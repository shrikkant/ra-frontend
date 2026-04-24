import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MarketingChrome from '../components/redesign/MarketingChrome'

export const metadata = {
  title: 'About RentAcross — Camera rentals for everyone',
  description:
    'Why we built RentAcross — making professional camera, lens and lighting gear accessible to creators, travelers and students.',
}

export default function Page() {
  return (
    <MarketingChrome title="About">
      <div className="px-4 md:px-0 pt-3 md:pt-10">
        <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
          About RentAcross
        </div>
        <h1 className="text-[34px] md:text-[56px] lg:text-[72px] font-extrabold tracking-tight-lg lg:tracking-tight-2xl leading-[1] text-ink mt-1.5 md:max-w-3xl">
          Pro gear for
          <br />
          <span className="bg-gradient-to-r from-accent via-accent to-ink bg-clip-text text-transparent">
            everyone&apos;s story.
          </span>
        </h1>
        <p className="text-[14px] md:text-[18px] text-ink-secondary mt-3 md:mt-5 leading-relaxed md:max-w-xl">
          Everyone deserves access to the tools they need to tell their
          story — through stunning photography or captivating video. Our
          mission is simple: make high-quality gear accessible, affordable
          and available to creators of every kind.
        </p>
      </div>

      <section className="mt-6 md:mt-10 px-4 md:px-0">
        <div className="bg-ink rounded-[20px] overflow-hidden md:grid md:grid-cols-2">
          <div className="relative aspect-[1.6/1] md:aspect-auto md:min-h-[280px] bg-surface-muted">
            <Image
              src="/assets/v2/img/about-us-image.png"
              alt="A creator with a camera"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <div className="text-[11px] uppercase tracking-kicker font-bold text-accent">
              Our mission
            </div>
            <p className="text-[15px] text-surface mt-2 leading-relaxed">
              Bridge the gap between creativity and resources. Empower
              individuals to capture life&apos;s best moments with
              professional-grade gear at affordable prices.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 md:mt-10 px-4 md:px-0 md:max-w-2xl">
        <div className="text-[11px] uppercase tracking-kicker font-extrabold text-ink-secondary">
          Our vision
        </div>
        <p className="text-[15px] md:text-[17px] text-ink-secondary mt-2 leading-relaxed">
          To build a vibrant creative community — inspired by resilience,
          innovation, and a love for exploration. RentAcross strives to be
          the go-to platform for storytellers, helping them turn fleeting
          moments into lasting memories.
        </p>
      </section>

      <section className="mt-6 md:mt-10 px-4 md:px-0 grid grid-cols-3 gap-2 md:gap-4">
        {[
          {value: '1,500+', label: 'rentals fulfilled'},
          {value: '24h', label: 'avg fulfillment'},
          {value: '4.9★', label: 'customer rating'},
        ].map(s => (
          <div
            key={s.label}
            className="rounded-[14px] border border-line-soft bg-surface p-3 md:p-6 text-center"
          >
            <div className="font-mono text-[18px] md:text-[28px] font-extrabold text-ink">
              {s.value}
            </div>
            <div className="text-[10px] md:text-[12px] uppercase tracking-kicker font-bold text-ink-muted mt-1 leading-tight">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 md:mt-12 px-4 md:px-0 md:max-w-md">
        <Link
          href="/"
          className="block w-full text-center bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 no-underline"
        >
          Browse the catalog →
        </Link>
      </section>
    </MarketingChrome>
  )
}
