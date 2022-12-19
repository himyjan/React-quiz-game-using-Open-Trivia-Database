const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const isDevelopment = process.env.NODE_ENV !== 'production';

const fs = require('fs'),
  entries = fs.readdirSync('./src/').filter(function (file) {
    return file.match(/(index.js(x?)|index.ts(x?))$/);
  });

module.exports = {
  output: {
    path: path.join(process.cwd(), 'build'),
    filename: '[name].js',
  },
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    client: { overlay: false },
  },
  entry: {
    main: './src/' + entries,
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(ts(x?))?$/,
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: isDevelopment ? 'tsconfig.dev.json' : 'tsconfig.json',
              transpileOnly: true,
              ...(isDevelopment && {
                getCustomTransformers: () => ({
                  before: [ReactRefreshTypeScript()],
                }),
              }),
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    isDevelopment && new ReactRefreshPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './public/index.html',
      favicon: './public/favicon.ico',
      manifest: './public/manifest.json',
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
