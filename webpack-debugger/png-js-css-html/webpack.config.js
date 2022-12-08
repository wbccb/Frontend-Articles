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
            },
            {
                // 处理图片资源
                test: /\.(jpg|png|gif)$/,
                //使用一个loader，还需要下载两个包，url-loader file-loader
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            //图片大小,小于8kb，就会被base64(一种图片编码格式)处理
                            // 优点：减少请求数量（减轻服务器压力）
                            // 缺点：图片体积增大
                            limit: 8 * 1024,
                            //问题:因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                            //解析时会出问题:[object Module]
                            //解决:关闭url-loader的es6模块化，使用commonjs解析
                            esModule: false,
                        }
                    }],
                type: 'javascript/auto'
            },
            {
                test: /\.html$/,
                /**
                 * html-loader可以处理html中的img图片，可负责将其中的图片引入，然后交由url-loader进行解析
                 */
                loader: 'html-loader',
                options:{
                    esModule: false,
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    mode: 'production'
};

