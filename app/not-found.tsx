import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-6 font-sans">
      <div className="font-mono text-[80px] font-extrabold text-ink leading-none">
        404
      </div>
      <div
        aria-hidden
        className="w-12 h-1 rounded-full bg-accent mt-3"
      />
      <h1 className="text-[26px] font-extrabold tracking-tight-lg text-ink mt-6">
        Page not found
      </h1>
      <p className="text-[14px] text-ink-secondary mt-2 max-w-xs">
        The page you were after has either moved, been renamed, or never
        existed in the first place.
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
