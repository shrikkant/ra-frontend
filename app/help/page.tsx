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
  )) as IBlog[] | null | undefined
  const list = Array.isArray(articles) ? articles : []

  return (
    <MarketingChrome title="Help & support">
      <div className="px-4 pt-3">
        <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
          Help center
        </div>
        <h1 className="text-[28px] font-extrabold tracking-tight-lg leading-tight text-ink mt-1.5">
          What can we help with?
        </h1>
        <p className="text-[14px] text-ink-secondary mt-2 leading-relaxed">
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
        <div className="px-4 mt-6 text-[13px] text-ink-muted">
          No help articles yet — please reach out via WhatsApp.
        </div>
      ) : (
        <ul className="mx-4 mt-6 bg-surface rounded-[18px] border border-line-soft divide-y divide-line-soft">
          {list.map(article => (
            <li key={article._id}>
              <Link
                href={`/help/${article.slug.current}`}
                className="flex items-start gap-3 px-4 py-3.5 no-underline"
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
