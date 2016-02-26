/*eslint-env shelljs*/
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
  promptApproval('Do you want to continue?', () => {
    log('copying project blueprint')
    const blueprint = path.join(__dirname, '..', 'blueprint', '/')

    // release.sh moves blueprint/package.json to here
    const blueprintPkg = require('../blueprint_package.json')

    cp('-R', blueprint, APP_PATH)

    // cp -R bug https://github.com/shelljs/shelljs/issues/140
    ;[ '.babelrc', '.env', '.eslintrc' ].forEach(file => {
      cp(path.join(blueprint, file), path.join(APP_PATH, file))
    })

    // release.sh renames these since npm publish would exclude them otherwise
    mv(path.join(APP_PATH, 'gitignore'), path.join(APP_PATH, '.gitignore'))
    mv(path.join(APP_PATH, 'npmrc'), path.join(APP_PATH, '.npmrc'))

    log('Adding scripts to package.json')
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
  })

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

