import React from 'react'

interface JsonLdProps {
  data: object | object[]
}

/**
 * Safe JSON-LD renderer.
 *
 * Escapes all characters that could break out of a <script> context:
 *   <  → \u003c  (prevents </script> breakout and <!-- comments)
 *   >  → \u003e  (defense in depth)
 *   &  → \u0026  (prevents HTML entity reinterpretation)
 *   \u2028 / \u2029 → escaped (JS line/paragraph separators)
 *
 * This matches the OWASP recommendation and what Next.js uses internally.
 */
function safeJsonStringify(obj: object): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function JsonLd({data}: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: safeJsonStringify(schema)}}
        />
      ))}
    </>
  )
}
