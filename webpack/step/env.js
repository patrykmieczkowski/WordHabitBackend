const webpack = require('webpack');


module.exports = {

  loaders: [
  ],

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '\'production\''
      }
    })
  ]
};
