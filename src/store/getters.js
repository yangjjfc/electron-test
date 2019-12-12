export default {
    userInfo: state => state.user.userInfo,
    token: state => state.user.userInfo && state.user.userInfo.token, // 用户token
    enterpriseNo: state => state.user.userInfo && state.user.userInfo.enterpriseNo, // enterpriseNo
    enterpriseName: state => state.user.userInfo && state.user.userInfo.enterpriseName, // enterpriseName
    clientid: state => state.user.userInfo && state.user.userInfo.clientId, // clientid
    enterpriseGroupType: state => state.user.userInfo && state.user.userInfo.enterpriseGroupType, // enterpriseGroupType
    routers: state => state.permission.routers,
    menuList: state => state.user.menuList,
    buttons: state => state.user.buttons,
    collectList: state => state.user.collectList,
    tempNavs: state => state.app.tempNavs,
    activeNav: state => state.app.activeNav,
    isOpean: state => state.app.sidebar.opened, // 菜单状态
    leftMenu: state => state.app.leftMenu,
    auth: state => state.app.auth,
    unreadCount: state => state.user.unreadCount // 未读消息数
};
