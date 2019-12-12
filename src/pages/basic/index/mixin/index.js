import debounce from 'lodash.debounce';

export default {
    mounted () {
        this.__resizeHanlder = debounce(() => {
            this.saleOrderChart && this.saleOrderChart.resize(); 
            this.productChart && this.productChart.resize(); 
            this.purchaseOrderChart && this.purchaseOrderChart.resize(); 
            this.certificateChart && this.certificateChart.resize(); 
        }, 100);
        window.addEventListener('resize',
            this.__resizeHanlder
        );
    },
    methods: {
        getPrevYears () {
            let date = new Date();
            let strYear = date.getFullYear() - 1,
                strDay = date.getDate(),
                strMonth = date.getMonth() + 1;
            if (strMonth < 10) {
                strMonth = '0' + strMonth;
            }
            if (strDay < 10) {
                strDay = '0' + strDay;
            }
            let datastr = strYear + '-' + strMonth + '-' + strDay;
            return datastr;
        }
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.__resizeHanlder);
    }
};
