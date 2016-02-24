/*eslint-env mocha*/
describe('react-project', () => {
  describe('init', () => {
    it('initializes a new project')
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

