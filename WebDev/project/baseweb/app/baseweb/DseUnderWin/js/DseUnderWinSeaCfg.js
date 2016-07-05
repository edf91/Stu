seajs.config({
    base: 'http://127.0.0.1:8080/baseweb/',
    alias: {
        /*第三方依赖*/
        'jquery': 'public/libs/jquery/dist/jquery.min.js',
        'echarts': 'public/libs/echarts/echarts.min.js',
        'easyui': 'public/libs/jquery-easyui/jquery.easyui.min.js',
        '97Date': 'public/libs/My97DatePicker/WdatePicker.js',
        'nicescroll':'public/libs/nicescroll/jquery.nicescroll.min.js',
        'bootstrap':'public/libs/bootstrap/dist/js/bootstrap.min.js',
        'layer':'public/libs/layer/layer.js',
        'underscore':'public/libs/lodash/dist/lodash.min.js',
        'jqbox':'public/libs/jquery-foxibox-0.2/script/jquery-foxibox-0.2.min.js',

        /*定义公司自己的common*/
        'dseCommon':'public/dse/common/dist/js/main.dse.min.js'
    }
});

/*程序入口*/
seajs.use('../js/DseUnderWinMain',function(module){
    /*程序 start*/

    /*程序 end*/
});