/*eslint no-console: 0*/
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

