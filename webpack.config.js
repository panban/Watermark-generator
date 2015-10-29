var extend = require('extend'),
    path = require('path'),
    srcPath = path.join(__dirname, 'source/assets/js');

var config = {
    entry: {
        core: srcPath + '/Core',
        ui: srcPath + '/UI',
        vendor: [
            'blockui',
            'jquery',
            'jquery-ui',
            'blueimp-file-upload',
            'es6-promise'
        ],
        init: srcPath + '/Init'
    },
    output: {
        path: 'build/assets/js',
        filename: '[name].js',
        chunkFilename: "[id].async.js",
        publicPath: "build/assets/js"
    },
    resolve: {
        root: srcPath,
        alias: {},
        extensions: ['', '.js'],
        modulesDirectories: ['node_modules', './vendor', srcPath]
    },
    module: {
        noParse: [],
        loaders: []
    }
};

module.exports = extend(true, config, process.env.APPLICATION_ENV === 'development' ? require('./webpack.dev') : require('./webpack.prod'));