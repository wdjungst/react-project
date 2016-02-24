/*eslint no-console: 0*/
import fs from 'fs'
import path from 'path'
import { log } from './LogUtils'
import { APP_PATH } from './Constants'

export const pkgPath = path.join(APP_PATH, 'package.json')

export function getPackageJSON() {
  if (!fs.existsSync(pkgPath))
    logNoPackageJSON()
  let packageJSON
  try {
    packageJSON = require(pkgPath)
  } catch(e) {
    logCantReadPackageJSON()
  }
  return packageJSON
}

export function getDXConfig() {
  const packageJSON = getPackageJSON()
  validatePackageJSON(packageJSON)
  return getPackageJSON().dx
}

function validatePackageJSON(appPackageJSON) {
  if (!appPackageJSON.dx) {
    logNoDX()
  }
  if (
    !appPackageJSON.dx ||
    !appPackageJSON.dx.client ||
    !appPackageJSON.dx.server
  ) {
    logError('No "dx" entry found in package.json')
    log('It should look something like this:')
    console.log()
    console.log('  {')
    console.log('    ...')
    console.log('    "dx": {')
    console.log('      "server": "modules/server.js",')
    console.log('      "client": "modules/client.js"')
    console.log('    }')
    console.log('  }')
    console.log()
    process.exit()
  }
}

function logCantReadPackageJSON() {
  logError('Can\'t read "package.json", go fix it or maybe run this:')
  log()
  log('  npm init .')
  log()
  process.exit()
}


function logNoPackageJSON() {
  log('No "package.json" found, run this:')
  log()
  log('  npm init .')
  log()
  process.exit()
}

function logNoDX() {
  log('No "dx" entry found in package.json')
  log('It should look something like this:')
  console.log()
  console.log('  {')
  console.log('    ...')
  console.log('    "dx": {')
  console.log('      "server": "modules/server.js",')
  console.log('      "server": "modules/client.js",')
  console.log('      "webpack": "modules/webpack.config.js"')
  console.log('    }')
  console.log('  }')
  console.log()
  process.exit()
}

