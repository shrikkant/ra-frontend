import React from 'react'
import MarketingChrome from './MarketingChrome'

interface LegalPageProps {
  title: string
  /** Date label shown in mono under the title. */
  lastUpdated?: string
  children: React.ReactNode
}

/**
 * Wrapper for long-form legal pages. Provides the redesign chrome plus a
 * prose container with the new typography (Inter Tight body, JetBrains Mono
 * for any inline code/dates) and ink colors.
 *
 * Page authors keep their existing JSX — the wrapper applies typography
 * via descendant selectors so we don't have to rewrite every paragraph.
 */
export default function LegalPage({
  title,
  lastUpdated,
  children,
}: LegalPageProps) {
  return (
    <MarketingChrome title={title}>
      <div className="px-4 pt-3">
        <h1 className="text-[28px] font-extrabold tracking-tight-lg leading-[1.05] text-ink">
          {title}
        </h1>
        {lastUpdated && (
          <div className="font-mono text-[11px] text-ink-muted mt-1.5">
            Last updated {lastUpdated}
          </div>
        )}
      </div>

      <article
        className={[
          'px-4 pt-5 pb-2 text-[14px] text-ink-secondary leading-relaxed',
          '[&_h1]:text-[20px] [&_h1]:font-extrabold [&_h1]:text-ink [&_h1]:mt-6',
          '[&_h2]:text-[18px] [&_h2]:font-extrabold [&_h2]:text-ink [&_h2]:mt-6',
          '[&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-ink [&_h3]:mt-5',
          '[&_p]:my-2.5',
          '[&_b]:text-ink [&_strong]:text-ink',
          '[&_a]:font-bold [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2',
          '[&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1',
          '[&_hr]:my-6 [&_hr]:border-line-soft',
        ].join(' ')}
      >
        {children}
      </article>
    </MarketingChrome>
  )
}
