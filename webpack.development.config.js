const webpack = require('webpack');

const port = process.env.PORT || '8080';
const host = process.env.IP || '127.0.0.1';

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-async-to-generator'],
        }
      },
      {
        test: /\.s[ac]ss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'image-webpack-loader',
        options: {
          progressive: true,
          optipng: {
            optimizationLevel: 7,
          },
          mozjpeg: {
            quality: 65
          },
          gifsicle: {
            interlaced: true,
          },
          pngquant: {
            quality: '65-90',
            speed: 4
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: `${__dirname}/public`,
    inline: true,
    hot: true,
    host,
    port
  },
  resolve: {
    modulesDirectories: {
      modules: ['node_modules']
    },
    extensions: ['.js', '.json']
  },
  plugins: ([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_HOST: JSON.stringify(process.env.API_HOST),
      }
    }),
  ])
};
