const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BrowserSyncWebpackPlugin = require('browser-sync-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

function resolve (...dir) {
  return path.resolve(__dirname, '../', ...dir)
}

const phaserModule = resolve('./node_modules/phaser')
const phaser = resolve(phaserModule, './build/custom/phaser-split.js')
const pixi = resolve(phaserModule, './build/custom/pixi.js')
const p2 = resolve(phaserModule, './build/custom/p2.js')

module.exports = function (env) {
  let config = {
    mode: env.dev ? 'development' : 'production',
    entry: {
      main: [resolve('./src-demo/main.js')],
    },
    output: {
      path: resolve('./dist-demo'),
      filename: '[name].[chunkhash:6].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          enforce: 'pre',
          options: {
            fix: true,
          },
        }, {
          test: /\.js$/,
          loader: 'babel-loader',
          include: resolve('./src-demo'),
        }, {
          test: /pixi\.js$/,
          loader: 'expose-loader?PIXI',
        }, {
          test: /p2\.js$/,
          loader: 'expose-loader?p2',
        }, {
          test: /phaser-split\.js$/,
          loader: 'expose-loader?Phaser',
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin('dist-demo', { root: resolve() }),
      new HtmlWebpackPlugin({
        template: resolve('./src-demo/index.html'),
      }),
      new CopyWebpackPlugin([{
        from: resolve('./src-demo/assets'),
        to: resolve('./dist-demo/assets'),
      }]),
    ],
    resolve: {
      alias: {
        phaser, pixi, p2,
      },
    },
  }

  if (env.dev) {
    config.watch = true
    config.devtool = 'cheap-source-map'
    config.plugins.push(
      new BrowserSyncWebpackPlugin({
        host: '127.0.0.1',
        port: 8889,
        server: {
          baseDir: resolve('dist-demo'),
        },
      }),
    )
  } else {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
        },
      },
      runtimeChunk: {
        name: 'manifest',
      },
    }
  }

  return config
}
