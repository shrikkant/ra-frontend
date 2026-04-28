import { randomBytes } from 'crypto'

const k = () => randomBytes(6).toString('hex')

export const span = (text, marks = []) => ({ _key: k(), _type: 'span', marks, text })
export const em = (text) => span(text, ['em'])
export const strong = (text) => span(text, ['strong'])
export const code = (text) => span(text, ['code'])

export const link = (href, text) => ({ __link: true, href, text })

const toChild = (c) => {
  if (c == null) return null
  if (typeof c === 'string') return span(c)
  if (c.__link) return c
  return c
}

const buildBlock = (style, children, extra = {}) => {
  const markDefs = []
  const finalChildren = []
  for (const raw of children) {
    const c = toChild(raw)
    if (!c) continue
    if (c.__link) {
      const id = k()
      markDefs.push({ _key: id, _type: 'link', href: c.href })
      const inner = Array.isArray(c.text) ? c.text : [c.text]
      for (const t of inner) {
        const s = typeof t === 'string' ? span(t) : t
        finalChildren.push({ ...s, marks: [...(s.marks || []), id] })
      }
    } else {
      finalChildren.push(c)
    }
  }
  return { _key: k(), _type: 'block', style, markDefs, children: finalChildren, ...extra }
}

export const p = (...children) => buildBlock('normal', children)
export const h2 = (...children) => buildBlock('h2', children)
export const h3 = (...children) => buildBlock('h3', children)
export const h4 = (...children) => buildBlock('h4', children)
export const quote = (...children) => buildBlock('blockquote', children)

export const bullet = (...children) =>
  buildBlock('normal', children, { listItem: 'bullet', level: 1 })
export const numbered = (...children) =>
  buildBlock('normal', children, { listItem: 'number', level: 1 })

// Inline image block. `imgRef` is the resolved object from publish.mjs:
//   { assetId, photographer, photoUrl, sourceUrl }
// `caption` defaults to a Pexels attribution if the imgRef came from Pexels.
export const image = (imgRef, alt, caption) => ({
  _key: k(),
  _type: 'image',
  asset: { _type: 'reference', _ref: imgRef.assetId },
  alt,
  caption:
    caption ??
    (imgRef.photographer ? `Photo by ${imgRef.photographer} on Pexels` : undefined),
})
