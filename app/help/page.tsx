import Link from 'next/link'
import {PortableText} from 'next-sanity'
import {fetchBlogsServer} from '../../api/blog/blog.api'
import {ARTICLE_TYPES} from '../../config/constants'
import {IBlog} from '../../app-store/app-defaults/types'
import MarketingChrome from '../components/redesign/MarketingChrome'
import {ChevronRightIcon} from '../components/redesign/icons'

export const revalidate = 3600

export const metadata = {
  title: 'Help & support — RentAcross',
  description:
    'Answers, how-to articles and troubleshooting for renting cameras, lenses and lighting on RentAcross.',
}

export default async function HelpPage() {
  const articles = (await fetchBlogsServer(
    1,
    20,
    ARTICLE_TYPES.HELP_ARTICLE,
  ).catch(error => {
    console.warn('Help: articles fetch failed', error)
    return null
  })) as IBlog[] | null | undefined
  const list = Array.isArray(articles) ? articles : []

  return (
    <MarketingChrome title="Help & support">
      <div className="px-4 md:px-0 pt-3 md:pt-10">
        <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
          Help center
        </div>
        <h1 className="text-[28px] md:text-[44px] lg:text-[56px] font-extrabold tracking-tight-lg lg:tracking-tight-2xl leading-tight text-ink mt-1.5">
          What can we help with?
        </h1>
        <p className="text-[14px] md:text-[16px] text-ink-secondary mt-2 md:mt-4 leading-relaxed md:max-w-2xl">
          Browse common questions, or message us on WhatsApp at{' '}
          <a
            href="https://wa.me/917720829444"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-ink no-underline"
          >
            +91 77208 29444
          </a>
          .
        </p>
      </div>

      {list.length === 0 ? (
        <div className="px-4 md:px-0 mt-6 text-[13px] text-ink-muted">
          No help articles yet — please reach out via WhatsApp.
        </div>
      ) : (
        <ul className="mx-4 md:mx-0 mt-6 md:mt-8 bg-surface rounded-[18px] border border-line-soft divide-y divide-line-soft md:divide-y-0 md:divide-x-0 md:bg-transparent md:border-0 md:grid md:grid-cols-2 md:gap-4">
          {list.map(article => (
            <li key={article._id}>
              <Link
                href={`/help/${article.slug.current}`}
                className="flex items-start gap-3 px-4 py-3.5 md:bg-surface md:border md:border-line-soft md:rounded-[14px] md:p-5 md:hover:shadow-card-hover md:transition-shadow no-underline"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-ink leading-tight line-clamp-2">
                    {article.title}
                  </div>
                  {Array.isArray(article.short_desc) && (
                    <div className="text-[12px] text-ink-muted mt-1 leading-snug line-clamp-2">
                      <PortableText value={article.short_desc} />
                    </div>
                  )}
                </div>
                <ChevronRightIcon
                  size={16}
                  className="text-ink-subtle shrink-0 mt-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </MarketingChrome>
  )
}
