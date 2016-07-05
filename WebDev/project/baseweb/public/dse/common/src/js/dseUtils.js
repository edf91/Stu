'use strict'
/*工具类*/
var dseDefine = dseDefine === null ? define : dseDefine;
dseDefine('dseUtils',['dseDep'],function(require,exports,module){
	let DseDep = require('dseDep').DseDep;
	let _ = DseDep._;
	let $ = DseDep.$;

	const DseUtils = {
		/*对象工具类*/
		ObjectUtil : {
			/**
			 * 创建对象的只读属性
			 * @param  {Object} obj      被创建对象
			 * @param  {String} propName 属性名称
			 * @param  {Object} value    属性的值
			 * @return {this}          返回ObjectUtil对象
			 */
			createReadOnlyProp(obj,propName,value){
				Object.defineProperty(obj,propName,{
					value : value,
					writable : false,
					enumerable: false,
    				configurable: false
				});
				return this;
			},
			/**
			 * 深度复制一个对象为全新的对象,不存在引用
			 * @param  {Object} target 目标对象
			 * @return {Object}        新对象,如果传入的为非对象,则返回一个空对象{}
			 */
			depthCopy(target){
				return !_.isObject(target) ? {} : JSON.parse(JSON.stringify(target));
			},
			/**
			 * 返回对象的属性的值，用于不清楚传入对象是否为空的情况，如果对象为空则返回undefined
			 * @param  {Object} target   目标对象
			 * @param  {String} propName 对象的属性
			 * @return {Object}          对象的值
			 */
			getPropValue(target,propName){
				return _.propertyOf(target)(propName);
			},
			/**
			 * 返回对象的属性的值，用于不清楚传入对象是否为空的情况，如果对象为空则返回0
			 * @param  {Object} target   目标对象
			 * @param  {String} propName 对象的属性
			 * @return {Object}          对象的值
			 */
			getPropValueInt(target,propName){
				return this.getPropValue(target,propName) || 0;
			},
			/**
			 * 将数组转换成树
			 * @param  {[Array]} target 目标数组
			 * @param  {Object} config 配置项{
			 *                         		idField:String,id的属性名称，如果没有默认拿id
			 *                         		pidField:String,pid的属性名称,如果没有默认拿pid
			 *                         		childrenField:String,children的属性名称,如果没有默认拿children
			 *                         		 }
			 * @return {Object}       返回树结构对象，如果传入为非数组，则返回空对象
			 */
			arrayToTree(target,config){
				if(!_.isArray(target)) return {};
				let idField = DseUtils.ObjectUtil.getPropValue(config,idField) || 'id';
				let pidField = DseUtils.ObjectUtil.getPropValue(config,pidField) || 'pid';
				let childrenField = DseUtils.ObjectUtil.getPropValue(config,childrenField) || 'children';
				/*根对象*/
				let _that = this;
				let array = _that.depthCopy(target);
				/*查找每个节点的孩子节点*/
				let findMyChild = function(parent,nodes){
					if(!nodes) return ;
					if(!parent[childrenField]) parent[childrenField] = [];
					nodes.forEach(node => {
						if(node.id !== parent.id && node.pid === parent.id) parent[childrenField].push(node);
					});
				}
				array.forEach(node => findMyChild(node,array));
				/*查找根节点*/
				let root = [];
				let findRoot = function(nodes){
					nodes.forEach(pnode => {
						let isParent = true;
						nodes.forEach(node => {
							if(pnode[idField] !== node[idField] && pnode[pidField] === node[idField]){
								isParent = false;
								return ;
							}
						});
						if(isParent) root.push(pnode);
					});
				}
				findRoot(array);
				return root;
			},
			/**
			 * 树转成array数组
			 * @param  {Object||Array} tree   目标对象
			 * @param  {Object} config 配置信息
			 *                         {
			 *                         		childrenField:String 子节点的名称,如果没有默认为children
			 *                         }
			 * @return {[Array]}        转换后数组
			 */
			treeToArray(tree,config){
				let result = [];
				DseUtils.FunUtil.recursion(tree,(node) => result.push(node),config);
				return result;
			},
			/**
			 * 将树处理为list
			 * @param  {Array} array 树数组
			 * @param  {Object} config 配置项
			 *                         {	
			 *                         		keyField: 对象的key属性，如果没有默认为id的值作为key
			 *                         		valueField: key对应的值属性，如果没有传，默认采用的是对象
			 *                         }
			 * @return {Array}       返回一个key对应的对象，如果传入非数组，则返回空对象{};
			 */
			treeToMap(array,config){
				if(!_.isArray(array)) return {};
				if(!_.isObject(config)) config = {};
				let keyField = config.keyField || 'id';
				let valueField = config.valueField;
				
				let result = {};
				DseUtils.FunUtil.recursion(array,function(parent,children){
					if(!result[parent[keyField]]) result[parent[keyField]] = {};
					result[parent[keyField]] = parent[valueField] || parent;
				});
				return result;
			},
			/**
			 * 检查是否为字符串
			 * @param  {Obj}  target 被检查对象
			 * @return {Boolean}        true为字符串，false为非字符串
			 */
			isString(target){
				return _.isString(target);
			},
			/**
			 * 检查是否为对象
			 * @param  {Object}  target 被检查对象
			 * @return {Boolean}        true为对象，false为非对象
			 */
			isObject(target){
				return _.isObject(target);
			},
			/**
			 * 判断目标对象是否为空，[],{}等都为空
			 * @param  {Object||Array}  target 目标对象
			 * @return {Boolean}        true表示为空，false表示不为空
			 */
			isEmpty(target){
				return _.isEmpty(target);
			},
			/**
			 * 判断对象是否为false值
			 * @param  {Object}  target 目标对象
			 * @return {Boolean}        [如果为'',null,'null',false,'false',undefine,'undefine',0]
			 */
			isFalse(target){
				return !target || target === 'null' || target === 'false' || target === 'undefined';
			},
		},
		/*路径处理工具类*/
		PathUtil: {
			/**
			 * 跳转路径，自动进行utf-8编码
			 * @param  {String} url 目标路径
			 * @return {Object}     this
			 */
			jumpTo: function(url){
				window.location.href=encodeURI(url);
				return this;
			},
			/**
			 * 解析地址上面的参数
			 * @return {Object}     返回对象，如果传入的为非字符串则返回空对象
			 */
			resolvePath(){
				let str = decodeURI(window.location.href,'utf-8');
				if(!_.isString(str) || str.indexOf('?') === -1) return {};
				str = str.split('?')[1].split('&');
				let obj = {};
				str.forEach(key => {
					key = key.split('=');
					obj[key[0]] = key[1];
				});
				return obj;
			},
		},
		/*弹出工具类*/
		LayerUtil: {

		},
		/*字符处理工具类*/
		StringUtil: {
			/**
			 * 获取字符串真实的长度，即汉子为两个字节的长度
			 * @param  {String} str 目标字符串
			 * @return {Number}     字符串长度:-1表示传入的是非字符串
			 */
			realLength(str){
				if(!_.isString(str)) return -1;
				let realLength = 0;
				for(let i = 0; i < str.length; i++){
				    let charCode = str.charCodeAt(i);
				    if (charCode >= 0 && charCode <= 128)
				        realLength += 2;
				    else
				        realLength += 1;
				}
				return realLength;
			},
			/**
			 * 转义HTML字符串，替换&, <, >, ", ', 和 /字符
			 * @param  {String} str 目标字符串
			 * @return {String}     转换结果
			 */
			htmlEscape(str){
				return _.escape(str);
			},
			/**
			 * 和htmlEscape相反。转义HTML字符串，替换&, &lt;, &gt;, &quot;, &#96;, 和 &#x2F;字符。
			 * @param  {String} str 目标字符串
			 * @return {String}     转换结果
			 */
			htmlUnEscape(str){
				return _.unescape(str);
			},
			/**
			 * 替换字符串中所有指定的字符为新字符
			 * @param  {String} str    目标字符串
			 * @param  {String} oldStr 要被替换的字符串
			 * @param  {String} newStr 替换为新的字符串
			 * @return {String}        返回替换结果字符串
			 */
			relpaceAll(str,oldStr,newStr){
				return _.isString(str) ? str.replace(new RegExp('\\' + oldStr,'g'),newStr) : str;
			},
			/**
			 * 将字符串首字符大写，之后的小写,如果isFirst为true则只对第一个进行大写转换
			 * @param  {String} str 目标字符串
			 * @param  {Boolean} isFirst 是否只转换第一个字符
			 * @return {String}     转换结果
			 */
			capitalize(str,isFirst){
				return !_.isString(str) ? str 
				:
				isFirst ? str.charAt(0).toUpperCase() + str.substring(1) 
				:
				str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
			},
			/**
			 * 是否包含某个字符串
			 * @param  {String}  str     目标字符串
			 * @param  {String}  destStr 包含字符串
			 * @return {Boolean}         true为包含，false不包含
			 */
			isContain(str,destStr){
				return !_.isString(str) ? false : str.indexOf(destStr) !== -1;
			},
			/**
			 * 移除字符串最后一个字符
			 * @param  {String} str 目标字符串
			 * @return {String}     返回移除后的字符串，如果传入为非字符串，则返回空字符''
			 */
			removeLast(str){
				return !_.isString(str) ? '' : str.substring(0,str.length - 1);
			},
			/**
			 * 将字符串转换成小写，如果为空字符串则返回空字符
			 * @param  {String} str 目标字符
			 * @return {String}     转换结果，如果传入为非字符串，则返回空字符''
			 */
			toLowerCase(str){
				return !_.isString(str) ? '' : str.toLowerCase();
			},
			/**
			 * 将对象的属性名称转换成小写,如果传入为非对象，则返回空对象
			 * @param  {Object} target 目标对象
			 * @return {Object}     转换后的对象，如果传入为非对象，则返回空对象
			 */
			propToLowerCase(target){
				if(!_.isObject(target)) return {};
				let obj = {};
				for(let prop in target) obj[this.toLowerCase(prop)] = target[prop];
				return obj;
			},
			/**
			 * 将空对象替换成指定的字符
			 * @param  str 目标字符串，
			 * @param  sp：转后的字符(默认‘--’)
			 * @return {String}     替换后的字符串
			 */
			nullToSP(str,sp) {
				return !str && str !== 0 ? !sp ? '--' : sp : str;
			},
			/**
			 * uuid生成器
			 * @return {String} 产生uuid
			 */
			uuid(){
				return _.now() + 'uuid' + _.random(0,10000000);
			}
		},
		/*时间日期处理工具类*/
		DateUtil: {
			/**
			 * 一天时间戳
			 * @return {Number} 一天的时间戳
			 */
			oneDayMs(){
				return 1000 * 60 * 60 * 24;
			},
			/**
			 * 获取当前客户端时间戳
			 * @return {Number} 当前客户端时间戳
			 */
			now(){
				return _.now();
			},
			/**
			 * 获取某年某月的最后一天时间戳
			 * @param  {Number} year  年
			 * @param  {Number} month 月
			 * @return {Number}       那一天的时间戳,如果传入为非时间则返回-1
			 */
			getLastDayOfYearMonth(year,month){
				if(!_.isNumber(year) || !_.isNumber(month)) return -1;
				let _year = year;
				let _month = month ++;
				if(month > 12) {
				    _month -= 12;
				    _year++;
				}
				return new Date(_year,_month,1).getTime() - this.oneDayMs();
			},
			/**
			 * 获取离当前时间近n天的时间戳
			 * @param  {Number} n 整数，代表n天,如果为负数，表示当前天之后几天
			 * @return {Number}   n天的时间戳,如果传入的不是数值，则返回-1
			 */
			getNearDayTimeStamp(n){
			    /**一天毫秒数*/
			    return !_.isNumber(n) ? -1 : new Date().getTime() - (n * this.oneDayMs());
			},
			/**
			 * 将时间戳转换为时间对象
			 * @param  {Number} timeStamp 时间戳
			 * @return {Object}           时间对象{year:'',month:'',day:'',hour:'',minu:'',seconds : ''}
			 */
			timeStampFormatDateObj(timeStamp){
			    let dateObj = {year:'',month:'',day:'',hour:'',minu:'',seconds : ''};
			    if(!_.isNumber(timeStamp)) return dateObj;
			    let date = new Date(timeStamp);
			    dateObj.year = date.getFullYear();
			    dateObj.month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
			    dateObj.day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			    dateObj.hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
			    dateObj.minu = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
			    dateObj.seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
			    return dateObj;
			},
			/**
			 * 将时间戳转换成yyyy-MM-dd
			 * @param  {Number} timeStamp 时间戳
			 * @return {String}           返回转换后格式,如果传入为非数值类型,则返回''字符串
			 */
			timeStampFormatDate(timeStamp){
				if(!_.isNumber(timeStamp)) return '';
			    let _Obj = this.timeStampFormatDateObj(timeStamp);
			    return _Obj.year + '-' + _Obj.month + '-' + _Obj.day;
			},
			/**
			 * 将时间戳转换成yyyy-MM-dd hh:mm:ss
			 * @param  {Number} timeStamp 时间戳
			 * @return {String}           返回转换后格式,如果传入为非数值类型,则返回''字符串
			 */
			timeStampFormatDateTime(timeStamp){
				if(!_.isNumber(timeStamp)) return '';
			    let _Obj = this.timeStampFormatDateObj(timeStamp);
			    return _Obj.year + '-' + _Obj.month + '-' + _Obj.day + ' ' + _Obj.hour + ':' + _Obj.minu + ':' + _Obj.seconds;
			},
		},
		/*数组处理工具类*/
		ArrayUtil: {
			/**
			 * 去除重复数组
			 * @param  {Array} array 目标数组
			 * @return {Array}       返回去除重复数据的数组,如果传入的为非数组则返回一个空数组
			 */
			unique(array){
				return !_.isArray(array) ? [] : _.uniq(array);
			},
			/**
			 * 返回多个数组的并集，并去除重复的
			 * @return {Array} 并集数组
			 */
			union(){
				return this.unique(_.flatten(arguments));
			},
			/**
			 * 返回多个数组的交集
			 * @return {Array} 交集数组，如果存入非数组返回空数组[]
			 */
			intersection(array){
				if(!_.isArray(array)) return [];
				let result = [];
				let argsLength = arguments.length;
				for (let i = 0, length = array.length; i < length; i++) {
				  let item = array[i];
				  if (_.contains(result, item)) continue;
				  let j = 1;
				  for (; j < argsLength; j++) {
				    if (!_.contains(arguments[j], item)) break;
				  }
				  if (j === argsLength) result.push(item);
				}
				return result;
			},
			/**
			 * 移除数组中为false的值，即移除 false, null, 0, "", undefined 和 NaN值
			 * @param  {Array} array 目标数组
			 * @return {Array}       结果数组,如果传入的为非数组则返回一个空数组[]
			 */
			removeFalse(array){
				return !_.isArray(array) ? [] : _.compact(array);
			},
			/**
			 * 从数组中，移除指定值		
			 * @param  {Array} array 目标数组
			 * @param  {...} 被移除的值
			 * @return {Array}       结果数组，如果传入为非数组则返回一个空数组[]
			 */
			without(array){
				if(!_.isArray(array)) return [];
				return _.difference(array, Array.prototype.slice.call(arguments, 1));
			},
			/**
			 * 将元素插入到指定位置，如果没传index默认插入到首位
			 * @param  {Array} array 目标数组
			 * @param  {Object} obj   元素
			 * @param  {int} index 插入位置0为第一个位置
			 * @return {this}       ArrayUtil工具对象
			 */
			insertOfIndex(array,obj,index){
				if(!_.isArray(array)) return this;
				array = array.splice(index || 0,0,obj);
				return this;
			},
		},
		/*函数处理工具类*/
		FunUtil: {
			/**
			 * 递归树结果
			 * @param  {Array||Object} root 被递归对象
			 * @param  {Function} fun   业务处理对象
			 * @param  {Object} config   配置信息
			 *                           {
			 *                           	childrenField:String,子节点的属性名称如果没有默认为children
			 *                           }
			 * @return {Void}       
			 */
			recursion(root,fun,config){
				let index = 0;
				let childrenField = DseUtils.ObjectUtil.getPropValue(config,'childrenField') || 'children';
				let resolve = function(node,children,index){
					fun(node,children,index);
					if(!children) return ;
					index++
					children.forEach(node => {
						resolve(node,node[childrenField],index);
					});
				};
				return _.isArray(root) ? root.forEach(node => resolve(node,node[childrenField],index)) : resolve(root,node[childrenField],index);
			},
		},
		/*函数处理工具类*/
		ScrollUtil: {
			/**
			 * 生成默认的滚动条
			 * @return {Void}
			 */
			defaultScroll(){
				$('*[data-scroll="true"]').each(function(){
					let $color = $(this).attr('data-cursor-color') || '#ccc', //滚动条颜色
						$opacity = $(this).attr('data-cursor-opacity') || 0.8, //滚动条颜色不透明度，范围从1到0
						$touch = Boolean($(this).attr('data-cursor-touch')) || false, //是否启用touch事件拖动滚动，默认false
						$width = $(this).attr('data-cursor-width') || '5px',//滚动条宽度
						$border = $(this).attr('data-cursor-border') || '0',//滚动条边框
						$radius = $(this).attr('data-cursor-radius') || '2px',//滚动条圆角
						$autohide = Boolean($(this).attr('data-cursor-autohide')) || false;//是否隐藏滚动条
					$(this).niceScroll({
						cursorcolor: $color,
						cursoropacitymax: $opacity,
						touchbehavior: $touch,
						cursorwidth: $width,
						cursorborder: $border,
						cursorborderradius: $radius,
						autohidemode: $autohide
					});
				});
			},

		},
		/*文档处理*/
		DocUtil: {
			/**
			 * 去除doc的选中文本事件
			 * @param  {[type]} target [description]
			 * @return {[type]}        [description]
			 */
			clearSelection(target){
				if(target.selection && target.selection.empty) {
					target.selection.empty();
				}else if(window.getSelection){
					window.getSelection().removeAllRanges();
				}
				return this;
			}
		}
	};

	module.exports.DseUtils = DseUtils;
});