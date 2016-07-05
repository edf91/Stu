/**
 * create by wangxd
 */
/**
 * 模块生成器
 * @param {Object} config 配置项
 */
function ModuleGenerator(config){
	this.grunt = config.grunt;
	this.config = config.config;
	this.fs = config.fs;
	this.path = config.path;
}
/*生成*/
ModuleGenerator.prototype.generator = function(success,error){
	if(!this._movenTemplateToProject()) return error();
	this._renameToModuleName()
		._replaceParams()
		._removeSvnOrGitDir();
	success();
};
/**
 * 移动定义好的模块到项目下，如果模块存在提示，并结束
 * @param  {String} moduleDir  目标模块路径
 * @param  {String} moduleName 模块名称
 * @return {[type]}            [description]
 */
ModuleGenerator.prototype._movenTemplateToProject = function(){
	var config = this.config;
	var grunt = this.grunt;
	var moduleDir = this.config.moduleDir;
	var moduleName = this.config.moduleName;
	var path = this.path;

	var templateDir = path.resolve(config.templateModulePath);
	if(grunt.file.exists(moduleDir)){
		return false;
	}
	grunt.file.copy(templateDir,moduleDir);
	return true;
};
/**
 * 重命名模板文件为模块文件
 * @param  {String} moduleDir  目标模块路径
 * @param  {String} moduleName 模块名称
 * @return {[type]}            [description]
 */
ModuleGenerator.prototype._renameToModuleName = function(){
	var config = this.config;
	var grunt = this.grunt;
	var moduleDir = this.config.moduleDir;
	var moduleName = this.config.moduleName;
	var path = this.path;
	var delDirs = config.delDirs;

	grunt.file.recurse(moduleDir,(abspath, rootdir, subdir, filename) => {
		if(filename.indexOf(config.templateModuleName) >= 0){
			var renamepath = path.join(rootdir,subdir,filename.replace(config.templateModuleName,moduleName));
			grunt.file.write(renamepath,
				grunt.file.read(abspath,{encoding:config.charset}),
				{encoding:config.charset});
			grunt.file.delete(abspath);
		}
	});

	return this;
}
/**
 * 替换文件内容里面的占位符号
 * @param  {String} moduleDir  目标模块路径
 * @param  {String} moduleName 模块名称
 * @return {[type]}            [description]
 */
ModuleGenerator.prototype._replaceParams = function(){
	var config = this.config;
	var grunt = this.grunt;
	var moduleDir = this.config.moduleDir;
	var moduleName = this.config.moduleName;

	grunt.file.recurse(moduleDir,(abspath, rootdir, subdir, filename) => {
		var buf = grunt.file.read(abspath,{encoding:config.charset});
		if(buf.includes('${')){
			var content = buf.toString();
			for(var key in config.templateModuleParams){
				var reg = new RegExp('\\${' + key + '}','g');
				if(!config.templateModuleParams[key]){
					content = content.replace(reg,moduleName);
				}else{
					content = content.replace(reg,eval(config.templateModuleParams[key]));
				}
			}
			grunt.file.write(abspath,content,{encoding:config.charset});
		}
	});
	return this;
}
/**
 * 移除版本控制信息目录如.svn或者.git
 * @return {[type]} [description]
 */
ModuleGenerator.prototype._removeSvnOrGitDir = function(){
	var config = this.config;
	var moduleDir = this.config.moduleDir;
	var delDirs = this.config.delDirs;
	var fs = this.fs;
	var path = this.path;
	var grunt = this.grunt;
	(function(){
		var deleteDir = function(dir,delDirs){
			var filesArray = fs.readdirSync(dir);
			if(!filesArray || filesArray.length === 0) return ;
			filesArray.forEach(file => {
				file = path.resolve(dir, file);
				var stat = fs.statSync(file);
				if(stat && stat.isDirectory()){
					var dirArray = file.split(path.sep);
					var lastDir = dirArray[dirArray.length - 1];
					var isDeleteDir = false;
					delDirs.forEach(dirName => {
						if(dirName === lastDir){
							grunt.file.delete(file);
							isDeleteDir = true;
						}
					});
					if(!isDeleteDir) deleteDir(file,delDirs);
				}
			});
		}
		deleteDir(moduleDir,delDirs);
	})();
	
	return this;
}

exports.ModuleGenerator = ModuleGenerator;