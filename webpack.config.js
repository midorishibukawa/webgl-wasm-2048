const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
    entry: './src/ts/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'wasm_2048.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'dist/index.html'
        }),
        // new WasmPackPlugin({
        //     crateDirectory: path.resolve(__dirname, ".")
        // })
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
    mode: 'development'
};