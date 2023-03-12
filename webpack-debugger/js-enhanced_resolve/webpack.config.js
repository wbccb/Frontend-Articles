const { resolve } = require('path');
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: {
        app1: "./src/entry1.js"
    },
    resolve: {
        alias: {
            aliasTest: resolve(__dirname, 'src/item'),
        },
        aliasFields: ['browser'],
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[id].js",
        path: resolve(__dirname, 'build'),
        clean: true
    },
    module: {
        rules: []
    },
    optimization: {
        chunkIds: "named",
        splitChunks: {
            chunks: 'all'
        }
    },
    mode: 'development'
};
