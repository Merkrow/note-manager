const webpack = require('webpack');


module.exports = {
  entry: {
    vendors: [
      'react',
      'react-router',
      'react-dom',
      'react-redux',
      'redux',
    ],
    bundle: `${__dirname}/src/app/app.js`
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
        }
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap',
          'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'js'],
    extensions: ['', '.js', '.json']
  },
  plugins: ([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors'],
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_HOST: JSON.stringify(process.env.API_HOST),
      }
    }),
  ])
};
