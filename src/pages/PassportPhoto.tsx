import React, { useState, useRef } from 'react'
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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
  const [tab, setTab] = useState<'single' | 'multiple'>('single')
  const [multiFiles, setMultiFiles] = useState<(File | null)[]>(Array(8).fill(null));
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleMultiFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setMultiFiles(prev => {
      const arr = [...prev];
      arr[idx] = files[0];
      return arr;
    });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const toggleMultiple = () => {
    setIsMultiple(!isMultiple);
    setSelectedFiles([]);
  }

  const handleTabChange = (value: string) => {
    setTab(value as 'single' | 'multiple');
    setSelectedFiles([]);
  }

  const getActiveFiles = () => {
    if (tab === "single") return selectedFiles;
    return multiFiles.filter(Boolean) as File[];
  };

  // Shared PDF generation logic
  const generatePDF = async (files: File[]) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 10;
    const spacing = 2;
    const photosPerRow = Math.floor((A4_DIMENSIONS.width - 2 * margin + spacing) / (ORIGINAL_PASSPORT.width + spacing));
    const photosPerCol = Math.floor((A4_DIMENSIONS.height - 2 * margin + spacing) / (ORIGINAL_PASSPORT.height + spacing));

    for (let i = 0; i < formData.number; i++) {
      const file = files[i % files.length];
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => { img.onload = resolve });

      const row = Math.floor(i / photosPerRow);
      const col = i % photosPerRow;
      const x = margin + (col * (ORIGINAL_PASSPORT.width + spacing));
      const y = margin + (row * (ORIGINAL_PASSPORT.height + spacing));

      pdf.setDrawColor(200);
      pdf.rect(x, y, ORIGINAL_PASSPORT.width, ORIGINAL_PASSPORT.height);
      pdf.addImage(img, 'JPEG', x, y, ORIGINAL_PASSPORT.width, ORIGINAL_PASSPORT.height);

      if (formData.name || formData.date) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(7);
        if (formData.name) {
          pdf.text(formData.name, x + 2, y + ORIGINAL_PASSPORT.height - 2, { align: 'left' });
        }
        if (formData.date) {
          const dateText = new Date(formData.date).toLocaleDateString();
          pdf.text(dateText, x + ORIGINAL_PASSPORT.width - 2, y + ORIGINAL_PASSPORT.height - 2, { align: 'right' });
        }
      }

      if ((i + 1) % (photosPerRow * photosPerCol) === 0 && i + 1 < formData.number) {
        pdf.addPage();
      }
    }
    return pdf;
  };

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
      await axios.post(`${BACKEND_URL}/api/transactions/card`, transaction);
      toast({
        title: "Transaction Success",
        description: "Transaction and download started.",
      });
    } catch (err: any) {
      toast({
        title: "API Error",
        description: err?.response?.data?.message || err.message || "Failed to create transaction.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    const files = getActiveFiles();
    if (!files.length) return;
    if (!window.confirm("Are you sure you want to download the passport photo PDF?")) return;

    try {
      const pdf = await generatePDF(files);
      await handleSubmit(files[0], 0);
      pdf.save(`passport_photos_${formData.name || 'download'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handlePrint = async () => {
    const files = getActiveFiles();
    if (!files.length) return;
    if (!window.confirm("Are you sure you want to print the passport photo PDF?")) return;

    try {
      const pdf = await generatePDF(files);
      await handleSubmit(files[0], 0);
      const pdfUrl = pdf.output('bloburl');
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
        };
      }
    } catch (error) {
      console.error('Error during printing process:', error);
      toast({
        title: "Print Error",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />
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
                <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="mb-4 flex w-full bg-gray-800/60 rounded-lg p-1">
                    <TabsTrigger value="single" className={`flex-1 ${tab === 'single' ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}>Single</TabsTrigger>
                    <TabsTrigger value="multiple" className={`flex-1 ${tab === 'multiple' ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}>Multiple</TabsTrigger>
                  </TabsList>
                  <TabsContent value="single">
                    <Label className="text-white text-xs sm:text-sm">Select Photo</Label>
                    <Button variant="outline" className="bg-gray-800/50 ml-5 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white text-xs sm:text-sm mt-2" onClick={triggerFileUpload}>
                      Choose File
                    </Button>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple={false} className="hidden" onChange={handleFileUpload} />
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-400">Selected file:</p>
                        <p className="text-xs text-gray-500">{selectedFiles[0]?.name}</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="multiple">
                    <Label className="text-white text-xs sm:text-sm mb-2 block">Select Photos</Label>
                    <div className="space-y-2">
                      {multiFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center rounded border border-gray-700 bg-[#23272f] overflow-hidden" style={{ minHeight: 40 }}>
                          <div className="px-3 py-2 border-r border-gray-700 text-gray-300 text-xs w-32 flex-shrink-0 flex items-center">Select Photo</div>
                          <label className="flex-shrink-0">
                            <input type="file" accept="image/*" className="hidden" onChange={e => handleMultiFileChange(idx, e)} />
                            <button type="button" className="px-4 py-2 bg-transparent text-xs text-gray-100 hover:bg-gray-800 border-none outline-none cursor-pointer" style={{ minWidth: 90 }} onClick={e => { e.currentTarget.previousSibling.click(); }}>Choose File</button>
                          </label>
                          <div className="flex-1 px-3 py-2 text-xs text-gray-100 truncate">{file ? file.name : <span className="text-gray-400">No file chosen</span>}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-white text-xs sm:text-sm">Name</Label>
                      <Input placeholder="Enter name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-sm" />
                    </div>
                    <div>
                      <Label className="text-white text-xs sm:text-sm">Date</Label>
                      <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="mt-1 bg-gray-800/50 border-gray-700/50 text-white text-sm" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white text-xs sm:text-sm">Number</Label>
                    <Input type="number" placeholder="Images range 1 to 30" min="1" max="30" value={formData.number} onChange={(e) => setFormData({...formData, number: parseInt(e.target.value)})} className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                  </div>
                  <div>
                    <Label className="text-white text-xs sm:text-sm">Page Size</Label>
                    <Select value={formData.pageSize} onValueChange={(value) => setFormData({...formData, pageSize: value})}>
                      <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"><SelectValue placeholder="A4-Full page (30 photos)" /></SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700"><SelectItem value="a4-full">A4-Full page (30 photos)</SelectItem><SelectItem value="a4-half">A4-Half page (15 photos)</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-lg sm:text-xl">A4 size PDF</span>
                  <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"><ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"><ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"><RotateCw className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"><Share className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={previewRef} className="aspect-[1/1.4] bg-white rounded-lg flex items-center justify-center overflow-hidden p-[10mm]">
                  {getActiveFiles().length > 0 ? (
                    <div className="grid gap-[2mm] w-full h-full" style={{ gridTemplateColumns: `repeat(auto-fit, ${ORIGINAL_PASSPORT.width}mm)`, gridAutoRows: `${ORIGINAL_PASSPORT.height}mm`, alignContent: 'start' }}>
                      {Array.from({ length: formData.number }).map((_, index) => (
                        <div key={index} className="bg-white rounded overflow-hidden flex items-center justify-center border border-gray-200 relative" style={{ width: `${ORIGINAL_PASSPORT.width}mm`, height: `${ORIGINAL_PASSPORT.height}mm`, backgroundColor: formData.backgroundColor }}>
                          {getActiveFiles()[index % getActiveFiles().length] && (
                            <>
                              <img src={URL.createObjectURL(getActiveFiles()[index % getActiveFiles().length])} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-20 py-0.5 px-1 flex justify-between items-center">
                                {formData.name && <span className="text-white text-[5px] truncate max-w-[70%]">{formData.name}</span>}
                                {formData.name && formData.date && <span className="mx-1" />}
                                {formData.date && <span className="text-white text-[5px]">{new Date(formData.date).toLocaleDateString()}</span>}
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
                <Button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm" onClick={handleDownload} disabled={getActiveFiles().length === 0}>
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />Download
                </Button>
                <Button className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white text-sm" onClick={handlePrint} disabled={getActiveFiles().length === 0}>
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
  