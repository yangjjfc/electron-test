
/**
 * 页面跳转 mixin
 * 使用this.handleLinkTo('purchase/purchaseOrder',params);
 */
export default {
    methods: {
        /**
         * @param {String} link 需要跳转的path
         * @param {Sting|Object} params query参数
         * @param {Sting} num 使用首页,>1时可跳
         */
        handleLinkTo (link, params, num = 1) {
            let routers = this.$store.getters.routers;
            if (!num) return;
            this.getURL(routers, link, (url) => {
                if (params) {
                    let query = {};
                    if (typeof params === 'string') {
                        query = { state: params }; 
                    } else if (Object.prototype.toString.call(params) === '[object Object]') {
                        query = params;
                    } else {
                        throw new Error('params只支持object和string');
                    }
                    this.$router.push({ path: url, query });
                } else {
                    this.$router.push({ path: url });
                }
            });
        },
        getURL (routers, name, callback) {
            let reg = new RegExp(`${name}$`);
            for (const item of routers) {
                if (item.path && item.path.includes(name) && reg.test(item.path)) {
                    callback(item.path);
                    return;
                } else {
                    if (item.children && item.children.length) {
                        this.getURL(item.children, name, callback);
                    }
                }
            }
        }
    }
};
