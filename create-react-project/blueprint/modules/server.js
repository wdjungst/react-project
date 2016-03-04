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
  cb(null, <RouterContext {...props}/>)
}

function getApp(req, res, cb) {
  cb(null, { renderDocument, routes, renderApp })
}

createServer(getApp).start()

