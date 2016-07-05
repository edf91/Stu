var request = require('request');
var fs = require('fs');

request('http://v2.mukewang.com/cef3e514-8203-4c67-877f-79f7763553cf/L.mp4?auth_key=1459071200-0-0-65f436128f5f20fd565bd45a7cf04466')
	.pipe(fs.createWriteStream('mk.mp4'));