/*eslint no-console: 0*/
import webpack from 'webpack'
import * as SHARED from './webpack.shared.config'

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
        loaders: [
          { test: SHARED.JS_REGEX,
            loader: 'babel-loader'
          },
          { test: SHARED.CSS_REGEX,
            loader: `style-loader!css-loader?${SHARED.CSS_LOADER_QUERY}!postcss-loader`
          },
          { test: SHARED.JSON_REGEX,
            loader: 'json-loader'
          },
          { test: SHARED.FONT_REGEX,
            loader: 'url-loader?limit=10000'
          },
          { test: SHARED.IMAGE_REGEX,
            loader: 'url-loader?limit=10000'
          },
          { test: /modules\/api\//,
            loader: 'null-loader'
          }
        ],
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

