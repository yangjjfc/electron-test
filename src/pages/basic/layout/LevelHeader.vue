<template>
    <div class="container">
        <div class="c-left">
            <div class="logo" :class="{'close':!isOpean}">
                <div @click="handleToHello" class="pointer">
                    <img v-if="isOpean" :src="Logo1" alt="" class="sysName">
                    <img v-else :src="Logo2" alt="" class="sysName2">
                </div>
               
            </div>
            <ul class="products">
                <li :class="{'active': activeNo == item.no}" @click="handleChangeMenu(item)" v-for="(item, index) in menuList" :key="index">
                    <yl-icon :className="item.funcIcon" style="font-size: 22px;"></yl-icon>
                    <span v-text="item.label"></span>
                </li>
            </ul>
        </div>
        <div class="c-right">
            <ul>
                <li>
                    <el-badge :value="unreadCount > 0 ? unreadCount : ''" :max="100">
                        <yl-icon icon="icon-xiaoxi1" style="font-size: 16px; padding-right: 5px;"></yl-icon>
                        <el-button type="text"  @click="handleMessage">
                            消息
                        </el-button>
                    </el-badge>
                </li>
                <li>
                    <p>{{userInfo.enterpriseName}}</p>
                </li>
            </ul>
            <div class="helps" v-if="list.length > 1">
                <el-dropdown @command="changeSystem" trigger="hover">
                    <div class="el-dropdown-link">
                        <yl-icon class="svg" className="icon-zhihuan"></yl-icon>
                        <span>切换公司</span>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item" v-for="(item, index) in list" :disabled="!item.canSwitch" :key="index">{{item.enterpriseName}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="userinfo-inner" :class="{active: isLogoActive}">
                <el-dropdown @command="handleCommand" trigger="click" @visible-change="visibleChange" placement="bottom">
                    <div class="user-logo">
                        <img :src="userLogo" alt="" />
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="user">
                            <div class="line" style="line-height: 22px; padding-bottom: 5px;">
                                <h4><yl-icon icon="icon-gerenxinxi" class="icon"></yl-icon> {{userInfo.userName}}</h4>
                                <p style="color: #999; font-size: 12px;">账号: {{userInfo.loginAccount}}</p>
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="enterprise">
                            <div class="line">
                                <yl-icon icon="icon-qiyeziliao" class="icon"></yl-icon> 企业信息
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="help">
                            <div class="line">
                                <yl-icon icon="icon-bangzhu" class="icon"></yl-icon> 帮助文档
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="exit">
                            <div class="exit">
                                <el-button size="mini" >退出</el-button>
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import Logo1 from './img/logo1.png';
import Logo2 from './img/logo2.png';
import userLogo from './img/userLogo.png';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { Tools } from 'ycloud-ui';
import BASE from '@/utils/constant/index.js';
import linkMix from '@/utils/mixins/linkMix.js';
const URL = {
    getFileUrl: 'scs.file.fileTemplate.getFileUrl', // 下载模板
    USER_INFO: 'ypt.user.findUserByNo', // 获取用户详情
    changeEnterprise: 'ddc.uim.authorizationPermission.getEmployeePartPermission'
}; // 文件格式
export default {
    mixins: [linkMix],
    data () {
        return {
            isLogoActive: false,
            logo: '',
            userLogo,
            Logo1,
            Logo2,
            activeNo: '',
            list: []
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'menuList',
            'isOpean',
            'unreadCount'
        ])
    },
    watch: {
        
    },
    methods: {
        ...mapMutations(['SEFLEFTMENU', 'SETTEMPNAVS']),
        ...mapActions(['logout', 'getCollectList', 'getUnreadMessageCount']),
        toggleMenu () {
            this.$store.commit('TOGGLE_SIDEBAR');
        },
        handleToHello () {
            this.$router.push('/app/hello');
        },
        // 切换产品
        changeSystem (item) {
            this.Http(URL.changeEnterprise, {
                enterpriseNo: item.enterpriseNo,
                userNo: item.userNo
            }).then(result => {
                // let data = result.data || [];
                this.SETTEMPNAVS([]);
                sessionStorage.clear();
                window.location.href = BASE.defaultUrl;
            });
        },
        // 切换左侧菜单
        handleChangeMenu (item) {
            this.activeNo = item.no;
            this.SEFLEFTMENU(item.children);
            // this.getCollectList(item.releaseNo);
        },
        visibleChange (visible) {
            this.isLogoActive = visible;
        },
        handleHelp () {
            let enterpriseType = this.$store.getters.userInfo.enterpriseType; // 判断用户类型
            let nameDoc = '';
            if (enterpriseType.includes('jxs')) {
                nameDoc = 'Distributor_Manual';
            } else if (enterpriseType.includes('cs')) {
                nameDoc = 'Manufacturer_Manual';
            } else {
                nameDoc = 'Hospital_end_Manual';
            }
            // Distributor_Manual		经销商操作手册
            // Hospital_end_Manual		医院端操作手册
            // Manufacturer_Manual		生产厂商操作手册
            this.Http(URL.getFileUrl, {
                token: nameDoc
            }).then(res => {
                Tools.downloadFile(Tools.mode.IMAGE_DOWNLOAD + res.data.url);
            });
        },
        handleCommand (type) {
            if (type === 'exit') {
                this.exit();
            } else if (type === 'help') {
                this.handleHelp();
            } else if (type === 'enterprise') {
                let url = 'basic/enterprise/info';
                this.handleLinkTo(url);
            } else if (type === 'user') {
                let url = 'basic/enterprise/account';
                this.handleLinkTo(url);
            }
        },
        /** 退出登 */
        exit () {
            this.$confirm('确认退出该系统吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.logout().then(result => {
                    sessionStorage.removeItem('vuex');
                    window.location.href = '/login';
                });
            });
        },
        // 消息列表
        handleMessage () {
            this.handleLinkTo('message/list', {
                unread: 1
            });
        }
    },
    created () {
        // this.getList();
        if (this.menuList && this.menuList.length) {
            this.menuList.forEach(item => {
                if (item.path.includes('/scm')) {
                    item.funcIcon = 'icon-SCM';
                } else if (item.path.includes('/openLink')) {
                    item.funcIcon = 'icon-juhelianjie';
                } else if (item.path.includes('/ddm')) {
                    item.funcIcon = 'icon-DDM';
                }
                return item;
            });
            this.handleChangeMenu(this.menuList[0]);
        }
    },
    beforeDestroy () {
        console.log('清除定时器');
        clearInterval(this._interMessage);
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    /deep/.el-badge__content.is-fixed {
        top: 14px;
    }
    /deep/ .popper__arrow{
        display: none !important;
    }
    /deep/ .line {
        border-bottom: 1px solid #d8e2ec;
        min-width: 130px;
        padding: 0 10px;
        .icon{
            color: #95acca;
            padding-right: 3px;
        }
        &:hover .icon{
            color: $theam;
        }
    }
    /deep/ .exit{
        padding-top: 5px;
        text-align: right;
    }
    /deep/ .el-dropdown-menu__item {
        padding: 0 12px;
    }
    /deep/ .el-dropdown-menu__item:not(.is-disabled):hover, .el-dropdown-menu__item:focus{
        background-color: transparent;
    }
    .container {
        height: $header-height;
        background-color: $theam;
        // background: linear-gradient(to right, #038b8d, #13a967);
        color: #fff;
        font-size: 16px;
        @include flex(space-between);
        .c-left {
            flex: none;
            height: 100%;
            @include flex(flex-start);
            .logo {
                width: $menu-width;
                padding: 0 11px;
                box-sizing: border-box;
                @include flex(space-between, center);
                height: 100%;
                overflow: hidden;
                &.close {
                    @include flex;
                    width: $menu-close-width;
                    .sysName {
                        display: none;
                    }
                    .sysName2{
                        display: block;
                    }
                    .shrink {
                        margin-left: 0;
                    }
                }
                .sysName {
                    height: 42px;
                    margin: 4px auto 0;
                }
                .sysName2 {
                    height: 30px;
                }
                .shrink {
                    margin-left: 10px;
                    padding: 6px 8px;
                    background: $header-active;
                    cursor: pointer;
                    .svg {
                        width: 12px;
                        height: 12px;
                    }
                }
            }
            .products {
                @include flex(flex-start, flex-start);
                // margin-left: 10px;
                height: 100%;
                & > li {
                    @include flex;
                    height: 100%;
                    padding: 0 20px;
                    cursor: pointer;
                    .iconfont {
                        font-size: 14px;
                    }
                    &:hover {
                        background-color: rgba(0,0,0,.1);
                    }
                    &.active {
                        background-color: rgba(0,0,0,.1);
                    }
                    span {
                        margin-left: 10px;
                    }
                }
            }
        }

        .c-right {
            font-size: 14px;
            height: 100%;
            @include flex(flex-start);
            /deep/ .el-dropdown{ color: #fff; cursor: pointer; }
            ul {
                display: flex;
                li {
                    line-height: $header-height;
                    padding: 0 10px;
                    /deep/ .el-button--text{ color: #fff}
                }
            }

            .userinfo-inner {
                height: $header-height;
                padding-right: 20px;
                padding-left: 10px;
                &.active{
                    background-color: rgba(0,0,0,.1);
                }
                @include flex(flex-start);
                .user-logo {
                    display: block;
                    height: 36px;
                    width: 36px;
                    background-color: #fff;
                    margin-left: 10px;
                    border-radius: 3px;
                    box-sizing: border-box;
                    padding: 2px;
                    img{
                        border-radius: 3px;
                        width: 100%;
                        height: 100%;
                        box-shadow: 0px 0px 1px #666;
                    }
                }
            }
            .helps {
                @include flex(flex-start);
                & > li {
                    cursor: pointer;
                    margin-right: 20px;
                    .svg {
                        height: 18px;
                        width: 18px;
                        margin-right: 5px;
                    }
                }
            }
            .logout {
                .svg {
                    cursor: pointer;
                    height: 25px;
                    width: 25px;
                    margin-right: 20px;
                }
            }
        }
    }
</style>
