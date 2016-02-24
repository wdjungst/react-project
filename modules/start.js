import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import build from './build'
import { log, logError } from './LogUtils'
import { getDXConfig } from './PackageUtils'
import { DEV_PORT, APP_PATH } from './Constants'

export default function start(cb) {
  if (process.env.NODE_ENV === 'production') {
    logDXStartWarning()
  } else {
    build(() => {
      const appServerPath = path.join(process.cwd(), '.build', 'server.js')
      require(appServerPath)
      runDevServer(cb)
    })
  }
}

function logDXStartWarning() {
  logError('Don\'t use `react-project start` in production.')
  log('First add:')
  log()
  log('  rm -rf .build && react-project build && node .build/server.js')
  log()
  log('to your package.json `scripts.start` entry, then use:')
  log()
  log('  npm start\n')
}

function runDevServer(cb) {
  const configPath = path.join(APP_PATH, getDXConfig().webpack)
  const { ClientDevConfig } = require(configPath)
  const compiler = webpack(ClientDevConfig)
  const server = new WebpackDevServer(compiler, ClientDevConfig.devServer)
  server.listen(DEV_PORT, 'localhost', () => {
    log('Webpack dev server listening on port', DEV_PORT)
    cb()
  })
}

