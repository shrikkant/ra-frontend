import {getPlaiceholder} from 'plaiceholder'

export async function getBlurDataURL(imageUrl: string): Promise<string> {
  try {
    // Fetch the image buffer
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate blur placeholder
    const {base64} = await getPlaiceholder(buffer)
    return base64
  } catch (error) {
    console.error('Error generating blur placeholder:', error)
    // Fallback to a generic shimmer placeholder
    return `data:image/svg+xml;base64,${toBase64(shimmer(10, 10))}`
  }
}

// Shimmer and toBase64 utility functions from previous example
function shimmer(w: number, h: number) {
  return `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`
}

function toBase64(str: string) {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)
}
