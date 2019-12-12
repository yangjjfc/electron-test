/* layout */
/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 * virtual : this is the virtual menu
 **/
import Layout from '@/pages/basic/layout/Layout.vue';
import Error from '@/components/error/Error.vue';
import BASE from '@/utils/constant/index.js';
export let constantRouterMap = [
    { path: '', redirect: '/app/hello' },
    {
        path: '/login',
        component: () => import('../pages/basic/login/index'),
        name: 'login'
    },
    {
        path: '/app',
        component: Layout,
        funcIcon: 'icon-daohang-jichu',
        funcType: '',
        label: '固定页面',
        children: [{
            path: BASE.defaultUrl,
            name: 'hello',
            funcIcon: 'icon-daohang--5',
            meta: {
                name: '首页',
                componentUrl: 'basic/index'
            }
        },
        {
            path: '404',
            component: Error,
            meta: { name: '未知页面' },
            name: 'errorPage'
        }
        ]
    }

];
const RouterMap = {
    map: constantRouterMap,
    _execMeun (list, leval = 1) {
        list.forEach(item => {
            item.meta = item.meta || {
                no: Math.random() * 1000 + '',
                name: item.label || item.title,
                leval
            };
            item.meta.cache = BASE.cacheUrls.includes(item.meta.componentUrl);
            item.funcType = item.funcType || 'MENU';
            item.children && this._execMeun(item.children, leval + 1);
        });
        return list;
    }
};

export default RouterMap;
