## 0.0.23

- BREAKING: `createServer` now takes just a `render` method, not
  `renderApp` and `renderDocument`, and then you callback from render
  with those. See the blueprint `server.js`. This allows for custom data
  loading abstractions (like AsyncProps) that need the props from
  React Router `match` and then sends the data to both the `<Document/>`
  (for data hand-off) and the `<App/>`.

- BREAKING: 'react-project/webpack' now only exports `ClientConfig` and
  `SeverConfig`, no more client "dev" and "prod".

## 0.0.22

- Fixed unchecked in blueprint package.json

## 0.0.21

- BREAKING: `createServer` API now allows for request specific setup
- BREAKING: `serverRouteHandler` API gets params and location

## 0.0.20

- ignore `node_modules` regression fixed. Must faster initial bundle
  times now.

## 0.0.7 - 0.0.19

- Lots of screwing around w/ the blueprint, weird npm things and other
  stuff that eventually led to `create-react-project` global npm
  install.  I don't like global installs either. You can remove it after
  you've used it to create the blueprint.

## 0.0.6

- fixed skipping first prompt in init

## 0.0.5

- allow apps to add express middleware before express routing starts
- fixed init issues #8, #9
- added hook for server data hydration
- fixed missing babel-preset-react-hmre dep

## 0.0.4

- switched from `prompt-sync` to `prompt` because all of the issues so
  far came from `prompt-sync` :(.
- cleaned up package.json dependencies, many were dev dependencies
- `start` adds missing deps to package.json, making upgrading awesome

## 0.0.3

- `start` now checks dependencies so when you upgrade React Project, you
  know how to update your app to work with it.

- added some default security stuff to the web server.

