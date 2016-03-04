/*eslint-env mocha, shelljs*/
/*eslint no-console: 0*/
import 'shelljs/global'
import expect from 'expect'
import { spawn } from 'child_process'
import http from 'http'

const TEST_DIR = 'test-fixture'

if (process.env.FAST) {
  console.log('Detected FAST, skipping initialization of blueprint')
} else {
  console.log('Copying blueprint, this may take a while. Use FAST=1 to skip next time.')
  rm('-rf', TEST_DIR)
  exec(`create-react-project/index.js ${TEST_DIR}`)
  exec('npm link')
  cd(TEST_DIR)
  exec('npm link react-project')
  exec('npm install')
}

describe('create-react-project', () => {
  it('initializes a new project', function () {
    cd(TEST_DIR)
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

describe('react-project', () => {
  describe('start', () => {
    it('starts a web server', function (done) {
      this.timeout(100000)
      cd(TEST_DIR)
      const start = spawn('npm', [ 'start' ])
      start.stdout.on('data', (data) => {
        const str = data.toString()
        console.log(str)
        if (str.match(/webpack: bundle is now VALID/)) {
          http.get('http://localhost:8080/?__ssr', (res) => {
            console.log(`Got response: ${res.statusCode}`)
            res.resume()
            res.on('data', (chunk) => {
              expect(chunk.toString()).toMatch(/DRAGON/)
            })
            res.on('end', () => {
              console.log('No more data in response.')
              start.kill('SIGINT') // <-- this doesn't actually kill it :(
              done()
            })
          })
        }
      })
      start.on('close', () => {
        //done() // called in res.on('end'), but should be here
        console.log('start closed')
      })
    })

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

