'use client'

import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {useSelector} from 'react-redux'
import MobileChrome from '../../MobileChrome'
import {ArrowLeftIcon, CheckIcon, IdCardIcon} from '../../icons'
import {selectAuthState} from '../../../../../app-store/auth/auth.slice'
import {IDocument} from '../../../../../app-store/app-defaults/types'
import {getUserDocuments} from '../../../../../api/user/documents.api'
import {VERIFICATION_FLAGS, isVerified} from '../../../../../config/constants'
import DigilockerCard from './DigilockerCard'
import EmailCard from './EmailCard'
import DocumentCard from './DocumentCard'
import StepCard from './StepCard'

export default function VerifyScreen() {
  const router = useRouter()
  const user = useSelector(selectAuthState)
  const [existingDocuments, setExistingDocuments] = useState<
    Record<string, IDocument>
  >({})
  const [isLoading, setIsLoading] = useState(true)

  // Verification needs a logged-in user.
  useEffect(() => {
    if (!user) router.push('/join')
  }, [user, router])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const fetchDocuments = async () => {
      try {
        const documents = await getUserDocuments()
        if (!cancelled && documents) {
          const docsMap: Record<string, IDocument> = {}
          documents.forEach(doc => {
            docsMap[doc.document_type] = doc
          })
          setExistingDocuments(docsMap)
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchDocuments()
    return () => {
      cancelled = true
    }
  }, [user])

  const handleDocumentUpload = (newDoc: IDocument) => {
    setExistingDocuments(prev => ({
      ...prev,
      [newDoc.document_type]: newDoc,
    }))
  }

  if (!user) return null

  const kycVerified = isVerified(user.verified ?? 0, VERIFICATION_FLAGS.AADHAAR)
  const emailVerified =
    isVerified(user.verified ?? 0, VERIFICATION_FLAGS.EMAIL) ||
    user.signin_source === 'G' ||
    user.signin_source === 'F'
  const hasUtilityBill = !!existingDocuments['utility_bill']
  const hasIdentityDoc =
    !!existingDocuments['driving_license'] || !!existingDocuments['passport']
  const documentsVerified = hasUtilityBill && hasIdentityDoc
  const allComplete = kycVerified && emailVerified && documentsVerified

  return (
    <MobileChrome hideTabBar bottomPad="none" width="narrow">
      <div className="md:mt-12 md:bg-surface md:border md:border-line-soft md:rounded-[20px] md:p-6 md:shadow-card-hover">
        <div className="px-4 md:px-0 pt-1.5">
          <button
            type="button"
            aria-label="Back to profile"
            onClick={() => router.push('/p/profile')}
            className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink"
          >
            <ArrowLeftIcon size={20} />
          </button>
        </div>

        <div className="px-4 md:px-0 pt-5">
          <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
            Account · Verification
          </div>
          <h1 className="text-[28px] font-extrabold tracking-tight-lg text-ink leading-[1.05] mt-1">
            Verify your identity
          </h1>
          <p className="text-[14px] text-ink-secondary mt-1.5">
            Complete these once and book any gear instantly — no waiting at
            checkout.
          </p>

          {!isLoading && (
            <Checklist
              kyc={kycVerified}
              email={emailVerified}
              documents={documentsVerified}
            />
          )}
        </div>

        <div className="px-4 md:px-0 pt-5 pb-8 space-y-3">
          {isLoading ? (
            <div className="text-center text-ink-muted text-[14px] py-12">
              Loading verification status…
            </div>
          ) : (
            <>
              {allComplete && (
                <SuccessBanner onDone={() => router.push('/p/profile')} />
              )}

              <DigilockerCard />

              <EmailCard />

              <StepCard
                status={documentsVerified ? 'done' : 'todo'}
                icon={<IdCardIcon size={20} />}
                title="Identity & address documents"
                subtitle={
                  documentsVerified
                    ? 'All required documents are uploaded.'
                    : 'Upload an address proof and one identity proof.'
                }
              >
                {!documentsVerified && (
                  <div className="space-y-3">
                    <DocumentCard
                      title="Utility Bill / Rental Agreement"
                      hint="Address proof · JPG, PNG or PDF"
                      documentType="utility_bill"
                      existingDocument={existingDocuments['utility_bill']}
                      onUpload={handleDocumentUpload}
                    />

                    <div className="rounded-[14px] bg-surface-muted p-3">
                      <p className="text-[11px] uppercase tracking-kicker font-extrabold text-ink-secondary mb-2.5">
                        Identity proof · upload any one
                      </p>
                      <div className="space-y-2.5">
                        <DocumentCard
                          title="Driving License"
                          hint="JPG, PNG or PDF"
                          documentType="driving_license"
                          existingDocument={
                            existingDocuments['driving_license']
                          }
                          onUpload={handleDocumentUpload}
                        />
                        <div className="flex items-center gap-2">
                          <span className="flex-1 h-px bg-line" />
                          <span className="text-[11px] font-extrabold text-ink-muted">
                            OR
                          </span>
                          <span className="flex-1 h-px bg-line" />
                        </div>
                        <DocumentCard
                          title="Passport"
                          hint="JPG, PNG or PDF"
                          documentType="passport"
                          existingDocument={existingDocuments['passport']}
                          onUpload={handleDocumentUpload}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </StepCard>
            </>
          )}
        </div>
      </div>
    </MobileChrome>
  )
}

// ── Pieces ────────────────────────────────────────────────────────────

function Checklist({
  kyc,
  email,
  documents,
}: {
  kyc: boolean
  email: boolean
  documents: boolean
}) {
  const items: Array<{label: string; done: boolean}> = [
    {label: 'KYC verification', done: kyc},
    {label: 'Email verification', done: email},
    {label: 'Identity & address documents', done: documents},
  ]
  const doneCount = items.filter(i => i.done).length

  return (
    <div className="mt-4 bg-surface border border-line-soft rounded-[16px] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] uppercase tracking-kicker font-extrabold text-ink-secondary">
          Progress
        </span>
        <span className="font-mono text-[12px] font-extrabold text-ink">
          {doneCount}/{items.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2.5">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                item.done
                  ? 'bg-success text-surface'
                  : 'bg-surface-muted border border-line'
              }`}
            >
              {item.done && <CheckIcon size={12} strokeWidth={3} />}
            </span>
            <span
              className={`text-[13px] font-bold ${
                item.done ? 'text-ink' : 'text-ink-secondary'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SuccessBanner({onDone}: {onDone: () => void}) {
  return (
    <div className="bg-success/10 border border-success/30 rounded-[16px] p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-success text-surface flex items-center justify-center shrink-0">
          <CheckIcon size={18} strokeWidth={3} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-extrabold text-ink">
            You&apos;re fully verified
          </div>
          <p className="text-[12px] text-ink-secondary mt-0.5 leading-relaxed">
            Your identity is confirmed. Book any gear without delays.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="block w-full text-center bg-ink text-surface text-[13px] font-extrabold rounded-full py-2.5 mt-3"
      >
        Back to profile →
      </button>
    </div>
  )
}
