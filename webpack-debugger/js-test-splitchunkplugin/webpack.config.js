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
        app3: "./src/entry3.js"
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
            cacheGroups: {
                test: {
                    chunks: 'all',
                    minChunks: 3,
                    name: "test",
                }
            }
        }
    },
    mode: 'production'
};

