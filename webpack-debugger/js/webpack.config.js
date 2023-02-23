const { resolve } = require('path');
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: {
        app1: "./src/entry1.js",
        app2: "./src/entry2.js"
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[id].js",
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: []
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    mode: 'production'
};

