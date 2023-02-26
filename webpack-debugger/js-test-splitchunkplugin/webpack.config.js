const { resolve } = require('path');
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    stats: {
        groupAssetsByChunk: true
    },
    entry: {
        app1: "./src/entry1.js",
        app2: "./src/entry2.js",
        app3: "./src/entry3.js",
        app4: "./src/entry4.js"
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[id].js",
        path: resolve(__dirname, 'build'),
        clean: true,
    },
    module: {
        rules: []
    },
    optimization: {
        chunkIds: "named",
        splitChunks: {
            minSize: 1,
            chunks: 'all',
            maxInitialRequests: 10,
            maxAsyncRequests: 10,
            cacheGroups: {
                test3: {
                    chunks: 'all',
                    minChunks: 3,
                    name: "test3",
                    priority: 3
                },
                test2: {
                    chunks: 'all',
                    minChunks: 2,
                    name: "test2",
                    priority: 2
                }
            }
        }
    },
    mode: 'production'
};

