'use strict'

module.exports = function(grunt){

	require('load-grunt-tasks')(grunt);

	require('time-grunt')(grunt);

	var config = {
		app : 'app',
		dist : 'dist'
	};

	grunt.initConfig({
		config : config,

		copy : {
			dist_html : {
				files:[
					{
						expand : true,
						cwd : '<%= config.app %>/',
						src : '**/*.js',
						dest : '<%= config.dist %>/',
						ext : '.min.js',
						extDoc : 'first',// 从哪个.开始处理文件
						flatten : true, // 将文件拷贝到第一层目录下；不处理其原本的目录结构
						// 在ext、extDoc、flatten执行之后调用，以下效果实现目录结构
						rename : function(dest,src){
							return dest + 'js/' + src;
						}

					}
				]
			}
		},
		clean : {
			dist : {
				// src : ['<%= config.dist %>/index.html','<%= config.dist %>/js/index.js']
				src : ['<%= config.dist %>/**/*']
			}
		}
	});
}