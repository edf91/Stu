'use strict'
/**
 * 常量配置类
 * create by wangxd
 */
var dseDefine = dseDefine === null ? define : dseDefine;
dseDefine('dseConstant',function(require,exports,module){

	const DseConstant = {
		/*路径配置项，约定放第一次出现配置路径。以便grunt进行打包*/
		DsePath : {
			SERVER_PATH: 'http://127.0.0.1:8080/baseweb/',/*打包时动态读取package.json进行读取*/
			CLIENT_PATH: 'http://127.0.0.1:8080/baseweb/',/*打包时动态读取package.json进行读取*/
		},
		/*请求配置项*/
		DseRequest : {
			SUCCESS_CODE : 1,/*成功状态码*/
			ERROR_CODE : 0,/*失败状态码*/
		},
	}
	module.exports.DseConstant = DseConstant;
});