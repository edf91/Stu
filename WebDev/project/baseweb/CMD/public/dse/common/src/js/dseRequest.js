'use strict'
/*扩展jquery的ajax请求，提供接口:DseRequest*/
var dseDefine = dseDefine === null ? define : dseDefine;
dseDefine('dseRequest',['dseDep','dseConstant','dseUtils'],function(require,exports,module){
	/*声明依赖*/
	/*配置项*/
	let DseConstant = require('dseConstant').DseConstant,
		DseDep = require('dseDep').DseDep,
		DseUtils = require('dseUtils').DseUtils;
	/**
	 * 请求类,_开头的方法请别调用，后台返回数据结构：
	 * {
	 * 	data: Obj,
	 * 	status: Number,
	 * 	message : {msg: String,...}
	 * }
	 */
	class DseRequest{

		constructor(config){
			this.$ = config.$;
			this._ = config._;
			/*定义状态码，不可修改*/
			DseUtils.ObjectUtil
			.createReadOnlyProp(this,'_successCode',DseConstant.DseRequest.SUCCESS_CODE)
			.createReadOnlyProp(this,'_errorCode',DseConstant.DseRequest.ERROR_CODE);
		}

		/**
		 * 请求后台统一接口
		 * @param  {Obj} params 请求对象：{
		 *                      			success : function(data,msgObj),
		 *                      			error : function(msgObj),
		 *                      		   }
		 * @return {this}       DseRequest对象
		 */
		request(params){
			return this._ajaxRequest(params);
		}

		/**
		 * 获取模板，并渲染数据，返回渲染后的结果,如果不传数据则只返回模板。
		 * @param  {Obj} params {
		 *                      data : Object,// 渲染数据
		 *                      success : Fun, // 成功回调
		 *                      }
		 * @return {String}        渲染之后的结果字符或模板
		 */
		getTemplate(params){
			let _that = this,
				_ = _that._,
				successFun = params.success;
			params.success = function(html){
				if(successFun) {
					if(!params.data) successFun(html);
					else successFun(_.template(html)(params.data));
				}
			}

			return _that._jqRequest(params);
		}

		/**
		 * 下载文件请求
		 * @param  {Obj} params {
		 *                      url:String,//请求路径
		 *                      }
		 * @return {this}       DseRequest对象                     
		 */
		requestDownLoad(params){
			window.location.href = params.url;
			return this;
		}

		/**
		 * 调用后台ajax请求，不使用Promise进行封装
		 * @param  {Obj} params 请求对象：{
		 *                      			success : function(data,msgObj),
		 *                      			error : function(msgObj),
		 *                      		   }
		 * @return {this}       DseRequest对象
		 */
		_ajaxRequest(params){
			let _that = this,
				successFun = params.success,
				errorFun = params.error;
			params.success = '';
			params.complete = function(data){
				let result = data.responseText;
				if(DseUtils.ObjectUtil.isString(result)){
					result = JSON.parse(result);
				}
				if(result.status === _that._successCode && successFun) return successFun(result.data,result.message);
				if((result.status === _that._errorCode || result.status >= 400) && errorFun) return errorFun(result.message);
			}
			return _that._jqRequest(params);
		}
		/**
		 * jquery ajax请求方法
		 * @param  {Obj} params 请求对象
		 * @return {this}       DseRequest对象
		 */
		_jqRequest(params){
			this.$.ajax(params);
			return this;
		}

	}

	module.exports.DseRequest = new DseRequest({$:DseDep.$,_:DseDep._});
});