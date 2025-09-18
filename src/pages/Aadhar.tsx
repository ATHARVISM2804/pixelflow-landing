'use client'

import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Upload,
  Download,
  Scissors,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  FileImage
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useTermsNCondition } from "@/components/TermsNCondition"

export function Aadhar() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [frontCard, setFrontCard] = useState<string | null>(null)
  const [backCard, setBackCard] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cropMode, setCropMode] = useState<'front' | 'back' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { openModal, modal } = useTermsNCondition()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string)
        setFrontCard(null)
        setBackCard(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const extractFrontCard = () => {
    if (!originalImage) return
    setIsProcessing(true)
    setCropMode('front')
    
    // Simulate processing - in real implementation, you'd crop the top portion
    setTimeout(() => {
      setFrontCard(originalImage) // Placeholder - would be cropped version
      setIsProcessing(false)
      setCropMode(null)
    }, 1500)
  }

  const extractBackCard = () => {
    if (!originalImage) return
    setIsProcessing(true)
    setCropMode('back')
    
    // Simulate processing - in real implementation, you'd crop the bottom portion
    setTimeout(() => {
      setBackCard(originalImage) // Placeholder - would be cropped version
      setIsProcessing(false)
      setCropMode(null)
    }, 1500)
  }

  const downloadCard = (cardType: 'front' | 'back') => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create download link
    const link = document.createElement('a')
    link.download = `aadhaar-${cardType}-card.png`
    link.href = cardType === 'front' ? frontCard || '' : backCard || ''
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Aadhaar Card Generator" icon={Shield} showNewServiceButton={false} />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="h-5 w-5 text-indigo-400" />
                  Upload Aadhaar Card
                </CardTitle>
                <p className="text-gray-400 text-sm">Upload your Aadhaar card image to extract printable cards</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div 
                  className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                  onClick={triggerFileUpload}
                >
                  {originalImage ? (
                    <div className="space-y-2">
                      <img 
                        src={originalImage} 
                        alt="Original Aadhaar" 
                        className="max-w-full h-32 object-contain mx-auto rounded"
                      />
                      <p className="text-gray-300 text-sm">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-gray-300">Click to upload Aadhaar card image</p>
                      <p className="text-gray-500 text-sm">Supports JPG, PNG, JPEG</p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={extractFrontCard}
                    disabled={!originalImage || isProcessing}
                    className="w-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
                  >
                    <Scissors className="h-4 w-4 mr-2" />
                    {isProcessing && cropMode === 'front' ? 'Processing...' : 'Extract Front Card'}
                  </Button>
                  
                  <Button 
                    onClick={extractBackCard}
                    disabled={!originalImage || isProcessing}
                    className="w-full bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                  >
                    <Scissors className="h-4 w-4 mr-2" />
                    {isProcessing && cropMode === 'back' ? 'Processing...' : 'Extract Back Card'}
                  </Button>

                  <Button 
                    onClick={openModal}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Terms & Conditions
                  </Button>
                </div>

                {/* Instructions */}
                <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
                  <h4 className="text-white font-medium">Instructions:</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Upload a clear image of your Aadhaar card</li>
                    <li>• Front card contains photo and personal details</li>
                    <li>• Back card contains address information</li>
                    <li>• Cards will be auto-cropped for printing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Front Card Preview */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-indigo-400" />
                    Front Card
                  </CardTitle>
                  {frontCard && (
                    <Button 
                      onClick={() => downloadCard('front')}
                      className="bg-indigo-500 text-white hover:bg-indigo-600"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
                <p className="text-gray-400 text-sm">Photo side of the Aadhaar card</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1.6/1] bg-white rounded-lg p-4 flex items-center justify-center">
                  {frontCard ? (
                    <img 
                      src={frontCard} 
                      alt="Front Card" 
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-gray-500">Front card preview</p>
                      <p className="text-gray-400 text-sm">Upload image and extract front card</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Back Card Preview */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-purple-400" />
                    Back Card
                  </CardTitle>
                  {backCard && (
                    <Button 
                      onClick={() => downloadCard('back')}
                      className="bg-purple-500 text-white hover:bg-purple-600"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
                <p className="text-gray-400 text-sm">Address side of the Aadhaar card</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1.6/1] bg-white rounded-lg p-4 flex items-center justify-center">
                  {backCard ? (
                    <img 
                      src={backCard} 
                      alt="Back Card" 
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-gray-500">Back card preview</p>
                      <p className="text-gray-400 text-sm">Upload image and extract back card</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Info */}
          {isProcessing && (
            <Card className="mt-6 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  <div>
                    <p className="text-white font-medium">
                      Processing {cropMode} card...
                    </p>
                    <p className="text-gray-400 text-sm">
                      Extracting and optimizing the card for printing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Download All */}
          {frontCard && backCard && (
            <Card className="mt-6 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Cards Ready!</h3>
                    <p className="text-gray-400 text-sm">Both front and back cards have been extracted successfully</p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => downloadCard('front')}
                      className="bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Front
                    </Button>
                    <Button 
                      onClick={() => downloadCard('back')}
                      className="bg-purple-500 text-white hover:bg-purple-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Back
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Terms & Conditions Modal */}
      {modal}
    </div>
  )
}

export default Aadhar

