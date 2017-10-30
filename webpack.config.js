module.exports = {
    entry: './browser.jsx',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    devtool: 'source-map'
}
