/*eslint-env mocha*/
import expect from 'expect'
import Dragon from './index'
import React from 'react'
import { render } from 'react-dom'

describe('Dragon', () => {
  it('says "RAR"', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<Dragon/>, div)
    expect(div.innerHTML).toMatch(/RAR/)
  })
})
