import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js with proper worker setup
export const configurePdfJs = () => {
  if (typeof window !== 'undefined') {
    // Force a specific version to avoid mismatches
    const PDFJS_VERSION = '3.11.174'
    
    // Set worker source with fallbacks
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`
    } catch (error) {
      console.warn('Failed to set primary worker source, trying fallback')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`
    }
    
    console.log('PDF.js configured with version:', PDFJS_VERSION)
  }
}

// Default PDF loading options
export const getDefaultPdfOptions = () => ({
  useSystemFonts: false,
  disableFontFace: true,
  enableXfa: false,
  useWorkerFetch: false,
  isEvalSupported: false,
  disableRange: false,
  disableStream: false,
  disableAutoFetch: false
})

// Enhanced rendering options for better card detection
export const getRenderingOptions = (scale: number = 3) => ({
  scale,
  enableWebGL: false,
  renderInteractiveForms: false,
  intent: 'print' as const,
  annotationMode: 0, // Disable annotations
  textLayerMode: 0, // Disable text layer for pure image extraction
})
