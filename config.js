/**
 * config 打包配置文件
 * cnd引用相关js,目前公司本地引用外部的cnd,线上环境徐引用公司阿里云环境的,每新加一条cnd需要去阿里云生成相关cnd.js
 */

// 基本cnd,区分环境
let CDN_JS = [ 
    '//at.alicdn.com/t/font_977230_ps39ct04beg.js', // svg 阿里图标
    'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js' // 微信登录
];
const CDN_CSS = [
    '//at.alicdn.com/t/font_977230_ps39ct04beg.css' // iconfont
];
let IMAGE_DOWNLOAD = 'http://dfs.dev.cloudyigou.com/dfs/';

// process.env.NODE_BUILD 区分环境
if (process.env.NODE_BUILD !== 'online') {
    CDN_JS = [...CDN_JS, ...[
        'https://lib.baomitu.com/vue/2.6.10/vue.min.js', // cdn
        'https://lib.baomitu.com/vue-router/3.0.2/vue-router.min.js',
        'https://lib.baomitu.com/vuex/3.1.0/vuex.min.js',
        'https://cdn.bootcss.com/element-ui/2.10.1/index.js',
        /* 'https://lib.baomitu.com/echarts/4.2.1-rc1/echarts-en.common.min.js', */
        'https://lib.baomitu.com/jquery/3.3.1/jquery.min.js',
        'https://cdn.bootcss.com/tinymce/4.7.5/tinymce.min.js'
    ]];
}
switch (process.env.NODE_BUILD) {
case 'dev': 
    IMAGE_DOWNLOAD = 'http://dfs.dev.cloudyigou.com/dfs/';
    break;  
case 'test': 
    IMAGE_DOWNLOAD = 'http://dfs.test.cloudyigou.com/dfs/';
    break; 
case 'demo': 
    IMAGE_DOWNLOAD = 'http://ddc-dfs.demo.yyigou.com/dfs/';
    break; 
case 'online': // 线上
    CDN_JS = [...CDN_JS, ...[
        'https://cdn.yyigou.com/vue/2.6.10/vue.min.js?auth_key=2185076436-0-0-142238880b5cc938c4a5afdc51bedc86',
        'https://cdn.yyigou.com/vue-router/3.0.2/vue-router.min.js?auth_key=2185076493-0-0-1257cdca97b4ebc3a72d75585b48c613',
        'https://cdn.yyigou.com/vuex/3.1.0/vuex.min.js?auth_key=2185076511-0-0-eb36bdb3c38cc30fca60b8efaf16a713',
        'https://cdn.yyigou.com/element-ui/2.8.2/index.js?auth_key=2191560034-0-0-62aa533c22d1a6b0c81d40126195a456',
        'https://cdn.yyigou.com/echarts/4.2.1-rc1/echarts-en.common.min.js?auth_key=2185076543-0-0-426cc7eda01a1e60632fba061a1d94a2',
        'https://cdn.yyigou.com/jquery/3.3.1/jquery.min.js?auth_key=2185076552-0-0-e0806421b26aa21971014aa72cc87596'
    ]];   
    IMAGE_DOWNLOAD = 'https://ddc-dfs.yyigou.com/dfs/'; // 线上https
    break;
case 'yz': // 线上
    IMAGE_DOWNLOAD = 'slip.ddc-dfs.yiyigou.com'; // 线上https
    break;
default: // 开发 测试 演练
        
    break;
}

module.exports = {
    CDN_JS,
    CDN_CSS,
    IMAGE_DOWNLOAD
};
