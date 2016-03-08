import path from 'path'
import { APP_PATH } from './Constants'
import { getDXConfig } from './PackageUtils'

export { APP_PATH }
export const CLIENT_ENTRY = path.join(APP_PATH, getDXConfig().client)
export const APP_ENTRIES_PATH = path.join(APP_PATH, 'modules')
export const NODE_ENV = process.env.NODE_ENV
export const FONT_REGEX = /\.(otf|eot|svg|ttf|woff|woff2).*$/
export const IMAGE_REGEX = /\.(gif|jpe?g|png|ico)$/
export const CSS_REGEX = /\.css$/
export const JS_REGEX = /\.js$/
export const JSON_REGEX = /\.json$/
export const JS_EXCLUDE_REGEX = /node_modules/
export const CSS_LOADER_QUERY = 'modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'

