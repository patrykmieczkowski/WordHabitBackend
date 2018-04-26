const path = require('path');
const nodeExternals = require('webpack-node-externals');
const env = require('../step/env');


module.exports = {

  target: 'node',

  entry: path.resolve(__dirname, '..', '..', 'src', 'app.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', 'dist'),
    filename: 'app.js'
  },

  externals: [
    nodeExternals()
  ],

  node: {
    __dirname: false
  },


  module: {
    rules: []
      .concat(env.loaders)
  },

  plugins: []
    .concat(env.plugins)
};
