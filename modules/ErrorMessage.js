import React from 'react'

const style = {
  fontFamily: 'sans-serif',
  width: 300,
  padding: '10px 50px 50px 50px',
  background: '#f0f0f0',
  color: '#333',
  margin: '100px auto 0 auto'
}

export default function ErrorMessage(props) {
  return (
    <div style={style}>
      <h1>DX Error</h1>
      {props.children}
    </div>
  )
}
