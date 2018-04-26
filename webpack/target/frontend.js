const path = require('path');
const handlebars = require('../step/handlebars');
const scss = require('../step/scss');


module.exports = {

  target: 'web',

  entry: path.resolve(__dirname, '..', '..', 'src', 'templates', 'script', 'script.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', 'dist', 'static'),
    filename: 'script.js',
    publicPath: '/panel/static'
  },

  module: {
    rules: []
      .concat(handlebars.loaders)
      .concat(scss.loaders)
  },

  plugins: []
    .concat(handlebars.plugins)
    .concat(scss.plugins)
};
