#!/usr/bin/env node
/*eslint-disable*/
var path = require('path')
require('shelljs/global')

mv(
  path.join('blueprint', 'gitignore'),
  path.join('blueprint', '.gitignore')
)

mv(
  path.join('blueprint', 'npmrc'),
  path.join('blueprint', '.npmrc')
)

