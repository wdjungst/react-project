#!/usr/bin/env node
/*eslint-disable*/
var path = require('path')
require('shelljs/global')

mv(
  path.join(__dirname, '..', 'blueprint', '.gitignore'),
  path.join(__dirname, '..', 'blueprint', 'gitignore')
)

mv(
  path.join(__dirname, '..', 'blueprint', '.npmrc'),
  path.join(__dirname, '..', 'blueprint', 'npmrc')
)

