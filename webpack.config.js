const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    // Background script
    'worker/index': './src/worker/index.ts',
    // Content script
    'content/view': './src/content/view.ts',
  },
  devtool: 'inline-source-map', // Safe for CSP
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'web',
};