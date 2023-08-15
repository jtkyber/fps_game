const path = require('path');
const glob = require('glob');

const dev = {
	mode: 'development',
	devtool: 'inline-source-map',
};

const prod = {
	mode: 'production',
	devtool: 'source-map',
};

module.exports = {
	...dev,
	entry: glob.sync('./src/**/*.ts'),
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
};
