import React from 'react'

export default function TrustBullet({text}: {text: string}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      {text}
    </span>
  )
}
