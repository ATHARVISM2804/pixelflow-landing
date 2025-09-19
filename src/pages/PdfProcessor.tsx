'use client'

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
  Key,
  Printer
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
import axios from "axios";
import { auth } from "../auth/firebase"
import { useTermsNCondition } from "@/components/TermsNCondition"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// Add overlay image path
const overlayImage = "/assets/overlay.png";
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
  const [responseMessage, setResponseMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { open: termsOpen, openModal: openTermsModal, closeModal: closeTermsModal, modal: termsModal } = useTermsNCondition();
  const [pendingAction, setPendingAction] = useState<null | { type: "download" | "print", card: AadhaarCardData, index: number }>(null);
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  const [a4PdfUrl, setA4PdfUrl] = useState<string | null>(null);

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

  const uid = auth.currentUser?.uid;
  console.log("User ID:", uid); 

  // Modified handleSubmit to show terms modal before download
  const handleSubmit = async (card: AadhaarCardData, index: number) => {
    setPendingAction({ type: "download", card, index });
    openTermsModal();
  };

  // Modified handlePrint to show terms modal before print
  const handlePrint = async (card: AadhaarCardData, index: number) => {
    setPendingAction({ type: "print", card, index });
    openTermsModal();
  };

  // Effect to handle the action after agreeing to terms
  React.useEffect(() => {
    if (!termsOpen && pendingAction) {
      // Only proceed if modal was just closed and there is a pending action
      const { type, card, index } = pendingAction;
      setPendingAction(null);
      if (type === "download") {
        // Original download logic
        (async () => {
          try {
            const transaction = {
              uid: uid,
              cardName: 'Aadhar',
              amount: 1,
              type: 'CARD_CREATION',
              date: new Date().toISOString(),
              metadata: { page: card.originalPage }
            };
            const response = await axios.post(`${BACKEND_URL}/api/transactions/card`, transaction);
            toast({
              title: "Transaction Success",
              description: "Transaction and download started.",
            });
            await downloadCombinedPdf(card, index);
          } catch (err: any) {
            toast({
              title: "API Error",
              description: err?.response?.data?.message || err.message || "Failed to create transaction.",
              variant: "destructive"
            });
          }
        })();
      } else if (type === "print") {
        // Original print logic
        (async () => {
          try {
            // Create canvases from both images
            const frontCanvas = await dataURLToCanvas(card.frontImage)
            const backCanvas = await dataURLToCanvas(card.backImage)
            const pdfBytes = await createCombinedPdf(frontCanvas, backCanvas)
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const pdfUrl = URL.createObjectURL(blob)
            const printWindow = window.open(pdfUrl)
            if (printWindow) {
              printWindow.onload = function () {
                printWindow.focus()
                printWindow.print()
              }
            }
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000)
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to generate PDF for print.",
              variant: "destructive"
            })
          }
        })();
      }
    }
  }, [termsOpen, pendingAction]);

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
    const cropWidth = (2 * width) / 5 // Keep the original card width
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

    // Add overlay to the front card
    const overlay = new Image()
    await new Promise((resolve) => {
      overlay.onload = resolve
      overlay.src = overlayImage
    })

    // Calculate dimensions for centered, smaller overlay - only make the overlay smaller
    const overlayScale = 0.4 // Make overlay 40% of the card size

    const overlayWidth = cropWidth * 0.72
    const overlayHeight = cropHeight * 0.35

    // Calculate position to center the overlay
    const overlayX = 5.12 * (cropWidth - overlayWidth) / 5
    const overlayY = 6 * (cropHeight - overlayHeight) / 8

    // Draw the overlay centered with reduced size
    frontCtx.drawImage(overlay, overlayX, overlayY, overlayWidth, overlayHeight)

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
      page.setCropBox(width / 11, height * 0.4, 2 * width / 5, height / 5.4)
    })

    const frontPdfBytes = await frontPdfDoc.save()

    // Create back card PDF (right side cropping)  
    const backPdfDoc = await PDFDocument.load(pdfBytes)
    const backPages = backPdfDoc.getPages()

    backPages.forEach((page) => {
      const { width, height } = page.getSize()
      // Back card cropping - adjusted to crop from bottom portion
      // Y coordinate adjusted to start from lower portion of page
      page.setCropBox(width / 2, height * 0.4, 3.7 * width / 9, height / 5.4)
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
    ) * 0.98 // Slightly reduce scale to ensure margins

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

  // Update createCombinedPdf to increase the border width
  const createCombinedPdf = async (frontCanvas: HTMLCanvasElement, backCanvas: HTMLCanvasElement): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Load and embed the overlay image
    const response = await fetch(overlayImage)
    const overlayBytes = new Uint8Array(await response.arrayBuffer())
    const overlayPng = await pdfDoc.embedPng(overlayBytes)

    // Increase quality of PNG conversion
    const frontPngBytes = frontCanvas.toDataURL('image/png', 1.0).split(',')[1]
    const backPngBytes = backCanvas.toDataURL('image/png', 1.0).split(',')[1]

    // Convert base64 to Uint8Array for both images
    const frontBytes = Uint8Array.from(atob(frontPngBytes), c => c.charCodeAt(0))
    const backBytes = Uint8Array.from(atob(backPngBytes), c => c.charCodeAt(0))

    const frontImage = await pdfDoc.embedPng(frontBytes)
    const backImage = await pdfDoc.embedPng(backBytes)

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

        // Draw thicker black border for front card
        page.drawRectangle({
          x: startX,
          y,
          width: cardWidth,
          height: cardHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 2, // Increased border width
        })
        // Draw front card
        page.drawImage(frontImage, {
          x: startX,
          y,
          width: cardWidth,
          height: cardHeight,
        })

        // Draw thicker black border for back card
        page.drawRectangle({
          x: startX + cardWidth + spacing,
          y,
          width: cardWidth,
          height: cardHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 2, // Increased border width
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
          const text = `Mob : ${phoneNumber}`

          // Add phone number on front card (below gender area, left side)
          page.drawText(text, {
            x: startX + 77.7,
            y: y + cardHeight * 0.48,
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

  // Fix phone number input: use a real input field
  // ...existing code...

  // Generate and preview the A4 PDF when aadhaarCards or phoneNumber/copies changes
  React.useEffect(() => {
    const generateA4PdfPreview = async () => {
      if (aadhaarCards.length === 0) {
        setA4PdfUrl(null);
        return;
      }
      const card = aadhaarCards[0];
      const frontCanvas = await dataURLToCanvas(card.frontImage);
      const backCanvas = await dataURLToCanvas(card.backImage);
      const pdfBytes = await createCombinedPdf(frontCanvas, backCanvas);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setA4PdfUrl(url);
      // Clean up old URLs
      return () => URL.revokeObjectURL(url);
    };
    generateA4PdfPreview();
    // eslint-disable-next-line
  }, [aadhaarCards, phoneNumber, copies]);

  // Download the A4 PDF (combined) directly
  const downloadA4Pdf = async () => {
    if (aadhaarCards.length === 0) return;
    const card = aadhaarCards[0];
    const frontCanvas = await dataURLToCanvas(card.frontImage);
    const backCanvas = await dataURLToCanvas(card.backImage);
    const pdfBytes = await createCombinedPdf(frontCanvas, backCanvas);
    await downloadPdf(pdfBytes, `aadhaar_combined_a4.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#181A20]">
      <Sidebar />
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        {/* Header */}
        <DashboardHeader title="Make Aadhaar (Cards)" icon={CreditCard} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Notice Bar */}
            <div className="w-full flex justify-center mb-6">
              <div className="bg-green-900/90 text-green-200 px-8 py-4 rounded-xl font-semibold text-lg shadow border border-green-700 max-w-2xl w-full text-center">
                Notice<br />
                <span className="text-green-300 text-base font-normal">
                  We only support original aadhaar PDF files downloaded from UIDAI with valid signature.
                </span>
              </div>
            </div>

            {/* Main Card Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Form */}
              <div className="bg-[#23242A] rounded-xl p-6 shadow border border-gray-800/60 flex flex-col justify-between min-h-[370px]">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Make Aadhaar (Cards)</h2>
                  <div className="space-y-4">
                    {/* Password */}
                    <div>
                      <Label htmlFor="pdf-password" className="text-white font-medium">Password</Label>
                      <Input
                        id="pdf-password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-[#23242A] border-gray-700 text-white placeholder:text-gray-500 mt-1"
                      />
                    </div>
                    {/* File Upload */}
                    <div>
                      <Label className="text-white font-medium">Select Aadhaar</Label>
                      <div className="flex gap-2 mt-1">
                        <Button
                          onClick={triggerFileUpload}
                          className="bg-[#23242A] border border-gray-700 text-gray-300 hover:bg-gray-700/50"
                        >
                          Choose File
                        </Button>
                        <span className="text-gray-400 text-sm truncate max-w-[120px]">
                          {selectedPdf ? selectedPdf.name : "No file chosen"}
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={handlePdfUpload}
                        />
                      </div>
                    </div>
                    {/* Phone Number */}
                    <div>
                      <Label htmlFor="phone" className="text-white font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        pattern="[0-9]*"
                        maxLength={10}
                        placeholder="Enter phone number (optional)"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="bg-[#23242A] border-gray-700 text-white placeholder:text-gray-500 mt-1"
                      />
                      <span className="text-gray-400 text-xs">Will be printed on front card (optional)</span>
                    </div>
                    {/* Copies */}
                    <div>
                      <Label htmlFor="copies" className="text-white font-medium">Number of Copies</Label>
                      <Input
                        id="copies"
                        type="number"
                        min={1}
                        max={4}
                        value={copies}
                        onChange={e => setCopies(Math.min(4, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="bg-[#23242A] border-gray-700 text-white placeholder:text-gray-500 mt-1 w-24"
                      />
                      <span className="text-gray-400 text-xs">Max 4 per page</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={processPdf}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-[#A78BFA] text-white hover:bg-[#8B5CF6] font-bold text-lg py-2"
                >
                  Submit
                </Button>
              </div>

              {/* Right: Preview */}
              <div className="bg-[#23242A] rounded-xl p-6 shadow border border-gray-800/60 flex flex-col min-h-[370px]">
                <h2 className="text-xl font-bold text-white mb-4">Front and Back</h2>
                <p className="text-gray-400 text-sm mb-2">Please click on the card to slide the Images.</p>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="bg-[#F3F4F6] rounded-lg w-full max-w-xs aspect-[85.6/53.98] flex items-center justify-center cursor-pointer"
                    onClick={() => setPreviewSide(previewSide === 'front' ? 'back' : 'front')}
                  >
                    {aadhaarCards.length > 0 ? (
                      <img
                        src={previewSide === 'front' ? aadhaarCards[0].frontImage : aadhaarCards[0].backImage}
                        alt={previewSide === 'front' ? "Front" : "Back"}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <span className="text-gray-400">No preview</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white border border-gray-300"
                      onClick={() => setPreviewSide('front')}
                    >
                      <span className="text-gray-700 font-bold">&lt;</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white border border-gray-300"
                      onClick={() => setPreviewSide('back')}
                    >
                      <span className="text-gray-700 font-bold">&gt;</span>
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => aadhaarCards.length > 0 && handleSubmit(aadhaarCards[0], 0)}
                  className="w-full mt-6 bg-[#A78BFA] text-white hover:bg-[#8B5CF6] font-bold text-lg py-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* A4 size PDF Section */}
            <div className="bg-[#23242A] rounded-xl shadow border border-gray-800/60 mt-8">
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <div>
                  <span className="text-white font-semibold">A4 size PDF.</span>
                  <span className="text-gray-400 text-xs ml-2">This is A4 size page. This page might not work for PVC card.</span>
                </div>
                <div className="text-gray-400 text-xs">aadhaar_combined_a4.pdf</div>
              </div>
              <div className="bg-[#F3F4F6] rounded-lg m-6 p-6 flex items-center justify-center min-h-[350px]">
                {/* PDF Preview */}
                {a4PdfUrl ? (
                  <embed
                    src={a4PdfUrl}
                    type="application/pdf"
                    className="w-full h-[400px] rounded shadow"
                  />
                ) : (
                  <div className="w-full flex flex-col items-center justify-center h-[350px]">
                    <span className="text-gray-400">No PDF preview</span>
                  </div>
                )}
              </div>
              <div className="flex justify-center pb-6">
                <Button
                  onClick={downloadA4Pdf}
                  className="bg-[#A78BFA] text-white hover:bg-[#8B5CF6] font-bold text-lg py-2 px-8"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {termsModal}
    </div>
  )
}

export default PdfProcessor;
