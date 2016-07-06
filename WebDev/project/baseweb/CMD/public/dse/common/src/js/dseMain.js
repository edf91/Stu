'use strict'
/*common唯一入口*/
/**
 * common对外提供的服务类
 * create by wangxd
 */
var dseDefine = dseDefine === null ? define : dseDefine;
dseDefine(['dseConstant','dseUtils','dseRequest','dseLoad'],function(require,exports,module){
	/**
	 * 配置对外提供的服务
	 * @type {Object}
	 */
	module.exports.DseCommon = {
		DseRequest : require('dseRequest').DseRequest,/*请求服务*/
		DseConstant : require('dseConstant').DseConstant,/*常量配置*/
		DseUtils : require('dseUtils').DseUtils,/*工具类*/
		DseLoad: require('dseLoad'),/*加载触发类*/
		DseUnderWin: require('dseUnderWin').DseUnderWin/*下拉窗体*/
	};
});