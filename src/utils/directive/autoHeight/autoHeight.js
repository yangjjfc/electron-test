import debounce from 'lodash.debounce';
const autoHeigth = (el, binding, vnode) => {
    let clientTop = el && el.getBoundingClientRect().top;
    // console.log(clientTop);
    let limitH = Number(binding.value) || 0;
    let elHeight = window.innerHeight - clientTop - limitH - 30;
    // console.log(elHeight);
    el.style.height = elHeight + 'px';
};
const debounceFunc = debounce(autoHeigth, 500);
const listener = (...rest) => {
    debounceFunc(...rest);
};
export default {
    bind (...rest) {
        autoHeigth(...rest);
        window.addEventListener('resize', listener.bind(this, ...rest));
    },
    inserted (...rest) {
        autoHeigth(...rest);
    },
    update (...rest) {
        autoHeigth(...rest);
    },
    unbind () {
        window.removeEventListener('resize', listener);
    }
};