var BowerWebpackPlugin = require("bower-webpack-plugin"),
    path = require('path'),
    webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ["ui", "core", "vendor"],
            minChunks: Infinity
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            ENV_TYPE: JSON.stringify('production')
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