import React from 'react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-2">Oops! Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-600">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className=" py-2 px-4 border-2 border-amber-400 rounded-md mt-4"
      >
        Go Home
      </Link>
    </div>
  )
}
