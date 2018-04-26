const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {

  loaders: [{
    test: /\.scss$/,
    include: path.resolve(__dirname, '..', '..', 'src', 'templates', 'style'),
    use: [
      MiniCssExtractPlugin.loader, {
        loader: 'css-loader',
        options: {
          url: false,
          minimize: true
        }
      }, {
        loader: 'postcss-loader'
      }, {
        loader: 'sass-loader'
      }]
  }],

  plugins: [
    new MiniCssExtractPlugin({filename: 'style.css'})
  ]
};
