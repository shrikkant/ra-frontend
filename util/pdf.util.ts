/**
 * Opens a PDF URL in a new window with proper handling for data URLs
 * @param pdfUrl - The PDF URL (can be data URL or regular URL)
 * @param filename - Optional filename for download fallback
 */
export const openPdfInNewWindow = (pdfUrl: string, filename = 'document.pdf'): void => {
  if (!pdfUrl) return

  // If it's a data URL, convert it to a blob URL for better compatibility
  if (pdfUrl.startsWith('data:')) {
    // Convert data URL to blob
    fetch(pdfUrl)
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob)
        const newWindow = window.open(blobUrl, '_blank')

        // Clean up the blob URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl)
        }, 1000)

        // If window didn't open, try fallback
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === 'undefined'
        ) {
          // Create download link as fallback
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = filename
          link.click()
        }
      })
      .catch(err => {
        console.error('Failed to open PDF:', err)
        // Fallback: try opening data URL directly
        window.open(pdfUrl, '_blank')
      })
  } else {
    // Regular URL, open directly
    window.open(pdfUrl, '_blank')
  }
}