/*eslint no-console:0*/
import React from 'react'
import { createServer } from 'react-project/server'
import { RouterContext } from 'react-router'
import Document from '../modules/components/Document'
import routes from '../modules/routes'

function renderDocument(props, cb) {
  cb(null, <Document {...props}/>)
}

function renderApp(props, cb) {
  const use404 = props.location.pathname === '/throws-an-error'
  const err = use404 ? { status: 404 } : null
  cb(err, <RouterContext {...props}/>)
}

createServer({
  renderDocument,
  renderApp,
  routes
}).start()

