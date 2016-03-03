import webpack from 'webpack'
import fs from 'fs'
import path from 'path'
import * as SHARED from './webpack.shared.config'
import * as SHARED_CLIENT from './webpack.shared.client.config'
import { DEV_PORT } from './Constants'

const HOT = process.env.AUTO_RELOAD === 'hot'
const REFRESH = process.env.AUTO_RELOAD === 'refresh'

export default {

  devtool: 'cheap-module-eval-source-map',

  entry: getEntry(),

  output: {
    path: SHARED_CLIENT.BUILD_PATH,
    filename: '[name].js',
    publicPath: `http://localhost:${DEV_PORT}/`
  },

  module: {
    loaders: SHARED_CLIENT.LOADERS.concat([
      getBabelLoader(),
      SHARED_CLIENT.STYLE_LOADER
    ])
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

function getBabelLoader() {
  // we can't use the "dev" config in babelrc because we don't always
  // want it, sometimes we want refresh, sometimes we want none. Also, we
  // don't want it in the server bundle either (not yet anyway?)
  const loader = { test: SHARED.JS_REGEX, exclude: /node_modules/, loader: 'babel-loader' }
  if (HOT) {
    const rc = JSON.parse(fs.readFileSync(path.join(SHARED.APP_PATH, '.babelrc')))
    loader.query = { presets: rc.presets.concat([ 'react-hmre' ]) }
  }
  return loader
}

function getEntry() {
  // since all configs are required at once, we can't be mutating
  // anything, will clean this up when webpack configs can export functions
  // https://gist.github.com/sokra/27b24881210b56bbaff7#configuration
  const entry = { ...SHARED_CLIENT.ENTRY }
  entry._vendor = entry._vendor.slice(0)
  if (HOT) {
    entry._vendor.unshift('webpack/hot/dev-server')
  }
  if (HOT || REFRESH) {
    entry._vendor.unshift(
      `webpack-dev-server/client?http://localhost:${DEV_PORT}`
    )
  }
  return entry
}


function getPlugins() {
  const plugins = SHARED_CLIENT.PLUGINS.slice(0)
  plugins.push(
    new webpack.BannerPlugin(`
      if (!window.__reactProjectDebugRan__) {
        window.__reactProjectDebugRan__ = true
        console.debug('[react-project] NODE_ENV=${process.env.NODE_ENV}');
        console.debug('[react-project] AUTO_REFRESH=${process.env.AUTO_RELOAD}');
        if (!location.search.match(/__ssr/)) {
           console.debug(
             '[react-project] SSR disabled in dev. Enable with',
             location.search ? location.href + '&__ssr' : location.href + '?__ssr'
           );
        }
      }
    `, { raw: true, entryOnly: true })
  )
  if (HOT) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  return plugins
}

