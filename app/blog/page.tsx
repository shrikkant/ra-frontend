import Link from 'next/link'
import Image from 'next/image'
import {client} from '../../sanity/client'
import {type SanityDocument} from 'next-sanity'
import {Metadata} from 'next'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {JsonLd} from '../../components/seo/JsonLd'
import MarketingChrome from '../components/redesign/MarketingChrome'

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc){
  _id,
  title,
  slug,
  short_desc,
  publishedAt,
  image,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "excerpt": pt::text(short_desc)[0...150],
  categories[]->{ title, slug }
}`

const {projectId, dataset} = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({projectId, dataset}).image(source)
    : null

export const metadata: Metadata = {
  title: 'Photography & Camera Rental Blog | RentAcross',
  description:
    'Expert photography tips, camera reviews and rental guides from the RentAcross team.',
  alternates: {canonical: '/blog'},
}

const blogStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'RentAcross Photography Blog',
  description: 'Expert photography tips, camera gear guides, and rental advice',
  url: 'https://rentacross.com/blog',
  publisher: {
    '@type': 'Organization',
    name: 'RentAcross',
    logo: {
      '@type': 'ImageObject',
      url: 'https://rentacross.com/logo.png',
    },
  },
}

const fmtDate = (d?: string) => {
  if (!d) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(d))
}

export default async function BlogPage() {
  const posts = await client.fetch<SanityDocument[]>(
    POSTS_QUERY,
    {},
    {next: {revalidate: 3600}},
  )
  const all = (posts ?? []) as any[]
  const featured = all[0]
  const rest = all.slice(1)

  return (
    <>
      <JsonLd data={blogStructuredData} />
      <MarketingChrome title="Blog">
        <div className="px-4 md:px-0 pt-3 md:pt-10">
          <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
            From the studio
          </div>
          <h1 className="text-[28px] md:text-[44px] lg:text-[56px] font-extrabold tracking-tight-lg lg:tracking-tight-2xl leading-tight text-ink mt-1.5">
            Stories, tips & gear
          </h1>
        </div>

        {featured && <FeaturedCard post={featured} />}

        {rest.length > 0 && (
          <ul className="px-4 md:px-0 mt-5 md:mt-8 space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
            {rest.map(post => (
              <li key={post._id}>
                <PostRow post={post} />
              </li>
            ))}
          </ul>
        )}
      </MarketingChrome>
    </>
  )
}

function FeaturedCard({post}: {post: any}) {
  const img = post.image
    ? urlFor(post.image)?.width(800).height(450).quality(85).url()
    : null
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="block mx-4 md:mx-0 mt-5 md:mt-8 rounded-[20px] bg-surface border border-line-soft overflow-hidden no-underline md:grid md:grid-cols-2 md:items-center"
    >
      {img && (
        <div className="relative w-full aspect-[1.78/1] md:aspect-[1.2/1] bg-surface-muted">
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="text-[11px] uppercase tracking-kicker font-bold text-accent">
          Featured
        </div>
        <div className="text-[18px] font-extrabold text-ink leading-tight mt-1">
          {post.title}
        </div>
        {(post as any).excerpt && (
          <p className="text-[13px] text-ink-secondary mt-1.5 leading-snug line-clamp-2">
            {(post as any).excerpt}
          </p>
        )}
        <div className="font-mono text-[11px] text-ink-muted mt-2">
          {fmtDate(post.publishedAt)}
          {(post as any).estimatedReadingTime ? (
            <> · {(post as any).estimatedReadingTime} min read</>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

function PostRow({post}: {post: any}) {
  const img = post.image
    ? urlFor(post.image)?.width(192).height(192).quality(80).url()
    : null
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="flex gap-3 bg-surface border border-line-soft rounded-[14px] p-3 no-underline"
    >
      <div className="relative w-20 h-20 rounded-[10px] bg-surface-muted shrink-0 overflow-hidden">
        {img && (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-extrabold text-ink leading-snug line-clamp-2">
          {post.title}
        </div>
        <div className="font-mono text-[11px] text-ink-muted mt-1.5">
          {fmtDate(post.publishedAt)}
        </div>
      </div>
    </Link>
  )
}
