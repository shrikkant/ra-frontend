import React from 'react'
import Link from 'next/link'

export default function Custom500() {
  return (
    <div style={{textAlign: 'center', padding: '50px'}}>
      <h1>500 - Server-side Error</h1>
      <p>An unexpected server-side exception has occurred.</p>
      <p>Digest: 3453556563</p> {/* Include the error digest if you want */}
      <Link href="/">
        <a>Go back to Home</a>
      </Link>
    </div>
  )
}
