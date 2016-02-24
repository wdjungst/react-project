#!/usr/bin/env node
/*eslint-disable*/

var dotenv = require('dotenv')
var path = require('path')

dotenv.load({
  path: process.cwd() + '/.env',
  silent: true
})

require('../lib/cli')

