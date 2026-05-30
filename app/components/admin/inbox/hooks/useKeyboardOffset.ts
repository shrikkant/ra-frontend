'use client'

import {useEffect, useState} from 'react'

/**
 * Reports the height of the on-screen software keyboard (or any
 * viewport-shrinking UI) by reading the visualViewport API.
 *
 * Why: iOS Safari and most Android browsers shrink the *visual*
 * viewport when the keyboard opens but leave the *layout* viewport at
 * its original `100vh`. Anything sized in `vh` / `100%` of a fixed
 * parent ends up partly behind the keyboard — composers vanish, send
 * buttons get hidden, sales reps tap blindly. Subtracting this offset
 * from the chat view's height makes the layout follow the visual
 * viewport instead.
 *
 * Returns 0 when the keyboard is closed (or on browsers without
 * visualViewport — Safari < 13, ancient Android). Caller can apply it
 * verbatim as a height delta.
 */
export function useKeyboardOffset(): number {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    const vv = window.visualViewport

    const update = () => {
      // Keyboard height = (layout viewport) − (visual viewport bottom).
      // Clamp at 0 — when keyboard is closed the difference is tiny
      // noise from URL-bar shrinkage and we don't want to react to it.
      const kb = Math.max(
        0,
        window.innerHeight - vv.height - vv.offsetTop,
      )
      // Filter sub-50px noise (toolbar collapses, scrollbar gutters)
      // so the layout doesn't jitter on scroll. Real keyboards are
      // always > 200px tall.
      setOffset(kb > 50 ? kb : 0)
    }

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return offset
}
