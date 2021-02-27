const copyPlugin = require('copy-webpack-plugin');
const assets = ['gamilation.db'];
const path = require('path');
module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: assets.map(asset => {
    return new copyPlugin({
      patterns: [{
        from: path.resolve(__dirname, './src/db', asset),
        to: path.resolve(__dirname, '.webpack/main', asset)
      }]
    });
  }),


};