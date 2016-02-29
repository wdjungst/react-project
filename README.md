React Project: State of the Art Web Development
===============================================

A dependency--not a boilerplate--to make your React project a delight to
develop.

This is brand new, not ready for production unless you are ready and
willing to contribute to the project. Basically just building something
we want here, if it interests you, please help :)

Also, it has no tests. Also, it's awesome.





## Node/NPM Versions

I'm running node v5.7.0 and npm v3.6.0 as I tinker, there's no plan to
support older versions at the moment.





## Contributing

Please see [CONTRIBUTING.md](/CONTRIBUTING.md)




## Getting Started

The quickest way to get started is to use `create-react-project`.

```sh
npm install -g create-react-project
create-react-project the-best-app-ever
cd the-best-app-ever
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

Minified, gzipped, long-term hashed assets and server-pre-rendering, and
more.

You can use this as a dependency of an existing app. For now,
the result of `create-react-project` is your best documentation on how
to do that.



## Features

- [React][react]
  - [React Router][router]
- Modern JavaScript with [Babel][babel]
  - [ES2015][es2015]
  - [React preset][react-preset] (JSX)
  - [Stage 1 proposals preset][stage1] (gotta have that `{ ...awesome, stuff }`)
  - [configurable][babelrc] with `.babelrc`
  - Polyfills
    - [ES5 Shims][es5]
    - [Promise][promise]
    - [fetch][fetch] (server and client)
- [Express][express] server rendering
- [Server-only routes][serverroute] (what?)
- [Document titles][documenttitle]
- [Code Splitting][splitting]
  - vendor/app initial bundles
  - [lazy route config loading][lazy]
  - [lazy route component loading][lazy]
- Auto Reload
  - Refresh (entire page)
  - [Hot Module Replacement][hmr] (just the changed components)
  - None (let you refresh when you're ready)
- [Webpack loaders][loaders]
  - [babel][babel-loader]
  - [CSS Modules][cssmodules]
  - [json][jsonloader]
  - [url][urlloader] Fonts / images
- Optimized production build
  - [gzip][compression]
  - [Minification][uglify]
  - [long-term asset caching][caching]
  - [base64][urlloader] inlined images/fonts/svg < 10k
- Test Runner
  - [Karma][karma]
  - [Mocha][mocha]


### Future Features (Pull Requests Welcome!)

Please see [CONTRIBUTING.md](/CONTRIBUTING.md) and help out :)




## Philosophy

- Cut the crap and start building an app right away
- Wrap up the stuff that is good for all apps.
- Keep the app in charge. Config lives in the app, defaults provided by
  the framework are imported into the app, the app is not imported into
  the framework.
- Escape hatches are important.
- Upgrading should be simple, benefits should come w/o changing app
  code usually.




## Semver Versioning

As soon as I ship a real app with this, I'll ship 1.0.




## API

### npm scripts

After running `react-project init` your package.json will have some new tasks.

#### `npm start`

Starts the server. It's smart enough to know which `NODE_ENV` you're in.
If `NODE_ENV=production` you'll get the full production build. If you're
shipping to heroku, for instance, deploying is just `git push heroku master`.
It'll create a production build up there.

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
// lazily, it won't be in the initial bundle
import loadDashboard from 'bundle?lazy!./Dashboard'

// now wrap that load function with `lazy` and you're done, you've got
// super simple code splitting, the dashboard code won't be downloaded
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
route's handler is called (maybe we could do something cool later with
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

`callback(err, reactElement, initialState)`

- `reactElement` is the react element to be rendered
- `initialState` is initial state from the server for data re-hydration
  on the client.

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


### `react-project` CLI

It's not intended that you use this directly, task should be done with
npm scripts.

#### `react-project init`

Initializes the app, copies over a blueprint app, updates package.json
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



  [ni]:/CONTRIBUTING.md
  [express]:http://expressjs.com/
  [Document]:#TODO
  [bundle-loader]:https://github.com/webpack/bundle-loader
  [router]:https://github.com/reactjs/react-router
  [hmr-server]:#hmr-server
  [react]:https://facebook.github.io/react/
  [babel]:https://babeljs.io/
  [es2015]:https://babeljs.io/docs/learn-es2015/
  [react-preset]:https://babeljs.io/docs/plugins/preset-react/
  [stage1]:https://babeljs.io/docs/plugins/preset-stage-1/
  [babelrc]:https://babeljs.io/docs/usage/babelrc/
  [es5]:https://github.com/es-shims/es5-shim#shims
  [promise]:https://github.com/stefanpenner/es6-promise
  [fetch]:https://github.com/github/fetch
  [express]:http://expressjs.com/
  [serverroute]:#serverroute
  [lazy]:#lazy
  [documenttitle]:https://github.com/ryanflorence/react-title-component
  [splitting]:https://webpack.github.io/docs/code-splitting.html
  [hmr]:https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
  [loaders]:https://webpack.github.io/docs/loaders.html
  [babel-loader]:https://github.com/babel/babel-loader
  [cssmodules]:https://github.com/css-modules/css-modules
  [jsonloader]:https://github.com/webpack/json-loader
  [urlloader]:https://github.com/webpack/url-loader
  [compression]:https://github.com/expressjs/compression
  [uglify]:https://github.com/mishoo/UglifyJS2
  [caching]:http://webpack.github.io/docs/long-term-caching.html
  [urlloader]:https://github.com/webpack/url-loader
  [karma]:https://karma-runner.github.io/0.13/index.html
  [mocha]:https://mochajs.org/


