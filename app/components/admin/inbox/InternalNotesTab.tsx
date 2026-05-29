'use client'

import React from 'react'
import ActivityLogger from '../../../../components/admin/ActivityLogger'

interface Props {
  userId: number | null
}

// Internal-only notes between sales reps about this customer. Backed by
// the existing /v1/admin/users/:id/activities endpoint via the legacy
// ActivityLogger component. Customer never sees these.
export default function InternalNotesTab({userId}: Props) {
  if (!userId) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center bg-bg">
        <div className="max-w-sm">
          <div className="text-[13px] font-bold text-ink">
            No customer linked yet
          </div>
          <div className="text-[12px] text-ink-muted mt-1 leading-relaxed">
            Internal notes attach to a customer profile. This conversation
            isn't linked to a user — typically auto-link runs on the first
            inbound; if it didn't, link the user from the legacy tools.
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex-1 overflow-y-auto bg-bg p-3 lg:p-5">
      <div className="max-w-2xl">
        <ActivityLogger userId={userId} />
      </div>
    </div>
  )
}
