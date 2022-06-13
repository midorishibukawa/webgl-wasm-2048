const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/ts/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new WorkboxWebpackPlugin.InjectManifest({
            compileSrc: true,
            swSrc: './src/ts/sw.ts',
            swDest: './sw.js'
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/, loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    experiments: {
        asyncWebAssembly: true,
        topLevelAwait: true
    },
    mode: 'production'
};