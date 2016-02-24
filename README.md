React Project: State of the Art Web Development
===============================================

This is brand new, not ready for production unless you are ready and
willing to contribute to the project. Basically just building something
we want here, if it interests you, please help :)

Also, it has no tests. Also, it's awesome.




## Get Started

```
mkdir best-app-of-your-life
cd best-app-of-your-life
npm init .
npm install react-project --save
node_modules/.bin/react-project init
npm install
npm start
```

Now open [http://localhost:8080](http://localhost:8080).

Go edit a file, notice the app reloads, you can enable hot module
replacement by adding `AUTO_RELOAD=hot` to `.env`.

Also:

```
npm test
```

Also:

```
NODE_ENV=production npm start
```

Minified, gzipped, long-term hashed assets and server-pre-rendering.




## Features

- React
  - React Router

- Modern JavaScript with Babel
  - ES2015
  - JSX
  - Stage 1 proposals (gotta have that `{ ...awesome, stuff }`)
  - configurable with `.babelrc`
  - Polyfills
    - ES5
    - Promise
    - fetch (server and client)

- Server rendering (with express)
- Server-only routes (what?)
- Document titles

- Code Splitting
  - vendor/app initial bundles
  - lazy route config loading
  - lazy route component loading

- Auto Reload
  - Refresh (entire page)
  - Hot Module Replacement (just the changed components)
  - None (let you refresh when you're ready)

- Webpack loaders
  - babel
  - CSS Modules
  - json
  - fonts
  - images

- Optimized production build
  - gzip
  - minification
  - long-term asset caching
  - base64 inlined images/fonts/svg < 10k

- Test Runner
  - Karma
  - Mocha


### Future Features (Pull Requests Welcome!)

- Hot reloading server code (https://github.com/jlongster/backend-with-webpack does this)
- Better Test runner implementation see [here](#test-runnter)
- Redux + data loading (probably just keep it in the blueprint)
- Server side test runner (for the stuff in /api)




## Philosophy

- Cut the crap and start building an app right away
- Wrap up the stuff that is good for all apps.
- Keep the app in charge. Config lives in the app, defaults provided by
  the framework are imported into the app, the app is not imported into
  the framework.
- Escape hatches are important.




## Semver Versioning

As soon as I ship a real app with this, I'll ship 1.0.




## API

### `react-project` CLI

#### `react-project init`

Initializes the app, copies over a bluebrint app, updates package.json
with tasks, etc.

#### `react-project build`

Builds the assets, called from `npm start`, not normally called
directly.

#### `react-project start`

Starts the server. Called from `npm start`, not normally called
directly.

#### `react-project --help`

[NOT IMPLEMENTED][ni]

#### `react-project --version`

[NOT IMPLEMENTED][ni]


### npm scripts

After running `react-project init` your package.json will have some new tasks.

#### `npm start`

Starts the server. It's smart enough to know which `NODE_ENV` you're in.
If `NODE_ENV=production` you'll get the full production build.

#### `npm test`

Runs any files named `modules/**/*.test.js` with karma and mocha.

**Implementation needs work**

<a name="test-runner"></a>
Desired API is:

- App doesn't need `tests.webpack.js` context junk.
- App only has a karma config and a webpack tests config
- Karma config:
  - configurable on package.json `react-project`, like `"karma": "karma.conf.js"`
  - blueprint default is `export { KarmaConfig } from 'react-project/test'`
- Webpack test config
  - one more export from `webpack.config.js`
- Both configs should be babel'd.

This way people can mess w/ the default configs (both webpack and karma)
or take full control.


### ENV vars

```
NODE_ENV=development

# web server port
PORT=8080

# webpack dev server port
DEV_PORT=8081

# where to find assets, point to a CDN on production box
PUBLIC_PATH=/

# "hot", "refresh", and "none"
AUTO_RELOAD=refresh
```


### `react-project`

```
import { lazy, ServerRoute } from 'react-project'
```

#### `lazy`

Convenience method to simplify lazy route configuration with [bundle
loader][bundle-loader].

```js
import { lazy } from 'react-project'

// bundle loader returns a function here that will load `Dashboard`
// lazily, it won't be in the intial bundle
import loadDashboard from 'bundle?lazy!./Dashboard'

// now wrap that load function with `lazy` and you're done, you've got
// super simple code splitting, the dashboad code won't be downloaded
// until the user visits this route
<Route getComponent={lazy(loadDashboard)}/>

// just FYI, `lazy` doesn't do anything other than wrap up the callback
// signatures of getComponent and the bundle loader. Without `lazy` you
// would be doing this:
<Route getComponent={(location, cb) => {
  loadDashboard((Dashboard) => cb(Dashboard.default))
}}/>
```

#### `ServerRoute`

Defines a route to only be available on the server. Add handlers
(functions) to the different http methods.

**Note:** You have to restart the server after making changes to server
routes. But only until somebody implements HMR for the server.

You can nest routes to get path nesting, but only the final matched
route's handler is called (maybe we could do somethign cool later with
the handlers?!)

```js
import { ServerRoute } from 'react-project/server'
import {
  listEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent
} from './events'

export default (
  <Route path="/api">
    <ServerRoute path="events"
      get={listEvents}
      post={createEvent}
    >
      <ServerRoute path=":id"
        get={getEvent}
        patch={updateEvent}
        delete={deleteEvent}
      />
    </ServerRoute>
  </Route>
)
```


### `react-project/server`

#### `createServer({ renderDocument, renderApp, routes })`

```
import { createServer } from 'react-project/server'
createServer({ renderDocument, renderApp, routes }).start()
```

Creates and returns a new [Express][express] server, with a new
`start` method.

##### `renderDocument(props, callback)`

App-supplied function to render the top-level document. Callback with
a [`Document`][Document] component. You'll probably want to just tweak
the `Document` component supplied by the blueprint.

`callback(err, reactElement)`

##### `renderApp(props, callback)`

App-supplied function to render the application content. Should call
back with `<RouterContext {...props}/>` or something that renders a
`RouterContext` at the end of the render tree.

`callback(err, reactElement)`

If you call back with an error object with a `status` key, the server
will respond with that status:

`callback({ status: 404 })`

##### `routes`

The app's routes.


  [ni]:/CONTRIBUTING.md
  [express]:http://expressjs.com/
  [Document]:#TODO
  [bundle-loader]:https://github.com/webpack/bundle-loader
  [hmr-server]:#hmr-server
