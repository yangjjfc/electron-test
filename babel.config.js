const isProduction = process.env.NODE_ENV === 'production';
let plugins = [];
if (!isProduction) {
    plugins.push('dynamic-import-node');
}

module.exports = {
    presets: [
        '@vue/app'
    ],
    plugins
};
