/**
 * router配置文件
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import RouterMap from './router.js';
import BASE from '@/utils/constant/index.js';
import store from '@/store/index';
import Layout from '@/pages/basic/layout/Layout.vue';
/**
 * router
 */
Vue.use(VueRouter);
let defaultRouter = RouterMap._execMeun(RouterMap.map); // RouterMap._execMeun(localRouter).concat();
const router = new VueRouter({
    routes: defaultRouter,
    mode: 'history',
    strict: process.env.NODE_ENV !== 'production',
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 };
    }
});

// register global progress.
router.beforeEach((to, from, next) => {
    if (BASE.skipAuth.includes(to.path)) {
        next();
    } else {
        if (!store.getters.menuList) {
            // 判断当前用户是否登陆
            store.dispatch('currentUser').then(() => {
                // 没有登陆 跳到登陆页 what
                let user = store.getters.userInfo;
                if (!user || !user.enterpriseNo) {
                    next('/login');
                    return;
                }
                if (user.extInfo && ['canceled', 'unaudit'].includes(user.extInfo.status)) {
                    next('/perfectRegister');
                    return;
                }
                // 权限不存在,获取权限
                store.dispatch('getUserMenus').then(res => {
                    store.dispatch('generateRouters', res).then(list => {
                        let app = [{
                            path: '',
                            component: Layout,
                            name: 'root',
                            children: list
                        }];
                        router.addRoutes(app); // 必须是数组,动态添加可访问路由表
                        next({ ...to }); // hack方法 确保addRoutes已完成
                    });
                }).catch(errs => {
                    console.info(errs);
                    // 无法获取权限则跳到登入页,无权限进入系统
                    next('/login');
                });
            });
        } else if (to.matched.length) {
            next();
        } else {
            next(BASE.defaultUrl);
        }
    }
});

export default router;
