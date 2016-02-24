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
  return getPackageJSON()['react-project']
}

export function copyProps(source, target, field) {
  if (!target[field])
    target[field] = {}

  for (const key in source[field]) {
    if (!target[field][key])
      target[field][key] = source[field][key]
  }
}

function validatePackageJSON(appPackageJSON) {
  if (!appPackageJSON['react-project']) {
    logNoDX()
  }
  if (
    !appPackageJSON['react-project'] ||
    !appPackageJSON['react-project'].client ||
    !appPackageJSON['react-project'].server
  ) {
    logError('No "react-project" entry found in package.json')
    log('It should look something like this:')
    console.log()
    console.log('  {')
    console.log('    ...')
    console.log('    "react-project": {')
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
  log('No "react-project" entry found in package.json')
  log('It should look something like this:')
  console.log()
  console.log('  {')
  console.log('    ...')
  console.log('    "react-project": {')
  console.log('      "server": "modules/server.js",')
  console.log('      "client": "modules/client.js",')
  console.log('      "webpack": "modules/webpack.config.js"')
  console.log('    }')
  console.log('  }')
  console.log()
  process.exit()
}

