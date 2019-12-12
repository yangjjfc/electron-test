const PZ = require('./config');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
function resolve (dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    lintOnSave: false,
    configureWebpack: {
        externals: {
            'vue': 'Vue',
            'element-ui': 'Element',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter'
        }
    },
    pluginOptions: {
        electronBuilder: {
          builderOptions: {
            publish: ['github']
          }
        }
      },
    productionSourceMap: false,
    chainWebpack: config => {
        config.resolve.alias
            .set('~', resolve('src/utils/custom'))
            .set('@', resolve('src'));
        config.plugin('html')
            .tap(args => {
                args[0].CDN_JS = PZ.CDN_JS;
                args[0].CDN_CSS = PZ.CDN_CSS;
                return args;
            }).end();
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
                .plugin('compression')
                .use(CompressionPlugin, {
                    asset: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8,
                    cache: true
                })
                .tap(args => { });
        }
    },
    devServer: {
        open: true,
        proxy: {
            '/gateway': {
                target: 'http://dms-admin.dev.cloudyigou.com',
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
