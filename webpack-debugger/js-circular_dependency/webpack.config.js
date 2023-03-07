const { resolve } = require('path');
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: {
        app1: "./src/es_entry1.js"
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
    mode: 'development',
    devtool: "cheap-module-source-map"
};

