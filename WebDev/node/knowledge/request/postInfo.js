var http = require('http');
var querystring = require('querystring');

var postData = querystring.stringify({
	url:'jwmRMff0gsdipWrnyks4EIeafTsMnqbYqSC92SYczJFR3L1xzKpByrLRGda0Mo7DtaX2-AfHBrmDExySHOOgWK',
	cb:'jQuery110203329881710149618_1458963166657',
	data_name:'recommend_common_merger',
	ie:'utf-8',
	oe:'utf-8',
	format:'json',
	t:'1458965847000',
	_:'1458963166701'
});

var options = {
	hostname: 'www.baidu.com',
	port:'80',
	path:'',
	method : 'get',
	headers: {
		'Accept':'*/*',
		'Accept-Encoding':'gzip, deflate, sdch',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Cache-Control':'no-cache',
		'Connection':'keep-alive',
		'Cookie':'BAIDUID=8011242D5CE20D0B2AA54731E46AD496:FG=1; BIDUPSID=8011242D5CE20D0B2AA54731E46AD496; PSTM=1455992517; BDUSS=ZXQnpmanZIUkJReTljOHhxQ1Bpb1F2QnIyU3R-VkZMbWJRVVFjTEZRWGhjZ1pYQVFBQUFBJCQAAAAAAAAAAAEAAAAuSecfbW1hbm5lcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOHl3lbh5d5Wfm; MCITY=-%3A; BDSFRCVID=5qtsJeC627_U1-64nqP3JIGv5gGK8w3TH6aosFbp04VRrmAkpLrcEG0PtvlQpYD-KlYUogKK3gOTH4nP; H_BDCLCKID_SF=JJCq_CLXtCvHhD0wDDTo-t0hqxby26nuWJneaJ5nJD_MsfTPjh8MhR_h5-6A0bKtBe0jLUJlQpP-HJ7weJ7CX5LgDn6Ct4KjMCn4Kl0MLpF5DMjxWf8VX--IqfnMBMPe52OnaIb8LIFbhCIRj68aen-W5gTD5-7ybCPX3b7EfK5af-O_bf--D6-m3HLLtj3X-G4eaqTTbD5Jspk95Tbxy5K_hpbl5J8jJNcNQJ6p2-JdqROHQT3m5bKj0q3k0IriaN5PWb3cWKOJ8UbSj-Tme4tX-NFfJjFj3H; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; H_PS_PSSID=18881_1463_18205_18560_17000_15921_11886',
		'Host':'sp2.baidu.com',
		'Pragma':'no-cache',
		'Referer':'https://www.baidu.com/s?wd=apache%20ab%E4%B8%8B%E8%BD%BD&rsv_spt=1&rsv_iqid=0xc97fdaa2001fd295&issp=1&f=3&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&oq=apache%20ab%20mac%20%E5%AE%89%E8%A3%85&rsv_t=0b0ezbKsd%2BtZWXVmF1EZF2yy4Lke0TzKaJc%2F5yH%2B5bToIZ1znI4CVRH5cCUNX7%2Fm8XON&inputT=2726&rsv_sug3=38&rsv_sug1=15&rsv_sug7=100&rsv_pq=c29014b400239e3e&rsv_sug2=0&prefixsug=apache%20ab&rsp=1&rsv_sug4=3391&rsv_sug=1',
		'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36'
	}
};

var req = http.request(options,function(res){
	console.log('statusCode:' + res.statusCode);
	console.log('headers:' + JSON.stringify(res.headers));
	res.on('data',function(chunk){
		console.log(Buffer.isBuffer(chunk));
		console.log(typeof chunk);
		console.log('parsedata:');
		console.log('data--->' + JSON.stringify(chunk));
	});
	res.on('end',function(){
		console.log('send finish.');
	});
});

req.on('error',function(e){
	console.log('error:' + e.messsage);
});
req.write(postData);
req.end();