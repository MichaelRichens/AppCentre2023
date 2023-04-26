const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function loadEnvVariables() {
  const env = dotenv.config().parsed;
  const envFile = `.env.${process.env.NODE_ENV}`;
  const envLocal = dotenv.parse(fs.readFileSync('.env.local'));

  if (fs.existsSync(envFile)) {
    const envConfig = dotenv.parse(fs.readFileSync(envFile));
    for (const key in envConfig) {
      env[key] = envConfig[key];
    }
  }

  for (const key in envLocal) {
    env[key] = envLocal[key];
  }

  return env;
}


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(loadEnvVariables()),
    }),
  ],  
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    open: true,
    historyApiFallback: true,
  }
};
