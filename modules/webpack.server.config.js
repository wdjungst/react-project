import webpack from 'webpack'
import fs from 'fs'
import path from 'path'
import * as SHARED from './webpack.shared.config'

const nodeModules = fs.readdirSync(
  path.join(SHARED.APP_PATH, 'node_modules')
).filter( x => (
  [ '.bin' ].indexOf(x) === -1
))

export default {

  target: 'node',

  devtool: 'sourcemap',

  entry: path.resolve(SHARED.SERVER_ENTRY),

  output: {
    path: path.join(SHARED.APP_PATH, '.build'),
    filename: 'server.js'
  },

  // keep node_module paths out of the bundle
  externals: [
    function (context, request, callback) {
      const pathStart = request.split('/')[0]
      // keep react-project stuff *in* the bundle so it gets processed through babel (and we don't
      // need to ship a prebundled version :D)
      if (nodeModules.indexOf(pathStart) >= 0 && request !== 'react-project' && request !== 'react-project/server') {
        return callback(null, 'commonjs ' + request)
      }
      callback()
    }
  ],

  node: {
    __filename: true,
    __dirname: true
  },

  module: {
    loaders: SHARED.LOADERS.concat([
      { test: SHARED.JS_REGEX,
        loader: 'babel-loader'
      },
      { test: SHARED.CSS_REGEX,
        loader: `css-loader?${SHARED.CSS_LOADER_QUERY}!postcss-loader`
      }
    ])
  },

  plugins: SHARED.PLUGINS.concat([
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: false }
    ),
    new webpack.ProvidePlugin({
      fetch: 'node-fetch'
    })
  ])

}

