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
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useToast } from "@/components/ui/use-toast"
import * as pdfjsLib from 'pdfjs-dist'
import axios from "axios"
import { auth } from "../auth/firebase"
import { PDFDocument, rgb } from 'pdf-lib'
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface VoterCardData {
  image: string
  originalPage: number
}

export function Voter() {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [voterCards, setVoterCards] = useState<VoterCardData[]>([])
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [password, setPassword] = useState('')
  const [needsPassword, setNeedsPassword] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [a4PdfUrl, setA4PdfUrl] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0); // 0: front, 1: back
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const uid = auth.currentUser?.uid;

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
      setVoterCards([])
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

  // Cropping logic for Voter ID card (adjust as needed for your layout)
  const extractVoterFrontBackFromFullPage = async (pageImage: string): Promise<{ front: string, back: string }> => {
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

    // To make cardWidth changes visible, also adjust cutX for both front and back
    // Example cropping values for your sample voter card layout:
    // Adjust cutY, cutX, cardWidth, cardHeight as needed for your PDF
    const cutY = Math.round(canvas.height * 0.112); // top margin
    const cardHeight = Math.round(canvas.height * 0.185); // height of card region
    const cardWidth = Math.round(canvas.width * 0.416); // change this value to see effect

    // Front card (left side)
    const cutXFront = Math.round(canvas.width * 0.053); // left margin
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = cardWidth;
    frontCanvas.height = cardHeight;
    frontCanvas.getContext('2d')!.drawImage(
      canvas,
      cutXFront, cutY, cardWidth, cardHeight,
      0, 0, cardWidth, cardHeight
    );

    // Back card (right side)
    const cutXBack = Math.round(canvas.width * 0.548); // right half
    const backCanvas = document.createElement('canvas');
    backCanvas.width = cardWidth;
    backCanvas.height = cardHeight;
    backCanvas.getContext('2d')!.drawImage(
      canvas,
      cutXBack, cutY, cardWidth, cardHeight,
      0, 0, cardWidth, cardHeight
    );

    return {
      front: frontCanvas.toDataURL('image/png'),
      back: backCanvas.toDataURL('image/png')
    };
  };

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
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password || undefined
      })

      let pdf
      try {
        pdf = await loadingTask.promise
        setIsPasswordProtected(password ? true : false)
        setNeedsPassword(false)
        toast({
          title: "PDF loaded successfully",
          description: "Extracting Voter ID card regions from all pages...",
        })
      } catch (error: any) {
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
        throw error
      }

      const extractedCards: VoterCardData[] = []

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const pageImage = await renderPageToCanvas(page)

        // Always extract front and back from every page
        const { front, back } = await extractVoterFrontBackFromFullPage(pageImage)

        extractedCards.push({
          image: front,
          originalPage: pageNum
        })
        extractedCards.push({
          image: back,
          originalPage: pageNum
        })
      }

      if (extractedCards.length === 0) {
        toast({
          title: "No Voter ID cards found",
          description: "No card regions extracted from the PDF.",
          variant: "destructive"
        })
      } else {
        setVoterCards(extractedCards)
        toast({
          title: "Voter ID cards extracted successfully",
          description: `Extracted ${extractedCards.length} card images from the PDF.`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Processing failed",
        description: "An error occurred while processing the PDF.",
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

  // Helper: Create combined PDF (front+back on A4) with border
  const createCombinedPdf = async (frontDataUrl: string, backDataUrl: string): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create()
    const A4_WIDTH = 595.28
    const A4_HEIGHT = 841.89
    const margin = 40
    const spacing = 20

    const frontCanvas = await dataURLToCanvas(frontDataUrl)
    const backCanvas = await dataURLToCanvas(backDataUrl)

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

    // Card size (fixed width for voter card)
    const cardWidth = 200
    const cardHeight = cardWidth * (frontCanvas.height / frontCanvas.width)
    const y = A4_HEIGHT - cardHeight - margin

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
    // Draw black border for front card
    page.drawRectangle({
      x: margin - 2,
      y: y - 2,
      width: cardWidth + 4,
      height: cardHeight + 4,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
    })
    // Draw black border for back card
    page.drawRectangle({
      x: margin + cardWidth + spacing - 2,
      y: y - 2,
      width: cardWidth + 4,
      height: cardHeight + 4,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
    })
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

  // Generate and set A4 PDF preview URL
  const generateA4PdfPreview = async (front: string, back: string) => {
    const pdfBytes = await createCombinedPdf(front, back);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setA4PdfUrl(url);
  };

  React.useEffect(() => {
    if (voterCards.length > 1 && voterCards[0].image && voterCards[1].image) {
      generateA4PdfPreview(voterCards[0].image, voterCards[1].image);
    } else {
      setA4PdfUrl(null);
    }
    // eslint-disable-next-line
  }, [voterCards]);

  const handleSubmit = async (card: VoterCardData, index: number) => {
    try {
      const transaction = {
        uid: uid,
        cardName: 'Voter',
        amount: 2,
        type: 'CARD_CREATION',
        date: new Date().toISOString(),
        metadata: { page: card.originalPage }
      };
      await axios.post(`${BACKEND_URL}/api/transactions/card`, transaction);
      toast({
        title: "Transaction Success",
        description: "Transaction and download started.",
      });
      downloadImage(card.image, `voter_${index + 1}.png`)
    } catch (err: any) {
      toast({
        title: "API Error",
        description: err?.response?.data?.message || err.message || "Failed to create transaction.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Voter ID Card Extractor" icon={CreditCard} showNewServiceButton={false} />
        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Notice */}
            <div className="w-full flex justify-center">
              <div className="bg-green-900/90 text-green-200 font-semibold rounded-lg px-8 py-4 mb-4 text-center max-w-2xl">
                <span className="text-lg font-bold">Notice</span>
                <br />
                We only support original Voter PDF files. Please do not upload any other file.
              </div>
            </div>
            {/* Main two-column layout */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Upload/Form */}
              <div className="flex-1 min-w-[320px]">
                {/* Upload Section */}
                <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                      <Upload className="h-5 w-5 text-blue-500" />
                      Upload Voter PDF
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
                            <p className="text-white font-medium">Drop your Voter PDF here or click to browse</p>
                            <p className="text-gray-400 text-sm">Supports PDF files with Voter ID cards up to 50MB</p>
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
                        Extract Voter ID Cards
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
                              Extract Voter ID Cards
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              {/* Right: Card Previews (Carousel) */}
              <div className="flex-1 min-w-[320px] flex flex-col gap-6">
                <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                      Front and Back
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-6">
                      {/* Carousel */}
                      <div className="w-full aspect-[1.6/1] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center mb-2 relative">
                        {/* Left Button */}
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700/70 hover:bg-gray-800/90 rounded-full p-2 z-10"
                          onClick={() => setCarouselIndex((prev) => (prev === 0 ? 1 : 0))}
                          disabled={voterCards.length < 2}
                          aria-label="Previous"
                          style={{ visibility: voterCards.length < 2 ? 'hidden' : 'visible' }}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 17l-5-5 5-5"/></svg>
                        </button>
                        {/* Card Image */}
                        {voterCards.length > carouselIndex && voterCards[carouselIndex]?.image ? (
                          <img
                            src={voterCards[carouselIndex].image}
                            alt={carouselIndex === 0 ? "Voter Front" : "Voter Back"}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-gray-500 text-center w-full">
                            {carouselIndex === 0 ? "Front card preview will appear here" : "Back card preview will appear here"}
                          </div>
                        )}
                        {/* Right Button */}
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700/70 hover:bg-gray-800/90 rounded-full p-2 z-10"
                          onClick={() => setCarouselIndex((prev) => (prev === 1 ? 0 : 1))}
                          disabled={voterCards.length < 2}
                          aria-label="Next"
                          style={{ visibility: voterCards.length < 2 ? 'hidden' : 'visible' }}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7l5 5-5 5"/></svg>
                        </button>
                        {/* Carousel label */}
                        {voterCards.length > 1 && (
                          <span className="absolute bottom-2 right-1/2 translate-x-1/2 bg-gray-900/80 text-xs text-white px-3 py-1 rounded-full">
                            {carouselIndex === 0 ? "Front" : "Back"}
                          </span>
                        )}
                      </div>
                      {/* Download Button */}
                      <div className="flex gap-2 w-full mt-4">
                        <Button
                          onClick={() => downloadImage(voterCards[carouselIndex].image, carouselIndex === 0 ? `voter_front.png` : `voter_back.png`)}
                          className={`flex-1 ${carouselIndex === 0 ? "bg-indigo-500 hover:bg-indigo-600" : "bg-purple-500 hover:bg-purple-600"} text-white`}
                          disabled={!(voterCards.length > carouselIndex && voterCards[carouselIndex].image)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download {carouselIndex === 0 ? "Front" : "Back"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* A4 PDF Preview */}
            <div>
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    A4 size PDF.
                  </CardTitle>
                  <div className="text-gray-400 text-xs mt-1">
                    This is A4 size page. This page might not work for PVC card.
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-black rounded-lg overflow-hidden border border-gray-800">
                    {a4PdfUrl ? (
                      <iframe
                        src={a4PdfUrl}
                        title="A4 PDF Preview"
                        className="w-full min-h-[400px] rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-500 text-center py-16">A4 PDF preview will appear here</div>
                    )}
                  </div>
                  <div className="flex justify-center mt-4 gap-2">
                    <Button
                      onClick={() => {
                        if (a4PdfUrl) {
                          const link = document.createElement('a');
                          link.href = a4PdfUrl;
                          link.download = "voter_card_a4.pdf";
                          link.click();
                        }
                      }}
                      className="bg-green-500 text-white hover:bg-green-600"
                      disabled={!a4PdfUrl}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Instructions */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">How to Use Voter Card Extractor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-300 text-sm">
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <p>Upload your PDF file containing Voter ID cards using the upload area above</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <p>Click "Extract Voter ID Cards" to automatically detect and extract cards from the PDF</p>
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
                    <p>Print at standard Voter ID card size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Voter;

