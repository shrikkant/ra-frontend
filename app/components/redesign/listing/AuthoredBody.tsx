'use client'
import React from 'react'
import {PortableText, type PortableTextComponents} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {client} from '../../../../sanity/client'

const {projectId, dataset} = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({projectId, dataset}).image(source)
    : null

const components: PortableTextComponents = {
  block: {
    h2: ({children}) => (
      <h2 className="text-[20px] lg:text-[26px] font-extrabold tracking-tight-md text-ink mt-10 mb-3">
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="text-[17px] lg:text-[20px] font-extrabold text-ink mt-7 mb-2">
        {children}
      </h3>
    ),
    h4: ({children}) => (
      <h4 className="text-[15px] font-extrabold text-ink mt-5 mb-2">
        {children}
      </h4>
    ),
    normal: ({children}) => (
      <p className="text-[14px] lg:text-[15px] leading-relaxed text-ink-secondary mb-4 max-w-3xl">
        {children}
      </p>
    ),
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-accent pl-4 italic text-ink-secondary my-5 max-w-3xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="list-disc pl-6 mb-4 text-[14px] lg:text-[15px] text-ink-secondary max-w-3xl space-y-1.5">
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="list-decimal pl-6 mb-4 text-[14px] lg:text-[15px] text-ink-secondary max-w-3xl space-y-1.5">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode
      value?: {href?: string}
    }) => {
      const href = value?.href || ''
      const ext = href.startsWith('http')
      return (
        <a
          href={href}
          className="text-accent underline-offset-2 hover:underline"
          {...(ext ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({
      value,
    }: {
      value: SanityImageSource & {alt?: string; caption?: string}
    }) => {
      const url = urlFor(value)?.width(1200).quality(85).url()
      if (!url) return null
      return (
        <figure className="my-6 max-w-3xl">
          <img
            src={url}
            alt={value?.alt ?? ''}
            className="block rounded-2xl shadow-lg w-full h-auto"
          />
          {value?.caption && (
            <figcaption className="mt-2 text-[12px] text-ink-muted italic text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export default function AuthoredBody({body}: {body: any[] | undefined}) {
  if (!Array.isArray(body) || body.length === 0) return null
  return (
    <section className="px-4 lg:px-0 mt-2 lg:mt-4 mb-2">
      <PortableText value={body} components={components} />
    </section>
  )
}
