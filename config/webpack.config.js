const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env) => {
  const isProduction = env ? env.production : false;

  // ////////////////////////////////////
  // / WHERE TO LOOK FOR SOURCE FILES ///
  // ////////////////////////////////////
  // prettier-ignore
  const app = path.resolve(
    process.cwd(),
    'src/index.js'
  );
  const entry = isProduction
    ? {
      app: [app],
    }
    : {
      app: [app],
    };
  // ////////////////////////////////////////
  // / WHERE TO PUT THE GENERATED BUNDLES ///
  // ////////////////////////////////////////
  const output = isProduction
    ? {
      path: path.resolve(process.cwd(), 'dist'),
      filename: '[name].js',
      publicPath: '/',
    }
    : {
      path: path.resolve(process.cwd(), 'dist'),
      filename: '[name].js',
      publicPath: '/',
    };

  // ////////////////////////////////////////
  // / HOW TO HANDLE DIFFERENT FILE TYPES ///
  // ////////////////////////////////////////
  const rules = isProduction
    ? [
      {
        use: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        use: ['json-loader'],
        test: /\.json$/,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=public/fonts/[name].[ext]',
      },
    ]
    : [
      {
        use: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        use: ['json-loader'],
        test: /\.json$/,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=public/fonts/[name].[ext]',
      },
    ];

  // ////////////////////////////////////
  // / DEFINE THE PLUGINS FOR WEBPACK ///
  // ////////////////////////////////////
  // prettier-ignore
  const plugins = isProduction
    ? [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      }),
      new CopyWebpackPlugin([
        {
          from: 'node_modules/monaco-editor/min/vs',
          to: 'vs',
        }
      ]),
    ]
    : [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"',
        },
      }),
      new CopyWebpackPlugin([
        {
          from: 'node_modules/monaco-editor/min/vs',
          to: 'vs',
        }
      ]),
    ];

  // ///////////////////////////////
  // / RETURN THE WEBPACK CONFIG ///
  // ///////////////////////////////
  return {
    entry,
    output,
    plugins,
    devtool: 'cheap-module-source-map',
    module: {
      rules,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    node: {
      fs: 'empty',
    },
    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: {
        index: 'src/index.html',
      },
    },
  };
};