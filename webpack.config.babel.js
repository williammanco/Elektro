// @flow

import path from 'path'
import webpack from 'webpack'
import { WDS_PORT } from './src/shared/config'
import DashboardPlugin from 'webpack-dashboard/plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const html = new HtmlWebpackPlugin({
  template: __dirname + '/src/client/index.html'
})
const uglify = new UglifyJSPlugin({
  compress: {
    warnings: false
  }
})
export default {
  entry: [
    './src/client',
  ],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: process.env.NODE_ENV === 'production' ? './dist/' : `./dist/`,
  },
  plugins: [
    new DashboardPlugin(),
    new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    THREE: "three",
    "window.THREE": "three",
    "window.$": "jquery",
    "window.jQuery": "jquery",
    html,
    uglify
    })
  ],
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|jpg|json|mp3)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /(\.glsl|\.frag|\.vert)$/, loader: 'raw-loader'   },
      { test: /(\.glsl|\.frag|\.vert)$/, loader: 'glslify' },
      { test: /\.sass$/, loader: 'style-loader!css-loader!sass-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader'},
      { test: /\.html$/, use:[{
          loader: 'html-loader',
          options: {
            minimize: true,
            removeComments: false,
            collapseWhitespace: false
          }

        }
      ]}
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: WDS_PORT,
  },
}
