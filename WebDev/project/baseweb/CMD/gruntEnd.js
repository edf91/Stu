/**
 * create by wangxd
 */
/**
 * grunt任务结束后处理器
 * @param {Object} config 配置项
 */

function GruntEnd(config){
	this.grunt = config.grunt;
	this.config = config.config;
	this.fs = config.fs;
	this.path = config.path;
}

GruntEnd.prototype.process = function(){
	var _that = this;
	var grunt = this.grunt;
	var config = this.config;
	var fs = this.fs;
	var path = this.path;
	var config = this.config;
	var contextPath = __dirname;
	var commonSrcDir = path.join(contextPath,config.common_src);
	var appSrcDir = path.join(contextPath,config.app);
	grunt.log.oklns('开始收尾工作');
	grunt.log.oklns('=============================清除less同名的css文件==========================');
	grunt.log.subhead('正在清理根目录:' + commonSrcDir);
	grunt.file.recurse(commonSrcDir,(abspath, rootdir, subdir, filename) => {
		_that.delFileSameName(abspath,path.sep + 'css' + path.sep,'.css','.less');
	});
	grunt.log.oklns('Done');
	grunt.log.subhead('正在清理根目录:' + appSrcDir);
	grunt.file.recurse(appSrcDir,(abspath, rootdir, subdir, filename) => {
		_that.delFileSameName(abspath,path.sep + 'css' + path.sep,'.css','.less');
	});
	grunt.log.oklns('Done');
	grunt.log.oklns('=============================清除less同名的css文件 Done==========================');
}

GruntEnd.prototype.delFileSameName = function(abspath,underDir,delExt,undelExt){
	var path = this.path;
	var grunt = this.grunt;
	abspath = path.normalize(abspath);
	if(abspath.indexOf(underDir) === -1) return ;
	var fileInfo = path.parse(abspath);
	if(fileInfo.ext !== undelExt) return ;
	grunt.file.recurse(fileInfo.dir,(abspath, rootdir, subdir, filename) => {
		var delFileInfo = path.parse(abspath);
		if(delFileInfo.name === fileInfo.name && delFileInfo.ext === delExt){
			grunt.log.subhead('正在删除:' + abspath);
			grunt.file.delete(abspath);
		}
	});
}
exports.GruntEnd = GruntEnd;
