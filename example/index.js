import React from 'react'
import ReactDOM from 'react-dom'
import {
  useChain, useEasing, useLiner, useEaseIn, useEaseInOut,
} from '../src/index'

const Test = () => {
  const hooksReturns = useChain(
    { hook: useEasing, args: [500] },
    { hook: useLiner, args: [1000] },
    { hook: useEaseIn, args: [200] },
    { hook: useEaseInOut, args: [300] },
    { hook: useEasing, args: [400] },
    { hook: useLiner, args: [2000] },
  )
  const colors = ['pink', 'yellow', 'blue', 'grey']
  const divs = hooksReturns.map(({ percent }, index) => (
    <div
      key={index} // eslint-disable-line
      style={{
        position: 'relative',
        left: 500 * percent,
        width: 100,
        height: 100,
        background: colors[index % 4],
      }}
    />

  ))
  return divs
}


ReactDOM.render(
  <div>
    <Test />
  </div>,
  document.getElementById('app'),
)
