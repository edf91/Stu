seajs.config({
    base: 'http://127.0.0.1:8080/baseweb/',
    alias: {
        /*第三方依赖*/
        'jquery': 'public/libs/jquery/dist/jquery.min.js',/*jquery*/
        'echarts': 'public/libs/echarts/echarts.min.js',/*eachar*/
        'easyui': 'public/libs/jquery-easyui/jquery.easyui.min.js',/*easyui依赖jquery*/
        '97Date': 'public/libs/My97DatePicker/WdatePicker.js',/*97Date*/
        'nicescroll':'public/libs/nicescroll/jquery.nicescroll.min.js',/*nicescroll依赖jquery*/
        'bootstrap':'public/libs/bootstrap/dist/js/bootstrap.min.js',/*bootstrap依赖jquery；bsFileinput放大图依赖，且需先引入bsFileinput*/
        'bsfCanvas':'public/libs/bootstrap-fileinput/js/plugins/canvas-to-blob.min.js',/*bsFileinput图画依赖*/
        'bsfPurify':'public/libs/bootstrap-fileinput/js/plugins/purify.min.js',/*bsFileinput预览图片效果*/
        'bsfSort':'public/libs/bootstrap-fileinput/js/plugins/sortable.min.js',/*bsFileinput排序改编初始化文件则依赖*/
        'bsFileinput':'public/libs/bootstrap-fileinput/js/fileinput.min.js',/*依赖jquery*/
        'bsfFa':'public/libs/bootstrap-fileinput/js/locales/fa.js',/*bsFileinput字体*/
        'bsFileinput-zh':'public/libs/bootstrap-fileinput/js/locales/zh.js',/*bsFileinput语言包*/
        'layer':'public/libs/layer/layer.js',/*layer弹出层*/
        'underscore':'public/libs/underscore/underscore-min.js',/*underscore将替换为loadsh*/
        'jqbox':'public/libs/jquery-foxibox-0.2/script/jquery-foxibox-0.2.min.js',/*图片在线预览，依赖jquery*/
        /*定义公司自己的common*/
        'dseCommon':'public/dse/common/dist/js/main.dse.min.js'
    }
});

/*程序入口*/
seajs.use('../js/fileUploadMain',function(module){
    /*程序 start*/
    
    /*程序 end*/
});