import NavPage from './src/NavPage';

/* istanbul ignore next */
NavPage.install = function (Vue) {
    Vue.component(NavPage.name, NavPage);
};

export default NavPage;