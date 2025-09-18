'use client'

import React, { useState, useRef } from 'react'
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
  ZoomIn,
  Lock,
  Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useToast } from "@/components/ui/use-toast"
import { useTermsNCondition } from "@/components/TermsNCondition"
import * as pdfjsLib from 'pdfjs-dist'
import axios from "axios"
import { auth } from "../auth/firebase"
import { PDFDocument } from 'pdf-lib'
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface UanCardData {
  image: string
  originalPage: number
}

export function Uan() {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uanCards, setUanCards] = useState<UanCardData[]>([])
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [password, setPassword] = useState('')
  const [needsPassword, setNeedsPassword] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { openModal, modal } = useTermsNCondition()

  const uid = auth.currentUser?.uid;
  const [pendingAction, setPendingAction] = useState<null | { type: "download" | "downloadCombined" | "print" | "printCombined", card: UanCardData, index: number, backImage?: string }>(null);

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
      setUanCards([])
      setSelectedCardIndex(null)
      setPassword('')
      setNeedsPassword(false)
      setIsPasswordProtected(false)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const renderPageToCanvas = async (page: any, scale: number = 4): Promise<string> => {
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

  // Cropping logic for UAN card (adjust as needed for your layout)
  const extractUanFrontBackFromFullPage = async (pageImage: string): Promise<{ front: string, back: string }> => {
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = pageImage;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    // Example cropping values for your sample UAN card layout:
    // Adjust cutY, cutX, cardWidth, cardHeight as needed for your PDF
    // For the attached sample, cards are stacked vertically.
    const cardHeight = Math.round(canvas.height / 5.6);
    const cardWidth = Math.round(canvas.width * 0.385);
    const cutX = Math.round(canvas.width * 0.19);
    const cutY = Math.round(canvas.height * 0.075);
    const cutYback = Math.round(canvas.height * 0.26);

    // Front card (top)
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = cardWidth;
    frontCanvas.height = cardHeight;
    
    frontCanvas.getContext('2d')!.drawImage(
      canvas,
      cutX, cutY, cardWidth, cardHeight,
      0, 0, cardWidth, cardHeight
    );

    // Back card (bottom)
    const backCanvas = document.createElement('canvas');
    backCanvas.width = cardWidth;
    backCanvas.height = cardHeight;
    backCanvas.getContext('2d')!.drawImage(
      canvas,
      cutX, cutYback, cardWidth, cardHeight,
      0, 0, cardWidth, cardHeight
    );

    return {
      front: frontCanvas.toDataURL('image/png'),
      back: backCanvas.toDataURL('image/png')
    };
  };

  // Configure PDF.js worker (ensure this runs in browser)
  if (typeof window !== 'undefined' && (pdfjsLib as any).GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }

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
    console.log('Starting PDF processing...')

    try {
      const arrayBuffer = await selectedPdf.arrayBuffer()
      console.log(`PDF file size: ${arrayBuffer.byteLength} bytes`)

      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password || undefined
      })

      let pdf
      try {
        pdf = await loadingTask.promise
        console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`)
        setIsPasswordProtected(!!password)
        setNeedsPassword(false)
        toast({
          title: "PDF loaded successfully",
          description: `Extracting UAN card regions from ${pdf.numPages} page(s)...`,
        })
      } catch (error: any) {
        console.error('PDF loading error:', error)

        // Worker / version mismatch errors
        if (error.message && error.message.includes('API version') && error.message.includes('Worker version')) {
          toast({
            title: "PDF Version Error",
            description: "PDF.js worker/version mismatch. Refresh the page and try again.",
            variant: "destructive"
          })
          setIsProcessing(false)
          return
        }

        if (error.message && error.message.includes('Setting up fake worker failed')) {
          toast({
            title: "PDF Worker Error",
            description: "Failed to initialize PDF worker. Ensure worker is reachable and try again.",
            variant: "destructive"
          })
          setIsProcessing(false)
          return
        }

        if (error.name === 'PasswordException') {
          setIsPasswordProtected(true)
          setNeedsPassword(true)
          toast({
            title: "Password Required",
            description: "This PDF is password-protected. Please enter the password.",
            variant: "destructive"
          })
          setIsProcessing(false)
          return
        }

        // rethrow to be caught by outer try
        throw error
      }

      const extractedCards: UanCardData[] = []

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`Processing page ${pageNum}...`)
        try {
          const page = await pdf.getPage(pageNum)
          const pageImage = await renderPageToCanvas(page)

          // Always extract front and back from every page
          const { front, back } = await extractUanFrontBackFromFullPage(pageImage)

          extractedCards.push({
            image: front,
            originalPage: pageNum
          })
          extractedCards.push({
            image: back,
            originalPage: pageNum
          })

          console.log(`Successfully extracted cards from page ${pageNum}`)
        } catch (pageError) {
          console.error(`Error processing page ${pageNum}:`, pageError)
          // don't abort whole run on single page error
        }
      }

      console.log(`Total extracted cards: ${extractedCards.length}`)

      if (extractedCards.length === 0) {
        toast({
          title: "No UAN cards found",
          description: "No card regions could be extracted from the PDF. Check PDF format and cropping parameters.",
          variant: "destructive"
        })
      } else {
        setUanCards(extractedCards)
        toast({
          title: "UAN cards extracted successfully",
          description: `Extracted ${extractedCards.length} card images.`,
        })
      }
    } catch (error: any) {
      console.error('PDF processing error (outer):', error)
      toast({
        title: "Processing failed",
        description: error?.message || "An error occurred while processing the PDF. See console for details.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
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

  // Helper: Convert dataURL to canvas
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

  // Helper: Create combined PDF (front+back on A4)
  const createCombinedPdf = async (frontDataUrl: string, backDataUrl: string): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create()
    // A4 size in points
    const A4_WIDTH = 595.28
    const A4_HEIGHT = 841.89
    const margin = 40
    const spacing = 20

    // Convert images to canvas
    const frontCanvas = await dataURLToCanvas(frontDataUrl)
    const backCanvas = await dataURLToCanvas(backDataUrl)

    // Embed images
    function getPngBytes(dataUrl: string) {
      const base64 = dataUrl.split(',')[1]
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      return bytes
    }
    const frontImage = await pdfDoc.embedPng(getPngBytes(frontCanvas.toDataURL('image/png', 1.0)))
    const backImage = await pdfDoc.embedPng(getPngBytes(backCanvas.toDataURL('image/png', 1.0)))

    // Calculate card size to fit two cards side by side
    const availableWidth = A4_WIDTH - (2 * margin) - spacing
    const cardWidth = availableWidth / 2
    const cardHeight = cardWidth * (frontCanvas.height / frontCanvas.width)
    const y = A4_HEIGHT - cardHeight - margin

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
    page.drawImage(frontImage, {
      x: margin,
      y,
      width: cardWidth,
      height: cardHeight,
    })
    page.drawImage(backImage, {
      x: margin + cardWidth + spacing,
      y,
      width: cardWidth,
      height: cardHeight,
    })

    return await pdfDoc.save()
  }

  const downloadCombinedPdf = async (front: string, back: string, index: number) => {
    try {
      const pdfBytes = await createCombinedPdf(front, back)
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `uan_${index + 1}_combined.pdf`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 100)
      toast({
        title: "PDF downloaded",
        description: "Combined UAN card PDF downloaded.",
      })
      handleSubmit(uanCards[index], index);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create combined PDF.",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (card: UanCardData, index: number) => {
    try {
      const transaction = {
        uid: uid,
        cardName: 'Uan',
        amount: 2,
        type: 'CARD_CREATION',
        description: `UAN Card creation for page ${card.originalPage}`, // Add this line
        date: new Date().toISOString(),
        metadata: { page: card.originalPage }
      };
      await axios.post(`${BACKEND_URL}/api/transactions/card`, transaction);
      toast({
        title: "Transaction Success",
        description: "Transaction and download started.",
      });
      downloadImage(card.image, `uan_${index + 1}.png`)
    } catch (err: any) {
      toast({
        title: "API Error",
        description: err?.response?.data?.message || err.message || "Failed to create transaction.",
        variant: "destructive"
      });
    }
  }

  // Print helpers
  const printImage = async (imageData: string, filename: string) => {
    try {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print ${filename}</title>
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                img { max-width: 100%; max-height: 100%; object-fit: contain; }
                @media print { body { margin: 0; } img { max-width: 100%; height: auto; } }
              </style>
            </head>
            <body>
              <img src="${imageData}" alt="${filename}" />
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.onload = function() {
          printWindow.focus()
          printWindow.print()
        }
      }
    } catch (error) {
      toast({
        title: "Print Error",
        description: "Failed to open print dialog.",
        variant: "destructive"
      })
    }
  }

  const printCombinedPdf = async (front: string, back: string, index: number) => {
    try {
      const pdfBytes = await createCombinedPdf(front, back)
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const pdfUrl = URL.createObjectURL(blob)
      const printWindow = window.open(pdfUrl, '_blank')
      if (printWindow) {
        printWindow.onload = function() {
          printWindow.focus()
          printWindow.print()
        }
      }
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000)
      toast({
        title: "Print started",
        description: "Combined UAN card sent to printer.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF for printing.",
        variant: "destructive"
      })
    }
  }

  // Wrap download/print to require terms acceptance
  const handleDownload = (card: UanCardData, index: number) => {
    setPendingAction({ type: "download", card, index });
    openModal(() => setPendingAction(null));
  };

  const handleDownloadCombined = (front: string, back: string, index: number) => {
    setPendingAction({ type: "downloadCombined", card: { image: front, originalPage: index }, index, backImage: back });
    openModal(() => setPendingAction(null));
  };

  const handlePrint = (card: UanCardData, index: number) => {
    setPendingAction({ type: "print", card, index });
    openModal(() => setPendingAction(null));
  };

  const handlePrintCombined = (front: string, back: string, index: number) => {
    setPendingAction({ type: "printCombined", card: { image: front, originalPage: index }, index, backImage: back });
    openModal(() => setPendingAction(null));
  };

  // Effect to handle the action after agreeing to terms
  React.useEffect(() => {
    if (pendingAction && !modal.props.open) {
      const { type, card, index, backImage } = pendingAction;
      setPendingAction(null);
      if (type === "download") {
        handleSubmit(card, index);
      } else if (type === "downloadCombined" && backImage) {
        downloadCombinedPdf(card.image, backImage, index);
      } else if (type === "print") {
        printImage(card.image, `uan_${index + 1}`);
      } else if (type === "printCombined" && backImage) {
        printCombinedPdf(card.image, backImage, index);
      }
    }
  }, [modal.props.open, pendingAction]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      {modal}
      <Sidebar />
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="UAN Card Extractor" icon={CreditCard} showNewServiceButton={false} />
        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Upload Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-500" />
                  Upload UAN PDF
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
                        <p className="text-white font-medium">Drop your UAN PDF here or click to browse</p>
                        <p className="text-gray-400 text-sm">Supports PDF files with UAN cards up to 50MB</p>
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
                    Extract UAN Cards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Password Input Section */}
                  {selectedPdf && (
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
                      </div>
                    </div>
                  )}

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
                          Extract UAN Cards
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={openModal}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Terms & Conditions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            {uanCards.length > 1 && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    UAN Card Previews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preview 1: Front */}
                  <div className="bg-gray-800/30 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Front Card</h3>
                    <div className="aspect-[1.6/1] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={uanCards[0].image} alt="UAN Front" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownload(uanCards[0], 0)}
                        className="flex-1 bg-indigo-500 text-white hover:bg-indigo-600"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Front PNG
                      </Button>
                      <Button
                        onClick={() => handlePrint(uanCards[0], 0)}
                        className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                  {/* Preview 2: Back */}
                  <div className="bg-gray-800/30 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Back Card</h3>
                    <div className="aspect-[1.6/1] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={uanCards[1].image} alt="UAN Back" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownload(uanCards[1], 1)}
                        className="flex-1 bg-purple-500 text-white hover:bg-purple-600"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Back PNG
                      </Button>
                      <Button
                        onClick={() => handlePrint(uanCards[1], 1)}
                        className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                  {/* Preview 3: Combined PDF */}
                  <div className="bg-gray-800/30 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Combined PDF (A4 Sheet)</h3>
                    <div className="aspect-[2.1/1] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                      {/* Show both images side by side as preview */}
                      <div className="flex gap-4">
                        <img src={uanCards[0].image} alt="UAN Front" className="max-w-[45%] max-h-full object-contain rounded" />
                        <img src={uanCards[1].image} alt="UAN Back" className="max-w-[45%] max-h-full object-contain rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownloadCombined(uanCards[0].image, uanCards[1].image, 0)}
                        className="flex-1 bg-green-500 text-white hover:bg-green-600"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Combined PDF
                      </Button>
                      <Button
                        onClick={() => handlePrintCombined(uanCards[0].image, uanCards[1].image, 0)}
                        className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print PDF
                      </Button>
                    </div>
                  </div>
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
                      Card Preview - UAN {selectedCardIndex + 1}
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
                    <div className="bg-gray-800 rounded-lg p-4 relative">
                      <img
                        src={uanCards[selectedCardIndex].image}
                        alt="UAN Preview"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">How to Use UAN Card Extractor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-300 text-sm">
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <p>Upload your PDF file containing UAN cards using the upload area above</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <p>Click "Extract UAN Cards" to automatically detect and extract cards from the PDF</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <p>Preview extracted cards to ensure they are correctly separated</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <p>Download the card image in PNG format for printing</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                    <p>Download both cards as a combined PDF for A4 printing</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">6</span>
                    <p>Print at standard card size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      {modal}
    </div>
  )
}

export default Uan;

