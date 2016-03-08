import webpack from 'webpack'
import fs from 'fs'
import path from 'path'
import * as SHARED from './webpack.shared.config'
import { DEV_PORT, DEV_HOST, PUBLIC_PATH, SERVER_RENDERING } from './Constants'
import { getDXConfig } from './PackageUtils'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const HOT = process.env.AUTO_RELOAD === 'hot'
const REFRESH = process.env.AUTO_RELOAD === 'refresh'
const PROD = process.env.NODE_ENV === 'production'
const HASH8 = '[hash:8]'

function getPublicPath() {
  return PROD ? PUBLIC_PATH : `http://${DEV_HOST}:${DEV_PORT}/`
}

export default {

  entry: getEntry(),

  devtool: getDevTool(),

  output: {
    path: path.join(SHARED.APP_PATH, '.build'),
    filename: getFileName(),
    publicPath: getPublicPath()
  },

  module: {
    loaders: getLoaders()
  },

  plugins: getPlugins(),

  devServer: {
    hot: HOT,
    contentBase: false,
    quiet: false,
    noInfo: false,
    stats: {
      assets: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: true
    }
  }
}

function getLoaders() {
  return [
    getBabelLoader(),
    getCSSLoader(),
    { test: SHARED.JSON_REGEX,
      loader: 'json-loader'
    },
    { test: SHARED.FONT_REGEX,
      loader: 'url-loader?limit=10000'
    },
    { test: SHARED.IMAGE_REGEX,
      loader: 'url-loader?limit=10000'
    },
    { test: /modules\/api\//,
      loader: 'null-loader'
    }
  ]
}

function getCSSLoader() {
  const loader = { test: SHARED.CSS_REGEX }
  if (PROD || SERVER_RENDERING) {
    loader.loader = ExtractTextPlugin.extract(
      'style-loader',
      `css-loader?${SHARED.CSS_LOADER_QUERY}!postcss-loader`
    )
  } else {
    loader.loader = `style-loader!css-loader?${SHARED.CSS_LOADER_QUERY}!postcss-loader`
  }
  return loader
}

function getFileName() {
  return PROD ? `${HASH8}.js` : '[name].js'
}

function getDevTool() {
  return PROD ? 'sourcemap' : 'cheap-module-eval-source-map'
}

function getBabelLoader() {
  // we can't use the "dev" config in babelrc because we don't always
  // want it, sometimes we want refresh, sometimes we want none. Also, we
  // don't want it in the server bundle either (not yet anyway?)
  const loader = {
    test: SHARED.JS_REGEX,
    exclude: /node_modules/,
    loader: 'babel-loader'
  }
  if (!PROD && HOT) {
    const rc = JSON.parse(fs.readFileSync(path.join(SHARED.APP_PATH, '.babelrc')))
    loader.query = { presets: rc.presets.concat([ 'react-hmre' ]) }
  }
  return loader
}

function getEntry() {
  const entry = {
    app: path.join(SHARED.APP_PATH, getDXConfig().client),
    _vendor: [ 'react', 'react-dom', 'react-router', 'react-project' ]
  }
  if (!PROD) {
    if (HOT) {
      entry._vendor.unshift('webpack/hot/dev-server')
    }
    if (HOT || REFRESH) {
      entry._vendor.unshift(
        `webpack-dev-server/client?http://${DEV_HOST}:${DEV_PORT}`
      )
    }
  }
  return entry
}

function getPlugins() {

  const plugins = [
    new webpack.optimize.CommonsChunkPlugin('_vendor', 'vendor.js')
  ]

  if (PROD) {
    plugins.push(
      new ExtractTextPlugin(`${HASH8}.css`),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin()
    )
  } else {
    if (SERVER_RENDERING) {
      plugins.push(new ExtractTextPlugin('[name].css'))
    } else if (HOT) {
      // can't do HMR with SERVER_RENDERING because of ExtractTextPlugin
      plugins.push(new webpack.HotModuleReplacementPlugin())
    }
  }

  return plugins
}

