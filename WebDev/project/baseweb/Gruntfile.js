'use strict';
/*insert*/
module.exports = function(grunt){
	var path = require('path');
 	var fs = require('fs');
	var pkg = grunt.file.readJSON('package.json');
	var ModuleGenerator = require('./gruntBuild').ModuleGenerator;
	var GruntEnd = require('./gruntEnd').GruntEnd;
	var args = process.argv;
	// 系统配置
	var config = {
		charset: 'UTF-8',
		projectName : pkg.name,/*项目名称*/
		app : pkg.src_dir,/*源码*/
		dist : pkg.dist_dir,/*打包*/
		common_src : pkg.common_src,/*源码*/
		common_dist : pkg.common_dist,/*打包*/
		commonDistMin : '.dse.min',/*打包后的文件名称*/
		distMin : '.min.' + pkg.version,/*打包后的文件名称*/
		concatScriptName : 'main.js',/*concat生成的文件名称*/
		concatCSSName : 'main.css',/*concat生成的文件名称*/
		scriptFileExt : '.js',/*生成concat对象递归文件目录下处理的脚步后缀*/
		cssFileExt : '.css',/*生成concat对象递归文件目录下处理的脚步后缀*/
		htmlFileExt : '.html',/*生成concat对象递归文件目录下处理的脚步后缀*/
		seaCfgEndExt : pkg.moduleSeaCfgExt,/*模块的seajs配置文件结尾字符串SeaCfg.js*/
		seaCfgSeachKey : pkg.seaCfgSeachKey,/*模块的seajs配置文件结尾字符串SeaCfg.js*/
		seaCfgLibDir : pkg.seaCfgLibDir,/*模块的seajs配置文件结尾字符串SeaCfg.js*/
		/*用于根据*/
		Server_Path : pkg.Server_Path,/*服务器地址*/
		Client_Path : pkg.Client_Path,/*客户端地址*/
		profile: pkg.profile,/*环境配置项*/
		common_config_file : pkg.common_config_file_path,/*dseConfig.js文件位置*/
		common_config_file_client_param_name : pkg.Client_Path_ParamName,/*dseConfig.js文件位置*/
		common_config_file_server_param_name : pkg.Server_Path_ParamName,/*dseConfig.js文件位置*/

		templateModulePath : pkg.templateModulePath,/*模板目录，生成模块*/
		templateModuleName : pkg.templateModuleName,/*模板文件名，需要替换掉的文件*/
		templateModuleParams : {
			module: '',
			clientPath: 'config.Client_Path',
			projectName: 'config.projectName'
		},
		delDirs:['.svn','.git'],/*配置创建模板时需要删除的文件*/
	};
	var GruntBase = require('./gruntBase').GruntBase;
	var gruntBase = new GruntBase({
		config : config,
		grunt : grunt,
		path : path,
		fs: fs,
		pkg:pkg,
		args:args
	});
	(function(){
		config.Server_Path = config.profile.dev.Server_Path;
		config.Client_Path = config.profile.dev.Client_Path;
		var str = gruntBase._getCommand();
		if(str.lastIndexOf(':') === -1) return ;
		str = str.split(':')[1];
		var profile = config.profile[str];
		if(!profile) return ;
		config.Server_Path = profile.Server_Path;
		config.Client_Path = profile.Client_Path;
	})();
	
	grunt.log.oklns('服务器端地址：' + config.Server_Path);
	grunt.log.oklns('客户端地址：' + config.Client_Path);

	var gruntConfig = gruntBase.buildGruntConfig();
	grunt.initConfig(gruntConfig);

	require('load-grunt-tasks')(grunt);

	require('time-grunt')(grunt);
	// 清除
	require('grunt-contrib-clean')(grunt);
	// 复制	
	require('grunt-contrib-copy')(grunt);
	// js语法检查
	require('grunt-contrib-jshint')(grunt);
	// 压缩image
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	// 压缩js
	require('grunt-contrib-uglify')(grunt);
	// 压缩css
	require('grunt-contrib-cssmin')(grunt);
	// 合并
	require('grunt-contrib-concat')(grunt);
	// watch
	grunt.loadNpmTasks('grunt-contrib-watch');
	// sass
	grunt.loadNpmTasks('grunt-contrib-sass');
	// less
	grunt.loadNpmTasks('grunt-contrib-less');


	// 处理文件任务
	grunt.registerTask(
		'_buildConcat',
		'构建concat',
		function(){
			gruntBase.process();
			gruntConfig.concat = gruntBase.buildConcat();
		});
	// 注册build任务
	grunt.registerTask(
		'build',
		'打包项目',
		function(){
			grunt.task.run([
				'clean:all','less:all','_buildConcat',
				'copy:all','concat','babel:all',
				'uglify:all','imagemin:all','cssmin:all','usemin',
				'endDeal']);
		});
	// 注册buildCommon
	grunt.registerTask(
		'buildCommon',
		'构建公共模块',
		function(){
			grunt.task.run([
				'clean:common','less:common','_buildConcat',
				'copy:common','concat','babel:common',
				'uglify:common','imagemin:common','cssmin:common','usemin',
				'endDeal']);
		});
	
	grunt.registerTask(
		'endDeal',
		'任务结束处理器',
		function(){
			new GruntEnd({
				config : config,
				grunt : grunt,
				path : path,
				fs: fs
			}).process();
		});
	
	// 默认检查js语法
	grunt.registerTask(
		'default',
		'检查js语法',
		['jshint']
		);
	// 注册创建模块任务
	grunt.registerTask('init','创建模块，生成模块目录',function(moduleName){
		if(!moduleName){
			grunt.log.errorlns('请使用"grunt init:模块名称"新建模块');
			return ;
		};
		/*获取模块目录*/
		var moduleDir = path.resolve(path.join(config.app,config.projectName,moduleName));
		var generatorConfig = config;
		generatorConfig.moduleDir = moduleDir;
		generatorConfig.moduleName = moduleName;
		new ModuleGenerator({
			config : generatorConfig,
			grunt : grunt,
			path : path,
			fs: fs
		}).generator(function(){
			grunt.log.oklns(moduleName + '模块生成完成，路径为：' + moduleDir);
		},function(){
			grunt.log.errorlns(moduleName + '模块生成失败，模块已经存在！');

		});
	});
};