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
				files:{
					'<%= config.dist %>/index.html' : '<%= config.app %>/index.html',
					'<%= config.dist %>/js/index.js' : ['<%= config.app %>/js/index.js']
				}
				// files:[
				// 	{
				// 		src : '<%= config.app %>/index.html',
				// 		dest : '<%= config.dist %>/index.html'
				// 	},
				// 	{
				// 		src : '<%= config.app %>/js/index.js',
				// 		dest : '<%= config.dist %>/js/index.js',
				// 	}
				// ]
			}
		},
		clean : {
			dist : {
				// src : ['<%= config.dist %>/index.html','<%= config.dist %>/js/index.js']
				src : ['<%= config.dist %>/**/*'],
				// filter : 'isFile'/*保留文件夹*/
				// 自定义函数
				filter : function(filepath){
					return (!grunt.file.isDir(filepath));
				},
				dot : true,//命中‘.’开头的文件
				matchBase : true, // 例如：a?b /xzy/123/acb /xzy/acb/123 如果为true则只会命中第一个
			}
		}
	});
}