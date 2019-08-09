const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    devServer: {
        contentBase: './example',
        hot: true
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "fullpage.js",
        library: 'FullPage',
        libraryTarget: "umd",
        libraryExport: 'default'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            template: './example/index.html',
            filename: 'index.html'
        })
    ]
}