var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

var readStream = new Readable();
var writeStream = new Writable();

readStream.push('I ');
readStream.push('AM ');
readStream.push('MAN\n ');
readStream.push(null);

writeStream._write = function(chunk,encoding,cb){
	console.log(chunk.toString());
	cb();
};

readStream.pipe(writeStream);