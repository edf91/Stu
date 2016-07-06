/**
 * create by wangxd
 */
/**
 * grunt基础支持
 * @param {Object} config 配置项
 */

function GruntBase(config){
	this.grunt = config.grunt;
	this.config = config.config;
	this.fs = config.fs;
	this.path = config.path;
	this.pkg = config.pkg;
	this.args = config.args;
}

GruntBase.prototype.process = function(){
	this._replaceDseConstant();
}

GruntBase.prototype._getCommand = function(){
	return this.args[2] || '';
}
/**
 * 解析html文件，将资源路径改为配置的路径
 * @param  {Object} fileInfo 文件基本信息
 * @return {[type]}          [description]
 */
GruntBase.prototype._replaceHmtlPath = function(fileInfo){
	var _that = this;
	var path = this.path;
	var fs = this.fs;
	var config = this.config;
	var grunt = this.grunt;

	if(_that._getCommand().indexOf('build') === -1) return ;
	if(_that._getCommand().indexOf('Common') !== -1) return ;
	var filePath = path.resolve(fileInfo.dir,fileInfo.base);
	if(filePath.indexOf(path.sep + config.dist + path.sep) !== -1) return;
	var fileContent = fs.readFileSync(filePath,config.charset);
	var httpPath = 'http://';
	var httpStr = fileContent.substring(fileContent.indexOf(httpPath));
	if(httpStr === fileContent) return ;
	var htmlClientPath = httpStr.substring(0,httpStr.indexOf('"'));
	var httpPrev = htmlClientPath.substring(htmlClientPath.indexOf(httpPath),httpPath.length);
	var temp = htmlClientPath.substring(httpPath.length);
	var splitProject = '/';
	if(temp.indexOf('/' + config.projectName + '/') !== -1)
		splitProject = '/' + config.projectName + '/';
	var requestPath = temp.substring(0,temp.indexOf(splitProject) + splitProject.length);
	var resultPath = httpPrev + requestPath;
	var reg = new RegExp('\\' + resultPath,'g');
	grunt.log.subhead('正在处理HTML文件页面引用路径:'+filePath);
	grunt.log.subhead('替换:"'+resultPath+'"为：' + config.Client_Path);
	fs.writeFileSync(filePath, 
		fileContent.replace(reg,config.Client_Path), 
		config.charset);
	grunt.log.oklns('Done');
}
GruntBase.prototype._isEndWith = function(str,endWithStr){
	var endLength = str.length - endWithStr.length;
	return endLength >=0 && str.indexOf(endWithStr) === endLength;
}
/*构造concat对象*/
GruntBase.prototype.buildConcat = function(){
	var _that = this;
	var fs = this.fs;
	var config = this.config;
	var path = this.path;
	var concat = {
		dist: {
			options: {
			    separator: ';',
			    stripBanners: true,
			},
			files: {}
		}
	};
	(function(){
		/*遍历目录*/
		var resultConcatFiles = {};
		var resolveDir = function(dir,distSrcInfo){
			var filesArray = fs.readdirSync(dir);
			if(!filesArray || filesArray.length === 0) return ;
			/*concat到的目录*/
			var concatResultDir = distSrcInfo.dist + dir.substring(dir.indexOf(path.sep+path.normalize(distSrcInfo.src) + path.sep) + (distSrcInfo.src + path.sep).length) + path.sep;

			/*concat后的文件名称*/
			var concatScriptObj = {};
			var isScript = false;
			filesArray.forEach(function(file){
				file = path.resolve(dir, file);
				var stat = fs.statSync(file);
				if(stat && stat.isDirectory()){
					resolveDir(file,distSrcInfo);
				}else{
					var fileInfo = path.parse(file);
					/*如果为html文件，修改源码访问路径*/
					if(fileInfo.ext === config.htmlFileExt){
						_that._replaceHmtlPath(fileInfo);
					}
					/*如果为*SeaCfg.js文件，修改其路径*/
					if(fileInfo.ext === config.scriptFileExt && _that._isEndWith(fileInfo.base,config.seaCfgEndExt)){
						_that._buildSeaCfgFile(fileInfo);
					}

					/*如果为脚本文件，构建压缩对象*/
					if(fileInfo.ext === config.scriptFileExt){
						var concatResultFile = concatResultDir + config.concatScriptName;
						if(!concatScriptObj['"' + concatResultFile + '"']) concatScriptObj['"' + concatResultFile + '"'] = [];
						isScript = true;
						var sourceFile = distSrcInfo.src + concatResultDir.substring(distSrcInfo.dist.length) + fileInfo.base;
						concatScriptObj['"' + concatResultFile + '"'].push(sourceFile);
					}else if(fileInfo.ext === config.cssFileExt){
						var concatResultFile = concatResultDir + config.concatCSSName;
						if(!concatScriptObj['"' + concatResultFile + '"']) concatScriptObj['"' + concatResultFile + '"'] = [];
						isScript = true;
						var sourceFile = distSrcInfo.src + concatResultDir.substring(distSrcInfo.dist.length) + fileInfo.base;
						concatScriptObj['"' + concatResultFile + '"'].push(sourceFile);
					}
				}
			});
			if(isScript){
				for(var key in concatScriptObj) {
					resultConcatFiles[key.replace('\'','')] = [];
					concatScriptObj[key].forEach(function(src){
						resultConcatFiles[key].push(src.replace('\''));
					});
				}
			}
		};
		var projectPath = __dirname;
		var appPath = projectPath + path.sep + config.app;
		appPath = path.normalize(appPath);
		resolveDir(appPath,{dist:config.dist,src:config.app});

		var commonPath = projectPath + path.sep + config.common_src;
		commonPath = path.normalize(commonPath);
		resolveDir(commonPath,{dist:config.common_dist,src:config.common_src});

		for(var key in resultConcatFiles) {
			var prop = key.replace(/\"/g,"");
			concat.dist.files[prop] = [];
			resultConcatFiles[key].forEach(function(src){
				concat.dist.files[prop].push(src.replace(/\"/g,""));
			});
		}

		/*將SeaCfg放到數組中的最後一個位置*/
		for(var key in concat.dist.files){
			var seaCfgEndExt = config.seaCfgEndExt;
			var files = concat.dist.files[key];
			var newFiles = [];
			var result = '';
			for (var i = 0,len = files.length; i < len; i++) {
				var fileStr = files.shift();
				if(_that._isEndWith(fileStr,seaCfgEndExt)) result = fileStr;
				else newFiles.push(fileStr);
			}
			if(result) newFiles.push(result);
			concat.dist.files[key] = newFiles;
		}
	})();
	return concat;
}
/**
 * 解析sea配置文件，将base加上客户端地址
 * @param  {Object} fileInfo 文件基本信息
 * @return {[type]}          [description]
 */
GruntBase.prototype._buildSeaCfgFile = function(fileInfo){
	var _that = this;
	var path = this.path;
	var config = this.config;
	var fs = this.fs;
	var grunt = this.grunt;

	var filePath = path.resolve(fileInfo.dir,fileInfo.base);
	var fileContent = fs.readFileSync(filePath,config.charset);
	
	grunt.log.subhead('正在处理文件JSON属性值:'+filePath);
	grunt.log.subhead('替换属性:'+config.seaCfgSeachKey+'值为' + config.Client_Path);
	fs.writeFileSync(filePath, 
		_that._findAndReplace(fileContent,config.seaCfgSeachKey,"'" + config.Client_Path + "'"), 
		config.charset);
	grunt.log.oklns('Done:');
}
/**
 * 查找文件，并根据obj的key替换字符串，如{a: 'dddd'}，替换为{a: 'hhh'};
 * @param  {[String]} str        [目标字符串:'{a: 'dddd'}']
 * @param  {[String]} searchKey  [查找key：a:或者a]
 * @param  {[String]} replaceStr [替换结果字符：'hhh']
 * @return {[String]}            [description]
 */
GruntBase.prototype._findAndReplace = function(str,searchKey,replaceStr){
	var fileContent = str;

	var searchIndex = fileContent.search(searchKey);
	/*第一个单引号的位置*/
	var firstIndex = fileContent.substring(searchIndex).indexOf("'") + 1 + searchIndex;
	/*临时文本*/
	var tempFirstContent = fileContent.substring(firstIndex);
	/*第二个单引号的位置*/
	var secondIndex = tempFirstContent.indexOf("'") + 1 + firstIndex;

	var currentSearchValue = fileContent.substring(firstIndex - 1,secondIndex);

	return fileContent.replace(currentSearchValue,replaceStr);
}
/*赋值dseConstant里的DsePath对象里关于服务器和客户端地址*/
GruntBase.prototype._replaceDseConstant = function(){
	var _that = this;
	var path = this.path;
	var config = this.config;
	var fs = this.fs;
	var grunt = this.grunt;

	var configFilePath = path.join(__dirname,config.common_config_file);
	/*读取文件*/
	var fileContent = fs.readFileSync(configFilePath,config.charset);

	var serverParamName = config.common_config_file_server_param_name;
	var clientParamName = config.common_config_file_client_param_name;
	var serverPath = config.Server_Path;
	var clientPath = config.Client_Path;

	grunt.log.subhead('正在common模块文件客户端和服务端的地址:'+configFilePath);
	grunt.log.subhead('替换:'+serverParamName+'为：' + "'" + serverPath + "'");
	grunt.log.subhead('替换:'+clientParamName+'为：' + "'" + clientPath + "'");
	fileContent = _that._findAndReplace(fileContent,serverParamName,"'" + serverPath + "'");
	fileContent = _that._findAndReplace(fileContent,clientParamName,"'" + clientPath + "'");
	/*写回文件*/
	fs.writeFileSync(configFilePath, fileContent, config.charset);
	grunt.log.oklns('Done');
	return _that;
}
/*构建合并路径*/
GruntBase.prototype._useminBuildPath = function(block,isCommon){
	var config = this.config;
	/*1、获取输出路径*/
	var distPath = block.dest;
	/*2、截取路径 eg:../a/b/c/main.min.js*/
	/*获取倒数第一个.的位置*/
	var lastIndex = distPath.lastIndexOf('.');
	/*截取临时路径eg:../a/b/c/main.min*/
	var tempPath = distPath.substring(0,lastIndex);
	/*获取倒数第二个.的位置*/
	var firstIndex = tempPath.lastIndexOf('.');
	/*截取前面的路径eg:../a/b/c/main*/
	var prevPath = distPath.substring(0,firstIndex);
	/*获取文件扩展名称*/
	var endPath = distPath.substring(lastIndex);
	/*3、组装路径*/
	var resultPath = 
	!isCommon ? 
	config.Client_Path + prevPath + config.distMin + endPath 
	: 
	config.Client_Path + distPath;

	var result = '';
	if(distPath.indexOf('.css') >= 0){
		result = '<link rel="stylesheet" type="text/css" href="' + resultPath + '"><\/link>';
	}else if(distPath.indexOf('.js') >= 0){
        result = '<script type="text/javascript" src="' + resultPath + '"><\/script>';
	}
	return result;
}
/*构建libs*/
GruntBase.prototype._buildLibs = function(block){
	var config = this.config;
	var libDir = block.dest;
	var clientPath = config.Client_Path;
	var result = '';
	block.src.map(src => {
		var libPath = clientPath + src.substring(src.indexOf(libDir));
		if(src.indexOf('.css') >= 0){
			result += '<link rel="stylesheet" type="text/css" href="' + libPath + '"><\/link>';
		}else if(src.indexOf('.js') >= 0){
        	result += '<script type="text/javascript" src="' + libPath + '"><\/script>';
		}
	});
	return result;
}
/**
 * 获取grunt配置项
 * @return {[type]} [description]
 */
GruntBase.prototype.buildGruntConfig = function(){
	var pkg = this.pkg;
	var config = this.config;
	var _that = this;
	return {
		pkg: pkg,
		config: config,
		/*清空任务*/
		clean: {
			// 所有
			all : ['<%= config.dist%>/','.build/','<%= config.common_dist%>/'],
			// 清除common
			common:['<%= config.common_dist%>/']
		},
		/*编译less*/
		less: {
            all: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/',
                    src: ['**/*.less'],
                    dest: '<%= config.app %>/',
                    ext: '.css'
                },
                {
            	    expand: true,
            	    cwd: '<%= config.common_src %>/',
            	    src: ['**/*.less'],
            	   	dest: '<%= config.common_src %>/',
            	    ext: '.css'
            	}]
            },
            common: {
            	files: [{
            	    expand: true,
            	    cwd: '<%= config.common_src %>/',
            	    src: ['**/*.less'],
            	   	dest: '<%= config.common_src %>/',
            	    ext: '.css'
            	}]
            }
        },
		/*编译sass*/
		sass: {
		    all: {
		      	files: [
		      		{
						expand: true,
			        	cwd: '<%= config.app %>/',
			        	src: ['**/*.scss'],
			        	dest: '<%= config.app %>/',
			        	ext: '.css'
		      		},
		      		{
						expand: true,
			        	cwd: '<%= config.common_src %>/',
			        	src: ['**/*.scss'],
			        	dest: '<%= config.common_src %>/',
			        	ext: '.css'
		      		}
		      	]
		    },
		    // 编译common
		    common: {
		    	files: [
		      		{
						expand: true,
			        	cwd: '<%= config.common_src %>/',
			        	src: ['**/*.scss'],
			        	dest: '<%= config.common_src %>/',
			        	ext: '.css'
		      		}
		      	]
		    }
		},
		/*复制任务*/
		copy : {
			// 所有模块
			all : {
				files: [
			            {
			                expand: true,
			                cwd: '<%= config.app %>/',
			                src: ['**/*.jsp','**/*.html'],
			                dest: '<%= config.dist %>/'
			            },
			            {
			                expand: true,
			                cwd: '<%= config.common_src %>/',
			                src: ['**/*.jsp','**/*.html'],
			                dest: '<%= config.common_dist %>/'
			            }
			        ]
			},
			// 复制common
			common:{
				files: [
			            {
			                expand: true,
			                cwd: '<%= config.common_src %>/',
			                src: ['**/*.jsp','**/*.html'],
			                dest: '<%= config.common_dist %>/'
			            }
			        ]
			}
		},
		/*合并*/
		concat: {},
		/*ES6编译配置*/
		babel: {
			options: {
				sourceMap: false,/*建立映射太费时间*/
				presets: ['babel-preset-es2015']
			},
			all: {
				files: [{
                    expand: true,
                    cwd: '<%= config.dist %>/',
                    src: '**/*.js',
                    dest: '<%= config.dist %>/',
                    ext: '.min-es5.js'
                },
                {
                    expand: true,
                    cwd: '<%= config.common_dist %>/',
                    src: '**/*.js',
                    dest: '<%= config.common_dist %>/',
                    ext: '.min-es5.js'
                }]
			},
			// common
			common:{
				files: [
			            {
			                expand: true,
			                cwd: '<%= config.common_dist %>/',
			                src: '**/*.js',
			                dest: '<%= config.common_dist %>/',
			                ext: '.min-es5.js'
			            }
			        ]
			}
		},
		/*压缩js*/
		uglify: {
			options: {
				sourceMap: false,/*建立映射太费时间*/
			},
			all: {
		      files: [{
		          expand: true,
		          cwd: '<%= config.dist %>/',
		          src: '**/*.min-es5.js',
		          dest: '<%= config.dist %>/',
		          ext: '<%= config.distMin %>.js',
		      },
		      {
		          expand: true,
		          cwd: '<%= config.common_dist %>/',
		          src: '**/*.min-es5.js',
		          dest: '<%= config.common_dist %>/',
		          ext: '<%= config.commonDistMin %>.js',
		      }]
	    	},
	    	// common
	    	common: {
	    		files: [{
	    		    expand: true,
	    		    cwd: '<%= config.common_dist %>/',
	    		    src: '**/*.min-es5.js',
	    		    dest: '<%= config.common_dist %>/',
	    		    ext: '<%= config.commonDistMin %>.js',
	    		}]
	    	}
	  	},
	   	/*压缩图片*/
	  	imagemin: {
	  		options: {
                    optimizationLevel: 3 //定义 PNG 图片优化水平
                },
	  		all: {
	  			files: [{
	  				expand: true,
	  				cwd: '<%= config.app %>/',
	  				src: ['**/*.{png,jpg,gif,jpeg}'],
	  				dest: '<%= config.dist %>/'
	  			},
	  			{
	  				expand: true,
	  				cwd: '<%= config.common_src %>/',
	  				src: ['**/*.{png,jpg,gif,jpeg}'],
	  				dest: '<%= config.common_dist %>/'
	  			}]
	  		},
	  		// common
	  		common: {
	  			files: [{
	  				expand: true,
	  				cwd: '<%= config.common_src %>/',
	  				src: ['**/*.{png,jpg,gif,jpeg}'],
	  				dest: '<%= config.common_dist %>/'
	  			}]
	  		}
	  	},
	  	/*压缩css*/
	  	cssmin: {
	  		all: {
			    files: [{
			      	expand: true,
			      	cwd: '<%= config.dist %>/',
			      	src: ['**/*.css'],
			      	dest: '<%= config.dist %>/',
			      	ext: '<%= config.distMin %>.css'
			    },{
			      	expand: true,
			      	cwd: '<%= config.common_dist %>/',
			      	src: ['**/*.css'],
			      	dest: '<%= config.common_dist %>/',
			      	ext: '<%= config.commonDistMin %>.css'
			    }]
			},
			common: {
				files: [{
				  	expand: true,
				  	cwd: '<%= config.common_dist %>/',
				  	src: ['**/*.css'],
				  	dest: '<%= config.common_dist %>/',
				  	ext: '<%= config.commonDistMin %>.css'
				}]
			}
	  	},
	   	/*替换引用*/
	  	usemin: {
		    html: '<%= config.dist %>/**/*.{html,jsp,js}',
		    options: {
		    	blockReplacements: {
		    		css : function(block){
                        return _that._useminBuildPath(block);
		    		},
		    		js : function(block){
                        return _that._useminBuildPath(block);
		    		},
		    		commonCss: function(block){
                        return _that._useminBuildPath(block,true);
		    		},
		    		libs: function(block){
		    			return _that._buildLibs(block);
		    		},
		    		projectPath: function(block){
		    			return '<base href="' + config.Client_Path + '" \/>';
		    		}
		    	},
		    },
		},
	   	/*检查js语法*/
	  	jshint: {
	  		options: {
	  			jshintrc : '.jshintrc',
	  		},
		    src : ['<%= config.app %>/**/*.js','<%= config.common_src %>/**/*.js'],
		},
		/*监听文件修改*/
		watch: {
			buildCommon: {
				files: [
				'<%= config.common_src %>/**/*.js',
				'<%= config.common_src %>/**/*.css',
				'<%= config.common_src %>/**/*.html'
				],
			    tasks: ['buildCommon']
			},
			build: {
				files: ['<%= config.app %>/**/*.js','<%= config.common_src %>/**/*.js',
				'<%= config.app %>/**/*.html','<%= config.common_src %>/**/*.html'],
			    tasks: ['build']
			}
		},
	};
}
exports.GruntBase = GruntBase;
