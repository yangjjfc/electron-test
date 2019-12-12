<template>
    <section class="app-main">
        <keep-alive :include="cachedViews" :max="10">
            <components :is="componentName" ></components>
        </keep-alive>
    </section>
</template>
<script>
import Error from '@/components/error/Error.vue';
import Nav from '@/components/navPage/index';
import { mapGetters } from 'vuex';
import Vue from 'vue';
const _import = (file) => () => import(/* webpackChunkName: `[request][index]` */ `@/pages${file}/index.vue`);

let reverseComponentName = (str) => str.replace(/(\/|\.)/g, '');
export default {
    data () {
        return {
            componentName: '',
            permissions: null
        };
    },
    computed: {
        ...mapGetters(['buttons']),
        cachedViews () {
            return this.$store.state.app.cachedViews;
        }
    },
    watch: {
        $route () {
            this.initPermission();
        }
    },
    methods: {
        _getBtnAuth (no, permissions) {
            this.buttons && this.buttons.forEach(item => {
                if (item.parentObjNo === no) {
                    permissions[item.permissionCode] = item.permissionName;
                }
            });
        },
        // 初始化按钮权限
        async initPermission () {
            let no = this.$route.meta.no || this.$route.query.$no,
                permissions = {},
                path = this.$route.meta.componentUrl;
            this._getBtnAuth(no, permissions);
            Vue.prototype.auth = permissions;
            this.$store.commit('setAuth', permissions);
            console.log(permissions, '按钮权限');
            // 模块点击，直接用navPage组件
            if (this.$route.meta.leval === 2) {
                this.componentName = Nav;
                return;
            }
            path = /^\//.test(path) ? path : ('/' + path);
            // path = /index/.test(path) ? path : path + '/index';
            let name = reverseComponentName(this.$route.name);
            let async = _import(path);
            async().then(com => {
                Vue.component(name, com.default);
                this.componentName = name;
            }, errors => {
                this.componentName = Error;
                this.$message.error('模块地址加载失败,地址：' + path + '，具体错误：' + errors);
                console.error(errors);
            });
        }
    },
    created () {
        this.initPermission();
    },
    components: {
        Error
    }

};

</script>

<style lang="scss">
    .app-main {
        padding: 0 10px;
        box-sizing: border-box;
    }
</style>