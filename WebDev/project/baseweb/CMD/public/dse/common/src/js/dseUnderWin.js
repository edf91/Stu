'use strict'
/**
 * 点击元素在下方弹出框，多余产生的元素会追加在body标签下
 * create by wangxd
 */
var dseDefine = dseDefine === null ? define : dseDefine;
dseDefine('dseUnderWin',['dseDep','dseUtils'],function(require,exports,module){
	let dseDep = require('dseDep').DseDep,
		dseUtils = require('dseUtils').DseUtils,
		DistWin = require('dseDistWin').DistWin,
		$ = dseDep.$;
	
	class DseUnderWin{
		/**
		 * 初始化构造函数
		 * 默认情况下生成一个在下方且宽度等于元素，自适应的元素
		 * @param  {Object} config {
		 *                      	target : Object,目标Jq对象
		 *                      	data : Object,渲染数据,
		 *                      	displayField : String,显示字段，如果没有则拿text进行显示,
		 *                      	idField:String,id属性名称,如果没有则为id,
		 *                      	pidField:String,pid属性名称,如果没有则为pid,
		 *                      	appendTo : Object,Jquery标签对象，如果有值则弹窗会将dom生成到该元素下，且自动为target添加点击显示事件,
		 *                      	groupInfo: Object,分组信息对象，如果需要分组则填写改对象
		 *                      				{
		 *                      					groups:['一级','二级','三级']
		 *                      				},
		 *                      	allInfo: Object,全选信息对象，
		 *                      			{
		 *                      				text: '全部',全选的显示命名
		 *                      			},
		 *                      	onClick: function(node,nodes),注册点击事件，返回被点击的节点，以及所有的节点
		 *                      	onDbClick: function(node,nodes),注册双击事件，返回被点击的节点，以及所有的节点
		 *                      	isClickReset:Boolean,是否隐藏panel后再点击显示需要重置panel的状态,默认false
		 *                      	isMultiSelect:Boolean,是否支持同层多选,默认为false,
		 *                      	position: Object,位置配置
		 *                      				{
		 *                      					offsetLeft: 左边偏移量
		 *                      					offsetTop: 上方偏移量
		 *                      					width: 宽度
		 *                      					height: 高度
		 *                      				}
		 *                          }
		 */
		constructor(config){
			if(!dseUtils.ObjectUtil.isObject(config)) throw new Error('config is not a Object.');
			this.target = config.target;
			this.targetInfo = {};/*目标div的样式信息*/
			this.idPanel = new Map();/*id为自定义生成对应panel*/
			this.idDistWin = new Map();/*id为自定义生成对应DistWin对象*/
			this.idAppendTo = new Map();/*id为自定义生成对应appendTo对象*/
			this.appendTo = config.appendTo;
			this.displayField = config.displayField || 'text';
			this.idField = config.idField || 'id';
			this.pidField = config.pidField || 'pid';
			this.onClick = config.onClick;/*点击事件*/
			this.onDbClick = config.onDbClick;/*双击事件*/
			this.data = config.data;
			this.groupInfo = config.groupInfo;
			this.allInfo = config.allInfo;
			this.isClickReset = config.isClickReset || false;
			this.isMultiSelect = config.isMultiSelect || false;
			this.position = config.position;
			this.zIndex = 1000;
			/*属性标示*/
			this.elementAttr = {
				panel: 'data-flag-panel-id',
			};
			/*样式信息*/
			this.classInfo = {
				panel: {
					content: 'dse-underwin-panel',
				},
				distWin: {
					continer: 'dse-underwin-continer',
					header : 'dse-underwin-header',
					headerSelectLabel: 'dse-underwin-header-label',
					headerSelectText: 'dse-underwin-header-text',
					nodeContent: 'dse-underwin-content',
					nodeDetail: 'dse-underwin-node-detail',
					group: 'dse-underwin-group',
					node: 'dse-underwin-node',
					nodeSelect: 'dse-underwin-node-selected',
				},
			};
		}
		/*setter/getter  start*/
		/**
		 * 设置data数据
		 * @param  {Object} data 数据源
		 * @return {this}      DseUnderWin对象
		 */
		set data(data){
			this._data = dseUtils.ObjectUtil.depthCopy(data);
		}
		get data(){
			return this._data;
		}
		/*setter/getter  end*/

		
		/**
		 * 产生panel的id
		 * @return {String} id
		 */
		_generatorPanelId(){
			return dseUtils.StringUtil.uuid();
		}
		/**
		 * 创建一个空白面板，是否创建样式，由参数决定
		 * @return {String}    panel的id
		 */
		createPanel(){
			let _that = this,
				panelId = _that._generatorPanelId(),
				panel = $('<div onselectstart="return false" '+_that.elementAttr.panel+'="'+panelId+'"></div>');
				_that.idPanel.set(panelId,panel);
				/*添加事件*/
				_that._buildPanelEvent(panelId)._buildCss(panel);
			return panelId;
		}
		
		/**
		 * 重置面板状态
		 * @return {this}
		 */
		resetPanel(panelId){
			let _that = this,
				panel = _that.getPanelOfId(panelId),
				_distWin = _that.getDistWinOfId(panelId);
			panel.empty();
			_distWin.clearAllStat();
			_distWin.allInfo = {};
			_distWin = new DistWin(_distWin);
			return _that;
		}
		/**
		 * 获取面板
		 * @param  {String} id [panel的Id值]
		 * @return {JQObject} 返回面板的jquery对象
		 */
		getPanelOfId(id){
			return this.idPanel.get(id);
		}
		/**
		 * 获取DistWin对象
		 * @param  {String} id [panel的Id值]
		 * @return {JQObject} 返回面板的jquery对象
		 */
		getDistWinOfId(id){
			return this.idDistWin.get(id);
		}
		/**
		 * 查找div
		 * @param  {Element} panel 元素
		 * @param  {Element} element 元素
		 * @return {JQObject}         返回元素
		 */
		findElement(panel,element){
			return panel.find(element);
		}
		/**
		 * 创建创建行政区划下拉
		 * @param  {Object} config配置
		 *         			{	
		 *         				headerHtml:'',头部自定义的html代码
		 *         				onRenderHeader:function(clickNode,beSelectedNode){
		 *         					return html
		 *         				}
		 *         			}
		 * @return {Object} panel对象
		 */
		createDistWin(config){
			/*生成一个面板*/
			let _underWin = this,
				panelId = _underWin.createPanel(),
				panel = _underWin.getPanelOfId(panelId),
				_distWin = new DistWin({
					_underWin: _underWin,
					classInfo: _underWin.classInfo.distWin,
					displayField: _underWin.displayField,
					idField: _underWin.idField,
					pidField: _underWin.pidField,
					data: _underWin._data,
					sourceData: _underWin._data,
					onClick: _underWin.onClick,
					onDbClick: _underWin.onDbClick,
					headerHtml: dseUtils.ObjectUtil.getPropValue(config,'headerHtml'),
					onRenderHeader: dseUtils.ObjectUtil.getPropValue(config,'onRenderHeader'),
					groupInfo: _underWin.groupInfo,
					allInfo: _underWin.allInfo,
					panelId: panelId,
					panel: panel,
					isMultiSelect: _underWin.isMultiSelect,
				});
				_underWin.idDistWin.set(panelId,_distWin);
			return _distWin;
		}

		/*private method start*/
		/**
		 * 设置样式
		 * @return {this}
		 */
		_buildCss(panel){
			/*解析对象的样式信息*/
			let targetInfo = this._resolveTarget().targetInfo;
			/*位置信息*/
			let position = this.position;
			panel.addClass(this.classInfo.panel.content);
			/*生成默认样式*/
			panel.css({
				'position': 'absolute',
				'z-index': targetInfo.zIndex,
				'top': targetInfo.top + targetInfo.height + dseUtils.ObjectUtil.getPropValueInt(position,'offsetTop'),
				'left': targetInfo.left + dseUtils.ObjectUtil.getPropValueInt(position,'offsetLeft'),
				'height': dseUtils.ObjectUtil.getPropValueInt(position,'height') || 'auto',
				'width':  dseUtils.ObjectUtil.getPropValueInt(position,'width') || targetInfo.width - 2,/*-2去除边框的2个像素*/
			});
			return this;
		}
		/**
		 * 添加事件到panel中
		 * @return {this} [description]
		 */
		_buildPanelEvent(panelId){
			let _that = this,
				panel = _that.getPanelOfId(panelId);
			if(_that.appendTo){
				_that.idAppendTo.set(panelId,$(_that.appendTo));
				_that.target.one('click',function(){
					$(_that.idAppendTo.get(panelId)).append(panel)
				});
			}

			let divTarget = _that.target;
			/*添加点击区域外消失事件*/
			$(document).click(function(e) {
				let target = $(e.target);
				let isShow = panel.css('display') !== 'none';
				if(target.closest(divTarget).length === 0 && target.closest(panel).length === 0){
					if(isShow){
						if(_that.isClickReset) _that.resetPanel(panelId);
						panel.hide();
					}
				}else{
					if(!isShow)panel.show();
				}
			});
			return _that;
		}
		/**
		 * 解析目标对象
		 * @return {Object} 返回目标对象的配置信息
		 */
		_resolveTarget(){
			let target = this.target;
			/*获取位置对象*/
			let targetOffset = target.offset();
			
			let zIndex = target.css('z-index');
			if(zIndex === 'auto' || !zIndex) zIndex = this.zIndex ++;

			/*获取元素基本信息*/
			this.targetInfo = {
				left: targetOffset.left,
				top: targetOffset.top,
				width: target.width(),
				height: target.height(),
				zIndex: zIndex,
			}
			return this;
		}
		/*private method end*/
		
	}

	module.exports.DseUnderWin = DseUnderWin;

});