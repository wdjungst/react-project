/*eslint no-console: 0*/
import { prompt } from 'prompt-sync'
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


export function promptApproval(msg) {
  if (process.env.NODE_ENV === 'production') {
    logError('Wanted to prompt approval but skipping because we are in production')
    log('Prompt message was: ', msg)
  } else {
    logPrompt(msg, '(y/N)')
    const approval = prompt({ sigint: true })
    const controlCd = approval === null
    if (controlCd || approval.toLowerCase().trim() !== 'y') {
      logError('FINE!')
      process.exit()
    }
  }
}

