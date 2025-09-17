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
  FileText,
  Scissors,
  Loader2,
  CreditCard,
  Lock,
  Download,
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ApaarCardData {
  image: string
  originalPage: number
}

export function Apaar() {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [apaarCards, setApaarCards] = useState<ApaarCardData[]>([])
  const [password, setPassword] = useState('')
  const [needsPassword, setNeedsPassword] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
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
      setApaarCards([])
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

  // Cropping logic for Apaar card (single card, centered)
  const extractApaarFrontFromFullPage = async (pageImage: string): Promise<string> => {
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

    // Adjust these values for your Apaar card layout
    // For the attached sample, the card is centered near the top
    const cardWidth = Math.round(canvas.width * 0.52);
    const cardHeight = Math.round(canvas.height * 0.255);
    const cutX = Math.round(canvas.width * 0.24);
    const cutY = Math.round(canvas.height * 0);

    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = cardWidth;
    frontCanvas.height = cardHeight;
    frontCanvas.getContext('2d')!.drawImage(
      canvas,
      cutX, cutY, cardWidth, cardHeight,
      0, 0, cardWidth, cardHeight
    );

    return frontCanvas.toDataURL('image/png');
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
          description: "Extracting APAAR card region from all pages...",
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

      const extractedCards: ApaarCardData[] = []

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const pageImage = await renderPageToCanvas(page)

        // Only extract front card from every page
        const front = await extractApaarFrontFromFullPage(pageImage)

        extractedCards.push({
          image: front,
          originalPage: pageNum
        })
      }

      if (extractedCards.length === 0) {
        toast({
          title: "No APAAR cards found",
          description: "No card regions extracted from the PDF.",
          variant: "destructive"
        })
      } else {
        setApaarCards(extractedCards)
        toast({
          title: "APAAR cards extracted successfully",
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

  const handleSubmit = async (card: ApaarCardData, index: number) => {
    // Confirmation popup
    if (!window.confirm("Are you sure you want to download this APAAR card?")) return;
    try {
      const transaction = {
        uid: uid,
        cardName: 'Apaar',
        amount: 1,
        type: 'CARD_CREATION',
        date: new Date().toISOString(),
        metadata: { page: card.originalPage }
      };
      await axios.post(`${BACKEND_URL}/api/transactions/card`, transaction);
      toast({
        title: "Transaction Success",
        description: "Transaction and download started.",
      });
      downloadImage(card.image, `apaar_${index + 1}.png`)
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
        <DashboardHeader title="APAAR Card Extractor" icon={CreditCard} showNewServiceButton={false} />
        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Upload Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-500" />
                  Upload APAAR PDF
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
                        <p className="text-white font-medium">Drop your APAAR PDF here or click to browse</p>
                        <p className="text-gray-400 text-sm">Supports PDF files with APAAR cards up to 50MB</p>
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
                    Extract APAAR Card
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Password Input Section */}
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
                          Extracting Card...
                        </>
                      ) : (
                        <>
                          <Scissors className="h-4 w-4 mr-2" />
                          Extract APAAR Card
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            {apaarCards.length > 0 && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    APAAR Card Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preview: Front */}
                  <div className="bg-gray-800/30 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Front Card</h3>
                    <div className="aspect-[1.6/1] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={apaarCards[0].image} alt="APAAR Front" className="max-w-full max-h-full object-contain" />
                    </div>
                    <Button
                      onClick={() => handleSubmit(apaarCards[0], 0)}
                      className="bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Front PNG
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">How to Use APAAR Card Extractor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-300 text-sm">
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <p>Upload your PDF file containing APAAR card using the upload area above</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <p>Click "Extract APAAR Card" to automatically detect and extract the card from the PDF</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <p>Preview extracted card to ensure it is correctly separated</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <p>Download the card image in PNG format for printing</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                    <p>Print at standard card size</p>
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

export default Apaar;

