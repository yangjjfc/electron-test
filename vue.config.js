/*
 * @Author: yangjj
 * @Date: 2019-08-21 16:40:43
 * @LastEditors: yangjj
 * @LastEditTime: 2019-12-12 10:07:03
 * @Description: file content
 */
const PZ = require("./config");
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const IS_PRODUCTION = process.env.NODE_ENV === "production";
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    externals: {
      vue: "Vue",
      "element-ui": "Element",
      vuex: "Vuex",
      "vue-router": "VueRouter"
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "com.example.app",
        "productName":"aDemo",//项目名，也是生成的安装文件名，即aDemo.exe
        "copyright":"Copyright © 2019",//版权信息
        "directories":{
            "output":"./dist"//输出文件路径
        },
        "win":{//win相关配置
          //  "icon":"./shanqis.ico",//图标，当前图标在根目录下，注意这里有两个坑
            "target": [
                {
                    "target": "nsis",//利用nsis制作安装程序
                    "arch": [
                        "x64",//64位
                        "ia32"//32位
                    ]
                }
            ]
        }
      }
    }
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set("~", resolve("src/utils/custom"))
      .set("@", resolve("src"));
    config
      .plugin("html")
      .tap(args => {
        args[0].CDN_JS = PZ.CDN_JS;
        args[0].CDN_CSS = PZ.CDN_CSS;
        return args;
      })
      .end();
    /*  config.plugin('define')
            .tap(definitions => {
                Object.assign(definitions[0]['process.env'], {
                    IMAGE_DOWNLOAD: '"' + PZ.IMAGE_DOWNLOAD + '"'
                });
                return definitions;
            }); */
    if (IS_PRODUCTION) {
      // #region 启用GZip压缩
      config
        .plugin("compression")
        .use(CompressionPlugin, {
          asset: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8,
          cache: true
        })
        .tap(args => {});
    }
  },
  devServer: {
    open: true,
    proxy: {
      "/gateway": {
        target: "http://dms-admin.dev.cloudyigou.com",
        changeOrigin: true
      }
    },
    overlay: {
      warnings: false,
      errors: false
    }
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: '@import "@/style/common.scss";'
      }
    }
  }
};
