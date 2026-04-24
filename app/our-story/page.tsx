import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MarketingChrome from '../components/redesign/MarketingChrome'

export const metadata = {
  title: 'Our story — RentAcross',
  description:
    'How RentAcross began — from a traveler with a question to a platform that puts pro photography gear in everyone\'s hands.',
}

export default function Page() {
  return (
    <MarketingChrome title="Our story">
      <div className="px-4 md:px-0 pt-3 md:pt-10">
        <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
          How we got here
        </div>
        <h1 className="text-[34px] md:text-[56px] lg:text-[72px] font-extrabold tracking-tight-lg lg:tracking-tight-2xl leading-[1] text-ink mt-1.5">
          A traveler,
          <br />
          <span className="bg-gradient-to-r from-accent via-accent to-ink bg-clip-text text-transparent">
            a question.
          </span>
        </h1>
      </div>

      <article className="px-4 md:px-0 mt-5 md:mt-8 space-y-4 text-[15px] md:text-[17px] text-ink-secondary leading-relaxed md:max-w-2xl">
        <p>
          Every great picture tells a story. So does RentAcross. It began
          with a traveler, a tech enthusiast, and a dreamer — someone who
          grew up in a farming family, learning the value of hard work,
          resilience, and the beauty of simplicity.
        </p>
        <p>
          Armed with a love for technology and a passion for exploring,
          our founder noticed something during their travels: great
          moments deserve great gear, but not everyone can afford it.
          <span className="text-ink font-semibold">
            {' '}Why should creativity be limited by cost?
          </span>
        </p>
      </article>

      <section className="mt-6 md:mt-10 px-4 md:px-0">
        <div className="relative w-full aspect-[1.6/1] md:aspect-[2.4/1] rounded-[20px] overflow-hidden bg-surface-muted">
          <Image
            src="/assets/v2/img/our-story-lake.jpeg"
            alt="A still lake at golden hour"
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
          />
        </div>
      </section>

      <article className="px-4 md:px-0 mt-6 md:mt-10 space-y-4 text-[15px] md:text-[17px] text-ink-secondary leading-relaxed md:max-w-2xl">
        <p>
          That question sparked an idea. With a vision to empower
          photographers, storytellers and adventurers, RentAcross was
          born — a bridge between creators and the kit they need.
        </p>
        <p>
          A student practicing photography, a traveler capturing their
          journey, a professional perfecting their craft — all should be
          able to access the best tools without the price tag.
        </p>
      </article>

      <section className="mt-6 md:mt-10 px-4 md:px-0 md:max-w-3xl">
        <div className="bg-ink rounded-[20px] p-5 md:p-8">
          <div className="text-[11px] md:text-[12px] uppercase tracking-kicker font-bold text-accent">
            Join us
          </div>
          <p className="text-[15px] md:text-[18px] text-surface mt-2 md:mt-3 leading-relaxed">
            We don&apos;t just provide gear. We provide opportunities to
            create, share, and grow. Whether you&apos;re on an epic
            adventure or learning the ropes, we&apos;re here for every
            step.
          </p>
        </div>
      </section>

      <section className="mt-8 md:mt-12 px-4 md:px-0 md:max-w-md">
        <Link
          href="/"
          className="block w-full text-center bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 no-underline"
        >
          Start your story →
        </Link>
      </section>
    </MarketingChrome>
  )
}
