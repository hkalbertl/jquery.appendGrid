const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const webpack = require('webpack');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		historyApiFallback: true,
		port: 9000,
		open: true
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, 'src/dev-bootstrap4.html')
			// template: path.resolve(__dirname, 'src/dev-bootstrap5.html')
			// template: path.resolve(__dirname, 'src/dev-bulma.html')
			// template: path.resolve(__dirname, 'src/dev-foundation6.html')
		}),
		new HtmlWebpackTagsPlugin({
			scripts: [{
				sourcePath: path.resolve(__dirname, 'src/dev-data.js'),
				path: 'dev-data.js'
			}]
		})
	]
});