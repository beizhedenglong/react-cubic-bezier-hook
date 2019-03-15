import { useState, useEffect, useRef } from 'react'
import BezierEasing from 'bezier-easing'


export const createEasingHook = (mX1, mY1, mX2, mY2) => (duration = 1000, immediate = true) => {
  const [percent, set] = useState(0)
  const startedRef = useRef(null)
  const bezierFn = BezierEasing(mX1, mY1, mX2, mY2)
  const rafRef = useRef(null)
  const [immediateStatus, setImmediate] = useState(immediate)
  const cancelIfNecessary = () => rafRef.current && cancelAnimationFrame(rafRef.current)

  // 怎么由 y 反推 x?
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
        rafRef.current = requestAnimationFrame(doAnimation)
      } else {
        set(bezierFn(1))
        cancelIfNecessary()
      }
    }
    rafRef.current = requestAnimationFrame(doAnimation)
    return cancelIfNecessary
  }, [immediateStatus, rafRef.current])

  return {
    percent,
    immediateStatus,
    setImmediate,
    start: () => setImmediate(true),
  }
}

export const useEasing = createEasingHook(0.25, 0.1, 0.25, 1.0)
export const useLiner = createEasingHook(0.00, 0.0, 1.00, 1.0)
export const useEaseIn = createEasingHook(0.42, 0.0, 1.00, 1.0)
export const useEaseInOut = createEasingHook(0.42, 0.0, 0.58, 1.0)

export const useChain = (...arr) => {
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
