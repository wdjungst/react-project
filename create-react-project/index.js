#!/usr/bin/env node
/*eslint-disable*/
// no babel, keep it old and raw
require('shelljs/global')
var path = require('path')
var fs = require('fs')

var name = process.argv[2]
var appPath = path.join(process.cwd(), name)
var bpPath = path.join(__dirname, 'blueprint')

cp('-R', bpPath, appPath)

// cp -R bug https://github.com/shelljs/shelljs/issues/140
cp('-R',
  path.join(bpPath, 'node_modules', '.bin'),
  path.join(appPath, 'node_modules', '.bin')
)
;[ '.babelrc', '.env', '.eslintrc', '.gitignore', '.npmrc' ].forEach(function (file) {
  cp(path.join(bpPath, file), path.join(appPath, file))
})

var pkgPath = path.join(appPath, 'package.json')
var pkg = require(pkgPath)
pkg.name = name
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

console.log('[react-project]', 'Done!')
console.log('[react-project]')
console.log('[react-project]', 'Now run:')
console.log()
console.log('cd', name)
console.log('npm install')
console.log('npm start')
console.log()

