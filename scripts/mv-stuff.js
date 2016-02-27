#!/usr/bin/env node
/*eslint-env shelljs*/
require('shelljs/global')

//npm publish removes these files, so we have to rename
mv('blueprint/.npmrc', 'blueprint/npmrc')
mv('blueprint/.gitignore', 'blueprint/gitignore')

// we don't want to actually copy this in the `init` task so we move it
// before publishing
mv('blueprint/package.json', 'blueprint_pkg.json')

