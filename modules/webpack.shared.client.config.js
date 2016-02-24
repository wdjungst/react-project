import webpack from 'webpack'
import path from 'path'
import * as SHARED from './webpack.shared.config'

export const ENTRY = {
  app: SHARED.CLIENT_ENTRY,
  _vendor: [
    'react',
    'react-dom',
    'react-router',
    'react-project'
  ]
}

export const BUILD_PATH = path.join(SHARED.APP_PATH, '.build')

export const PLUGINS = SHARED.PLUGINS.concat([
  new webpack.optimize.CommonsChunkPlugin('_vendor', 'vendor.js')
])

// ignore all imports from `api` for the client since that code
// only runs on the server
export const LOADERS = SHARED.LOADERS.concat([
  { test: /modules\/api\//,
    loader: 'null-loader'
  }
])

export const STYLE_LOADER = {
  test: SHARED.CSS_REGEX,
  loader: `style-loader!css-loader?${SHARED.CSS_LOADER_QUERY}!postcss-loader`,
  name: 'css'
}

