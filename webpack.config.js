var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : false,
  entry: __dirname + "/src/js/index.jsx",
  module: {
    loaders: [
	{
		test: /.jsx?$/,
		loader: 'babel-loader',
		exclude: /node_modules/,
		query: {
		  presets: ['es2015', 'react']
		}
	},
	{ 
		test: /\.css$/, 
		loader: "style-loader!css-loader" 
	},
	{
	  test:/\.s(c|a)ss$/,
	  exclude:/node_modules/,
	  use:['style-loader','css-loader','sass-loader']
	},
	{
	    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
	    use: [{
	        loader: 'file-loader',
	        options: {
	            name: '[name].[ext]',
	            outputPath: 'fonts/'
	        }
	    }]
	}
    ]
  },
  output: {
    path: __dirname + "/public/",
    filename: "bundle.min.js"
  },
  plugins: debug ? [] : [
	new webpack.DefinePlugin({
	  'process.env.NODE_ENV': JSON.stringify('production')
	}),
	new webpack.optimize.UglifyJsPlugin()
  ],
};