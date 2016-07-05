'use strict'
/**
 * common依赖框架，降低与其他第三方框架的耦合度
 * create by wangxd
 */
var dseDefine = dseDefine === null ? define : dseDefine;
dseDefine('dseDep',['jquery','underscore','nicescroll'],function(require,exports,module){
	const DseDep = {
		_ : require('underscore'),
		$ : require('nicescroll'),
	};
	module.exports.DseDep = DseDep;
});

