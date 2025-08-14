import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bell,
  User,
  Download,
  RotateCcw,
  RotateCw,
  AlertTriangle,
  Play,
  Upload,
  Moon,
  Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { cardApi } from '@/services/cardApi';
import { toast } from '@/components/ui/use-toast';
import axios from "axios";

export function Editor() {
  const [brightness, setBrightness] = useState([100])
  const [saturation, setSaturation] = useState([100])
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewImgRef = useRef<HTMLImageElement>(null) // Add ref for preview image

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = e.target?.result as string
        setImagePreview(img)
        setHistory([img]) // reset history on new image
        setRedoStack([])
      }
      reader.readAsDataURL(file)
    }
  }

  // Whenever brightness or saturation changes, push to history
  React.useEffect(() => {
    if (imagePreview && history[history.length - 1] !== imagePreview) {
      setHistory((prev) => [...prev, imagePreview])
      setRedoStack([])
    }
    // eslint-disable-next-line
  }, [imagePreview])

  const handleUndo = () => {
    if (history.length > 1) {
      setRedoStack((prev) => [history[history.length - 1], ...prev])
      setHistory((prev) => prev.slice(0, -1))
      setImagePreview(history[history.length - 2])
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      setHistory((prev) => [...prev, redoStack[0]])
      setImagePreview(redoStack[0])
      setRedoStack((prev) => prev.slice(1))
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Add uid state
  const uid = "user123"; // Replace with actual user auth ID
  
  // Add transaction creation function
  const createCardTransaction = async () => {
    try {
      await cardApi.createEditedImage({
        uid,
        cardName: selectedImage?.name || 'Edited_Image',
        metadata: {
          brightness: brightness[0],
          saturation: saturation[0]
        }
      });
      
      toast({
        title: "Transaction created",
        description: "Successfully charged for image editing",
      });
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Update handleDownloadImage to include transaction
  const handleDownloadImage = async () => {
    if (!imagePreview) return;
    
    try {
      // Create transaction first
      await createCardTransaction();
      
      const img = previewImgRef.current
      if (!img) return

      // Create a canvas with the same size as the image
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Apply filters
      ctx.filter = `brightness(${brightness[0]}%) saturate(${saturation[0]}%)`
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Download the canvas as PNG
      const link = document.createElement('a')
      link.download = selectedImage?.name ? `edited_${selectedImage.name}` : 'edited_image.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to download image and create transaction.",
        variant: "destructive"
      });
    }
  }

  // Add this function for API transaction and download (adapted for Editor)
  const handleSubmit = async (card: any, index: number) => {
    try {
      const transaction = {
        uid: 'Ashish Ranjan',
        cardName: 'Edited Image',
        amount: 1,
        type: 'CARD_CREATION',
        date: new Date().toISOString(),
        metadata: { brightness: brightness[0], saturation: saturation[0], imageName: selectedImage?.name }
      };
      // Call your backend API
      await axios.post("http://localhost:5000/api/transactions/card", transaction);
      toast({
        title: "Transaction Success",
        description: "Transaction and download started.",
      });
      // Proceed with download after successful transaction
      handleDownloadImage();
    } catch (err: any) {
      toast({
        title: "API Error",
        description: err?.response?.data?.message || err.message || "Failed to create transaction.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Image Editor" icon={Edit3} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Editor Panel */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-2xl font-bold text-white">Free Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Control Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  <Button className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs sm:text-sm">
                    Brightness
                  </Button>
                  <Button className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs sm:text-sm">
                    Saturation
                  </Button>
                </div>

                {/* Brightness Slider */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-300 text-xs sm:text-sm">Brightness</label>
                    <span className="text-gray-300 text-xs sm:text-sm">{brightness[0]}%</span>
                  </div>
                  <Slider
                    value={brightness}
                    onValueChange={setBrightness}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Saturation Slider */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-300 text-xs sm:text-sm">Saturation</label>
                    <span className="text-gray-300 text-xs sm:text-sm">{saturation[0]}%</span>
                  </div>
                  <Slider
                    value={saturation}
                    onValueChange={setSaturation}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Action Buttons */}
                {/* <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50"
                    onClick={handleUndo}
                    disabled={history.length <= 1}
                  >
                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                    Undo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                  >
                    <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
                    Redo
                  </Button>
                </div> */}

                {/* Width & Height Inputs */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-300 text-xs sm:text-sm">Width</label>
                    <Input
                      placeholder="Width"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300 text-xs sm:text-sm">Height</label>
                    <Input
                      placeholder="Height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 text-sm"
                    />
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50 text-xs sm:text-sm">
                    Reset
                  </Button>
                  <Button 
                    className="bg-indigo-500 text-white hover:bg-indigo-600 text-xs sm:text-sm"
                    onClick={triggerFileUpload}
                  >
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Choose Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader className="pb-2 sm:pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg sm:text-xl font-bold text-white">Image</CardTitle>
                  <Button
                    className="bg-indigo-500 text-white hover:bg-indigo-600 text-xs sm:text-sm w-full sm:w-auto"
                    onClick={() => handleSubmit(null, 0)}
                    disabled={!imagePreview}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {selectedImage ? `Editing: ${selectedImage.name}` : 'Processed image after edit will be visible here'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] bg-white rounded-lg p-3 sm:p-6 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      ref={previewImgRef}
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                      style={{
                        filter: `brightness(${brightness[0]}%) saturate(${saturation[0]}%)`
                      }}
                    />
                  ) : (
                    <div className="w-full max-w-sm space-y-6">
                      {/* Mock image placeholder with elements */}
                      <div className="flex gap-4">
                        <div className="w-20 h-16 bg-gray-400 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      
                      <div className="w-24 h-24 bg-gray-300 rounded-full ml-auto"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Editor;
