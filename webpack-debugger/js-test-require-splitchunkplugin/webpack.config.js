const { resolve } = require('path');
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    stats: {
        groupAssetsByChunk: true
    },
    entry: {
        app4: "./src/entry4.js"
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[id].js",
        path: resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: []
    },
    optimization: {
        chunkIds: "named",
        splitChunks: {
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
                    priority: 2,
                    maxSize: 50
                }
            }
        }
    },
    mode: 'development'
};

