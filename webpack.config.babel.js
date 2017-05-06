// @flow

import path from 'path'
import webpack from 'webpack'
import { WDS_PORT } from './src/shared/config'
import { isProd } from './src/shared/util'
import DashboardPlugin from 'webpack-dashboard/plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

const uglify = new UglifyJSPlugin({
  compress: {
    warnings: false
  }
})

console.log(uglify)


export default {
  entry: [
    './src/client',
  ],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProd ? '/static/' : `http://localhost:${WDS_PORT}/dist/`,
  },
  plugins: [
    new DashboardPlugin(),
    new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    THREE: "three",
    "window.THREE": "three",
    "window.$": "jquery",
    "window.jQuery": "jquery"
    })
  ],
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /(\.glsl|\.frag|\.vert)$/, loader: 'raw-loader'   },
      { test: /(\.glsl|\.frag|\.vert)$/, loader: 'glslify' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!scss-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader'},
    ]
  },
  devtool: isProd ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: WDS_PORT,
  },
}
