const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        open: true
    },
	plugins: [
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, 'src/dev-bootstrap4.html')
			// template: path.resolve(__dirname, 'src/dev-bulma.html')
			// template: path.resolve(__dirname, 'src/dev-foundation6.html')
		}),
		new HtmlWebpackIncludeAssetsPlugin({
			assets: 'src/dev-data.js',
			append: true
		}),
		new webpack.HotModuleReplacementPlugin()
	]
});