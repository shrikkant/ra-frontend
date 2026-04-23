import Link from 'next/link'

export default function Custom500() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-6 font-sans">
      <div className="font-mono text-[80px] font-extrabold text-ink leading-none">
        500
      </div>
      <div aria-hidden className="w-12 h-1 rounded-full bg-danger mt-3" />
      <h1 className="text-[26px] font-extrabold tracking-tight-lg text-ink mt-6">
        Something broke
      </h1>
      <p className="text-[14px] text-ink-secondary mt-2 max-w-xs">
        An unexpected server error occurred. Please try again, or head back
        to the home page.
      </p>
      <Link
        href="/"
        className="mt-6 bg-ink text-surface text-[14px] font-extrabold rounded-full px-6 py-3.5 no-underline"
      >
        Back to home →
      </Link>
    </div>
  )
}
