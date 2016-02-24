import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as SHARED from './webpack.shared.config'
import * as SHARED_CLIENT from './webpack.shared.client.config'

const HASH8 = '[hash:8]'

export default {

  devtool: 'sourcemap',

  entry: SHARED_CLIENT.ENTRY,

  output: {
    path: SHARED_CLIENT.BUILD_PATH,
    filename: `[name].${HASH8}.js`,
    publicPath: process.env.PUBLIC_PATH || `/`
  },

  module: {
    loaders: SHARED_CLIENT.LOADERS.concat([
      { test: SHARED.JS_REGEX,
        loader: 'babel-loader'
      },
      { test: SHARED.CSS_REGEX,
        loader: ExtractTextPlugin.extract('style-loader', `css-loader?${SHARED.CSS_LOADER_QUERY}!postcss-loader`),
        name: 'css'
      }
    ])
  },

  plugins: SHARED_CLIENT.PLUGINS.concat([
    new ExtractTextPlugin(`styles.${HASH8}.css`),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ])

}

