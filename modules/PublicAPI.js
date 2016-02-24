import React from 'react'

const { func, string, object, oneOfType } = React.PropTypes

export function lazy(loader) {
  return (location, cb) => {
    loader((Mod) => {
      cb(null, Mod.default)
    })
  }
}

const handler = oneOfType([ func, object ])

export const ServerRoute = React.createClass({
  propTypes: {
    path: string.isRequired,
    get: handler,
    post: handler,
    patch: handler,
    put: handler,
    delete: handler
  },
  getDefaultProps() {
    return {
      isServerRoute: true
    }
  },
  render() {
    return null
  }
})
