import React, { useState, useRef, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Upload,
  Download,
  FileText,
  Scissors,
  Eye,
  Loader2,
  CreditCard,
  RotateCcw,
  ZoomIn,
  Lock,
  Key
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useToast } from "@/components/ui/use-toast"
import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { configurePdfJs, getDefaultPdfOptions } from '@/utils/pdfConfig'

// Configure PDF.js on component load
configurePdfJs()

interface AadhaarCardData {
  frontImage: string
  backImage: string
  originalPage: number
  phoneNumber?: string // Add optional phone number
}

export function PdfProcessor() {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aadhaarCards, setAadhaarCards] = useState<AadhaarCardData[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [password, setPassword] = useState('')
  const [needsPassword, setNeedsPassword] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [copies, setCopies] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Aadhaar card dimensions (in mm) - standard size
  const AADHAAR_DIMENSIONS = {
    width: 85.6, // 3.37 inches
    height: 53.98, // 2.125 inches
  }

  // Add A4 dimensions (in points - PDF uses 72 points per inch)
  const A4_DIMENSIONS = {
    width: 595.28,  // 210mm in points
    height: 841.89, // 297mm in points
    margin: 40      // margin in points
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive"
        })
        return
      }
      setSelectedPdf(file)
      // Reset processed files and password states
      setAadhaarCards([])
      setPreviewImages([])
      setSelectedCardIndex(null)
      setPassword('')
      setNeedsPassword(false)
      setIsPasswordProtected(false)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const extractTextFromPage = async (page: any): Promise<string> => {
    const textContent = await page.getTextContent()
    return textContent.items
      .map((item: any) => item.str)
      .join(' ')
      .toLowerCase()
  }

  const isAadhaarPage = (text: string): boolean => {
    const aadhaarKeywords = [
      'आधार',
      'aadhaar',
      'government of india',
      'unique identification authority of india',
      'uidai',
      'भारत सरकार'
    ]
    return aadhaarKeywords.some(keyword => text.includes(keyword))
  }

  const renderPageToCanvas = async (page: any, scale: number = 4): Promise<string> => { // Increased scale from 2 to 4
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    
    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }

    await page.render(renderContext).promise
    return canvas.toDataURL('image/png')
  }

  const extractAadhaarFromPage = async (pageImage: string, pageNumber: number): Promise<AadhaarCardData | null> => {
    try {
      // Create a canvas to work with the image
      const img = new Image()
      await new Promise((resolve) => {
        img.onload = resolve
        img.src = pageImage
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Use PDF-lib based cropping for more precise extraction
      const frontImage = await extractFrontCard(canvas)
      const backImage = await extractBackCard(canvas)

      return {
        frontImage,
        backImage,
        originalPage: pageNumber
      }
    } catch (error) {
      console.error('Error extracting Aadhaar from page:', error)
      return null
    }
  }

  // Extract front card (left side) using PDF-lib inspired cropping
  const extractFrontCard = async (sourceCanvas: HTMLCanvasElement): Promise<string> => {
    const { width, height } = sourceCanvas
    
    // Crop from bottom portion where Aadhaar cards are located
    // Adjusted to crop from bottom 60% of the page
    const cropX = width / 11
    const cropY = height * 0.725 // Start from 40% down (bottom 60%)
    const cropWidth = (2 * width) / 5
    const cropHeight = height / 5

    const frontCanvas = document.createElement('canvas')
    const frontCtx = frontCanvas.getContext('2d')!
    
    frontCanvas.width = cropWidth
    frontCanvas.height = cropHeight
    
    // Draw the cropped region
    frontCtx.drawImage(
      sourceCanvas,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    )
    
    return frontCanvas.toDataURL('image/png')
  }

  // Extract back card (right side) using PDF-lib inspired cropping  
  const extractBackCard = async (sourceCanvas: HTMLCanvasElement): Promise<string> => {
    const { width, height } = sourceCanvas
    
    // Crop from bottom portion where Aadhaar cards are located
    // Adjusted to crop from bottom 60% of the page
    const cropX = width / 1.97
    const cropY = height * 0.725 // Start from 40% down (bottom 60%)
    const cropWidth = (3.6 * width) / 9
    const cropHeight = height / 5

    const backCanvas = document.createElement('canvas')
    const backCtx = backCanvas.getContext('2d')!
    
    backCanvas.width = cropWidth
    backCanvas.height = cropHeight
    
    // Draw the cropped region
    backCtx.drawImage(
      sourceCanvas,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    )
    
    return backCanvas.toDataURL('image/png')
  }

  // Alternative method: Process PDF directly with PDF-lib for even more precise cropping
  const processPdfWithLibCropping = async (pdfBytes: ArrayBuffer): Promise<{ frontPdf: Uint8Array, backPdf: Uint8Array }> => {
    // Create front card PDF (left side cropping)
    const frontPdfDoc = await PDFDocument.load(pdfBytes)
    const frontPages = frontPdfDoc.getPages()
    
    frontPages.forEach((page) => {
      const { width, height } = page.getSize()
      // Front card cropping - adjusted to crop from bottom portion
      // Y coordinate adjusted to start from lower portion of page
      page.setCropBox(width/11, height * 0.4, 2*width/5, height/5.4)
    })
    
    const frontPdfBytes = await frontPdfDoc.save()

    // Create back card PDF (right side cropping)  
    const backPdfDoc = await PDFDocument.load(pdfBytes)
    const backPages = backPdfDoc.getPages()
    
    backPages.forEach((page) => {
      const { width, height } = page.getSize()
      // Back card cropping - adjusted to crop from bottom portion
      // Y coordinate adjusted to start from lower portion of page
      page.setCropBox(width/2, height * 0.4, 3.7*width/9, height/5.4)
    })
    
    const backPdfBytes = await backPdfDoc.save()

    return { frontPdf: frontPdfBytes, backPdf: backPdfBytes }
  }

  // Convert cropped PDF to image
  const convertCroppedPdfToImage = async (pdfBytes: Uint8Array): Promise<string> => {
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise
    const page = await pdf.getPage(1)
    
    const viewport = page.getViewport({ scale: 4 }) // Increased scale from 2 to 4
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    
    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }

    await page.render(renderContext).promise
    return canvas.toDataURL('image/png')
  }

  // Enhanced processing function that uses PDF-lib for precise cropping
  const processPdfEnhanced = async () => {
    if (!selectedPdf) {
      toast({
        title: "No PDF selected",
        description: "Please upload a PDF file first.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    
    try {
      const arrayBuffer = await selectedPdf.arrayBuffer()
      
      // Try to load the PDF with password if provided
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        password: password || undefined,
        ...getDefaultPdfOptions()
      })
      
      let pdf
      try {
        pdf = await loadingTask.promise
        setIsPasswordProtected(password ? true : false)
        setNeedsPassword(false)
        
        toast({
          title: "PDF loaded successfully",
          description: "Processing pages for Aadhaar cards...",
        })
      } catch (error: any) {
        console.error('PDF loading error:', error)
        
        // Handle version mismatch specifically
        if (error.message && error.message.includes('API version') && error.message.includes('Worker version')) {
          toast({
            title: "PDF Version Error",
            description: "There's a version mismatch with the PDF processor. Please refresh the page and try again.",
            variant: "destructive"
          })
          setIsProcessing(false)
          return
        }
        
        if (error.name === 'PasswordException') {
          setIsPasswordProtected(true)
          if (!password) {
            setNeedsPassword(true)
            toast({
              title: "Password Required",
              description: "This PDF is password-protected. Please enter the password.",
              variant: "destructive"
            })
            setIsProcessing(false)
            return
          } else {
            setNeedsPassword(true)
            toast({
              title: "Incorrect Password",
              description: "The password you entered is incorrect. Please try again.",
              variant: "destructive"
            })
            setIsProcessing(false)
            return
          }
        } else if (error.message && error.message.includes('Setting up fake worker failed')) {
          toast({
            title: "PDF Worker Error",
            description: "There was an issue with the PDF processing engine. Please refresh the page and try again.",
            variant: "destructive"
          })
          setIsProcessing(false)
          return
        }
        throw error
      }
      
      const extractedCards: AadhaarCardData[] = []
      const previews: string[] = []
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        
        // Extract text to check if it's an Aadhaar page
        const text = await extractTextFromPage(page)
        
        if (isAadhaarPage(text)) {
          // Method 1: Use PDF-lib for precise cropping
          try {
            const { frontPdf, backPdf } = await processPdfWithLibCropping(arrayBuffer)
            
            // Convert cropped PDFs to images
            const frontImage = await convertCroppedPdfToImage(frontPdf)
            const backImage = await convertCroppedPdfToImage(backPdf)
            
            // Render page to image for preview
            const pageImage = await renderPageToCanvas(page)
            previews.push(pageImage)
            
            extractedCards.push({
              frontImage,
              backImage,
              originalPage: pageNum
            })
          } catch (libError) {
            console.warn('PDF-lib cropping failed, falling back to canvas method:', libError)
            
            // Method 2: Fallback to canvas-based extraction
            const pageImage = await renderPageToCanvas(page)
            previews.push(pageImage)
            
            const aadhaarData = await extractAadhaarFromPage(pageImage, pageNum)
            if (aadhaarData) {
              extractedCards.push(aadhaarData)
            }
          }
        }
      }
      
      if (extractedCards.length === 0) {
        toast({
          title: "No Aadhaar cards found",
          description: "The PDF doesn't appear to contain any Aadhaar cards.",
          variant: "destructive"
        })
      } else {
        setAadhaarCards(extractedCards)
        setPreviewImages(previews)
        toast({
          title: "Aadhaar cards extracted successfully",
          description: `Found ${extractedCards.length} Aadhaar card(s) in the PDF.`,
        })
      }
    } catch (error: any) {
      console.error('Error processing PDF:', error)
      
      // Handle version mismatch in outer catch as well
      if (error.message && error.message.includes('API version') && error.message.includes('Worker version')) {
        toast({
          title: "PDF Engine Error",
          description: "There's a compatibility issue with the PDF processor. Please refresh the page and try again.",
          variant: "destructive"
        })
      } else if (error.name === 'PasswordException') {
        setIsPasswordProtected(true)
        setNeedsPassword(true)
        toast({
          title: "Password Required",
          description: "This PDF is password-protected. Please enter the password.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Processing failed",
          description: "An error occurred while processing the PDF. Please check if the file is corrupted or try refreshing the page.",
          variant: "destructive"
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Main processing function - rename the enhanced function to this
  const processPdf = async () => {
    if (!selectedPdf) {
      toast({
        title: "No PDF selected",
        description: "Please upload a PDF file first.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    
    try {
      const arrayBuffer = await selectedPdf.arrayBuffer()
      
      // Try to load the PDF with password if provided
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        password: password || undefined,
        ...getDefaultPdfOptions()
      })
      
      let pdf
      try {
        pdf = await loadingTask.promise
        setIsPasswordProtected(password ? true : false)
        setNeedsPassword(false)
        
        toast({
          title: "PDF loaded successfully",
          description: "Processing pages for Aadhaar cards...",
        })
      } catch (error: any) {
        console.error('PDF loading error:', error)
        
        // Handle version mismatch specifically
        if (error.message && error.message.includes('API version') && error.message.includes('Worker version')) {
          toast({
            title: "PDF Version Error",
            description: "There's a version mismatch with the PDF processor. Please refresh the page and try again.",
            variant: "destructive"
          })
          setIsProcessing(false)
          return
        }
        
        if (error.name === 'PasswordException') {
          setIsPasswordProtected(true)
          if (!password) {
            setNeedsPassword(true)
            toast({
              title: "Password Required",
              description: "This PDF is password-protected. Please enter the password.",
              variant: "destructive"
            })
            setIsProcessing(false)
            return
          } else {
            setNeedsPassword(true)
            toast({
              title: "Incorrect Password",
              description: "The password you entered is incorrect. Please try again.",
              variant: "destructive"
            })
            setIsProcessing(false)
            return
          }
        } else if (error.message && error.message.includes('Setting up fake worker failed')) {
          toast({
            title: "PDF Worker Error",
            description: "There was an issue with the PDF processing engine. Please refresh the page and try again.",
            variant: "destructive"
          })
          setIsProcessing(false)
          return
        }
        throw error
      }
      
      const extractedCards: AadhaarCardData[] = []
      const previews: string[] = []
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        
        // Extract text to check if it's an Aadhaar page
        const text = await extractTextFromPage(page)
        
        if (isAadhaarPage(text)) {
          // Method 1: Use PDF-lib for precise cropping
          try {
            const { frontPdf, backPdf } = await processPdfWithLibCropping(arrayBuffer)
            
            // Convert cropped PDFs to images
            const frontImage = await convertCroppedPdfToImage(frontPdf)
            const backImage = await convertCroppedPdfToImage(backPdf)
            
            // Render page to image for preview
            const pageImage = await renderPageToCanvas(page)
            previews.push(pageImage)
            
            extractedCards.push({
              frontImage,
              backImage,
              originalPage: pageNum
            })
          } catch (libError) {
            console.warn('PDF-lib cropping failed, falling back to canvas method:', libError)
            
            // Method 2: Fallback to canvas-based extraction
            const pageImage = await renderPageToCanvas(page)
            previews.push(pageImage)
            
            const aadhaarData = await extractAadhaarFromPage(pageImage, pageNum)
            if (aadhaarData) {
              extractedCards.push(aadhaarData)
            }
          }
        }
      }
      
      if (extractedCards.length === 0) {
        toast({
          title: "No Aadhaar cards found",
          description: "The PDF doesn't appear to contain any Aadhaar cards.",
          variant: "destructive"
        })
      } else {
        setAadhaarCards(extractedCards)
        setPreviewImages(previews)
        toast({
          title: "Aadhaar cards extracted successfully",
          description: `Found ${extractedCards.length} Aadhaar card(s) in the PDF.`,
        })
      }
    } catch (error: any) {
      console.error('Error processing PDF:', error)
      
      // Handle version mismatch in outer catch as well
      if (error.message && error.message.includes('API version') && error.message.includes('Worker version')) {
        toast({
          title: "PDF Engine Error",
          description: "There's a compatibility issue with the PDF processor. Please refresh the page and try again.",
          variant: "destructive"
        })
      } else if (error.name === 'PasswordException') {
        setIsPasswordProtected(true)
        setNeedsPassword(true)
        toast({
          title: "Password Required",
          description: "This PDF is password-protected. Please enter the password.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Processing failed",
          description: "An error occurred while processing the PDF. Please check if the file is corrupted or try refreshing the page.",
          variant: "destructive"
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Download PDF function
  const downloadPdf = async (pdfBytes: Uint8Array, filename: string) => {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Download started",
      description: `${filename} is being downloaded.`,
    })
  }

  // Convert canvas to PDF
  const canvasToPdf = async (canvas: HTMLCanvasElement, filename: string): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create()
    
    // Increase PNG quality
    const pngImageBytes = canvas.toDataURL('image/png', 1.0).split(',')[1]
    
    // Convert canvas to PNG bytes
    const binaryString = atob(pngImageBytes)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    const pngImage = await pdfDoc.embedPng(bytes)
    
    // Adjust dimensions for single card
    const margin = 40
    const availableWidth = A4_DIMENSIONS.width - (2 * margin)
    const availableHeight = A4_DIMENSIONS.height - (2 * margin)
    
    // Calculate scale ratio to fit card within margins while maintaining aspect ratio
    const scaleRatio = Math.min(
      availableWidth / AADHAAR_DIMENSIONS.width,
      availableHeight / AADHAAR_DIMENSIONS.height
    ) * 0.5 // Slightly reduce scale to ensure margins

    const cardWidth = AADHAAR_DIMENSIONS.width * scaleRatio
    const cardHeight = AADHAAR_DIMENSIONS.height * scaleRatio

    // Center card on page
    const x = (A4_DIMENSIONS.width - cardWidth) / 2
    const y = A4_DIMENSIONS.height - cardHeight - margin

    // Create single page for each copy
    for (let i = 0; i < copies; i++) {
      const page = pdfDoc.addPage([A4_DIMENSIONS.width, A4_DIMENSIONS.height])
      page.drawImage(pngImage, {
        x,
        y,
        width: cardWidth,
        height: cardHeight,
      })
    }
    
    return await pdfDoc.save()
  }

  // Update createCombinedPdf for top positioning of both cards
  const createCombinedPdf = async (frontCanvas: HTMLCanvasElement, backCanvas: HTMLCanvasElement): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    
    // Increase quality of PNG conversion
    const frontPngBytes = frontCanvas.toDataURL('image/png', 1.0).split(',')[1] // Added quality parameter
    const backPngBytes = backCanvas.toDataURL('image/png', 1.0).split(',')[1] // Added quality parameter
    
    // Convert base64 to Uint8Array for both images
    const frontBytes = Uint8Array.from(atob(frontPngBytes), c => c.charCodeAt(0))
    const backBytes = Uint8Array.from(atob(backPngBytes), c => c.charCodeAt(0))
    
    const frontImage = await pdfDoc.embedPng(frontBytes)
    const backImage = await pdfDoc.embedPng(backBytes)
    
    // Remove this line - don't create an initial page
    // const page = pdfDoc.addPage([A4_DIMENSIONS.width, A4_DIMENSIONS.height])
    
    const margin = 40
    const spacing = 20
    const columns = 2
    const maxRowsPerPage = 4 // Fixed to 4 copies per page
    
    // Calculate dimensions for centered layout
    const availableWidth = A4_DIMENSIONS.width - (2 * margin) - spacing
    const availableHeight = A4_DIMENSIONS.height - (2 * margin)
    
    const scaleRatio = Math.min(
      (availableWidth / 2) / AADHAAR_DIMENSIONS.width,
      (availableHeight / maxRowsPerPage) / AADHAAR_DIMENSIONS.height
    )

    const cardWidth = AADHAAR_DIMENSIONS.width * scaleRatio
    const cardHeight = AADHAAR_DIMENSIONS.height * scaleRatio

    // Center cards horizontally
    const startX = (A4_DIMENSIONS.width - ((cardWidth * 2) + spacing)) / 2

    // Calculate total pages needed
    const totalPages = Math.ceil(copies / maxRowsPerPage)

    // Create pages for all copies
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      const page = pdfDoc.addPage([A4_DIMENSIONS.width, A4_DIMENSIONS.height])
      
      // Calculate how many rows to draw on this page
      const startCopy = pageNum * maxRowsPerPage
      const endCopy = Math.min(startCopy + maxRowsPerPage, copies)
      const rowsOnThisPage = endCopy - startCopy

      // Draw cards on this page
      for (let row = 0; row < rowsOnThisPage; row++) {
        const y = A4_DIMENSIONS.height - ((row + 1) * cardHeight) - margin - (row * spacing)
        
        // Draw front card
        page.drawImage(frontImage, {
          x: startX,
          y,
          width: cardWidth,
          height: cardHeight,
        })
        
        // Draw back card with spacing
        page.drawImage(backImage, {
          x: startX + cardWidth + spacing,
          y,
          width: cardWidth,
          height: cardHeight,
        })

        // Add phone number if provided - ONLY on front card
        if (phoneNumber) {
          const fontSize = 6
          const text = `Ph: ${phoneNumber}`
          
          // Add phone number on front card (below gender area, left side)
          page.drawText(text, {
            x: startX + 77.7,
            y: y + cardHeight * 0.515,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          })
        }
      }
    }
    
    return await pdfDoc.save()
  }

  // Helper function to convert data URL to canvas
  const dataURLToCanvas = async (dataURL: string): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        resolve(canvas)
      }
      img.src = dataURL
    })
  }

  // Download front card as PDF
  const downloadFrontPdf = async (card: AadhaarCardData, index: number) => {
    try {
      // Create canvas from front image
      const canvas = await dataURLToCanvas(card.frontImage)
      
      const pdfBytes = await canvasToPdf(canvas, `aadhaar_${index + 1}_front.pdf`)
      await downloadPdf(pdfBytes, `aadhaar_${index + 1}_front.pdf`)
    } catch (error) {
      console.error('Error creating front PDF:', error)
      toast({
        title: "Error",
        description: "Failed to create front card PDF.",
        variant: "destructive"
      })
    }
  }

  // Download back card as PDF
  const downloadBackPdf = async (card: AadhaarCardData, index: number) => {
    try {
      // Create canvas from back image
      const canvas = await dataURLToCanvas(card.backImage)
      
      const pdfBytes = await canvasToPdf(canvas, `aadhaar_${index + 1}_back.pdf`)
      await downloadPdf(pdfBytes, `aadhaar_${index + 1}_back.pdf`)
    } catch (error) {
      console.error('Error creating back PDF:', error)
      toast({
        title: "Error",
        description: "Failed to create back card PDF.",
        variant: "destructive"
      })
    }
  }

  // Download both cards on same page as PDF
  const downloadCombinedPdf = async (card: AadhaarCardData, index: number) => {
    try {
      // Create canvases from both images
      const frontCanvas = await dataURLToCanvas(card.frontImage)
      const backCanvas = await dataURLToCanvas(card.backImage)
      
      const pdfBytes = await createCombinedPdf(frontCanvas, backCanvas)
      await downloadPdf(pdfBytes, `aadhaar_${index + 1}_combined.pdf`)
    } catch (error) {
      console.error('Error creating combined PDF:', error)
      toast({
        title: "Error",
        description: "Failed to create combined PDF.",
        variant: "destructive"
      })
    }
  }

  const downloadImage = (imageData: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageData
    link.download = filename
    link.click()
    
    toast({
      title: "Download started",
      description: `${filename} is being downloaded.`,
    })
  }

  const previewCard = (index: number) => {
    setSelectedCardIndex(index)
  }

  const generatePasswordSuggestions = (filename: string): string[] => {
    const suggestions: string[] = []
    const name = filename.replace(/\.[^/.]+$/, "").toLowerCase() // Remove extension
    
    // Common patterns for Aadhaar PDF passwords
    const currentYear = new Date().getFullYear()
    const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]
    
    // Add some common password patterns
    suggestions.push('password', '123456', '000000')
    
    // If filename contains possible name/date patterns
    if (name.length >= 4) {
      const firstPart = name.substring(0, 4).toUpperCase()
      years.forEach(year => {
        suggestions.push(`${firstPart}${year}`)
        suggestions.push(`${name.substring(0, 6)}${year}`)
      })
    }
    
    // Date patterns (DDMMYYYY)
    for (let day = 1; day <= 31; day++) {
      for (let month = 1; month <= 12; month++) {
        for (let year = 1950; year <= currentYear; year++) {
          if (suggestions.length < 10) { // Limit suggestions
            const date = `${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year}`
            suggestions.push(date)
          }
        }
      }
    }
    
    return [...new Set(suggestions)].slice(0, 8) // Remove duplicates and limit to 8
  }

  const tryCommonPasswords = async () => {
    if (!selectedPdf) return
    
    const suggestions = generatePasswordSuggestions(selectedPdf.name)
    setIsProcessing(true)
    
    for (const pwd of suggestions) {
      try {
        const arrayBuffer = await selectedPdf.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ 
          data: arrayBuffer,
          password: pwd
        }).promise
        
        // If we get here, password worked
        setPassword(pwd)
        setNeedsPassword(false)
        setIsPasswordProtected(true)
        toast({
          title: "Password found!",
          description: `Successfully unlocked PDF with password: ${pwd}`,
        })
        setIsProcessing(false)
        return
      } catch (error: any) {
        if (error.name !== 'PasswordException') {
          console.error('Error trying password:', error)
        }
        // Continue to next password
      }
    }
    
    setIsProcessing(false)
    toast({
      title: "No common password worked",
      description: "Please enter the password manually.",
      variant: "destructive"
    })
  }

  // Add this component before the download buttons
  const CopySelector = () => (
    <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
      <Label htmlFor="copies" className="text-white mb-2">Number of Copies per Page</Label>
      <div className="flex items-center gap-2">
        <Input
          id="copies"
          type="number"
          min="1"
          max="4"
          value={copies}
          onChange={(e) => setCopies(Math.min(4, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-20 bg-gray-800/50 border-gray-700 text-white"
        />
        <span className="text-purple-200 text-sm">(Max 4 per page)</span>
      </div>
    </div>
  )

  // Add after the copies selector component
  const PhoneNumberInput = () => (
    <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
      <Label htmlFor="phone" className="text-white mb-2">Phone Number (Optional)</Label>
      <div className="flex items-center gap-2">
        <Input
          id="phone"
          type="tel"
          pattern="[0-9]*"
          maxLength={10}
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
          className="w-40 bg-gray-800/50 border-gray-700 text-white"
        />
        <span className="text-purple-200 text-sm">(Will be printed on front card)</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Aadhaar Card Extractor" icon={CreditCard} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Upload Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-500" />
                  Upload Aadhaar PDF
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  {selectedPdf ? (
                    <div className="space-y-3">
                      <FileText className="h-16 w-16 mx-auto text-blue-500" />
                      <p className="text-white font-medium">{selectedPdf.name}</p>
                      <p className="text-gray-400 text-sm">
                        Size: {(selectedPdf.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={triggerFileUpload}
                        className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50"
                      >
                        Choose Different File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-16 w-16 mx-auto text-gray-500" />
                      <div>
                        <p className="text-white font-medium">Drop your Aadhaar PDF here or click to browse</p>
                        <p className="text-gray-400 text-sm">Supports PDF files with Aadhaar cards up to 50MB</p>
                      </div>
                      <Button 
                        onClick={triggerFileUpload}
                        className="bg-indigo-500 text-white hover:bg-indigo-600"
                      >
                        Choose PDF File
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
              </CardContent>
            </Card>

            {/* Processing Section */}
            {selectedPdf && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-green-500" />
                    Extract Aadhaar Cards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Password Input Section - Always show when PDF is selected */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium text-blue-300">PDF Password (if required)</h4>
                    </div>
                    <p className="text-blue-200 text-sm">
                      If your PDF is password-protected, enter the password below. Leave empty if no password is required.
                    </p>
                    <div className="space-y-3">
                      <Label htmlFor="pdf-password" className="text-white font-medium">
                        PDF Password (Optional)
                      </Label>
                      <Input
                        id="pdf-password"
                        type="password"
                        placeholder="Enter PDF password if required"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            processPdf()
                          }
                        }}
                      />
                      <p className="text-gray-400 text-xs">
                        Common Aadhaar PDF passwords: Date of birth (DDMMYYYY), Name (first 4 letters + YYYY)
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={tryCommonPasswords}
                          disabled={isProcessing}
                          className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Trying...
                            </>
                          ) : (
                            <>
                              <Key className="h-3 w-3 mr-2" />
                              Try Common Passwords
                            </>
                          )}
                        </Button>
                        {password && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => setPassword('')}
                            className="bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error message for wrong password */}
                  {needsPassword && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-red-500" />
                        <h4 className="font-medium text-red-300">Password Required</h4>
                      </div>
                      <p className="text-red-200 text-sm mt-2">
                        This PDF is password-protected. Please enter the correct password above and try again.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={processPdf}
                      disabled={isProcessing}
                      className="bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Extracting Cards...
                        </>
                      ) : (
                        <>
                          <Scissors className="h-4 w-4 mr-2" />
                          Extract Aadhaar Cards
                        </>
                      )}
                    </Button>
                    
                    {isPasswordProtected && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setPassword('')
                          setNeedsPassword(false)
                        }}
                        className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50"
                      >
                        Reset Password
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            {aadhaarCards.length > 0 && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    Extracted Aadhaar Cards ({aadhaarCards.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aadhaarCards.map((card, index) => (
                    <div key={index} className="bg-gray-800/30 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          Aadhaar Card {index + 1} (Page {card.originalPage})
                        </h3>
                        <Button 
                          onClick={() => previewCard(index)}
                          variant="outline"
                          className="bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Front Card */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-blue-500" />
                            <h4 className="font-medium text-white">Front Side</h4>
                          </div>
                          <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                            <div className="aspect-[85.6/53.98] bg-gray-800 rounded-lg overflow-hidden">
                              <img 
                                src={card.frontImage} 
                                alt="Aadhaar Front"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => downloadImage(card.frontImage, `aadhaar_${index + 1}_front.png`)}
                                className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                                size="sm"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                PNG
                              </Button>
                              <Button 
                                onClick={() => downloadFrontPdf(card, index)}
                                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                                size="sm"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                PDF
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Back Card */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <RotateCcw className="h-5 w-5 text-green-500" />
                            <h4 className="font-medium text-white">Back Side</h4>
                          </div>
                          <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                            <div className="aspect-[85.6/53.98] bg-gray-800 rounded-lg overflow-hidden">
                              <img 
                                src={card.backImage} 
                                alt="Aadhaar Back"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => downloadImage(card.backImage, `aadhaar_${index + 1}_back.png`)}
                                className="flex-1 bg-green-500 text-white hover:bg-green-600"
                                size="sm"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                PNG
                              </Button>
                              <Button 
                                onClick={() => downloadBackPdf(card, index)}
                                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                size="sm"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                PDF
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Combined Download Section */}
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-purple-300 mb-1">Download Both Cards</h4>
                            <p className="text-purple-200 text-sm">Download front and back cards together on one page</p>
                          </div>
                        </div>
                        
                        {/* Add Copy Selector here */}
                        <div className="flex items-center gap-2">
                          <Label className="text-purple-200 whitespace-nowrap">Number of Copies:</Label>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            value={copies}
                            onChange={(e) => setCopies(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-20 bg-gray-800/50 border-gray-700 text-white"
                          />
                          <span className="text-purple-200 text-sm">(Max 4 per page, 20 total)</span>
                        </div>

                        {/* Phone Number Input */}
                        <div className="flex items-center gap-2">
                          <Label className="text-purple-200 whitespace-nowrap">Phone Number:</Label>
                          <Input
                            type="tel"
                            pattern="[0-9]*"
                            maxLength={10}
                            placeholder="Enter phone number (optional)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-40 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                          />
                          <span className="text-purple-200 text-sm">(Will be printed on front card)</span>
                        </div>

                        <Button 
                          onClick={() => downloadCombinedPdf(card, index)}
                          className="w-full bg-purple-500 text-white hover:bg-purple-600"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download {copies} {copies === 1 ? 'Copy' : 'Copies'} as PDF
                        </Button>
                      </div>

                      {/* Print Info */}
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                        <p className="text-indigo-300 text-sm">
                          <strong>Print Size:</strong> {AADHAAR_DIMENSIONS.width}mm × {AADHAAR_DIMENSIONS.height}mm 
                          (3.37" × 2.125") - Standard Aadhaar card size
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Preview Modal */}
            {selectedCardIndex !== null && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                      <ZoomIn className="h-5 w-5 text-yellow-500" />
                      Card Preview - Aadhaar {selectedCardIndex + 1}
                    </CardTitle>
                    <Button 
                      onClick={() => setSelectedCardIndex(null)}
                      variant="outline"
                      size="sm"
                      className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50"
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-white text-center">Front Side</h4>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <img 
                            src={aadhaarCards[selectedCardIndex].frontImage} 
                            alt="Aadhaar Front Preview"
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-white text-center">Back Side</h4>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <img 
                            src={aadhaarCards[selectedCardIndex].backImage} 
                            alt="Aadhaar Back Preview"
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">How to Use Aadhaar Card Extractor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-300 text-sm">
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <p>Upload your PDF file containing Aadhaar cards using the upload area above</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <p>If the PDF is password-protected, enter the password when prompted</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <p>Click "Extract Aadhaar Cards" to automatically detect and extract cards from the PDF</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <p>Preview extracted cards to ensure they are correctly separated</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                    <p>Download the front and back images in PNG or PDF format for printing</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">6</span>
                    <p>Use "Combined PDF" to download both cards on the same page</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">7</span>
                    <p>Print at standard Aadhaar card size: 85.6mm × 53.98mm (3.37" × 2.125")</p>
                  </div>
                </div>
                
                <Separator className="bg-gray-700/50 my-4" />
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                  <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Common Aadhaar PDF Passwords:
                  </h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• <strong>Date of Birth:</strong> DDMMYYYY format (e.g., 15031990)</li>
                    <li>• <strong>Name + Year:</strong> First 4 letters of name + birth year (e.g., AMIT1990)</li>
                    <li>• <strong>Full Name:</strong> Complete name in lowercase or uppercase</li>
                    <li>• <strong>Aadhaar Number:</strong> Last 4 digits of Aadhaar number</li>
                    <li>• <strong>Default:</strong> Sometimes "password" or "123456"</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="text-yellow-300 font-medium mb-2">Important Notes:</h4>
                  <ul className="text-yellow-200 text-sm space-y-1">
                    <li>• The extractor automatically detects Aadhaar cards in PDF pages</li>
                    <li>• Cards are extracted from the bottom portion of the page using precise cropping</li>
                    <li>• Download options include PNG images and PDF files with proper dimensions</li>
                    <li>• Combined PDF places both cards side by side for easy printing</li>
                    <li>• All downloaded files are ready for standard card printing</li>
                    <li>• Password is only used for PDF decryption and is not stored</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PdfProcessor;

