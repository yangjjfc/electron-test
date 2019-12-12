import Vue from 'vue';
import router from './router/r-config.js';
import store from './store/index.js';
import ContentMenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import YcloudUi, { changeEnvironment } from 'ycloud-ui';
import 'ycloud-ui/lib/theme-chalk/index.css';
import App from './App';
changeEnvironment(process.env.IMAGE_DOWNLOAD ? {
    IMAGE_DOWNLOAD: process.env.IMAGE_DOWNLOAD
} : { });
// 全局指令
Vue.use(ContentMenu);
Vue.use(YcloudUi);
Vue.config.productionTip = false; // 设置为 false 以阻止 vue 在启动时生成生产提示。
// 删除标签，提升到全局方法
Vue.prototype.removeNav = closeName => {
    store.commit('REMOVENAV', closeName);
};
// 全局组件
/* eslint-disable no-new */
new Vue({
    // eslint-disable-line no-new
    el: '#app',
    router,
    store,
    render: h => h(App)
}).$mount('#app');
