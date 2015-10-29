var BowerWebpackPlugin = require("bower-webpack-plugin"),
    path = require('path'),
    webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ["ui", "core", "vendor"],
            minChunks: Infinity
        }),
        new webpack.optimize.UglifyJsPlugin({test: /vendor\.js/}),
        new webpack.DefinePlugin({
            ENV_TYPE: JSON.stringify('development')
        }),
        new BowerWebpackPlugin({
            modulesDirectories: path.resolve(__dirname, 'source/bower_components/')
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            P: 'es6-promise'
        })
    ]
};