/*eslint no-console:0*/
import React from 'react'
import { createServer } from 'react-project/server'
import { RouterContext } from 'react-router'
import morgan from 'morgan'
import Document from '../modules/components/Document'
import routes from '../modules/routes'


function getApp(req, res, requestCallback) {
  // here is your chance to do things like get an auth token and generate
  // your route config w/ request aware `onEnter` hooks, etc.
  requestCallback(null, {
    routes: routes,
    render(routerProps, renderCallback) {
      // here is your chance to load up data before rendering and pass it to
      // your top-level components
      renderCallback(null, {
        renderDocument: (props) => <Document {...props}/>,
        renderApp: (props) => <RouterContext {...props}/>
      })
    }
  })
}

const server = createServer(getApp)

if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'))
}

if (process.env.NODE_ENV === 'production') {
  server.use(morgan('combined'))
}

server.start()

