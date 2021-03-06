const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const entryDirectory = './src/vue/entries/';
const entryRule = entryDirectory + '**/*.js';
const entries = {};

const files = glob.sync(entryRule);
files.forEach(file => {
  entries[file.replace(entryDirectory, '')] = file;
});

module.exports = {
  entry: entries,
  output: {
    path: path.join(__dirname, '../express/public/'),
    filename: 'js/[name]',
    publicPath: '/js/',
    library: 'VueApp',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [],
        loader: "babel-loader",
        options: {
          presets: ["es2015"],
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
        }
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJSPlugin(),
  ],
  resolve: {
    modules: [
      "node_modules",
    ],
  },
};
