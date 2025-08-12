import React, { useState, useRef } from 'react'
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
import { Slider } from "@/components/ui/slider"
import {
  FileText,
  User,
  Bell,
  Moon,
  Download,
  FileImage
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

export function PageMaker() {
  const [formData, setFormData] = useState({
    pageSize: 'A4',
    border: 'Yes'
  })
  
  const [files, setFiles] = useState({
    front1: null,
    back1: null,
    front2: null,
    back2: null,
    front3: null,
    back3: null,
    front4: null,
    back4: null,
    front5: null,
    back5: null
  })

  const [sliders, setSliders] = useState({
    height: [0],
    topMargin: [0],
    cardSpaceX: [1],
    width: [0],
    cardSpaceY: [1]
  })

  const fileInputRefs = useRef({})

  const handleFileUpload = (fieldName: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [fieldName]: file }))
  }

  const triggerFileUpload = (fieldName: string) => {
    fileInputRefs.current[fieldName]?.click()
  }

  const FileUploadSection = ({ frontField, backField, label }: { frontField: string, backField: string, label: string }) => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-white">Front</Label>
        <div className="mt-1 space-y-1">
          <Button 
            variant="outline" 
            className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
            onClick={() => triggerFileUpload(frontField)}
          >
            Choose File
          </Button>
          <input
            ref={el => fileInputRefs.current[frontField] = el}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(frontField, e.target.files?.[0] || null)}
          />
          <p className="text-xs text-gray-500">
            {files[frontField] ? files[frontField].name : 'No file chosen'}
          </p>
        </div>
      </div>
      
      <div>
        <Label className="text-white">Back</Label>
        <div className="mt-1 space-y-1">
          <Button 
            variant="outline" 
            className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
            onClick={() => triggerFileUpload(backField)}
          >
            Choose File
          </Button>
          <input
            ref={el => fileInputRefs.current[backField] = el}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(backField, e.target.files?.[0] || null)}
          />
          <p className="text-xs text-gray-500">
            {files[backField] ? files[backField].name : 'No file chosen'}
          </p>
        </div>
      </div>
    </div>
  )

  const SliderControl = ({ label, value, onChange, max = 100, suffix = "%" }: { label: string, value: number[], onChange: (value: number[]) => void, max?: number, suffix?: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-white text-sm">{label}</Label>
        <span className="text-white text-sm">{value[0]}{suffix}</span>
      </div>
      <Slider
        value={value}
        onValueChange={onChange}
        max={max}
        min={0}
        step={1}
        className="w-full"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Free Page Maker" icon={FileText} showNewServiceButton={false} />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Page Maker</CardTitle>
                <p className="text-gray-400 text-sm">Here you can set front and back of your card to an A4 sheet within a second.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Page Size */}
                <div>
                  <Label className="text-white">Page Size</Label>
                  <Select value={formData.pageSize} onValueChange={(value) => setFormData({...formData, pageSize: value})}>
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="A4" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem className='text-white' value="A4">A4</SelectItem>
                      <SelectItem className='text-white' value="A3">A3</SelectItem>
                      <SelectItem className='text-white' value="Letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload Sections */}
                <FileUploadSection frontField="front1" backField="back1" label="Row 1" />
                <FileUploadSection frontField="front2" backField="back2" label="Row 2" />
                <FileUploadSection frontField="front3" backField="back3" label="Row 3" />
                <FileUploadSection frontField="front4" backField="back4" label="Row 4" />
                <FileUploadSection frontField="front5" backField="back5" label="Row 5" />

                {/* Border */}
                <div>
                  <Label className="text-white">Border</Label>
                  <Select value={formData.border} onValueChange={(value) => setFormData({...formData, border: value})}>
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="Yes" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Yes" className='text-white'>Yes</SelectItem>
                      <SelectItem value="No" className='text-white'>No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-2 gap-4">
                  <SliderControl 
                    label="Height" 
                    value={sliders.height} 
                    onChange={(value) => setSliders({...sliders, height: value})} 
                  />
                  <SliderControl 
                    label="Top Margin" 
                    value={sliders.topMargin} 
                    onChange={(value) => setSliders({...sliders, topMargin: value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SliderControl 
                    label="Card Space X" 
                    value={sliders.cardSpaceX} 
                    onChange={(value) => setSliders({...sliders, cardSpaceX: value})} 
                    max={10}
                    suffix=""
                  />
                  <SliderControl 
                    label="Card Space Y" 
                    value={sliders.cardSpaceY} 
                    onChange={(value) => setSliders({...sliders, cardSpaceY: value})} 
                    max={10}
                    suffix=""
                  />
                </div>

                <SliderControl 
                  label="Width" 
                  value={sliders.width} 
                  onChange={(value) => setSliders({...sliders, width: value})} 
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Page Maker PDF file</CardTitle>
                  <div className="flex gap-2">
                    <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                      <FileImage className="h-4 w-4 mr-2" />
                      Image
                    </Button>
                    <Button className="bg-purple-500 text-white hover:bg-purple-600">
                      <Download className="h-4 w-4 mr-2" />
                      pdf
                    </Button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">This is A4 size PDF file.</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1/1.4] bg-white rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Page preview will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PageMaker
