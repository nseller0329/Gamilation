module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: {
      amd: false
    },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  }, {
    test: /\.jst$/,
    use: {
      loader: 'underscore-template-loader',
    },
  }, {
    test: /\.(eot|ttf|woff|woff2|png|svg|jpg|jpeg|gif)$/i,
    loader: 'file-loader',
    options: {
      name: '[name].[ext]'
    }

  },

];