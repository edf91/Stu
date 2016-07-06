define('../js/fileUploadRequest',['dseCommon'],function(require,exports,module){
    var DseConstant = require('dseCommon').DseCommon.DseConstant;
    var DseRequest = require('dseCommon').DseCommon.DseRequest;

    var fileUploadRequest = {
        CLIENT_PATH : DseConstant.DsePath.CLIENT_PATH,
        SERVER_PATH : DseConstant.DsePath.SERVER_PATH,
        SUFFIX : '.do',
        DIR: 'app/',
        getTemplateOfName: function(params){
            params.url = this.DIR + 'baseweb' + '/' + 'fileUpload' + '/views/template/' + params.templateName;
            this.templateRequest(params);
        },
        // 服务器端请求
        request : function(params){
            params.type = params.type || 'GET';
            params.url = this.SERVER_PATH + params.url + this.SUFFIX;
            DseRequest.request(params);
        },
        // 客户端请求
        templateRequest: function(params){
            params.type = 'GET';
            params.url = this.CLIENT_PATH + params.url;
            DseRequest.getTemplate(params);
        },
        // 下载请求
        downLoadRequest : function(params){
            params.url = this.SERVER_PATH + params.url + this.SUFFIX + '?';
            for(var key in params.param){
                params.url += key + '=' + params.param[key] + '&';
            }
            DseRequest.requestDownLoad(params);
        },
        // 客户端请求，获取测试datas下的模拟数据
        requestClientTest: function(params){
            params.type = params.type || 'GET';
            params.url = this.CLIENT_PATH + params.url;
            DseRequest.request(params);
        },
    };
    module.exports.fileUploadRequest = fileUploadRequest;
})