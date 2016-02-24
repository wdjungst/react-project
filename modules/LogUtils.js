/*eslint no-console: 0*/
import prompt from 'prompt'
import { red, yellow, green } from 'cli-color'

function logWithColor(color, msgs) {
  console.log(...[ color('[react-project]') ].concat(msgs))
}

export function log(...msgs) {
  console.log(...[ '[react-project]' ].concat(msgs))
}

export function logError(...msgs) {
  logWithColor(red, msgs)
}

export function logPrompt(...msgs) {
  logWithColor(yellow, msgs)
}

export function logTask(...msgs) {
  logWithColor(green, msgs)
}


export function promptApproval(msg, cb) {
  if (process.env.NODE_ENV === 'production') {
    logError('Wanted to prompt approval but skipping because we are in production')
    log('Prompt message was: ', msg)
  } else {
    prompt.start()
    const property = {
      name: 'yesno',
      message: msg + ' (y|n)',
      validator: /y|n/,
      warning: 'Must respond "y" for yes or "n" for no',
      default: 'n'
    }
    prompt.get(property, (err, result) => {
      if (result.yesno === 'y') {
        cb && cb()
      } else {
        logError('FINE!')
        process.exit()
      }
    })
  }
}

