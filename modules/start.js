import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import build from './build'
import { log, logError, promptApproval } from './LogUtils'
import { getPackageJSON, pkgPath, getDXConfig, copyProps } from './PackageUtils'
import { DEV_PORT, APP_PATH } from './Constants'

export default function start(cb) {
  if (process.env.NODE_ENV === 'production') {
    logDXStartWarning()
  } else {
    checkDependencies()
    build(() => {
      const appServerPath = path.join(process.cwd(), '.build', 'server.js')
      require(appServerPath)
      runDevServer(cb)
    })
  }
}

function checkDependencies() {
  log('checking app dependencies')
  const pkg = getPackageJSON()
  const blueprintPkg = require('../blueprint/package.json')
  const missingDeps = []
  const differentDeps = []
  for (const key in blueprintPkg.dependencies) {
    const blueprintVersion = `${key}@${blueprintPkg.dependencies[key]}`
    const pkgVersion = `${key}@${pkg.dependencies[key]}`
    if (!pkg.dependencies[key]) {
      missingDeps.push(blueprintVersion)
    } else if (pkgVersion !== blueprintVersion) {
      differentDeps.push({ pkgVersion, blueprintVersion })
    }
  }

  if (differentDeps.length) {
    log('Some of your dependencies don\'t match what I expect')
    differentDeps.forEach((dep) => {
      log(`You have: ${dep.pkgVersion} and I expect ${dep.blueprintVersion}`)
    })
    log('You might want to `npm install` the versions I expect.')
    promptApproval('Would you like me continue?')
  }

  if (missingDeps.length) {
    logError('You are missing some dependencies, please run:')
    log()
    log(`  npm install ${missingDeps.join(' ')} --save --save-exact`)
    log()
    process.exit()
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

