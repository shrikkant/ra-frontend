import {fetchBlogBySlug} from '../../../api/blog/blog.api'
import {sanitizeHtml} from '../../../util/sanitize'
import MarketingChrome from '../../components/redesign/MarketingChrome'

export const revalidate = 3600

interface PageProps {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: PageProps) {
  const {slug} = await params
  try {
    const blog = await fetchBlogBySlug(slug)
    return {
      title: `${blog?.title ?? 'Help'} — RentAcross`,
    }
  } catch {
    return {title: 'Help article — RentAcross'}
  }
}

export default async function HelpArticle({params}: PageProps) {
  const {slug} = await params
  const blog = await fetchBlogBySlug(slug)

  if (!blog) {
    return (
      <MarketingChrome title="Article not found">
        <div className="px-4 pt-6 text-[14px] text-ink-muted">
          We couldn&apos;t find this article.
        </div>
      </MarketingChrome>
    )
  }

  return (
    <MarketingChrome title="Help">
      <article className="px-4 md:px-0 pt-3 md:pt-10 mx-auto max-w-prose lg:max-w-3xl">
        <h1 className="text-[28px] md:text-[40px] font-extrabold tracking-tight-lg md:tracking-tight-2xl leading-[1.05] text-ink">
          {blog.title}
        </h1>
        <div
          className="prose prose-sm md:prose-base mt-4 md:mt-6 max-w-none text-ink-secondary leading-relaxed [&_h2]:text-ink [&_h2]:font-extrabold [&_h2]:text-[18px] md:[&_h2]:text-[22px] [&_h2]:mt-6 [&_h3]:font-bold [&_h3]:text-ink [&_h3]:text-[15px] md:[&_h3]:text-[18px] [&_h3]:mt-5 [&_a]:font-bold [&_a]:text-ink [&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1 [&_p]:my-3"
          dangerouslySetInnerHTML={{__html: sanitizeHtml(blog.content ?? '')}}
        />
      </article>
    </MarketingChrome>
  )
}
