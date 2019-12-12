<template>
    <yl-dialog title="提示" :show.sync="shows" width="400px" @submit="submit" @reset="cancel">
        <template >
            <div class="user-msg">
                <p>当前的登录账号为：{{userInfo ? userInfo.loginAccount : ''}}</p>
                <p>您确定退出当前账号并重新登录吗？</p>
            </div>
        </template>
    </yl-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data () {
        return {

        };
    },
    methods: {
        ...mapActions(['logout']),
        submit () {
            this.logout().then(result => {
                this.$router.go(0);
            });
        },
        cancel () {
            this.$router.push(this.defaultUrl);
        }
    },
    props: {
        defaultUrl: {
            type: String
        },
        userInfo: {
            type: Object,
            default: () => ({})
        },
        show: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue);
            }
        }
    },
    mounted () {

    }
};
</script>

<style lang="scss" scoped>
    .user-msg{
        line-height: 30px;
        font-size: 14px;
    }
</style>
