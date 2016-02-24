/*global cp*/
import fs from 'fs'
import { log, promptApproval } from './LogUtils'
import { getPackageJSON, pkgPath, copyProps } from './PackageUtils'
import 'shelljs/global'
import path from 'path'
import { APP_PATH } from './Constants'

export default function init(cb) {
  const pkg = getPackageJSON()
  log(
    'This is going to add a bunch of files and edit your package.json.',
    'You probably want to have a clean git working tree before continuing.',
    'That way you can reset the changes about to made with `git reset`.'
  )
  promptApproval('Do you want to continue?')

  log('copying project blueprint')
  const blueprint = path.join(__dirname, '..', 'blueprint', '/')
  cp('-R', blueprint, APP_PATH)
  // cp -R bug https://github.com/shelljs/shelljs/issues/140
  ;[ '.babelrc', '.env', '.eslintrc', '.gitignore', '.npmrc' ].forEach(file => {
    cp(path.join(blueprint, file), path.join(APP_PATH, file))
  })

  log('Adding scripts to package.json')
  const blueprintPkg = require('../blueprint/package.json')
  copyProps(blueprintPkg, pkg, 'scripts')
  copyProps(blueprintPkg, pkg, 'react-project')
  copyProps(blueprintPkg, pkg, 'dependencies')
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

  log()
  log('Now run:')
  log('')
  log('  npm install && npm start')
  log('')
  cb()
}

//function checkDotEnv(cb) {
  //const exists = fs.existsSync(`${APP_PATH}/.dotenv`)
  //if (exists) {
    ////validateDotEnv(cb)
    //// TODO
    //cb()
  //} else {
    //createDotEnv(cb)
  //}
//}

//function createDotEnv(cb) {
  //const filePath = `${APP_PATH}/.dotenv`
  //promptFileApproval(filePath)
  //cb()
//}

//function promptFileApproval(filepath) {
  //log('I need to create the following file')
  //log()
  //log(`  ${filepath}`)
  //log()
  //promptApproval('Can I create the file?')
//}

