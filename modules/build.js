/* eslint no-console: 0 */
import webpack from 'webpack'
import path from 'path'
import fs from 'fs'
import { log, logError } from './LogUtils'
import { APP_PATH, PUBLIC_DIR } from './Constants'
import { getDXConfig } from './PackageUtils'
import ProgressPlugin from 'webpack/lib/ProgressPlugin'
import { transformFile } from 'babel-core'

const WEBPACK_PATH = path.join(PUBLIC_DIR, 'webpack.config.js')

export default function build(cb) {
  log(`NODE_ENV=${process.env.NODE_ENV}`)
  validateEnv()
  transpileWebpackConfig(() => {
    bundleServer(() => {
      bundleClient(cb)
    })
  })
}

function transpileWebpackConfig(cb) {
  const configPath = path.join(APP_PATH, getDXConfig().webpack)
  const options = JSON.parse(fs.readFileSync(path.join(APP_PATH, '.babelrc')))
  transformFile(configPath, options, (err, result) => {
    if (err) throw err
    fs.writeFileSync(WEBPACK_PATH, result.code)
    cb()
  })
}

function validateEnv() {
  if (!process.env.NODE_ENV) {
    logError('OOPS', 'NODE_ENV is undefined, please add it to your `.env` file')
    console.log()
    console.log('  NODE_ENV=development')
    console.log()
    process.exit()
  }
}

function getAppWebpackConfig() {
  return require(WEBPACK_PATH)
}

function bundleClient(cb) {
  log('bundling client')
  bundle(getAppWebpackConfig().ClientConfig, { saveStats: true }, cb)
}

function bundleServer(cb) {
  log('bundling server')
  bundle(getAppWebpackConfig().ServerConfig, { saveStats: false }, cb)
}

function bundle(config, { saveStats }, cb) {
  const compiler = webpack(config)
  compiler.apply(new ProgressPlugin((percentage, msg) => {
    if (!msg.match(/build modules/))
      log('[webpack]', msg)
  }))
  compiler.run((err, rawStats) => {
    if (err) {
      throw err
    } else {
      const stats = rawStats.toJson()
      if (stats.errors.length) {
        throw stats.errors[0]
      } else {
        if (saveStats) {
          const statsPath = `${config.output.path}/stats.json`
          fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2))
          log('wrote file', path.relative(APP_PATH, statsPath))
        }
        cb()
      }
    }
  })
}
