import React from 'react'
import dragon from './dragon.jpg'
import { header } from './styles.css'
import Title from 'react-title-component'

export default React.createClass({
  render() {
    return (
      <div>
        <Title render={prev => `${prev} | Dragon!`}/>
        <h2 className={header}>RAR!</h2>
        <img src={dragon} height="400"/>
      </div>
    )
  }
})

