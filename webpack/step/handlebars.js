const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {

  loaders: [{
    test: /\.handlebars$/,
    include: path.resolve(__dirname, '..', '..', 'src', 'templates'),
    use: {
      loader: 'html-loader',
      options: {
        removeAttributeQuotes: false,
        minimize: true
      }
    }
  }],

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', '..', 'src', 'templates', 'login.handlebars'),
      filename: path.resolve(__dirname, '..', '..', 'dist', 'templates', 'login.handlebars')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', '..', 'src', 'templates', 'dashboard.handlebars'),
      filename: path.resolve(__dirname, '..', '..', 'dist', 'templates', 'dashboard.handlebars')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', '..', 'src', 'templates', 'word.handlebars'),
      filename: path.resolve(__dirname, '..', '..', 'dist', 'templates', 'word.handlebars')
    })
  ]
};
