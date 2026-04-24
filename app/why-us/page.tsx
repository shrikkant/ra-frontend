import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MarketingChrome from '../components/redesign/MarketingChrome'
import {CheckIcon} from '../components/redesign/icons'

export const metadata = {
  title: 'Why RentAcross — pro gear, zero deposit, doorstep delivery',
  description:
    'Premium photography gear, affordable rates, community-first service. Why creators in Pune choose RentAcross.',
}

const REASONS = [
  {
    title: 'Premium gear for all',
    body: 'Cameras, lenses, lighting and accessories curated for professionals, hobbyists, and learners.',
  },
  {
    title: 'Affordable rates',
    body: 'We prioritize accessibility — quality should not come with a high price tag.',
  },
  {
    title: 'Community-oriented',
    body: 'More than a rental service: a growing network of creators who inspire and support each other.',
  },
  {
    title: 'For the dreamers',
    body: 'Travelers, students, professionals — whoever you are, whatever you shoot, we are here for it.',
  },
]

export default function Page() {
  return (
    <MarketingChrome title="Why us">
      <div className="md:grid md:grid-cols-2 md:gap-10 md:items-end md:pt-10">
        <div className="px-4 md:px-0 pt-3 md:pt-0">
          <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
            Why creators choose us
          </div>
          <h1 className="text-[34px] md:text-[56px] lg:text-[64px] font-extrabold tracking-tight-lg lg:tracking-tight-2xl leading-[1] text-ink mt-1.5">
            Built for the
            <br />
            <span className="bg-gradient-to-r from-accent via-accent to-ink bg-clip-text text-transparent">
              way you shoot.
            </span>
          </h1>
        </div>

        <section className="mt-5 md:mt-0 px-4 md:px-0">
          <div className="relative w-full aspect-[1.6/1] rounded-[20px] overflow-hidden bg-surface-muted">
            <Image
              src="/assets/v2/img/why-us-image.png"
              alt="Creators sharing camera equipment"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          </div>
        </section>
      </div>

      <ul className="mt-6 md:mt-10 px-4 md:px-0 space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
        {REASONS.map(r => (
          <li
            key={r.title}
            className="flex items-start gap-3 bg-surface border border-line-soft rounded-[14px] p-4"
          >
            <span
              aria-hidden
              className="w-7 h-7 rounded-full bg-accent text-ink flex items-center justify-center shrink-0"
            >
              <CheckIcon size={16} strokeWidth={3} />
            </span>
            <div>
              <div className="text-[14px] font-extrabold text-ink">
                {r.title}
              </div>
              <div className="text-[13px] text-ink-secondary mt-0.5 leading-relaxed">
                {r.body}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-8 md:mt-12 px-4 md:px-0 md:max-w-md">
        <Link
          href="/"
          className="block w-full text-center bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 no-underline"
        >
          Start renting →
        </Link>
      </section>
    </MarketingChrome>
  )
}
