const BASE = {
    // 临时缓存组件路径：想被缓存的组件不能有name 属性， 否则不生效
    cacheUrls: ['order/protocol'],
    // more跳转地址
    defaultUrl: '/app/hello',
    // 不需要验证用户信息
    skipAuth: ['/login', '/register', '/perfectRegister', '/loginByWx'],
    // 组件路径名称对照  - key 是 组件路径  value 是路由name
    pageNames: {
        'sale/saleOrder': 'scmSaleOrder'
    }
};

export default BASE;
