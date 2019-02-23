import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import BezierEasing from 'bezier-easing'

const createEasingHook = (mX1, mY1, mX2, mY2) => (duration = 1000, immediate = true) => {
  const [percent, set] = useState(0)
  const startedRef = useRef(null)
  const bezierFn = BezierEasing(mX1, mY1, mX2, mY2)
  const rafRef = useRef(null)
  const [immediateStatus, setImmediate] = useState(immediate)
  const cancelIfNecessary = () => rafRef.current && cancelAnimationFrame(rafRef.current)
  useEffect(() => {
    if (!immediateStatus) {
      return cancelIfNecessary
    }
    const doAnimation = (timestamp) => {
      if (!startedRef.current) {
        startedRef.current = timestamp
      }
      const timePassed = timestamp - startedRef.current
      if (timePassed <= duration) {
        set(bezierFn(timePassed / duration))
        cancelIfNecessary()
        rafRef.current = requestAnimationFrame(doAnimation)
      } else {
        set(bezierFn(1))
      }
    }
    rafRef.current = requestAnimationFrame(doAnimation)
    return cancelIfNecessary
  }, [immediateStatus])
  return { percent, setImmediate }
}

const useEasing = createEasingHook(0.25, 0.1, 0.25, 1.0)
const useLiner = createEasingHook(0.00, 0.0, 1.00, 1.0)
const useEaseIn = createEasingHook(0.42, 0.0, 1.00, 1.0)
const useEaseInOut = createEasingHook(0.42, 0.0, 0.58, 1.0)

const useChain = (...arr) => {
  const res = arr.map(({ hook, args }, index) => {
    if (index === 0) {
      return hook(...args)
    }
    return hook(...args, false)
  })
  useEffect(() => {
    res.forEach(({ percent }, index) => {
      if ((percent === 1) && res[index + 1]) {
        res[index + 1].setImmediate(true)
      }
    })
  })
  return res
}

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
  return (
    divs
  )
}


ReactDOM.render(
  <div>
    <Test />
  </div>,
  document.getElementById('app'),
)
