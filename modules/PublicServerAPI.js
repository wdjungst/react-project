// You have to be careful about which files this thing brings in because
// it gets bundled into a single file and then required, so process.pwd()
// and friends are going to be different, not sure how to keep it sane
// yet. Only problem I've run into is trying to read the app's package.json
// in a module this imports, like Constants, but then it doesn't work when
// the bundled server runs. So ... don't try to read the app's package.json,
// and ... be careful.
//
// Also note that any dependencies in here need to in the `peerDependencies`
// entry in package.json. We don't package up any node_modules into the
// server build for two reasons 1) that file would be ginourmous and take
// a long time to bundle and 2) it's pretty cool that the app gets to
// decide which version of express, or react it wants to use, so that
// our release cycle doesn't get in the way of theirs.
import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import path from 'path'
import { match } from 'react-router'
import { flushTitle } from 'react-title-component'
import compression from 'compression'
import hpp from 'hpp'
import helmet from 'helmet'
import { log } from './LogUtils'
import { PORT, APP_PATH, PUBLIC_DIR } from './Constants'
import ErrorMessage from './ErrorMessage'

export function createServer(getApp) {
  const server = express()
  const webpackStats = getWebpackStats()
  server.disable('x-powered-by')
  addProductionOnlyMiddleware(server)
  addMiddleware(server)
  server._listen = server.listen
  server.listen = () => {
    throw new Error('[react-project]', 'Do not call `server.listen()`, use `server.start()`')
  }

  server.start = () => {
    server.all('*', (req, res) => {
      getApp(req, res, (err, { render, routes }) => {
        if (err) {
          onError(err, req, res)
        } else {
          match({ routes, location: req.url }, (err, redirect, routerProps) => {
            if (err) {
              onError(err, req, res)
            } else if (redirect) {
              // TODO: need a way to specify 301, 302, 307 etc. in the route config.
              // will need to make changes in React Router or history probably
              res.redirect(redirect.pathname + redirect.search)
            } else if (routerProps) {
              sendWithReactRouter({ req, res, render, webpackStats, routerProps })
            } else {
              sendNoRoutesMatched(res)
            }
          })
        }
      })
    })

    server._listen(PORT, () => {
      log()
      log(`NODE_ENV=${process.env.NODE_ENV}`)
      log(`Express server listening on port`, PORT)
    })
  }

  return server
}

function addProductionOnlyMiddleware(server) {
  if (process.env.NODE_ENV === 'production') {
    server.use(compression())
    server.use(express.static(PUBLIC_DIR))
  }
}

function addMiddleware(server) {
  server.use(express.static(path.join(APP_PATH, 'static')))
  server.use(bodyParser.json())
  server.use(hpp())
  server.use(helmet.contentSecurityPolicy({
    defaultSrc: [ "'self'" ],
    scriptSrc: [ "'self'" ],
    styleSrc: [ "'self'" ],
    imgSrc: [ "'self'" ],
    connectSrc: [ "'self'", 'ws:' ],
    fontSrc: [ "'self'" ],
    objectSrc: [ "'none'" ],
    mediaSrc: [ "'none'" ],
    frameSrc: [ "'none'" ]
  }))
  server.use(helmet.xssFilter())
  server.use(helmet.frameguard('deny'))
  server.use(helmet.ieNoOpen())
  server.use(helmet.noSniff())
}

function sendWithReactRouter({ req, res, render, webpackStats, routerProps }) {
  const { routes } = routerProps
  const lastRoute = routes[routes.length - 1]
  if (lastRoute.isServerRoute) {
    handleServerRoute(req, res, {
      params: routerProps.params,
      location: routerProps.location,
      routes: routerProps.routes,
      route: lastRoute
    })
  } else if (req.method !== 'GET') {
    sendNoRoutesMatched(res)
  } else {
    render(routerProps, (err, { renderDocument, renderApp }) => {
      if (err) {
        onError(err, req, res)
      } else {
        const status = err ? err.status : (lastRoute.status || 200)
        const appElement = renderApp(routerProps)
        const content = getContent(req, appElement)
        const documentElement = renderDocument({
          title: flushTitle(),
          content: content,
          scripts: getJavaScriptTags(webpackStats),
          styles: getStyleTags(webpackStats)
        })
        const markup = renderToStaticMarkup(documentElement)
        res.status(status).send(`<!doctype html>\n${markup}`)
      }
    })
  }
}

function handleServerRoute(req, res, route, props) {
  const handler = route[req.method.toLowerCase()]
  if (!handler) {
    res.status(500).send(renderToStaticMarkup(
      <ErrorMessage>
        <p>
          Route has no handler. Add "get", "post" etc.
        </p>
        <pre>{'<Route get={handler}/>'}</pre>
        <p>Route Props:</p>
        <pre>{Object.keys(route).join(' ')}</pre>
      </ErrorMessage>
    ))
  } else {
    handler(req, res, route, props)
  }
}

function onError(err, req, res) {
  res.status(500).send(renderToStaticMarkup(
    <ErrorMessage>
      <p>
        Unknown error occured:
      </p>
      <pre>{err.message}</pre>
    </ErrorMessage>
  ))
}

function getWebpackStats() {
  const file = path.resolve(APP_PATH, '.build', 'stats.json')
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function getContent(req, appElement) {
  return (process.env.NODE_ENV === 'production' || req.query.__ssr != null) ?
    renderToString(appElement) : ''
}

function getAssetPaths(stats, regex) {
  return Object.keys(stats.assetsByChunkName).reduce((assets, key) => {
    const chunk = stats.assetsByChunkName[key]
    const chunkArray = Array.isArray(chunk) ? chunk : [ chunk ]
    return assets.concat(chunkArray
      .filter(asset => (regex).test(asset))
      .map((asset) => stats.publicPath + asset)
    )
  }, [])
}

function getStyleTags(stats) {
  return getAssetPaths(stats, /\.css$/).map(href => (
    <link key={href} rel="stylesheet" href={href}/>
  ))
}

function getJavaScriptTags(stats) {
  return getAssetPaths(stats, /\.js$/).map(src => (
    <script key={src} src={src}/>
  ))
}

function sendNoRoutesMatched(res) {
  res.status(404).send(renderToStaticMarkup(
    <ErrorMessage>
      <p>
        No routes matched, you should add
      </p>
      <pre>{'<Route path="*" component={NoMatch}/>'}</pre>
      <p>
        to the end of your route config so your visitors don't see this message {':)'}
      </p>
    </ErrorMessage>
  ))
}


