'use client'

/**
 * Tiny external store backing the add-to-cart date-conflict prompt.
 *
 * A cart order owns ONE rental window and every line item is priced
 * against it (the backend silently re-prices any added item onto the
 * order's dates — see toffee `addProductToCart`). When a user adds gear
 * picked for a different window, we surface that instead of letting it
 * happen silently: `requestDateChoice` opens the sheet and resolves with
 * the user's choice.
 *
 * It lives outside Redux on purpose — this is transient UI coordination
 * between `useAddToCart` (any product card) and a single
 * `DateConflictHost` mounted in the root layout. A module-level store +
 * `useSyncExternalStore` avoids prop-drilling through five call sites.
 */

export interface DateWindow {
  /** Any `Date`-parseable string (ISO or legacy `'' + Date`). */
  startDate: string
  endDate: string
}

interface ConflictState {
  open: boolean
  cart: DateWindow | null
  picked: DateWindow | null
}

type Listener = () => void

let state: ConflictState = {open: false, cart: null, picked: null}
let pendingResolve: ((choice: 'cart' | 'picked') => void) | null = null
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

export function getSnapshot(): ConflictState {
  return state
}

/**
 * Open the conflict sheet and resolve once the user picks a window.
 * `cart` = what the order is already priced for; `picked` = the window
 * selected for the item being added.
 */
export function requestDateChoice(
  cart: DateWindow,
  picked: DateWindow,
): Promise<'cart' | 'picked'> {
  // A prompt is already open (rapid double-add): resolve the previous
  // one to its safe default so its promise never dangles.
  if (pendingResolve) {
    pendingResolve('cart')
    pendingResolve = null
  }
  return new Promise(resolve => {
    pendingResolve = resolve
    state = {open: true, cart, picked}
    emit()
  })
}

export function resolveDateChoice(choice: 'cart' | 'picked') {
  const resolve = pendingResolve
  pendingResolve = null
  state = {open: false, cart: null, picked: null}
  emit()
  resolve?.(choice)
}
