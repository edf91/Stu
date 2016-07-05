var stream = require('stream');
var util = require('util');

function ReadStream(){
	stream.Readable.call(this);
};
util.inherits(ReadStream,stream.Readable);

ReadStream.prototype._read = function(){
	this.push('I ');
	this.push('AM ');
	this.push('MAN\n ');
	this.push(null);
};

function WritStream(){
	stream.Writable.call(this);
	this._cached = new Buffer('');
}

util.inherits(WritStream,stream.Writable);

WritStream.prototype._write = function(chunk,encoding,cb){
	console.log(chunk.toString());
	cb();
}


function TransformStream(){
	stream.Transform.call(this);
}

util.inherits(TransformStream,stream.Transform);

TransformStream.prototype._transform = function(chunk,encoding,cb){
	this.push(chunk);
	cb();
};

TransformStream.prototype._flush = function(cb){
	this.push('Transform ')
	cb();
};

var readStream = new ReadStream();
var wirtStream = new WritStream();
var transformStream = new TransformStream();

readStream.pipe(transformStream).pipe(wirtStream);