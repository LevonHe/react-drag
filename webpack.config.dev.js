const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const os = require('os');
const chalk = require('chalk');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const devServer = require('./devServer');

function getNetworkIp() {
  let needHost = '';
  try {
    const network = os.networkInterfaces();
    Object.keys(network).forEach((dev) => {
      const iface = network[dev];
      iface.every((alias) => {
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          needHost = alias.address;
          return false;
        }
        return true;
      });
    });
  } catch (e) {
    needHost = '0.0.0.0';
  }
  return needHost;
}

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    filename: '[name]_[hash:8].main.js',
    chunkFilename: '[name]_[hash:8].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'],
                }),
                require('cssnano')(),
              ],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'],
                }),
                require('cssnano')(),
              ],
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          'React-drag Web is running at:\n',
          `- Local: ${chalk.blueBright('http://localhost:' + chalk.greenBright(devServer.port) + '/')}`,
          `- Network: ${chalk.blueBright('http://' + getNetworkIp() + ':' + chalk.greenBright(devServer.port) + '/')}`,
        ],
        notes: [
          'Note that the development build is not optimized.',
          `To create a production build, run ${chalk.blueBright('npm run build')} or ${chalk.blueBright(
            'yarn build'
          )}.\n`,
        ],
      },
      clearConsole: true,
    }),
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer,
});
