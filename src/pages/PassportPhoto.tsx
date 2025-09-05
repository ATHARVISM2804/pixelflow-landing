import React, { useState, useRef } from 'react'
// import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Share,
  Info,
  CreditCard,
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// import { useAuth } from '../auth/AuthContext.tsx';
import { auth } from "../auth/firebase"

const A4_DIMENSIONS = {
  width: 210, // mm
  height: 297, // mm
}

const ORIGINAL_PASSPORT = {
  width: 35, // mm
  height: 45, // mm
}

export function PassportPhoto() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    number: 1,
    pageSize: 'a4-full',
    backgroundColor: '#ffffff'
  })
  const [isMultiple, setIsMultiple] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast();
  // const { user } = useAuth();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const toggleMultiple = () => {
    setIsMultiple(!isMultiple)
    setSelectedFiles([])
  }

  const handleDownload = async () => {
    if (!selectedFiles.length) return

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const margin = 10
      const spacing = 2
      const photosPerRow = Math.floor((A4_DIMENSIONS.width - 2 * margin + spacing) / (ORIGINAL_PASSPORT.width + spacing))
      const photosPerCol = Math.floor((A4_DIMENSIONS.height - 2 * margin + spacing) / (ORIGINAL_PASSPORT.height + spacing))

      for (let i = 0; i < formData.number; i++) {
        const file = selectedFiles[i % selectedFiles.length]
        const img = new Image()
        img.src = URL.createObjectURL(file)
        await new Promise((resolve) => { img.onload = resolve })

        const row = Math.floor(i / photosPerRow)
        const col = i % photosPerRow
        const x = margin + (col * (ORIGINAL_PASSPORT.width + spacing))
        const y = margin + (row * (ORIGINAL_PASSPORT.height + spacing))

        // Draw border box
        pdf.setDrawColor(200) // light gray border
        pdf.rect(x, y, ORIGINAL_PASSPORT.width, ORIGINAL_PASSPORT.height)

        // Place the photo inside the box
        pdf.addImage(img, 'JPEG', x, y, ORIGINAL_PASSPORT.width, ORIGINAL_PASSPORT.height)
        
        // Add text if name or date is provided
        if (formData.name || formData.date) {
          // Set text color and font size
          pdf.setTextColor(225, 225, 225) // Black text
          pdf.setFontSize(7) // Small font size appropriate for passport photos
          
          // Add name at the bottom left of the photo if provided
          if (formData.name) {
            pdf.text(formData.name, x + 2, y + ORIGINAL_PASSPORT.height - 2, { 
              align: 'left'
            })
          }
          
          // Add date at the bottom right if provided
          if (formData.date) {
            const dateText = new Date(formData.date).toLocaleDateString()
            pdf.text(dateText, x + ORIGINAL_PASSPORT.width - 2, y + ORIGINAL_PASSPORT.height - 2, { 
              align: 'right' 
            })
          }
        }

        if ((i + 1) % (photosPerRow * photosPerCol) === 0 && i + 1 < formData.number) {
          pdf.addPage()
        }
      }

      pdf.save(`passport_photos_${formData.name || 'download'}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }



  // API call at the time of download
  const handleSubmit = async (file: File, index: number) => {
    try {
      const transaction = {
        uid: auth.currentUser?.uid,
        cardName: 'Passport Photo',
        amount: 2 * formData.number,
        type: 'CARD_CREATION',
        date: new Date().toISOString(),
        metadata: { fileName: file.name }
      };
      // Call your backend API
      await axios.post(`${BACKEND_URL}/api/transactions/card`, transaction);
      toast({
        title: "Transaction Success",
        description: "Transaction and download started.",
      });
      // Proceed with download after successful transaction
      handleDownload();
    } catch (err: any) {
      toast({
        title: "API Error",
        description: err?.response?.data?.message || err.message || "Failed to create transaction.",
        variant: "destructive"
      });
    }
  };

  // Print PDF instead of download
  const handlePrint = async () => {
    if (!selectedFiles.length) return

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const margin = 10
      const spacing = 2
      const photosPerRow = Math.floor((A4_DIMENSIONS.width - 2 * margin + spacing) / (ORIGINAL_PASSPORT.width + spacing))
      const photosPerCol = Math.floor((A4_DIMENSIONS.height - 2 * margin + spacing) / (ORIGINAL_PASSPORT.height + spacing))

      for (let i = 0; i < formData.number; i++) {
        const file = selectedFiles[i % selectedFiles.length]
        const img = new Image()
        img.src = URL.createObjectURL(file)
        await new Promise((resolve) => { img.onload = resolve })

        const row = Math.floor(i / photosPerRow)
        const col = i % photosPerRow
        const x = margin + (col * (ORIGINAL_PASSPORT.width + spacing))
        const y = margin + (row * (ORIGINAL_PASSPORT.height + spacing))

        pdf.setDrawColor(200)
        pdf.rect(x, y, ORIGINAL_PASSPORT.width, ORIGINAL_PASSPORT.height)
        pdf.addImage(img, 'JPEG', x, y, ORIGINAL_PASSPORT.width, ORIGINAL_PASSPORT.height)

        if (formData.name || formData.date) {
          pdf.setTextColor(225, 225, 225)
          pdf.setFontSize(7)
          if (formData.name) {
            pdf.text(formData.name, x + 2, y + ORIGINAL_PASSPORT.height - 2, { align: 'left' })
          }
          if (formData.date) {
            const dateText = new Date(formData.date).toLocaleDateString()
            pdf.text(dateText, x + ORIGINAL_PASSPORT.width - 2, y + ORIGINAL_PASSPORT.height - 2, { align: 'right' })
          }
        }

        if ((i + 1) % (photosPerRow * photosPerCol) === 0 && i + 1 < formData.number) {
          pdf.addPage()
        }
      }

      // Open PDF in new tab and trigger print
      const pdfUrl = pdf.output('bloburl')
      const printWindow = window.open(pdfUrl)
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.focus()
          printWindow.print()
        }
      }
    } catch (error) {
      console.error('Error generating PDF for print:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Passport Size Photo" icon={CreditCard} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-400 text-sm">Create passport size photos in one click</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Upload Form Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
                    Information
                  </div>
                </CardTitle>
                <div className="space-y-2 mt-2">
                  <p className="text-indigo-400 text-xs sm:text-sm">Hindi: फोटो अपलोड करने से पहले, फोटो का आकार करें 35 x 17 मि (280 x 210 पिक्सेल) ।</p>
                  <p className="text-gray-400 text-xs sm:text-sm">English: Before uploading the photo, resize the photo to 35 x 17 or 280 x 210 pixels.</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-white text-xs sm:text-sm">Select Photo</Label>
                  <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white text-xs sm:text-sm"
                      onClick={triggerFileUpload}
                    >
                      Choose File
                    </Button>
                    <Button 
                      variant={isMultiple ? "default" : "outline"}
                      className={`${isMultiple ? 'bg-indigo-500 text-white' : 'bg-gray-800/50 border-gray-700/50 text-gray-300'} hover:bg-gray-700/50 hover:text-white text-xs sm:text-sm w-full sm:w-auto`}
                      onClick={toggleMultiple}
                    >
                      Multiple
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={isMultiple}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-400">Selected files:</p>
                      {selectedFiles.map((file, index) => (
                        <p key={index} className="text-xs text-gray-500">
                          {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-white text-xs sm:text-sm">Name</Label>
                      <Input 
                        placeholder="Enter name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-white text-xs sm:text-sm">Date</Label>
                      <Input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="mt-1 bg-gray-800/50 border-gray-700/50 text-white text-sm" 
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-xs sm:text-sm">Number</Label>
                    <Input 
                      type="number" 
                      placeholder="Images range 1 to 30" 
                      min="1" 
                      max="30"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: parseInt(e.target.value)})}
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" 
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs sm:text-sm">Page Size</Label>
                    <Select value={formData.pageSize} onValueChange={(value) => setFormData({...formData, pageSize: value})}>
                      <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                        <SelectValue placeholder="A4-Full page (30 photos)" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="a4-full">A4-Full page (30 photos)</SelectItem>
                        <SelectItem value="a4-half">A4-Half page (15 photos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> 

                  {/* <div>
                    <Label className="text-white text-xs sm:text-sm">Background Color</Label>
                    <Input 
                      type="color" 
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                      className="mt-1 h-10 bg-gray-800/50 border-gray-700/50" 
                    />
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-lg sm:text-xl">A4 size PDF</span>
                  <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white flex-1 sm:flex-none">
                      <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white flex-1 sm:flex-none">
                      <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white flex-1 sm:flex-none">
                      <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white flex-1 sm:flex-none">
                      <Share className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={previewRef} className="aspect-[1/1.4] bg-white rounded-lg flex items-center justify-center overflow-hidden p-[10mm]">
                  {selectedFiles.length > 0 ? (
                    <div 
                      className="grid gap-[2mm] w-full h-full"
                      style={{
                        gridTemplateColumns: `repeat(auto-fit, ${ORIGINAL_PASSPORT.width}mm)`,
                        gridAutoRows: `${ORIGINAL_PASSPORT.height}mm`,
                        alignContent: 'start'
                      }}
                    >
                      {Array.from({ length: formData.number }).map((_, index) => (
                        <div 
                          key={index} 
                          className="bg-white rounded overflow-hidden flex items-center justify-center border border-gray-200 relative"
                          style={{
                            width: `${ORIGINAL_PASSPORT.width}mm`,
                            height: `${ORIGINAL_PASSPORT.height}mm`,
                            backgroundColor: formData.backgroundColor
                          }}
                        >
                          {selectedFiles[index % selectedFiles.length] && (
                            <>
                              <img 
                                src={URL.createObjectURL(selectedFiles[index % selectedFiles.length])}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Display name and date on the preview */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-20 py-0.5 px-1 flex justify-between items-center">
                                {formData.name && (
                                  <span className="text-white text-[5px] truncate max-w-[70%]">{formData.name}</span>
                                )}
                                {/* Add a spacer if both name and date exist */}
                                {formData.name && formData.date && <span className="mx-1" />}
                                {formData.date && (
                                  <span className="text-white text-[5px]">
                                    {new Date(formData.date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">Preview will appear here</p>
                  )}
                </div>
                <Button 
                  className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm"
                  onClick={() => selectedFiles.length > 0 && handleSubmit(selectedFiles[0], 0)}
                  disabled={selectedFiles.length === 0}
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Download
                </Button>
                {/* Print Button */}
                <Button
                  className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white text-sm"
                  onClick={handlePrint}
                  disabled={selectedFiles.length === 0}
                  type="button"
                >
                  Print
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PassportPhoto;

