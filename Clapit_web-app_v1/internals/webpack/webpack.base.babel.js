/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

const alias = {
  'react/lib/CSSPropertyOperations': path.resolve(__dirname, './node_modules/react-dom/lib/CSSPropertyOperations'),
  'react/lib/EventPluginHub': path.resolve(__dirname, './node_modules/react-dom/lib/EventPluginHub'),
  'react/lib/EventConstants': path.resolve(__dirname, './node_modules/react-dom/lib/EventConstants'),
  'react/lib/EventPluginUtils': path.resolve(__dirname, './node_modules/react-dom/lib/EventPluginUtils'),
  'react/lib/EventPropagators': path.resolve(__dirname, './node_modules/react-dom/lib/EventPropagators'),
  'react/lib/SyntheticUIEvent': path.resolve(__dirname, './node_modules/react-dom/lib/SyntheticUIEvent'),
  'react/lib/ViewportMetrics': path.resolve(__dirname, './node_modules/react-dom/lib/ViewportMetrics'),
};
module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel',
      exclude: /node_modules/,
      query: options.babelQuery,
    }, {
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      test: /\.css$/,
      include: /node_modules/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.(jpg|png|gif)$/,
      loaders: [
        'file-loader',
        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
      ],
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff',
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader?limit=10000',
    }],
  },
  plugins: options.plugins.concat([
    new webpack.IgnorePlugin(/\/iconv-loader$/),
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports?self.fetch!whatwg-fetch',
    }),
    new webpack.ProvidePlugin({
      CryptoJS: 'crypto-js',
    }),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.NamedModulesPlugin(),
    // moment is causing webpack to throw warning, this line fixes it - https://github.com/moment/moment/issues/2979
    new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
  ]),
  resolve: {
    alias,
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
});
