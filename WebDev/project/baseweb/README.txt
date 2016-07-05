app：	业务模块目录，存放源代码
dist：	项目上线的目录，存放打包后代码
public：资源存放目录

Gruntfile.js	grunt配置文件
package.json	node依赖以及项目的信息
.bowerrc	bower依赖库存放位置配置文件
bower.json	bower第三方类库依赖配置文件
.jshintrc	代码规范检查配置文件


{
  "name": "baseweb",// 项目名称
  "version": "1.0.0",// 项目当前版本号
  "src_dir": "app",// 业务源码目录
  "dist_dir": "dist",// 业务打包目录
  "common_src": "public/dse/common/src",// 公共模块源码目录
  "common_dist": "public/dse/common/dist",// 公共模块打包目录
  "common_config_file_path": "public/dse/common/src/js/dseConfig.js",// 公共模块打包目录
  "moduleSeaCfgExt": "SeaCfg.js",// 模块依赖配置文件后缀
  "seaCfgSeachKey": "base:",//模块配置文件的base的key键值
  "seaCfgLibDir": "public/",// 配置文件的lib标识符号
  "templateModulePath": "public/dse/templateModule",// 生成模块的模板目录
  "templateModuleName": "templateModule",//
  "Client_Path_ParamName": "Client_Path",// dseConfig.js文件参数名称
  "Server_Path_ParamName": "Server_Path",// dseConfig.js文件参数名称
  "profile":{// 环境配置项目
    "dev":{
      "Server_Path": "http://127.0.0.1:8080/baseweb/", // 开发环境的服务地址
      "Client_Path": "http://127.0.0.1:8080/baseweb/", // 开发环境的前端访问地址
    },
    "test":{
      "Server_Path": "http://127.0.0.1:8080/baseweb/",
      "Client_Path": "http://127.0.0.1:8080/baseweb/",
    },
    "product":{
      "Server_Path": "http://127.0.0.1:8080/baseweb/",
      "Client_Path": "http://127.0.0.1:8080/baseweb/",
    },
  },
  "description": "baseweb",
  "main": "Gruntfile.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "baseweb"
  ],
  "author": "wxd",
  "license": "ISC",
  "devDependencies": {
    "babel-preset-es2015": "^6.9.0",
    "bower": "^1.7.9",
    "grunt": "^1.0.1",
    "grunt-babel": "^6.0.0",
    "grunt-browserify": "^5.0.0",
    "grunt-cmd-transport": "^0.5.1",
    "grunt-contrib-clean": "^1.0.0",
    "grunt-contrib-concat": "^1.0.1",
    "grunt-contrib-copy": "^1.0.0",
    "grunt-contrib-cssmin": "^1.0.1",
    "grunt-contrib-imagemin": "^1.0.1",
    "grunt-contrib-jshint": "^1.0.0",
    "grunt-contrib-uglify": "^1.0.1",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-filerev": "^2.3.1",
    "grunt-usemin": "^3.1.1",
    "load-grunt-tasks": "^3.5.0",
    "time-grunt": "^1.3.0"
  }
}
