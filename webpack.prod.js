const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new CleanWebpackPlugin()
	],
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			terserOptions: {
				compress: {
					drop_console: true,
				},
			}
		})]
	}
});