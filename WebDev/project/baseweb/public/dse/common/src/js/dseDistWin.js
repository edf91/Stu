'use strict'
/**
 * 树形下拉的弹出窗体
 * create by wangxd
 */
var dseDefine = dseDefine === null ? define : dseDefine;
dseDefine('dseDistWin',['dseDep','dseUtils'],function(require,exports,module){
	let dseUtils = require('dseUtils').DseUtils;
	let dseDep = require('dseDep').DseDep;
	let $ = dseDep.$;

	class DistWin{
		constructor(config){
			this._underWin = config._underWin;/*DseUnderWin 对象*/
			this.classInfo = dseUtils.ObjectUtil.depthCopy(config.classInfo);
			this.displayField = config.displayField;/*显示字段的属性名称*/
			this.idField = config.idField;
			this.pidField = config.pidField;
			this.data = dseUtils.ObjectUtil.depthCopy(config.data);
			this.sourceData = config.sourceData;/*原始数据*/
			this.onClick = config.onClick;
			this.onDbClick = config.onDbClick;
			this.onRenderHeader = config.onRenderHeader;
			this.headerHtml = config.headerHtml;
			this.groupInfo = dseUtils.ObjectUtil.depthCopy(config.groupInfo);
			this.allInfo = dseUtils.ObjectUtil.depthCopy(config.allInfo);
			this.panel = config.panel;
			this.panelId = config.panelId;
			this.isMultiSelect = config.isMultiSelect;
			/*节点的标示属性*/
			this.elementAttr = {
				continer: 'data-flag-continer',/*容器*/
				header: 'data-flag-header',/*头部标示*/
				headerLabel: 'data-flag-header-label',/*头部label*/
				headerSelect: 'data-flag-header-text',/*头部被选中节点容器*/
				nodeContent: 'data-flag-node-content',/*节点容器*/
				nodeDetailContent: 'data-flag-node-detail',/*一层节点的容器*/
				nodeGroup:'data-flag-group',/*分组节点的标示*/
				nodeGroupStap:'data-group-stap',/*分组节点的当前级*/
				nodeGroupText:'data-group-text',/*分组节点的名称*/
				node: 'data-flag-node',/*节点标示*/
			};
			this.nodeMap = {};
			this.groupNodes = [];
			this.continer = null;
			this.header = null;
			this.nodeContent = null;
			this._buildAllInfoToData()
				.bulid();
		}
		_createAllInfoNode(node,array,text){
			let _that = this,
				allTextNode = dseUtils.ObjectUtil.depthCopy(node);
			if(!allTextNode) return _that;
			allTextNode[_that.displayField] = text;
			allTextNode[_that.idField] += 'all';
			allTextNode.children = [];
			allTextNode.isAllInfo = true;
			dseUtils.ArrayUtil.insertOfIndex(array,allTextNode,0);
			return _that;
		}
		/**
		 * 将allInfo信息put进data
		 * @return {this} DistWin对象
		 */
		_buildAllInfoToData(){
			let _that = this,
				text = dseUtils.ObjectUtil.getPropValue(_that.allInfo,'text');
			if(!text) return _that;
			dseUtils.FunUtil.recursion(_that.data,(node,children,index) => {
				if(children && children.length)
					_that._createAllInfoNode(children[0],children,text)
			});
			_that._createAllInfoNode(_that.data[0],_that.data,text);
			return _that;
		}
		/**
		 * 创建窗体
		 * @return {this} DistWin对象
		 */
		bulid(){
			let _that = this;
			/*创建容器以及头部*/
			_that
			._createContiner()/*创建容器*/
			._createHeader()/*创建头部信息*/
			._createNode()/*创建节点*/
			._buildRelation()/*建立关联关系*/
			.buildNodeContent(_that.data)/*构建node节点的显示*/
			.buildEvent()/*添加事件*/
			.buildSelectedNode();/*根据状态进行默认显示*/
			return _that;
		}
		/**
		 * 创建容器
		 * @return {this} DistWin对象
		 */
		_createContiner(){
			this.continer = $('<div '+ this.elementAttr.continer +' class="'+ this.classInfo.continer +'"></div>');
			return this;
		}

		/**
		 * 创建头部
		 * @return {this} DistWin对象
		 */
		_createHeader(){
			let _that = this,
				header = $('<div '+ _that.elementAttr.header +' class="'+ _that.classInfo.header +'" ></div>'),
				selectLabel = $('<label '+ _that.elementAttr.headerLabel +' class="'+ _that.classInfo.headerSelectLabel +'">已选 : </label>'),
				selectText = $('<div '+ _that.elementAttr.headerSelect +' class="'+ _that.classInfo.headerSelectText +'"></div>');
			if(!_that.headerHtml){
				header.append(selectLabel).append(selectText);
			}else{
				header.append(_that.headerHtml).append(selectText);
			}
			_that.header = header;
			return _that;
		}
		/**
		 * 创建节点
		 * @return {this} DistWin对象
		 */
		_createNode(){
			let _that = this;
			/*构建group节点*/
			let groups = dseUtils.ObjectUtil.getPropValue(_that.groupInfo,'groups') || [];
			if(groups)
				for (var i = 0; i < groups.length; i++)
					_that.groupNodes.push({stap:i,text:groups[i],html:$('<div '+ _that.elementAttr.nodeGroupStap +'="'+ i +'" '+ _that.elementAttr.nodeGroupText +'="'+groups[i]+'" '+ _that.elementAttr.nodeGroup +' class="'+ _that.classInfo.group +'">'+groups[i]+'</div>')});
			/**
			 * 构建html节点
			 */
			
			dseUtils.FunUtil.recursion(_that.data,(node,children,index) => {
				let group = _that.groupNodes[index];
				if(group) node.group = group;
				node.html = _that._createNodeEl(node);
				node.index = index;
				_that.nodeMap[node[_that.idField]] = node;
			});
			/*节点容器*/
			_that.nodeContent = $('<div '+ _that.elementAttr.nodeContent +' class="'+ _that.classInfo.nodeContent +'"></div>');
			return _that;
		}
		
		/**
		 * 创建节点内容
		 * @param  {Array} nodes 节点数组
		 * @return {this} DistWin对象
		 */
		buildNodeContent(nodes){
			if(dseUtils.ObjectUtil.isEmpty(nodes)) return this;
			let _that = this,
				_underWin = _that._underWin,
				panel = _that.panel,
				nodeContent = _that.nodeContent,
				nodeDetailContent = $('<div '+ _that.elementAttr.nodeDetailContent +' class="'+ _that.classInfo.nodeDetail +'"></div>');

			nodeContent.append(nodeDetailContent);
			/*构建第一层*/
			nodes.forEach(node => {
				let groupNode = node.group;
				/*添加group*/
				/**
				 * TODO 目前测试并无存在多个时的问题
				 * if(groupNode && nodeDetailContent.find(groupNode.html).length === 0){
				 */
				if(groupNode && _underWin.findElement(panel,groupNode.html).length === 0) nodeDetailContent.append(groupNode.html);
				nodeDetailContent.append(node.html);
				node.contentHtml = nodeDetailContent;
			});
			return _that;
		}
		/**
		 * 添加初始化点击事件
		 * @return {this} DistWin对象
		 */
		buildEvent(){
			return this._addClickEvent(this.data);
		}
		/**
		 * 根据默认状态进行显示结构
		 * @return {this} DistWin对象
		 */
		buildSelectedNode(){
			let _that = this;
			let changeNode = {};
			dseUtils.FunUtil.recursion(_that.sourceData,(node,children) => {
				if(!node.selected || node.isAllInfo) return ;
				changeNode[node[_that.idField]] = node;
			});
			dseUtils.FunUtil.recursion(_that.data,(node) => {
				if(!changeNode[node[_that.idField]]) return ;
				node.selected = false;
				node.html.trigger('click');
			});
			return _that;
		}
		/**
		 * 添加点击事件,改变node的状态
		 * @param {Array} nodes 节点数/
		 * @return {this} DistWin对象
		 */
		_addClickEvent(nodes){
			let _that = this,
				hasClick = false;
			if(dseUtils.ObjectUtil.isEmpty(nodes)) return _that;
			nodes.forEach(node => {
				let nodeHtml = node.html;
				nodeHtml.unbind('click');
				nodeHtml.unbind('dblclick');
				nodeHtml.on('dblclick',function(e){
					if(_that.onDbClick) _that.onDbClick(node,_that.data,_that._getNodesOfAllNode(node));
				});
				nodeHtml.on('click',function(e){_that._clickEvent(node)});
			});

			return _that;
		}
		/**
		 * 根据"全部"节点返回节点数据
		 * @param  {Object} node 节点
		 * @return {Array}      结果集
		 */
		_getNodesOfAllNode(node){
			let _that = this,
				results = [];
			if(!node.isAllInfo || !node.selected) return results;
			dseUtils.FunUtil.recursion(_that.data,(data,children,index) => {
				if(index !== node.index || data.isAllInfo || node[_that.pidField] !== data[_that.pidField]) return ;
				results.push(data);
			});
			return results;
		}
		/**
		 * 点击渲染事件
		 * @param  {Object} node 被点击节点
		 * @return {this}      DistWin对象
		 */
		_clickEvent(node){
			let _that = this;
			_that
				.clearAllChildStat(node)/*1、清除所有下级的状态*/
				.setBrothersStat(node)/*2、设置同级节点的状态*/
				.setNodeStat(node,!node.selected)/*3、设置选中状态*/
				.clearChildHtml(node);/*4、清除下级所有html*/
			/*如果为选中状态则根据当前节点生成child的html,并添加事件*/
			if(node.selected)
				_that.buildNodeContent(node.children)._addClickEvent(node.children);
			/*显示已选*/
			_that.buildSelectText(node);
			/*回调调用*/
			if(_that.onClick) _that.onClick(node,_that.data,_that._getNodesOfAllNode(node));
			return this;
		}
		/**
		 * 构建头部选中的显示
		 * @param  {Object} clickNode 被点击节点
		 * @return {this} DistWin对象
		 */
		buildSelectText(clickNode){
			let _that = this,
				_underWin = _that._underWin;
			let header = _underWin.findElement(_that.panel,_that.header);
			let str = '';
			let beSelectedNode = [];
			dseUtils.FunUtil.recursion(_that.data,(node,children,index) => {
				if(node.selected){
					str += node[_that.displayField] + '>';
					beSelectedNode.push(node);
				}
			});
			str = dseUtils.StringUtil.removeLast(str);
			if(_that.onRenderHeader){
				header.find('div[' + _that.elementAttr.headerSelect +']').html(_that.onRenderHeader(clickNode,beSelectedNode));
			}else{
				header.find('div[' + _that.elementAttr.headerSelect +']').html(str);
			}
			
			return _that;
		}
		/**
		 * 清除所有节点的状态
		 * @return {this} DistWin对象
		 */
		clearAllStat(){
			let _that = this;
			dseUtils.FunUtil.recursion(_that.data,(node) => _that.setNodeStat(node,false));
			return _that;
		}
		/**
		 * 清除下级所有的html
		 * @param  {Object} parentNode 父节点
		 * @return {this}            DistWin对选
		 */
		clearChildHtml(parentNode){
			let _that = this,
				_underWin = _that._underWin;
			let parentHtml = _underWin.findElement(_that.panel,parentNode.contentHtml),
				nextHtml = parentHtml.next();
			while(nextHtml.length){
				nextHtml.remove();
				nextHtml = parentHtml.next();
			}
			return _that;
		}

		/**
		 * 清除所有下级节点的状态
		 * @param  {Object} parentNode 父节点
		 * @return {this}            DistWin对象
		 */
		clearAllChildStat(parentNode){
			let _that = this;
			dseUtils.FunUtil.recursion(_that.data,(node,children,index) => {
				/*同级别不需要清除*/
				if(index <= parentNode.index) return ;
				_that.setNodeStat(node,false);
			})
			return _that;
		}
		/**
		 * 设置兄弟节点的状态，根据是否配置了可以同层多选
		 * @param {Object} targetNode 目标节点
		 * @return {this}            DistWin对象
		 */
		setBrothersStat(targetNode){
			let _that = this;
			if(_that.isMultiSelect) return _that;
			dseUtils.FunUtil.recursion(_that.data,(node,children,index) => {
				if(targetNode.index !== node.index) return ;
				if(targetNode[_that.idField] === node[_that.idField]) return ;
				_that.setNodeStat(node,false);
			});
			return _that;
		}
		/**
		 * 设置节点的状态
		 * @param {Object}  node       目标节点
		 * @param {Boolean} isSelected 是否选中
		 * @return {this}            DistWin对象
		 */
		setNodeStat(node,isSelected){
			let _that = this;
			node.selected = isSelected;
			if(node.selected)
				node.html.addClass(_that.classInfo.nodeSelect);
			else
				node.html.removeClass(_that.classInfo.nodeSelect);
			return _that;
		}

		/**
		 * 建立关系
		 * @return {this} DistWin对象
		 */
		_buildRelation(){
			let _that = this;
			let resultContent = _that.continer.append(_that.header).append(_that.nodeContent);
			_that.panel.append(resultContent);
			return _that;
		}

		/**
		 * 创建一个节点
		 * @param  {Object} node 节点对象
		 * @return {JQObject}      返回一个element
		 */
		_createNodeEl(node){
			return $('<div '+ this.elementAttr.node +' data-pid="'+ node[this.pidField] +'" data-id="'+ node[this.idField] +'" class="'+ this.classInfo.node +'">'+ node[this.displayField] +'</div>');
		}
	}

	module.exports.DistWin = DistWin;
});