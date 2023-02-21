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
        rules: [
            {
                // js兼容性处理
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env', {
                            useBuiltIns: 'usage',
                            corejs:
                                {
                                    version: 3
                                },
                            targets: {
                                // 浏览器兼容的版本
                                chrome: '60',
                                firefox: '50'
                            }
                        }
                        ]
                    ]
                }

            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    mode: 'production'
};

