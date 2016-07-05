var http = require('http');
var url = 'http://www.imooc.com/video/8525';


var filterHtml = function(html){
	var result = '';
	result = html;
	return result;
};

var printInfo = function(info){
	console.log(info);
};

http.get(url,function(res){
	var html = '';
	res.on('data',function(data){
		html += data;
	});

	res.on('end',function(){
		var info = filterHtml(html);
		printInfo(info);
	});
}).on('error',function(){
	conosle.log('is faile.');
});