var http = require('http');
// var Promise = require('Promise');
var cheerio = require('cheerio');
var baseUrl = 'http://www.imooc.com/learn/';
var videoIds = [348,259,197,134,75];

var filterHtml = function(html){
	var $ = cheerio.load(html);
	var chapters = $('.learnchapter');

	var title = $('#main .path span').text();
	var number = parseInt($($('#main .meta-value strong')[0]).text().trim(),10);

	var courseData = {
		title : title,
		number : number,
		videos : []
	};

	chapters.each(function(item){
		var chapter = $(this);
		var chapterTitle = chapter.find('strong').text();
		var videos = chapter.find('.video').children('li');

		var chapterData = {
			chapterTitle : chapterTitle,
			videos : []
		};

		videos.each(function(item){
			var video = $(this).find('.studyvideo');
			var videoTitle = video.text();
			var id = video.attr('href').split('video/')[1];

			chapterData.videos.push({
				title : videoTitle,
				id : id
			});
		});
		
		courseData.videos.push(chapterData);		
	});
	return courseData;
};

var printInfo = function(coursesData){
	console.log('爬取结果：' + JSON.stringify(coursesData));
};

/*使用promise重构*/

function getPageAsSync(url){
	return new Promise(function(resolve,reject){
		console.log('正在爬取：' + url);

		http.get(url,function(res){
			console.log('正在处理：' + url);
			var html = '';
			res.on('data',function(data){
				html += data;
			});

			res.on('end',function(){
				resolve(html);
				// var info = filterHtml(html);
				// printInfo(info);
			});
		}).on('error',function(e){
			conosle.log('is faile.');
			reject(e);
		});
	});
};

var fetchDatas = [];
videoIds.forEach(id => fetchDatas.push(getPageAsSync(baseUrl + id)));
Promise
	.all(fetchDatas)
	.then(function(pages){
		var courseData = [];
		pages.forEach(function(html){
			var course = filterHtml(html);
			courseData.push(course);
		});

		courseData.sort(function(a,b){
			return a.number < b.number;
		});

		printInfo(courseData);
	})