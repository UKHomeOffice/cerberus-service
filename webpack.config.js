const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');


module.exports = {
  devtool: 'source-map',
  entry: ['./src/', './src/assets/styles/main.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader'],
      },
      {
        test: /\.(s*)css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/styles/[name].css',
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/govuk-frontend/govuk/all.js', to: 'javascript/all.js' },
        { from: 'node_modules/govuk-frontend/govuk/assets', to: 'assets' }
      ],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        KEYCLOAK_AUTH_URL: JSON.stringify(process.env.KEYCLOAK_AUTH_URL),
        KEYCLOAK_CLIENT_ID: JSON.stringify(process.env.KEYCLOAK_CLIENT_ID),
        KEYCLOAK_REALM: JSON.stringify(process.env.KEYCLOAK_REALM),
      },
    }),
    new HtmlWebpackPlugin({template: './src/index.html'}),
  ],
};

