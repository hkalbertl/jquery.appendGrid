const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new CleanWebpackPlugin()
	],
	optimization: {
		minimizer: [new UglifyJsPlugin({
			uglifyOptions: {
				compress: {
					drop_console: true,
				}
			}
		})],
	}
});