import store from '@/store/index';

const install = function (Vue) {
    Vue.directive('auth', {
        bind (el, binding, vnode) {
            let auth = store.getters.auth,
                code = binding.arg;
            if (!auth[code]) {
                el.style.display = 'none';
            }
        }
    });
};
if (window.Vue) {
    Vue.use(install); // eslint-disable-line
}
export default {
    install
};
