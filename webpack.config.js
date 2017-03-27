var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + "/src/main.js", //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/build", //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },

    module: { //在配置文件里添加JSON loader
        loaders: [{
            test: /\.json$/,
            loader: "json-loader"
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader?modules' //添加对样式表的处理
        }]
    },

    plugins: [
        new webpack.BannerPlugin("Copyright Zeego Tech inc."),
        new HtmlWebpackPlugin({
            template: __dirname + "/src/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
        })
    ],

    devServer: {
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true //实时刷新
    }
}
