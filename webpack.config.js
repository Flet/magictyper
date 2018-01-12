'use strict'

const webpack = require('webpack')
const path = require('path')

module.exports = {

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'project.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            compact: true
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'CANVAS_RENDERER': JSON.stringify(true),
      'WEBGL_RENDERER': JSON.stringify(true)
    })
  ]

}
