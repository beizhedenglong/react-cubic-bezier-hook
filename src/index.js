import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import BezierEasing from 'bezier-easing'


const createEasingHook = (mX1, mY1, mX2, mY2) => (duration = 1000) => {
  const [percent, set] = useState(0)
  const startedRef = useRef(null)
  const bezierFn = BezierEasing(mX1, mY1, mX2, mY2)
  useEffect(() => {
    const doAnimation = (timestamp) => {
      if (!startedRef.current) {
        startedRef.current = timestamp
      }
      const timePassed = Date.now() - startedRef.current
      console.log(timePassed)
      if (timePassed <= duration) {
        set(bezierFn(timePassed / duration))
        window.requestAnimationFrame(doAnimation)
      } else {
        set(bezierFn(1))
      }
    }
    window.requestAnimationFrame(doAnimation)
    // if (!startedRef.current) {
    //   startedRef.current = Date.now()
    // }
    // const timerId = setInterval(() => {
    //   let timePassed = Date.now() - startedRef.current
    //   if (timePassed > duration) {
    //     timePassed = duration
    //     clearInterval(timerId)
    //   }
    //   set(bezierFn(timePassed / duration))
    // })
    // return () => clearInterval(timerId)
  }, [])
  return { percent }
}
const useEasing = createEasingHook(0.25, 0.1, 0.25, 1.0)
const useLiner = createEasingHook(0.00, 0.0, 1.00, 1.0)
const useEaseIn = createEasingHook(0.42, 0.0, 1.00, 1.0)
const useEaseInOut = createEasingHook(0.42, 0.0, 0.58, 1.0)

const Test = () => {
  const easing1 = useEasing(1000)
  const easing2 = useLiner(1000)
  const easing3 = useEaseIn(1000)
  const easing4 = useEaseInOut(1000)
  return (
    <div>
      <div
        style={{
          position: 'relative',
          left: 1000 * easing1.percent,
          width: 100,
          height: 100,
          background: 'black',
        }}
      />
      <div
        style={{
          position: 'relative',
          left: 1000 * easing2.percent,
          width: 100,
          height: 100,
          background: 'yellow',
        }}
      />
      <div
        style={{
          position: 'relative',
          left: 1000 * easing3.percent,
          width: 100,
          height: 100,
          background: 'green',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: 100 + 1000 * easing4.percent,
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
