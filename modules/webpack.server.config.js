import webpack from 'webpack'
import fs from 'fs'
import path from 'path'
import * as SHARED from './webpack.shared.config'
import { DEV_PORT, DEV_HOST, PUBLIC_PATH } from './Constants'
import { getDXConfig } from './PackageUtils'

const PROD = process.env.NODE_ENV === 'production'

function getPublicPath() {
  return PROD ? PUBLIC_PATH : `http://${DEV_HOST}:${DEV_PORT}/`
}

const nodeModules = fs.readdirSync(
  path.join(SHARED.APP_PATH, 'node_modules')
).filter( x => (
  [ '.bin' ].indexOf(x) === -1
))

export default {

  target: 'node',

  devtool: 'sourcemap',

  entry: path.resolve(SHARED.APP_PATH, getDXConfig().server),

  output: {
    path: path.join(SHARED.APP_PATH, '.build'),
    filename: 'server.js',
    publicPath: getPublicPath()
  },

  externals: getExternals(),

  node: {
    __filename: true,
    __dirname: true
  },

  module: {
    loaders: [
      { test: SHARED.JSON_REGEX,
        loader: 'json-loader'
      },
      { test: SHARED.FONT_REGEX,
        loader: 'url-loader?limit=10000'
      },
      { test: SHARED.IMAGE_REGEX,
        loader: 'url-loader?limit=10000'
      },
      { test: SHARED.JS_REGEX,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      { test: SHARED.CSS_REGEX,
        loader: `css-loader/locals?${SHARED.CSS_LOADER_QUERY}!postcss-loader`
      }
    ]
  },

  plugins: [
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: false }
    ),
    new webpack.ProvidePlugin({
      fetch: 'node-fetch'
    })
  ]

}

function getExternals() {
  // keep node_module paths out of the bundle
  return [
    function (context, request, callback) {
      const pathStart = request.split('/')[0]
      // can't remember why we need to bundle up react-project stuff ...
      if (
        nodeModules.indexOf(pathStart) >= 0 &&
        request !== 'react-project' &&
        request !== 'react-project/server'
      ) {
        callback(null, 'commonjs ' + request)
      } else {
        callback()
      }
    }
  ]
}

