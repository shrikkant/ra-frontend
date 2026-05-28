import React from 'react'
import Link from 'next/link'

const InstagramIcon = ({size = 18}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)

const YoutubeIcon = ({size = 18}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M21.6 7.2c-.2-1.4-1.3-2.5-2.7-2.7C16.8 4.2 12 4.2 12 4.2s-4.8 0-6.9.3C3.7 4.7 2.6 5.8 2.4 7.2 2.1 9.3 2.1 12 2.1 12s0 2.7.3 4.8c.2 1.4 1.3 2.5 2.7 2.7 2.1.3 6.9.3 6.9.3s4.8 0 6.9-.3c1.4-.2 2.5-1.3 2.7-2.7.3-2.1.3-4.8.3-4.8s0-2.7-.3-4.8zM10 15.3V8.7l5.5 3.3-5.5 3.3z" />
  </svg>
)

const WhatsappIcon = ({size = 18}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.5-.4zM12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.3 1.2 4.7L2 22l5.4-1.4c1.4.7 2.9 1.1 4.6 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.5 0-3-.4-4.2-1.1l-.3-.2-3.2.8.9-3.1-.2-.3C4.3 15.1 4 13.6 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8.3-8 8.3z" />
  </svg>
)

const MailIcon = ({size = 18}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

const CITY_LINKS = [
  {label: 'Pune', href: '/pune/rent-camera'},
  {label: 'Mumbai', href: '/mumbai/rent-camera'},
  {label: 'Bangalore', href: '/bangalore/rent-camera'},
  {label: 'Nashik', href: '/nashik/rent-camera'},
]

const COMPANY_LINKS = [
  {label: 'About', href: '/about-us'},
  {label: 'Why us', href: '/why-us'},
  {label: 'Blog', href: '/blog'},
]

const HELP_LINKS = [
  {label: 'How it works', href: '/pune/rent-camera#how-it-works'},
  {label: 'FAQs', href: '/pune/rent-camera#faqs'},
  {label: 'Help center', href: '/help'},
]

const LEGAL_LINKS = [
  {label: 'Terms & conditions', href: '/terms-of-use'},
  {label: 'Privacy policy', href: '/privacy-policy'},
  {label: 'Rental agreement', href: '/rental-agreement'},
]

// Redesign footer. Server-rendered for SEO + zero hydration cost, sits inside
// MobileChrome under the page content. Mirrors the link set the old footer
// carried (About, Why Us, How it Works, FAQs, T&C, Privacy, Contact, Email)
// but in the cleaner monochrome aesthetic of the 2026 redesign.
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface text-ink">
      <div className="max-w-7xl mx-auto px-5 md:px-6 pt-10 md:pt-14 pb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 no-underline text-ink"
              aria-label="RentAcross home"
            >
              <span
                aria-hidden
                className="w-10 h-10 rounded-[10px] bg-ink text-surface flex items-center justify-center font-extrabold text-[17px] tracking-tight-lg"
              >
                <span className="text-accent">R</span>A
              </span>
              <span className="text-[18px] font-extrabold tracking-tight-md">
                RentAcross
              </span>
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-secondary">
              Camera, lens and lighting gear rentals — delivered to your door
              across Pune, Mumbai, Bangalore and Nashik. 4.9 average across 265+
              reviews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/rent_across"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-line bg-surface flex items-center justify-center text-ink hover:bg-surface-muted"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.youtube.com/@rentacross"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="w-10 h-10 rounded-full border border-line bg-surface flex items-center justify-center text-ink hover:bg-surface-muted"
            >
              <YoutubeIcon />
            </a>
            <a
              href="https://wa.me/7720829444?text=Hello%20I%20need%20support"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full border border-line bg-surface flex items-center justify-center text-ink hover:bg-surface-muted"
            >
              <WhatsappIcon />
            </a>
            <a
              href="mailto:support@rentacross.com"
              aria-label="Email"
              className="w-10 h-10 rounded-full border border-line bg-surface flex items-center justify-center text-ink hover:bg-surface-muted"
            >
              <MailIcon />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Help" links={HELP_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
          <div>
            <div className="text-[10px] uppercase tracking-kicker font-bold text-ink-muted mb-3">
              Contact
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:support@rentacross.com"
                  className="text-[13px] font-semibold text-ink no-underline hover:underline break-all"
                >
                  support@rentacross.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917720829444"
                  className="text-[13px] font-semibold text-ink no-underline hover:underline"
                >
                  +91 77208 29444
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line pt-6 mb-6">
          <div className="text-[10px] uppercase tracking-kicker font-bold text-ink-muted mb-3">
            Cities we deliver to
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {CITY_LINKS.map(c => (
              <Link
                key={c.href}
                href={c.href}
                className="text-[13px] font-semibold text-ink-secondary hover:text-ink no-underline"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[12px] text-ink-muted">
          <div>© {year} RentAcross™. All rights reserved.</div>
          <div>
            Protected by reCAPTCHA — Google{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-ink"
            >
              Privacy
            </a>{' '}
            &{' '}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-ink"
            >
              Terms
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: {label: string; href: string}[]
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-kicker font-bold text-ink-muted mb-3">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map(l => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[13px] font-semibold text-ink-secondary hover:text-ink no-underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
