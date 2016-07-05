var http = require('http');
var request = require('request');

http
	.createServer(function(req,res){
		request('http://static.mukewang.com/static/img/common/logo.png').pipe(res);
	})
	.listen(9000);