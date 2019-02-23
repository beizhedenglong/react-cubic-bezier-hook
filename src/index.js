import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import BezierEasing from 'bezier-easing'
import { useSpring, animated } from 'react-spring'

function App() {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    immediate: true,
  })
  return <animated.div style={props}>I will fade in</animated.div>
}


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

const Test = () => {
  const easing1 = useEasing(1000)
  const easing2 = useLiner(1000)
  const easing3 = useEaseIn(1000)
  const easing4 = useEaseInOut(1000, false)
  return (
    <div>
      <App />
      <div
        style={{
          position: 'relative',
          left: 500 * easing1.percent,
          width: 100,
          height: 100,
          background: 'black',
        }}
      />
      <div
        style={{
          position: 'relative',
          left: 500 * easing2.percent,
          width: 100,
          height: 100,
          background: 'yellow',
        }}
      />
      <div
        style={{
          position: 'relative',
          left: 500 * easing3.percent,
          width: 100,
          height: 100,
          background: 'green',
        }}
      />
      <div
        onClick={() => easing4.setImmediate(true)}
        style={{
          position: 'relative',
          width: 100 + 500 * easing4.percent,
          height: 100,
          background: 'grey',
        }}
      />
    </div>
  )
}


ReactDOM.render(
  <div>
    <Test />
  </div>,
  document.getElementById('app'),
)
