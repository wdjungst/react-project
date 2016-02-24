import path from 'path'
import webpack from 'webpack'
import { APP_PATH } from './Constants'

import { getDXConfig } from './PackageUtils'

export { APP_PATH }

export const CLIENT_ENTRY = path.join(APP_PATH, getDXConfig().client)
export const SERVER_ENTRY = path.join(APP_PATH, getDXConfig().server)
export const APP_ENTRIES_PATH = path.join(APP_PATH, 'modules')
export const NODE_ENV = process.env.NODE_ENV
export const FONT_REGEX = /\.(otf|eot|svg|ttf|woff|woff2).*$/
export const IMAGE_REGEX = /\.(gif|jpe?g|png)$/
export const CSS_REGEX = /\.css$/
export const JS_REGEX = /\.js$/
export const JS_EXCLUDE_REGEX = /node_modules/
export const CSS_LOADER_QUERY = 'modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'

export const LOADERS = [
  { test: /\.json$/,
    loader: 'json-loader'
  },
  { test: FONT_REGEX,
    loader: 'url-loader?limit=10000'
  },
  { test: IMAGE_REGEX,
    loader: 'url-loader?limit=10000'
  }
]

export const PLUGINS = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
]


