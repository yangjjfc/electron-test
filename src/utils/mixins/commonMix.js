import { Tools } from 'ycloud-ui';

// 获取日期禁用选项
export const getDisableDate = (val, isStart = true, isSameDay = false) => {
    let time,
        supplement = isSameDay ? 86400000 : 0;
    if (!val) {
        time = {
            disabledDate () {
                return false;
            }
        };
    } else {
        time = {
            disabledDate (time) {
                if (isStart) {
                    return time.getTime() + supplement < new Date(val).getTime();
                } else {
                    return time.getTime() > new Date(val).getTime();
                }
            }
        };
    }
    return time;
};

export default {
    data () {
        return {
            isLoading: false,
            page: {
                total: 0,
                pageSize: 20,
                pageIndex: 1
            }
        };
    },
    // 判断当前分页是否异常
    watch: {
        'page.total': function (val) {
            let page = this.page;
            let maxPage = Math.ceil(page.total / page.pageSize);
            if (val > 0 && page.pageIndex > maxPage) {
                this.$message.info('分页数据异常，已为您初始化');
                (this.getList || $.noop)(1);
            }
        }
    },
    filters: {
        money (value) {
            if (value === 0) {
                return '0.00';
            }
            let title = value < 0 ? '-' : '';
            return title + Tools.parseMoney(Math.abs(value));
        }
    },
    methods: {
        getDisableDate
    }
};
