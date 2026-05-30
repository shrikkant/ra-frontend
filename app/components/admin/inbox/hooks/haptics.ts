'use client'

/**
 * Small wrapper around the Vibration API so we can sprinkle haptic
 * feedback on key composer actions without scattering feature-detection
 * everywhere.
 *
 * Browsers that don't support it (iOS Safari, desktop) silently no-op.
 * Android Chrome + Firefox honour the request and it makes the inbox
 * feel materially snappier — a 10ms tick on send, a softer 5ms on
 * picker selections.
 */
export function haptic(durationMs: number = 10): void {
  if (typeof navigator === 'undefined') return
  if (typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(durationMs)
  } catch {
    // Some browsers (Safari) expose the function but refuse non-user-
    // initiated calls. Ignore — degrades cleanly.
  }
}
