export default function Loading() {
  return (
    <div className="min-h-screen bg-bg font-sans">
      <div className="mx-auto max-w-md pt-notch px-4">
        {/* Top bar skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-surface-muted animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-2 w-12 rounded-full bg-surface-muted animate-pulse" />
              <div className="h-3 w-20 rounded-full bg-surface-muted animate-pulse" />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-muted animate-pulse" />
        </div>
        {/* Search bar */}
        <div className="h-12 rounded-[18px] bg-surface-muted animate-pulse mb-4" />
        {/* Hero */}
        <div className="h-[180px] rounded-4xl bg-surface-muted animate-pulse mb-6" />
        {/* Tile grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {Array.from({length: 4}).map((_, i) => (
            <div
              key={i}
              className="aspect-[1/1.25] rounded-[20px] bg-surface-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
