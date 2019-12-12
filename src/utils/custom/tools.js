/**
 * 数据字典
 * @param {*options} obj
 * @param type  平台端数据字典还是 企业端 qiye，默认是平台端 pingtai
 */
import { Http, Tools } from 'ycloud-ui';
import Vue from 'vue';
let tools = {
    pingtai: {} // 平台专用 pingtai
};
export const Dictionarie = (code, isRefresh) => {
    if (tools.pingtai[code] && !isRefresh) {
        return Promise.resolve(tools.pingtai[code]);
    } else {
        return new Promise((resolve, reject) => {
            Http('yhlo.brp.dict.platform.findByNumber', {
                ignoreRepeat: true, // 防止连续请求错误
                number: code
            }).then(result => {
                let list = result.data.children || [];
                if (list.length) {
                    tools.pingtai[code] = list.map(item => ({
                        dictVal: item.modValue,
                        modValue: item.modValue,
                        number: item.number,
                        source: {
                            ...item
                        }
                    }));
                    resolve(tools.pingtai[code]);
                }
            });
        });
    }
};
/**
 * 下载
 */
const handleDownzip = () => {
    // TODO:
    let file = process.env.IMAGE_DOWNLOAD + 'my/501622446704/printer-lodop-20180130155630792.zip';
    Tools.downloadFile(file, '安装包');
};

// console.log(Element);
/**
 * print 弹出框
 * @param {*html} vnode
 */
export const msgbox = (vnode) => {
    Vue.prototype.$alert(vnode, '提示', {
        confirmButtonText: '下载安装',
        type: 'warning',
        showCancelButton: false,
        center: true,
        dangerouslyUseHTMLString: true
    }).then(() => {
        handleDownzip();
    }).catch(() => { });
};

export const message = (message, type = 'success') => {
    Vue.prototype.$message({
        message,
        type
    });
};
