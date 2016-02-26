/*eslint-env mocha, shelljs*/
/*eslint no-console: 0*/
import 'shelljs/global'
import fs from 'fs'
import expect from 'expect'

const TEST_DIR = '.tmp'

function init() {
  rm('-rf', TEST_DIR)
  const pkgJSON = JSON.stringify({
    name: 'test',
    version: '1.0.0',
    scripts: { test: 'echo "Error: no test specified" && exit 1' },
    dependencies: { 'react-project': '*' }
  }, null, 2)

  mkdir(TEST_DIR)
  cd(TEST_DIR)
  mkdir('node_modules')
  fs.writeFileSync('package.json', pkgJSON)

  console.log('npm installing, this may take a while...')

  // fake the npm situation that release.sh does
  cd('..')
  exec('./scripts/mv-stuff.js')
  cd('.tmp')

  exec('npm install ../')

  cd('..')
  exec('./scripts/mv-stuff-back.js')
  cd('.tmp')

  exec('node_modules/react-project/bin/react-project.js init')
}

function initFast() {
  cd(TEST_DIR)
  rm('-rf', 'node_modules/react-project')
  ln('-s', '../', 'node_modules/react-project')
}

if (process.env.FAST) {
  initFast()
} else {
  console.log('use FAST=1 to skip initialization of fixture project')
  init()
}

describe('react-project', () => {

  describe('init', () => {
    it('initializes a new project', () => {
      expect(ls('-A')).toEqual([
        '.babelrc',
        '.env',
        '.eslintrc',
        '.gitignore',
        '.npmrc',
        'karma.conf.js',
        'modules',
        'node_modules',
        'package.json',
        'static',
        'tests.webpack.js',
        'webpack.config.js'
      ])
    })
  })

  describe('start', () => {
    it('starts a web server')
    it('uses DEV_PORT')
    describe('with AUTO_RELOAD', () => {
      it('uses refresh')
      it('uses hot')
      it('uses none')
    })
    it('uses PUBLIC_PATH')
    it('uses NODE_ENV')
    it('prompts to continue if app deps differ from blueprint')
    it('bails when there are missing deps and provides a copy/paste line to install')
  })
  describe('build', () => {
    it('splits vendor code out')
    it('chunks lazy bundles')
    it('uses css modules')
    it('uses babel')
    it('uses json-loader')
    describe('with NODE_ENV=production', () => {
      it('hashes assets')
      it('inserts css as style sheets to avoid FOUC')
    })
  })
})

describe('react-project/server', () => {
  describe('createServer', () => {
    describe('with NODE_ENV=production', () => {
      it('uses gzip compression with')
    })
    it('uses json bodyParser')
    it('sends error message on unknown errors')
    it('sends error message on unknown errors')
    it('handles redirects')
    it('renders matched routes')
    it('sends 404 for non-matched routes')
    it('uses process.env.PORT')
    it('uses `status` prop of last matched route')
    it('uses document title')
    describe('server routes', () => {
      it('renders server routes')
      it('responds to the http verbs')
    })
  })
})

