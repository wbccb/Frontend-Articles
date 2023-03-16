const { resolve } = require('path');
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: {
        // app1: "./src/entry1.js",
        // app2: "./src/entry2.js",
        app3: "./src/entry3.js"
    },
    resolve: {
        alias: {
            aliasTest: resolve(__dirname, 'src'),
        },
        // aliasFields: ["node22"],
        // extensionAlias: {
        //     '.js': ['.ts', '.js'],
        //     '.mjs': ['.mts', '.mjs'],
        // },
        // importsFields: ['browser', 'module', 'main'],
        // modules: "test/node_modules/test"
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

