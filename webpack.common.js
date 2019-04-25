const path = require('path');

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: './index.js',
	output: {
		library: 'AppendGrid',
		libraryTarget: 'umd',
		libraryExport: 'default',
		publicPath: '/',
		path: path.resolve(__dirname, 'dist'),
		filename: 'AppendGrid.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: ['babel-loader']
		}]
	}
};
