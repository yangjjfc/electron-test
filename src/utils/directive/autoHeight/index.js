import autoHeight from './autoHeight';

const install = function (Vue) {
    Vue.directive('autoHeight', autoHeight);
};
if (window.Vue) {
    window.autoHeight = autoHeight;
  Vue.use(install); // eslint-disable-line
}

autoHeight.install = install;
export default autoHeight;
