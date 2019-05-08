const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ClearConsoleWebpackPlugin = require('webpack-clear-console').WebpackClearConsole;

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new ClearConsoleWebpackPlugin(),
		new CleanWebpackPlugin()
	]
});