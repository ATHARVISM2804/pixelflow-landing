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
import { configurePdfJs, getDefaultPdfOptions } from '@/utils/pdfConfig'

// Configure PDF.js on component load
configurePdfJs()

interface AadhaarCardData {
  frontImage: string
  backImage: string
  originalPage: number
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Aadhaar card dimensions (in mm) - standard size
  const AADHAAR_DIMENSIONS = {
    width: 85.6, // 3.37 inches
    height: 53.98, // 2.125 inches
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

  const renderPageToCanvas = async (page: any, scale: number = 2): Promise<string> => {
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

      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Find card boundaries by detecting the blue header and card content
      const cardBounds = detectAadhaarCardBoundaries(imageData, canvas.width, canvas.height)
      
      if (cardBounds.length < 2) {
        // Fallback: Look for any content regions if specific detection fails
        const contentBounds = findContentRegions(imageData, canvas.width, canvas.height)
        
        if (contentBounds.length >= 2) {
          const front = contentBounds[0]
          const back = contentBounds[1]
          
          return {
            frontImage: extractCardRegion(canvas, front),
            backImage: extractCardRegion(canvas, back),
            originalPage: pageNumber
          }
        }
        
        // Final fallback to simple split
        const halfWidth = canvas.width / 2
        const frontCanvas = document.createElement('canvas')
        const frontCtx = frontCanvas.getContext('2d')!
        frontCanvas.width = halfWidth
        frontCanvas.height = canvas.height
        frontCtx.drawImage(canvas, 0, 0, halfWidth, canvas.height, 0, 0, halfWidth, canvas.height)
        
        const backCanvas = document.createElement('canvas')
        const backCtx = backCanvas.getContext('2d')!
        backCanvas.width = halfWidth
        backCanvas.height = canvas.height
        backCtx.drawImage(canvas, halfWidth, 0, halfWidth, canvas.height, 0, 0, halfWidth, canvas.height)

        return {
          frontImage: frontCanvas.toDataURL('image/png'),
          backImage: backCanvas.toDataURL('image/png'),
          originalPage: pageNumber
        }
      }

      // Extract cards based on detected boundaries
      const front = cardBounds[0]
      const back = cardBounds[1]
      
      return {
        frontImage: extractCardRegion(canvas, front),
        backImage: extractCardRegion(canvas, back),
        originalPage: pageNumber
      }
    } catch (error) {
      console.error('Error extracting Aadhaar from page:', error)
      return null
    }
  }

  // Extract a specific card region from canvas
  const extractCardRegion = (sourceCanvas: HTMLCanvasElement, bounds: {x: number, y: number, width: number, height: number}) => {
    const cardCanvas = document.createElement('canvas')
    const cardCtx = cardCanvas.getContext('2d')!
    
    cardCanvas.width = bounds.width
    cardCanvas.height = bounds.height
    
    // Draw the specific region
    cardCtx.drawImage(
      sourceCanvas, 
      bounds.x, bounds.y, bounds.width, bounds.height,
      0, 0, bounds.width, bounds.height
    )
    
    return cardCanvas.toDataURL('image/png')
  }

  // Function to detect Aadhaar card boundaries by looking for the characteristic blue header
  const detectAadhaarCardBoundaries = (imageData: ImageData, width: number, height: number) => {
    const data = imageData.data
    const cards: Array<{x: number, y: number, width: number, height: number}> = []
    
    // Look for blue color regions (Aadhaar header is typically blue/teal)
    const blueThreshold = {
      r: { min: 0, max: 100 },
      g: { min: 120, max: 200 },
      b: { min: 150, max: 255 }
    }
    
    // Scan for blue header regions
    const blueRegions: Array<{x: number, y: number}> = []
    
    for (let y = 0; y < height; y += 5) { // Sample every 5 pixels for performance
      for (let x = 0; x < width; x += 5) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        
        // Check if pixel matches blue header color
        if (r >= blueThreshold.r.min && r <= blueThreshold.r.max &&
            g >= blueThreshold.g.min && g <= blueThreshold.g.max &&
            b >= blueThreshold.b.min && b <= blueThreshold.b.max) {
          blueRegions.push({x, y})
        }
      }
    }
    
    if (blueRegions.length === 0) {
      return [] // No blue regions found
    }
    
    // Group blue regions into card areas
    const cardRegions = groupBlueRegionsIntoCards(blueRegions, width, height)
    
    // For each card region, find the full card boundaries
    cardRegions.forEach(region => {
      const cardBounds = findFullCardBounds(imageData, width, height, region)
      if (cardBounds) {
        cards.push(cardBounds)
      }
    })
    
    return cards
  }

  // Group blue regions into separate card areas
  const groupBlueRegionsIntoCards = (blueRegions: Array<{x: number, y: number}>, width: number, height: number) => {
    const cardRegions: Array<{centerX: number, centerY: number}> = []
    const leftSide = blueRegions.filter(p => p.x < width / 2)
    const rightSide = blueRegions.filter(p => p.x >= width / 2)
    
    if (leftSide.length > 0) {
      const avgX = leftSide.reduce((sum, p) => sum + p.x, 0) / leftSide.length
      const avgY = leftSide.reduce((sum, p) => sum + p.y, 0) / leftSide.length
      cardRegions.push({centerX: avgX, centerY: avgY})
    }
    
    if (rightSide.length > 0) {
      const avgX = rightSide.reduce((sum, p) => sum + p.x, 0) / rightSide.length
      const avgY = rightSide.reduce((sum, p) => sum + p.y, 0) / rightSide.length
      cardRegions.push({centerX: avgX, centerY: avgY})
    }
    
    return cardRegions
  }

  // Find the full card boundaries starting from a blue header region
  const findFullCardBounds = (
    imageData: ImageData, 
    width: number, 
    height: number, 
    region: {centerX: number, centerY: number}
  ) => {
    const data = imageData.data
    const whiteThreshold = 240 // Pixels brighter than this are considered background
    
    // Start from the blue region and expand to find card boundaries
    let minX = region.centerX, maxX = region.centerX
    let minY = region.centerY, maxY = region.centerY
    
    // Expand horizontally to find card width
    // Look left
    for (let x = region.centerX; x >= 0; x--) {
      let hasContent = false
      for (let y = Math.max(0, region.centerY - 100); y < Math.min(height, region.centerY + 300); y++) {
        const index = (y * width + x) * 4
        const gray = Math.round(0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2])
        if (gray < whiteThreshold) {
          hasContent = true
          break
        }
      }
      if (hasContent) {
        minX = x
      } else {
        break
      }
    }
    
    // Look right
    for (let x = region.centerX; x < width; x++) {
      let hasContent = false
      for (let y = Math.max(0, region.centerY - 100); y < Math.min(height, region.centerY + 300); y++) {
        const index = (y * width + x) * 4
        const gray = Math.round(0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2])
        if (gray < whiteThreshold) {
          hasContent = true
          break
        }
      }
      if (hasContent) {
        maxX = x
      } else {
        break
      }
    }
    
    // Expand vertically to find card height
    // Look up
    for (let y = region.centerY; y >= 0; y--) {
      let hasContent = false
      for (let x = minX; x <= maxX; x++) {
        const index = (y * width + x) * 4
        const gray = Math.round(0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2])
        if (gray < whiteThreshold) {
          hasContent = true
          break
        }
      }
      if (hasContent) {
        minY = y
      } else {
        break
      }
    }
    
    // Look down
    for (let y = region.centerY; y < height; y++) {
      let hasContent = false
      for (let x = minX; x <= maxX; x++) {
        const index = (y * width + x) * 4
        const gray = Math.round(0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2])
        if (gray < whiteThreshold) {
          hasContent = true
          break
        }
      }
      if (hasContent) {
        maxY = y
      } else {
        break
      }
    }
    
    // Add small padding and ensure minimum size
    const padding = 10
    const minWidth = 300
    const minHeight = 200
    
    const cardWidth = Math.max(minWidth, maxX - minX + padding * 2)
    const cardHeight = Math.max(minHeight, maxY - minY + padding * 2)
    
    return {
      x: Math.max(0, minX - padding),
      y: Math.max(0, minY - padding),
      width: Math.min(width - (minX - padding), cardWidth),
      height: Math.min(height - (minY - padding), cardHeight)
    }
  }

  // Fallback function to find content regions
  const findContentRegions = (imageData: ImageData, width: number, height: number) => {
    const data = imageData.data
    const regions: Array<{x: number, y: number, width: number, height: number}> = []
    const whiteThreshold = 250
    
    // Divide page into left and right halves
    const halfWidth = width / 2
    const searchRegions = [
      {startX: 0, endX: halfWidth, side: 'left'},
      {startX: halfWidth, endX: width, side: 'right'}
    ]
    
    searchRegions.forEach(region => {
      let minX = region.endX, maxX = region.startX
      let minY = height, maxY = 0
      let hasContent = false
      
      // Find content bounds in this region
      for (let y = 0; y < height; y += 2) {
        for (let x = region.startX; x < region.endX; x += 2) {
          const index = (y * width + x) * 4
          const gray = Math.round(0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2])
          
          if (gray < whiteThreshold) {
            hasContent = true
            minX = Math.min(minX, x)
            maxX = Math.max(maxX, x)
            minY = Math.min(minY, y)
            maxY = Math.max(maxY, y)
          }
        }
      }
      
      if (hasContent && (maxX - minX) > 100 && (maxY - minY) > 100) {
        regions.push({
          x: Math.max(0, minX - 20),
          y: Math.max(0, minY - 20),
          width: Math.min(width, maxX - minX + 40),
          height: Math.min(height, maxY - minY + 40)
        })
      }
    })
    
    return regions
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
        
        // Clear any previous error states
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
          // Render page to image
          const pageImage = await renderPageToCanvas(page)
          previews.push(pageImage)
          
          // Extract Aadhaar cards from this page
          const aadhaarData = await extractAadhaarFromPage(pageImage, pageNum)
          if (aadhaarData) {
            extractedCards.push(aadhaarData)
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
      } else if (error.message && (error.message.includes('CORS') || error.message.includes('worker'))) {
        toast({
          title: "Loading Error",
          description: "There was an issue loading the PDF processor. Please refresh the page and try again.",
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
                                Download Front
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
                                Download Back
                              </Button>
                            </div>
                          </div>
                        </div>
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
                    <p>Download the front and back images in PNG format for printing</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">6</span>
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
                    <li>• Cards are split assuming front and back are side-by-side in the PDF</li>
                    <li>• For best results, ensure your PDF has clear, high-quality Aadhaar images</li>
                    <li>• Downloaded images are ready for standard card printing</li>
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
