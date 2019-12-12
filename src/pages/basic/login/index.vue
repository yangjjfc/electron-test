<template>
    <div class="loginpage">
        <div class="login">
            <div class="w1000">
                <div class="login-form">
                    <div class="loginForm">
                        <div class="login-title">
                            <img src="./img/logo1.png" alt=""/>
                            <!--<h4>
                                欢迎使用智慧供应链服务云平台 </h4>-->
                        </div>
                        <div class="showinfo">
                            <strong class="bz" v-if="!errorMsg.length">请在安全网络下登录账户</strong>
                            <div class="errorMsg" v-if="errorMsg.length">
                                <i class="el-icon el-icon-warning"></i>
                                <p class="error" v-text="errorMsg"></p>
                            </div>
                        </div>
                        <el-form ref="form" :model="form">
                            <el-form-item>
                                <el-input placeholder="请输入用户名/手机号/邮箱" v-model.trim="form.username" @keyup.enter.native="login">
                                    <yl-icon icon="icon-denglu-1" slot="prefix" class="icons"></yl-icon>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input placeholder="请输入密码" v-model.trim="form.password" type="password" @keyup.enter.native="login">
                                    <yl-icon icon="icon-denglu-" slot="prefix" class="icons"></yl-icon>
                                </el-input>
                            </el-form-item>
                            <el-form-item class="custom-mgb">
                                <el-col :span="11">
                                    <el-input placeholder="验证码" v-model.trim="form.verifycode" :maxlength="4" @keyup.enter.native="login"></el-input>
                                </el-col>
                                <el-col :span="13" class="verifyimg">
                                    <img id="imageCode" class="textbox" :src="verifyImg" width="80" height="40" alt="验证码" title="点击刷新"/>
                                    <a @click="refreshCode()" href="javascript:void(0)">换一张？</a>
                                </el-col>
                            </el-form-item>
                            <el-form-item class="submit">
                                <el-button type="primary" @click="login">立即登录</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-col :span="12">
                                    <el-button type="text" @click="weixinLogin">
                                        <yl-icon icon="icon-weixin1" style="color: #00cc00; font-size: 15px;"></yl-icon> <span style="color: #666; padding-left: 3px;">微信</span>
                                    </el-button>
                                </el-col>
                                <el-col :span="12" class="fg-passwd">
                                    <el-button type="text" @click="goUrl('register')">立即注册</el-button>
                                    <el-button type="text" @click="showForget = true">忘记密码</el-button>
                                </el-col>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <footer class="bottom">
                <p>© 2017版权所有 杭州云医购网络科技有限公司 ICP证书：浙ICP备17033840号</p>
                <p>
                    国家药监局（浙）-经营性-2018-0016 增值电信业务经营许可证浙B2-20180650</p>
                <p><a  href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602008664" target="_blank"><img
                  src="./img/records.png" alt=""> <span>浙公网安备 33010602008664号</span></a></p>
            </footer>
        </div>
        <update-browder v-if="showUpdatebrowser"></update-browder>
        <div v-if="showForget">
            <ForgetPassWord :show.sync="showForget"></ForgetPassWord>
        </div>

        <UserMsg v-if="isUserMsg" :show.sync="isUserMsg" :userInfo="userInfo" :defaultUrl="defaultUrl"></UserMsg>
    </div>
</template>
<script type="text/javascript">
import { mapGetters, mapActions } from 'vuex';
import { Tools } from 'ycloud-ui';
import BASE from '@/utils/constant/index.js';
import UpdateBrowder from './mods/browserVersion';
import ForgetPassWord from './mods/forgetPassWord.vue';
import UserMsg from './mods/userMsg';

const URL = {
    VERIFY_CODE: '/verifyCode',
    status: 'yhlo.brp.enterprise.getEnterpriseStatus'
};
export default {
    data () {
        return {
            defaultUrl: BASE.defaultUrl,
            evs: process.env.NODE_ENV, // 环境
            showUpdatebrowser: false,
            showForget: false,
            verifyImg: '',
            errorMsg: '',
            form: {
                username: '',
                password: '',
                verifycode: ''
            },
            isUserMsg: false
        };
    },
    computed: {
        ...mapGetters(['userInfo', 'routers'])
    },
    methods: {
        ...mapActions({
            'userLogin': 'login',
            'currentUser': 'currentUser',
            'getroles': 'getroles'
        }),
        // 检测浏览器的版本
        checkBrowserVersion () {
            let ua = navigator.userAgent;
            let isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1; // 判断是否ie浏览器 除(ie11和edge)
            if (isIE) {
                let reIE = new RegExp('MSIE (\\d+\\.\\d+);');
                reIE.test(ua);
                let fIEVersion = parseFloat(RegExp.$1);
                if (fIEVersion < 10) {
                    this.showUpdatebrowser = true;
                }
            }
        },
        // 记住用户名
        rememberUser () {
            if (this.form.username) {
                localStorage.setItem('username', this.form.username);
            }
        },
        // 获取用户名
        getUser () {
            let name = localStorage.getItem('username');
            name && (this.form.username = name.trim());
        },
        // 刷新验证码
        getRandomImg () {
            this.form.verifycode = '';
            this.verifyImg = 'http://dms-admin.dev.cloudyigou.com'+'/gateway' + URL.VERIFY_CODE + '?t=' + Math.round(Math.random() * 1000000);
        },
        // 获取用户信息
        refreshCode () {
            if (this.userInfo && this.userInfo.token) {
                this.getRandomImg(); // 通过验证码获取token
                return Promise.resolve();
            } else {
                return this.currentUser().then(() => {
                    this.getRandomImg();
                }, () => {
                    this.getRandomImg();
                });
            }
        },
        // 判断用户企业状态
        getEnterpriseStatus () {
            this.Http(URL.status, {

            }).then(res => {
                let data = res.data;
                if (data === 'audited' || data === 'imported') {
                    this.$router.push(this.defaultUrl);
                } else if (data === 'unaudit') { // 为认证的跳转到认证页面
                    this.$router.push({
                        name: 'perfectRegister'
                    });
                } else {
                    this.$message({
                        message: '该企业已被注销，无法登录,请联系管理员',
                        type: 'warning'
                    });
                }
            });
        },
        // 登录
        login () {
            let xflag = false;
            let clientId = this.userInfo ? this.userInfo.clientId : null;
            let token = this.userInfo ? this.userInfo.token : null;
            let password = this.form.password;
            if (!/^[a-zA-Z0-9_@.-]{3,40}$/.test(this.form.username)) {
                xflag = true;
                this.errorMsg = this.form.username === '' ? '请输入用户名' : '用户名格式不正确';
                return;
            }

            if (this.form.password === '') {
                xflag = true;
                this.errorMsg = '请输入密码';
                return;
            }
            if (!/^[a-zA-Z0-9]{4}$/.test(this.form.verifycode)) {
                xflag = true;
                this.errorMsg = this.form.verifycode === '' ? '请输入验证码' : '验证码格式不正确';
                return;
            }
            let param = Object.assign({ platform: 'DMS' }, this.form, {
                token,
                password: Tools.encryption(password, clientId, token)
            });
            if (!xflag) {
                this.errorMsg = '';
                this.userLogin(param).then(msg => {
                    this.rememberUser();
                    this.getEnterpriseStatus();
                }, err => {
                    console.log(err);
                    // 记录错误信息
                    this.refreshCode();
                });
            }
        },
        goUrl (name) {
            this.$router.push({
                name
            });
        }
    },
    mounted () {
        this.checkBrowserVersion();
        this.getUser();
        this.refreshCode().then(res => {
            let userInfo = this.userInfo, status = ['unaudit', 'canceled'];
            if (userInfo && userInfo.userNo && userInfo.extInfo && !status.includes(userInfo.extInfo.status)) {
                this.isUserMsg = true;
            }
        });
    },
    components: {
        UpdateBrowder,
        ForgetPassWord,
        UserMsg
    }
};

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.w1000 {
    width: 1000px;
    height: 567px;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url('./img/tupian2.png');
    background-repeat: no-repeat;
    background-position: left top;
    z-index: 3;
}

.loginpage {
    background-image: linear-gradient(to right, #71d3bd, #788ebd);
    //background: linear-gradient(to right,#038b8d, #13a967);
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;

    .login-form {
        width: 340px;
        margin-left: 570px;
        margin-top: 50px;

        .loginForm {
            padding: 25px;

            .login-title {
                margin-bottom: 40px;

                h4 {
                    line-height: 40px;
                    font-size: 14px;
                    font-weight: normal;
                    color: #179b88;
                }
            }

            .showinfo {
                margin-bottom: 10px;

                .bz {
                    display: block;
                    padding-left: 15px;
                    background: #fefcee;
                    border: 1px solid #f3d995;
                    line-height: 26px;
                    color: #df9c1f;
                }

                .errorMsg {
                    background-color: #fef2f2;
                    padding: 6px 10px;
                    border: #f3ab9f 1px solid;
                    border-radius: 3px;
                    clear: both;
                    overflow: hidden;
                    color: #d24821;

                    .el-icon {
                        margin-right: 5px;
                        margin-top: 4px;
                        float: left;
                        width: 16px;
                        height: 16px;
                    }

                    .error {
                        float: left;
                        white-space: normal;
                        word-wrap: break-word;
                        word-break: break-all;
                    }
                }
            }

            .icons {
                width: 15px;
                height: 15px;
                padding-left: 2px;
            }

            .el-form-item {
                margin-bottom: 10px;
            }

            .custom-mgb {
                margin-bottom: 12px;
            }

            .verifyimg {
                float: right;
                display: flex;
                align-items: center;
                padding-left: 10px;

                img {
                    margin-right: 8px;
                }
            }

            .fg-passwd {
                display: flex;
                justify-content: flex-end;
                padding-right: 3px;
            }

            .submit {
                button {
                    width: 100%;
                }
            }
        }
    }
}

.bottom {
    width: 1000px;
    position: absolute;
    bottom: 50px;
    text-align: center;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    line-height: 22px;

    a {
        color: #fff;
    }
}
@media screen and (max-height: 800px){
    .w1000{
        transform: translate(-50%, -55%);
    }
    .bottom {
        bottom: 0px;
        transform: translate(-50%, -5%);
    }
}

.login-footer {
    text-align: center;
    padding: 20px;
    font-size: 14px;
}

.qr-code{
    position: relative;
    .code{
        position: absolute;
        left: 300px;
        height: 300px;
        left: 50%;
        top: 50%;
        margin-top: 150px;
        margin-left: -150px;
        background-color: #fff;
        border-radius: 10px;
        z-index: 11;
    }
    .mask{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: .3;
        z-index: 10;
    }
}
</style>
