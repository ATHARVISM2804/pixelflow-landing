import React, { useState, useRef, useEffect } from 'react'
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
  CreditCard,
  User,
  Upload,
  Download,
  FileImage,
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useToast } from "@/components/ui/use-toast"
import { PDFDocument, rgb } from 'pdf-lib'
import html2canvas from 'html2canvas'
import axios from "axios";
import { auth } from '../auth/firebase'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;



export function IdCard() {
  const [formData, setFormData] = useState({
    template: 'school-blue',
    header: '',
    data: '',
    footer: '',
    photo: null,
    logo: null,
    sign: null,
    principalSign: '',
    schoolName: '',
    schoolSubTitle: '',
    name: '',
    father: '',
    mother: '',
    class: '',
    dob: '',
    rollNo: '',
    address: '',
    phone: '',
    session: '',
    admissionNo: '',
    schoolContact: ''
  })

  const [files, setFiles] = useState({
    photo: null as File | null,
    logo: null as File | null,
    sign: null as File | null
  })

  const [fileUrls, setFileUrls] = useState({
    photo: null as string | null,
    logo: null as string | null,
    sign: null as string | null
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }))
    
    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file)
      setFileUrls(prev => ({ ...prev, [field]: url }))
    } else {
      setFileUrls(prev => ({ ...prev, [field]: null }))
    }
  }

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [])

  // Template configurations
  const templateConfigs = {
    'school-blue': {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      backgroundColor: '#ffffff',
      textColor: '#1f2937'
    },
    'school-red': {
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      backgroundColor: '#ffffff',
      textColor: '#1f2937'
    },
    'school-green': {
      primaryColor: '#16a34a',
      secondaryColor: '#15803d',
      backgroundColor: '#ffffff',
      textColor: '#1f2937'
    }
  }

  const currentTemplate = templateConfigs[formData.template] || templateConfigs['school-blue']

  // Generate ID card as image with exact dimensions
  const generateCardImage = async (): Promise<string> => {
    // Standard ID card size: 85.6mm x 53.98mm at 300 DPI
    const mmToPixels = 11.811 // 300 DPI conversion
    const cardWidthPx = Math.round(30.6 * mmToPixels)
    const cardHeightPx = Math.round(20.98 * mmToPixels)

    const canvas = document.createElement('canvas')
    canvas.width = cardWidthPx
    canvas.height = cardHeightPx
    const ctx = canvas.getContext('2d')!

    // Layout constants (scaled to match preview proportions)
    const layout = {
      padding: 12,
      headerHeight: 56,
      photo: {
        x: 16,
        y: 70,
        width: 80,
        height: 110
      },
      text: {
        x: 110,
        y: 80,
        lineHeight: 18
      }
    };

    // Fill background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw header with exact height
    ctx.fillStyle = currentTemplate.primaryColor
    ctx.fillRect(0, 0, canvas.width, layout.headerHeight)

    // Draw school logo if available (positioned like preview)
    if (fileUrls.logo) {
      const logoImg = new Image()
      logoImg.crossOrigin = 'anonymous'
      await new Promise((resolve) => {
        logoImg.onload = resolve
        logoImg.src = fileUrls.logo!
      })

      // Draw logo (circular) - matches preview w-10 h-10
      const logoSize = 40
      const logoX = 16
      const logoY = (layout.headerHeight - logoSize) / 2

      ctx.save()
      ctx.beginPath()
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
      ctx.restore()

      // Draw white border around logo
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      // Default logo placeholder
      const logoSize = 40
      const logoX = 16
      const logoY = (layout.headerHeight - logoSize) / 2
      
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.beginPath()
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2)
      ctx.stroke()
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('LOGO', logoX + logoSize/2, logoY + logoSize/2 + 3)
    }

    // Draw school name (centered, matches preview)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(
      formData.schoolName || 'SCHOOL NAME', 
      canvas.width / 2, 
      layout.headerHeight / 2 - 4
    )

    // Draw school subtitle
    ctx.font = '10px Arial'
    ctx.fillText(
      formData.schoolSubTitle || 'School Subtitle', 
      canvas.width / 2, 
      layout.headerHeight / 2 + 12
    )

    // Draw student photo with exact positioning
    if (fileUrls.photo) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((resolve) => {
        img.onload = resolve
        img.src = fileUrls.photo!
      })

      // Draw photo with border (exact size from preview)
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 1
      ctx.strokeRect(
        layout.photo.x, 
        layout.photo.y, 
        layout.photo.width, 
        layout.photo.height
      )
      ctx.drawImage(
        img, 
        layout.photo.x, 
        layout.photo.y, 
        layout.photo.width, 
        layout.photo.height
      )

      // Draw decorative corners (exact size from preview - w-2 h-2)
      ctx.fillStyle = currentTemplate.primaryColor
      const cornerSize = 8
      
      // Top-left
      ctx.beginPath()
      ctx.moveTo(layout.photo.x, layout.photo.y)
      ctx.lineTo(layout.photo.x + cornerSize, layout.photo.y)
      ctx.lineTo(layout.photo.x, layout.photo.y + cornerSize)
      ctx.closePath()
      ctx.fill()
      
      // Top-right
      ctx.beginPath()
      ctx.moveTo(layout.photo.x + layout.photo.width, layout.photo.y)
      ctx.lineTo(layout.photo.x + layout.photo.width - cornerSize, layout.photo.y)
      ctx.lineTo(layout.photo.x + layout.photo.width, layout.photo.y + cornerSize)
      ctx.closePath()
      ctx.fill()
      
      // Bottom-left
      ctx.beginPath()
      ctx.moveTo(layout.photo.x, layout.photo.y + layout.photo.height)
      ctx.lineTo(layout.photo.x + cornerSize, layout.photo.y + layout.photo.height)
      ctx.lineTo(layout.photo.x, layout.photo.y + layout.photo.height - cornerSize)
      ctx.closePath()
      ctx.fill()
      
      // Bottom-right
      ctx.beginPath()
      ctx.moveTo(layout.photo.x + layout.photo.width, layout.photo.y + layout.photo.height)
      ctx.lineTo(layout.photo.x + layout.photo.width - cornerSize, layout.photo.y + layout.photo.height)
      ctx.lineTo(layout.photo.x + layout.photo.width, layout.photo.y + layout.photo.height - cornerSize)
      ctx.closePath()
      ctx.fill()
    } else {
      // Photo placeholder (exact size from preview)
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(
        layout.photo.x, 
        layout.photo.y, 
        layout.photo.width, 
        layout.photo.height
      )
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 1
      ctx.strokeRect(
        layout.photo.x, 
        layout.photo.y, 
        layout.photo.width, 
        layout.photo.height
      )
      
      // Placeholder text
      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(
        'PHOTO', 
        layout.photo.x + layout.photo.width/2, 
        layout.photo.y + layout.photo.height/2 + 3
      )
    }

    // Draw student information (matches preview text-xs spacing)
    ctx.fillStyle = currentTemplate.textColor
    ctx.font = '10px Arial'
    ctx.textAlign = 'left'
    
    let currentY = layout.text.y
    const drawInfoLine = (label: string, value: string) => {
      // Draw bold label
      ctx.font = 'bold 10px Arial'
      ctx.fillText(`${label}:`, layout.text.x, currentY)
      
      // Draw normal value
      ctx.font = '10px Arial'
      const labelMetrics = ctx.measureText(`${label}: `)
      ctx.fillText(
        value || '-', 
        layout.text.x + labelMetrics.width, 
        currentY
      )
      currentY += layout.text.lineHeight
    }

    // Student info lines (matches preview order)
    drawInfoLine('Name', formData.name)
    drawInfoLine('Father', formData.father)
    drawInfoLine('Mother', formData.mother)
    drawInfoLine('Class', formData.class)
    drawInfoLine('Roll No', formData.rollNo)
    drawInfoLine('DOB', formData.dob)
    drawInfoLine('Session', formData.session)
    drawInfoLine('Admission', formData.admissionNo)

    // Draw address (matches preview mt-2 spacing)
    currentY += 8
    ctx.font = 'bold 10px Arial'
    ctx.fillText('Address:', layout.text.x, currentY)
    currentY += layout.text.lineHeight
    
    const address = formData.address || '-'
    const maxWidth = canvas.width - layout.text.x - layout.padding
    const words = address.split(' ')
    let line = ''
    
    ctx.font = '10px Arial'
    for (const word of words) {
      const testLine = line + word + ' '
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line.trim(), layout.text.x, currentY)
        line = word + ' '
        currentY += layout.text.lineHeight
      } else {
        line = testLine
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), layout.text.x, currentY)
      currentY += layout.text.lineHeight
    }

    // Draw custom fields
    customFields.forEach(field => {
      if (field.key && field.value) {
        ctx.font = 'bold 10px Arial'
        ctx.fillText(`${field.key}:`, layout.text.x, currentY)
        
        ctx.font = '10px Arial'
        const labelMetrics = ctx.measureText(`${field.key}: `)
        ctx.fillText(field.value, layout.text.x + labelMetrics.width, currentY)
        currentY += layout.text.lineHeight
      }
    })

    // Footer area (matches preview mt-4 positioning)
    const footerY = canvas.height - 24

    // Draw school contact (bottom left)
    if (formData.schoolContact) {
      ctx.font = 'bold 8px Arial'
      ctx.textAlign = 'left'
      ctx.fillText('Contact:', layout.padding, footerY)
      
      ctx.font = '8px Arial'
      const contactLabelWidth = ctx.measureText('Contact: ').width
      ctx.fillText(formData.schoolContact, layout.padding + contactLabelWidth, footerY)
    }

    // Draw signature area (bottom right, matches preview)
    const signatureX = canvas.width - 80
    const signatureY = footerY - 16
    
    if (fileUrls.sign) {
      const signImg = new Image()
      signImg.crossOrigin = 'anonymous'
      await new Promise((resolve) => {
        signImg.onload = resolve
        signImg.src = fileUrls.sign!
      })
      
      // Draw signature image (matches preview h-4 w-16)
      ctx.drawImage(
        signImg, 
        signatureX, 
        signatureY, 
        64, 
        16
      )
    }
    
    // Draw signature line (matches preview w-16)
    ctx.strokeStyle = '#9ca3af'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(signatureX, footerY)
    ctx.lineTo(signatureX + 64, footerY)
    ctx.stroke()
    
    // Draw principal name (matches preview text-2xs)
    ctx.font = '8px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(
      formData.principalSign, 
      signatureX + 32, 
      footerY + 10
    )

    // Draw border around card (matches preview)
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1)

    return canvas.toDataURL('image/png', 1.0)
  }

  // Download as image (matches preview)
  const downloadAsImage = async () => {
    // Confirmation popup
    if (!window.confirm("Are you sure you want to download the ID card image?")) return;
    try {
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      })
      const imageData = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      link.href = imageData
      link.download = `id-card-${formData.name || 'student'}.png`
      link.click()
      toast({
        title: "Image downloaded",
        description: "ID card image has been downloaded successfully.",
      })
    } catch (error) {
      console.error('Error generating image:', error)
      toast({
        title: "Error",
        description: "Failed to generate ID card image.",
        variant: "destructive"
      })
    }
  }

  // Add transaction creation function
  // const uid = "user123"; // Replace with actual user auth ID

  // const createCardTransaction = async () => {
  //   try {
  //     await cardApi.createIdCard({
  //       uid,
  //       cardName: formData.name || 'ID_Card',
  //       metadata: {
  //         template: formData.template,
  //         school: formData.schoolName
  //       }
  //     });
      
  //     toast({
  //       title: "Transaction created",
  //       description: "Successfully charged for ID card creation",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Transaction failed",
  //       description: error.message,
  //       variant: "destructive"
  //     });
  //   }
  // };

  // Update downloadAsPdf to include transaction
  
  
  const downloadAsPdf = async () => {
    // Confirmation popup
    if (!window.confirm("Are you sure you want to download the ID card PDF?")) return;
    try {
      // Create transaction first
      // await createCardTransaction();
      
      if (!formData.name) {
        toast({
          title: "Missing Information",
          description: "Please enter student name",
          variant: "destructive"
        })
        return
      }
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      })
      const imageData = canvas.toDataURL('image/png', 1.0)
      const pdfDoc = await PDFDocument.create()
      // Convert mm to points (1mm = 2.834645669 points)
      const mmToPoints = 2.834645669
      const page = pdfDoc.addPage([
        85.6 * mmToPoints, // width in points
        53.98 * mmToPoints // height in points
      ])
      // Convert base64 to bytes
      const imageBytes = imageData.split(',')[1]
      const binaryString = atob(imageBytes)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const pngImage = await pdfDoc.embedPng(bytes)
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      })
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' }); // Use .buffer for Blob
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `id-card-${formData.name}.pdf`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 100)
      toast({
        title: "PDF downloaded",
        description: "ID card PDF generated at exact size (85.6mm × 53.98mm)",
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "Error",
        description: "Failed to generate ID card PDF.",
        variant: "destructive"
      })
    }
  }

  const [customFields, setCustomFields] = useState([
    { key: '', value: '' },
    { key: '', value: '' },
    { key: '', value: '' },
    { key: '', value: '' },
    { key: '', value: '' },
    { key: '', value: '' }
  ])

  const handleCustomFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const newFields = [...customFields]
    newFields[index][field] = value
    setCustomFields(newFields)
  }

  const FileUploadButton = ({ field, label }: { field: string, label: string }) => (
    <div>
      <Label className="text-white">{label}</Label>
      <div className="mt-1 space-y-1">
        <Button 
          variant="outline" 
          className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
          onClick={() => document.getElementById(`file-${field}`)?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        <input
          id={`file-${field}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
        />
        <p className="text-xs text-gray-500">
          {files[field] ? files[field].name : 'No file chosen'}
        </p>
      </div>
    </div>
  )

  // Add AadhaarCardData type for type safety
  type AadhaarCardData = {
    originalPage: number;
    // Add other fields if needed
  };

  // Add handleSubmit function for API call and download
  const handleSubmit = async (card: AadhaarCardData, index: number) => {
    // Confirmation popup
    if (!window.confirm("Are you sure you want to download this ID card?")) return;
    try {
      const transaction = {
        uid: auth.currentUser?.uid,
        cardName: 'ID Card',
        amount: 2,
        type: 'CARD_CREATION',
        date: new Date().toISOString(),
        metadata: { page: card.originalPage }
      };
      // Call your backend API
      await axios.post(`${BACKEND_URL}/api/transactions/card`, transaction);
      toast({
        title: "Transaction Success",
        description: "Transaction and download started.",
      });
      // Proceed with download after successful transaction
      await downloadAsImage();
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
        <DashboardHeader title="Identity Cards" icon={CreditCard} showNewServiceButton={false} />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Designer Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Designer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Templates */}
                <div>
                  <Label className="text-white">Templates</Label>
                  <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="School - Blue" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="school-blue">School - Blue</SelectItem>
                      <SelectItem value="school-red">School - Red</SelectItem>
                      <SelectItem value="school-green">School - Green</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Header, Data, Footer */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Header</Label>
                    <Input 
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"
                      value={formData.header}
                      onChange={(e) => setFormData({...formData, header: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Data</Label>
                    <Input 
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"
                      value={formData.data}
                      onChange={(e) => setFormData({...formData, data: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Footer</Label>
                    <Input 
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"
                      value={formData.footer}
                      onChange={(e) => setFormData({...formData, footer: e.target.value})}
                    />
                  </div>
                </div>

                {/* Photo and Logo */}
                <div className="grid grid-cols-2 gap-4">
                  <FileUploadButton field="photo" label="Photo" />
                  <FileUploadButton field="logo" label="Logo" />
                </div>

                {/* Sign and Principal Signature Name */}
                <div className="grid grid-cols-2 gap-4">
                  <FileUploadButton field="sign" label="Sign" />
                  <div>
                    <Label className="text-white">Principal Signature Name</Label>
                    <Input 
                      placeholder="Principal Sign"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.principalSign}
                      onChange={(e) => setFormData({...formData, principalSign: e.target.value})}
                    />
                  </div>
                </div>

                {/* School Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">School Name</Label>
                    <Input 
                      placeholder="School Name"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-white">School Sub Title</Label>
                    <Input 
                      placeholder="School Sub Title"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.schoolSubTitle}
                      onChange={(e) => setFormData({...formData, schoolSubTitle: e.target.value})}
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Name</Label>
                    <Input 
                      placeholder="Name"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Father</Label>
                    <Input 
                      placeholder="Father"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.father}
                      onChange={(e) => setFormData({...formData, father: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Mother</Label>
                    <Input 
                      placeholder="Mother"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.mother}
                      onChange={(e) => setFormData({...formData, mother: e.target.value})}
                    />
                  </div>
                </div>

                {/* Class, DOB, Roll No */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Class</Label>
                    <Input 
                      placeholder="Class"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-white">DOB</Label>
                    <Input 
                      placeholder="DOB"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Roll No</Label>
                    <Input 
                      placeholder="Roll No"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label className="text-white">Address</Label>
                  <Input 
                    placeholder="Address"
                    className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                {/* Phone, Session, Admission No */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Phone</Label>
                    <Input 
                      placeholder="Phone"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Session</Label>
                    <Input 
                      placeholder="Session"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.session}
                      onChange={(e) => setFormData({...formData, session: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Admission No</Label>
                    <Input 
                      placeholder="Admission No"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                      value={formData.admissionNo}
                      onChange={(e) => setFormData({...formData, admissionNo: e.target.value})}
                    />
                  </div>
                </div>

                {/* School Contact */}
                <div>
                  <Label className="text-white">School Contact</Label>
                  <Input 
                    placeholder="School Contact"
                    className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                    value={formData.schoolContact}
                    onChange={(e) => setFormData({...formData, schoolContact: e.target.value})}
                  />
                </div>

                {/* Custom Key-Value Pairs */}
                <div className="space-y-4">
                  {customFields.map((field, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Key {index + 1}</Label>
                        <Input 
                          placeholder={`Key ${index + 1}`}
                          className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                          value={field.key}
                          onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-white">Value {index + 1}</Label>
                        <Input 
                          placeholder={`Value ${index + 1}`}
                          className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                          value={field.value}
                          onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card Preview Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white">Card Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSubmit({ originalPage: 1 }, 0)}
                      className="bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Image
                    </Button>
                    <Button 
                      onClick={downloadAsPdf}
                      className="bg-purple-500 text-white hover:bg-purple-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* ID Card Preview */}
                <div 
                  ref={cardRef}
                  className="max-w-md mx-auto rounded-lg overflow-hidden shadow-xl border-2 border-gray-300"
                  style={{ 
                    backgroundColor: '#ffffff',
                    aspectRatio: '85.6/53.98'
                  }}
                >
                  {/* Card Header */}
                  <div 
                    className="p-4 text-center relative"
                    style={{ 
                      backgroundColor: currentTemplate.primaryColor,
                      height: '100px'
                    }}
                  >
                    <div className="flex items-center justify-between h-full">
                      {/* Logo on left */}
                      <div className="flex-shrink-0">
                        {fileUrls.logo ? (
                          <div className="relative">
                            <img 
                              src={fileUrls.logo} 
                              alt="School Logo" 
                              className="w-16 h-16 rounded-full object-cover border-2 border-white"
                            />
                          </div>
                        ) : (
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white"
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                          >
                            LOGO
                          </div>
                        )}
                      </div>
                      
                      {/* School info in center */}
                      <div className="flex-1 px-4">
                        <h3 className="font-bold text-lg text-white leading-tight">
                          {formData.schoolName || 'SCHOOL NAME'}
                        </h3>
                        <p className="text-sm text-white/90 mt-1">
                          {formData.schoolSubTitle || 'School Subtitle'}
                        </p>
                      </div>
                      
                      <div className="w-16"></div> {/* Spacer for balance */}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-4 bg-white" style={{ minHeight: '380px' }}>
                    <div className="flex gap-4">
                      {/* Photo with decorative corners */}
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-32 bg-gray-100 border-2 border-gray-300 flex items-center justify-center relative overflow-hidden">
                          {fileUrls.photo ? (
                            <img 
                              src={fileUrls.photo} 
                              alt="Student" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-gray-400" />
                          )}
                          
                          {/* Decorative corners */}
                          <div 
                            className="absolute top-0 left-0 w-3 h-3"
                            style={{ 
                              backgroundColor: currentTemplate.primaryColor,
                              clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                            }}
                          ></div>
                          <div 
                            className="absolute top-0 right-0 w-3 h-3"
                            style={{ 
                              backgroundColor: currentTemplate.primaryColor,
                              clipPath: 'polygon(0 0, 100% 0, 100% 100%)'
                            }}
                          ></div>
                          <div 
                            className="absolute bottom-0 left-0 w-3 h-3"
                            style={{ 
                              backgroundColor: currentTemplate.primaryColor,
                              clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
                            }}
                          ></div>
                          <div 
                            className="absolute bottom-0 right-0 w-3 h-3"
                            style={{ 
                              backgroundColor: currentTemplate.primaryColor,
                              clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Student Info */}
                      <div className="flex-1 text-sm space-y-1" style={{ color: '#000000' }}>
                        <div><strong>Name:</strong> {formData.name || 'Student Name'}</div>
                        <div><strong>Father:</strong> {formData.father || 'Father Name'}</div>
                        <div><strong>Mother:</strong> {formData.mother || 'Mother Name'}</div>
                        <div><strong>Class:</strong> {formData.class || 'Class'}</div>
                        <div><strong>Roll No:</strong> {formData.rollNo || 'Roll Number'}</div>
                        <div><strong>DOB:</strong> {formData.dob || 'Date of Birth'}</div>
                        <div><strong>Session:</strong> {formData.session || '2023-24'}</div>
                        <div><strong>Admission No:</strong> {formData.admissionNo || 'Admission No'}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-sm" style={{ color: '#000000' }}>
                      <div><strong>Address:</strong> {formData.address || 'Student Address'}</div>
                      
                      {/* Custom Fields */}
                      {customFields.map((field, index) => (
                        field.key && field.value && (
                          <div key={index}>
                            <strong>{field.key}:</strong> {field.value}
                          </div>
                        )
                      ))}
                      
                      {/* Signature and Contact */}
                      <div className="flex justify-between items-end mt-6">
                        <div className="text-xs">
                          {formData.schoolContact && (
                            <div>Contact: {formData.schoolContact}</div>
                          )}
                        </div>
                        <div className="text-center">
                          {fileUrls.sign ? (
                            <img 
                              src={fileUrls.sign} 
                              alt="Signature" 
                              className="h-6 w-20 object-contain mb-1"
                            />
                          ) : (
                            <div className="h-6 w-20 mb-1"></div>
                          )}
                          <div className="text-xs border-t border-gray-400 pt-1 w-20">
                            {formData.principalSign || 'Principal'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-sm">
                    Current Template: <span className="text-white capitalize">{formData.template.replace('-', ' ')}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Card Size: 85.6mm × 53.98mm (3.37" × 2.13")
                  </p>
                  <p className="text-gray-500 text-xs">
                    PDF generated at exact card dimensions for direct printing
                  </p>
                  <p className="text-gray-500 text-xs">
                    Ready for card printers or manual cutting
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default IdCard