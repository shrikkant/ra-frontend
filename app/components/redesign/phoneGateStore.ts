'use client'

/**
 * Module-level store backing the phone-gate sheet.
 *
 * Why this exists: Google OAuth signups arrive without a phone. That
 * means we can't contact them on WhatsApp, can't run delivery, and
 * they're invisible to the admin inbox. Asking on the homepage is
 * spammy; asking once they show real intent (add to cart) converts
 * far better. Any callsite that wants to enforce phone-presence calls
 * `requirePhone()` and awaits the promise. The sheet UI is owned by a
 * single `<PhoneGateHost />` mounted in the root layout, mirroring
 * the [[dateConflictStore]] / DateConflictHost pattern so callers
 * never have to render or thread sheet state themselves.
 *
 * Resolution contract:
 *   true  — phone is now attached (either was already, or user just
 *           verified). The caller may proceed with its action.
 *   false — user dismissed without attaching. The caller MUST abort
 *           its action (no add-to-cart, no checkout). We do not retry.
 */

type Listener = () => void

interface GateState {
  open: boolean
  /** Optional context surfaced in the sheet copy ("Add Sony A7 to cart"). */
  reason?: string
}

let state: GateState = {open: false}
let pendingResolve: ((ok: boolean) => void) | null = null
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach(l => l())
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot(): GateState {
  return state
}

/**
 * Open the phone-gate sheet. Resolves true once the user has a
 * verified phone on file, false if they dismiss. If a gate is already
 * open (rapid double-tap on two product tiles), the previous promise
 * resolves false and the new one takes over — this matches the
 * date-conflict store's "last-call-wins" behaviour so promises never
 * dangle.
 */
export function requirePhone(reason?: string): Promise<boolean> {
  if (pendingResolve) {
    pendingResolve(false)
    pendingResolve = null
  }
  return new Promise(resolve => {
    pendingResolve = resolve
    state = {open: true, reason}
    emit()
  })
}

export function resolvePhoneGate(ok: boolean) {
  const resolve = pendingResolve
  pendingResolve = null
  state = {open: false}
  emit()
  resolve?.(ok)
}
