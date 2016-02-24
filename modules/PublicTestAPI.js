/*eslint no-console: 0*/
import webpack from 'webpack'
import * as SHARED from './webpack.shared.config'
import * as SHARED_CLIENT from './webpack.shared.client.config'

export function KarmaConf(config) {
  config.set({
    browsers: [ 'Chrome' ],
    frameworks: [ 'mocha' ],
    reporters: [ 'mocha' ],

    files: [ 'tests.webpack.js' ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: SHARED_CLIENT.LOADERS.concat([
          SHARED_CLIENT.STYLE_LOADER,
          { test: SHARED.JS_REGEX,
            exclude: SHARED.JS_EXCLUDE_REGEX,
            loader: 'babel'
          }
        ])
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test'),
          'process.env.FAIL_ON_WARNINGS': JSON.stringify(process.env.FAIL_ON_WARNINGS || false)
        })
      ]
    },

    webpackServer: {
      noInfo: true
    }

  })

}

