import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML from CMS or API sources before rendering via dangerouslySetInnerHTML.
 * Strips scripts, event handlers, and other XSS vectors while preserving safe markup.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'a', 'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins',
      'blockquote', 'pre', 'code',
      'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'section', 'article',
      'video', 'source', 'iframe',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
      'class', 'id', 'style',
      'type', 'controls', 'autoplay', 'loop', 'muted',
      'frameborder', 'allowfullscreen', 'allow',
      'loading', 'decoding',
    ],
    ALLOW_DATA_ATTR: false,
  })
}
