'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {useDispatch} from 'react-redux'
import {updateCustomer} from '../../../../api/admin/customers.api'
import {getAdminAuthUser} from '../../../../api/auth.api'
import {
  authUser,
  logout,
  setAdminLogin,
} from '../../../../app-store/auth/auth.slice'
import {IUser} from '../../../../app-store/types'
import {CheckIcon, CloseIcon} from '../../redesign/icons'

interface Props {
  customer: IUser
  onChange: (next: IUser) => void
}

const LoginGlyph = ({size = 12}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
)

type Field = 'name' | 'email' | 'phone' | 'city'

// Composite "name" because firstname + lastname share an edit context;
// editing one without the other is rare and the existing updateCustomer
// API requires both.
const FIELDS: Array<{
  id: Field
  label: string
  hint?: string
}> = [
  {id: 'name', label: 'Name'},
  {id: 'email', label: 'Email'},
  {id: 'phone', label: 'Phone', hint: '10-digit Indian'},
  {id: 'city', label: 'City'},
]

function displayValue(customer: IUser, field: Field): string {
  switch (field) {
    case 'name':
      return (
        [customer.firstname, customer.lastname].filter(Boolean).join(' ').trim() ||
        '—'
      )
    case 'email':
      return customer.email_address || '—'
    case 'phone':
      return customer.phone || '—'
    case 'city':
      return customer.city || '—'
  }
}

function isWhatsAppPlaceholderEmail(email?: string): boolean {
  return !!email && /^wa-\d+@whatsapp\.rentacross\.local$/i.test(email)
}

/**
 * Inbox-native customer profile editor: one row per field, tap to edit.
 *
 *   - Tap any row → that row flips to an input with Save / Cancel.
 *   - Other rows remain read-only (single edit at a time keeps focus
 *     and the on-screen keyboard manageable on mobile).
 *   - Save sends ALL fields to updateCustomer (the existing PUT
 *     endpoint requires the full set) and patches the parent's customer
 *     state on success.
 *   - The WhatsApp-signup placeholder email is highlighted so reps know
 *     to ask for a real one — sales nudge baked into the UX.
 */
export default function ProfileEditCard({customer, onChange}: Props) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [editing, setEditing] = useState<Field | null>(null)
  const [draft, setDraft] = useState({
    firstname: customer.firstname ?? '',
    lastname: customer.lastname ?? '',
    email: customer.email_address ?? '',
    phone: customer.phone ?? '',
    city: customer.city ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [impersonating, setImpersonating] = useState(false)

  /**
   * Log out of the admin account and into the customer's account.
   * Existing /admin endpoint hands back a fresh session for the target
   * user; we drop the admin's session, mark `adminLogin=true` in redux
   * so the customer-facing chrome knows it's a sudo and can offer a
   * "back to admin" affordance, then bounce to home.
   *
   * Confirm dialog before firing — this nukes the admin's session, so
   * a stray tap shouldn't trigger it.
   */
  const loginAsCustomer = async () => {
    if (impersonating) return
    const name =
      [customer.firstname, customer.lastname]
        .filter(Boolean)
        .join(' ')
        .trim() ||
      customer.email_address ||
      `+91 ${customer.phone ?? ''}`
    if (
      !window.confirm(
        `Log in as ${name}? You'll be signed out of admin and switched to their account.`,
      )
    ) {
      return
    }
    setImpersonating(true)
    try {
      dispatch(logout())
      const loggedUser = await getAdminAuthUser(customer.id)
      dispatch(authUser(loggedUser))
      dispatch(setAdminLogin(true))
      router.push('/')
    } catch (e) {
      console.error('Login-as-customer failed:', e)
      setImpersonating(false)
    }
  }

  const beginEdit = (field: Field) => {
    setDraft({
      firstname: customer.firstname ?? '',
      lastname: customer.lastname ?? '',
      email: customer.email_address ?? '',
      phone: customer.phone ?? '',
      city: customer.city ?? '',
    })
    setError(null)
    setEditing(field)
  }

  const cancel = () => {
    setEditing(null)
    setError(null)
  }

  const save = async () => {
    if (saving) return
    setError(null)

    if (editing === 'phone' && draft.phone && !/^[6-9]\d{9}$/.test(draft.phone)) {
      setError('Phone must be a 10-digit Indian number starting 6-9.')
      return
    }
    if (
      editing === 'email' &&
      draft.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)
    ) {
      setError('Enter a valid email address.')
      return
    }

    setSaving(true)
    try {
      const updated = await updateCustomer(
        customer.id,
        draft.email.trim(),
        draft.phone.trim(),
        draft.firstname.trim(),
        draft.lastname.trim(),
        draft.city.trim(),
      )
      onChange(updated)
      setEditing(null)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-surface border border-line rounded-[16px] overflow-hidden">
      <div className="px-4 py-3 border-b border-line-soft flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted">
            Profile
          </div>
          <div className="text-[15px] font-extrabold text-ink leading-tight mt-0.5">
            Customer details
          </div>
        </div>
        <button
          type="button"
          onClick={loginAsCustomer}
          disabled={impersonating}
          className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-kicker bg-surface border border-line text-ink rounded-full px-3 py-1.5 hover:bg-surface-muted active:scale-95 transition-transform disabled:opacity-60"
        >
          <LoginGlyph />
          {impersonating ? 'Switching…' : 'Login as'}
        </button>
      </div>

      <ul className="divide-y divide-line-soft">
        {FIELDS.map(({id, label, hint}) => {
          const isEditing = editing === id
          const showPlaceholderWarning =
            id === 'email' && isWhatsAppPlaceholderEmail(customer.email_address)
          return (
            <li key={id}>
              {isEditing ? (
                <div className="px-4 py-3 space-y-2">
                  <div className="text-[11px] uppercase tracking-kicker font-extrabold text-ink-muted">
                    {label}
                  </div>
                  {id === 'name' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={draft.firstname}
                        onChange={e =>
                          setDraft(d => ({...d, firstname: e.target.value}))
                        }
                        placeholder="First name"
                        className="rounded-[10px] border border-line bg-bg px-3 py-2 text-[14px] text-ink outline-none focus:border-ink"
                      />
                      <input
                        type="text"
                        value={draft.lastname}
                        onChange={e =>
                          setDraft(d => ({...d, lastname: e.target.value}))
                        }
                        placeholder="Last name"
                        className="rounded-[10px] border border-line bg-bg px-3 py-2 text-[14px] text-ink outline-none focus:border-ink"
                      />
                    </div>
                  ) : (
                    <input
                      type={
                        id === 'email' ? 'email' : id === 'phone' ? 'tel' : 'text'
                      }
                      inputMode={id === 'phone' ? 'numeric' : undefined}
                      autoFocus
                      value={
                        id === 'email'
                          ? draft.email
                          : id === 'phone'
                            ? draft.phone
                            : draft.city
                      }
                      onChange={e => {
                        const v = e.target.value
                        setDraft(d =>
                          id === 'email'
                            ? {...d, email: v}
                            : id === 'phone'
                              ? {...d, phone: v.replace(/\D/g, '').slice(0, 10)}
                              : {...d, city: v},
                        )
                      }}
                      placeholder={
                        id === 'email'
                          ? 'name@example.com'
                          : id === 'phone'
                            ? '9876543210'
                            : 'Pune'
                      }
                      className="w-full rounded-[10px] border border-line bg-bg px-3 py-2 text-[14px] text-ink outline-none focus:border-ink"
                    />
                  )}
                  {hint && (
                    <div className="text-[11px] text-ink-muted">{hint}</div>
                  )}
                  {error && (
                    <div className="text-[11px] text-danger">{error}</div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={cancel}
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-surface border border-line text-ink text-[12px] font-extrabold uppercase tracking-kicker rounded-full py-2 disabled:opacity-60"
                    >
                      <CloseIcon size={12} />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={save}
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-ink text-surface text-[12px] font-extrabold uppercase tracking-kicker rounded-full py-2 disabled:opacity-60"
                    >
                      <CheckIcon size={12} strokeWidth={3} />
                      {saving ? 'Saving' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => beginEdit(id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted">
                      {label}
                    </div>
                    <div className="text-[14px] font-bold text-ink truncate">
                      {displayValue(customer, id)}
                    </div>
                    {showPlaceholderWarning && (
                      <div className="text-[11px] text-accent font-bold mt-0.5">
                        Placeholder email — ask the customer for a real one
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] uppercase tracking-kicker font-extrabold text-ink-muted shrink-0">
                    Edit
                  </span>
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
