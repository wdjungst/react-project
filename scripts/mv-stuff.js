#!/usr/bin/env node
/*eslint-env shelljs*/
require('shelljs/global')

//npm publish removes these files, so we have to rename
mv('blueprint/.npmrc', 'blueprint/npmrc')
mv('blueprint/.gitignore', 'blueprint/gitignore')

