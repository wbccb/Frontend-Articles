const { resolve } = require('path');
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'built.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                // 正则表达，匹配less文件
                test: /\.less$/,
                use: [
                    // 这里的执行顺序是由下往上的，先less转换成css，css在打包，在引到style样式中去
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            }
        ]
    },
    plugins: [

    ],
    mode: 'production'
};

