import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  FileText,
  User,
  Bell,
  Download,
  Upload,
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

export function Resume() {
  const [academicEntries, setAcademicEntries] = useState([{ exam: '', board: '', year: '', marks: '', division: '' }])
  const [professionalEntries, setProfessionalEntries] = useState([{ exam: '', board: '', year: '', marks: '', division: '' }])
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click()
  }

  const addAcademicEntry = () => {
    setAcademicEntries([...academicEntries, { exam: '', board: '', year: '', marks: '', division: '' }])
  }

  const addProfessionalEntry = () => {
    setProfessionalEntries([...professionalEntries, { exam: '', board: '', year: '', marks: '', division: '' }])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Resume Maker" icon={FileText} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Form Section */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-2xl font-bold text-white">Make Resume @2/-</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-white text-xs sm:text-sm">Type *</Label>
                      <Select>
                        <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white text-sm">
                          <SelectValue placeholder="Resume" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="resume">Resume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white text-xs sm:text-sm">Photo</Label>
                      <div className="mt-1 space-y-1">
                        <Button 
                          variant="outline" 
                          className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 text-xs sm:text-sm"
                          onClick={triggerPhotoUpload}
                        >
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Choose File
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                        <p className="text-xs text-gray-500">
                          {photo ? photo.name : 'No file chosen'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-white text-xs sm:text-sm">Name *</Label>
                      <Input placeholder="Name" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-sm" />
                    </div>
                    <div>
                      <Label className="text-white text-xs sm:text-sm">Phone *</Label>
                      <Input placeholder="Phone" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-sm" />
                    </div>
                    <div>
                      <Label className="text-white text-xs sm:text-sm">Email *</Label>
                      <Input placeholder="Email" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white">Address *</Label>
                      <Input placeholder="Address" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <Label className="text-white">DOB *</Label>
                      <Input placeholder="DOB" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <Label className="text-white">Father *</Label>
                      <Input placeholder="Father" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white">Mother *</Label>
                      <Input placeholder="Mother" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <Label className="text-white">Nationality *</Label>
                      <Input placeholder="Nationality" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <Label className="text-white">Marital Status *</Label>
                      <Input placeholder="Marital Status" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Language *</Label>
                      <Input placeholder="Language" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <Label className="text-white">Hobbies *</Label>
                      <Input placeholder="Hobbies" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                  </div>

                  {/* Career Object */}
                  <div>
                    <Label className="text-white">Career Object *</Label>
                    <Textarea 
                      placeholder="Secure a responsible career opportunity to fully utilize my talent and skills to grow, while making a significant contribution to the success of the company. Self-motivated and hardworking fresher seeking for an opportunity to work in a challenging environment to prove my skills and utilize my knowledge. I would like to work for an organization where I can utilize my skills and knowledge and learn new skills and techniques to help in personal as well as overall organizational growth." 
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 h-32"
                    />
                  </div>

                  {/* Academic Qualification */}
                  <div>
                    <Label className="text-white text-sm sm:text-lg">Academic Qualification *</Label>
                    <div className="space-y-3 sm:space-y-4 mt-2">
                      {academicEntries.map((entry, index) => (
                        <div key={index} className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          <Input placeholder="Exam" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-xs sm:text-sm" />
                          <Input placeholder="Board/University" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-xs sm:text-sm" />
                          <Input placeholder="Passing year" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-xs sm:text-sm" />
                          <Input placeholder="Marks %" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-xs sm:text-sm" />
                          <Input placeholder="Division" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 text-xs sm:text-sm" />
                        </div>
                      ))}
                      <Button 
                        onClick={addAcademicEntry}
                        className="bg-indigo-500 text-white hover:bg-indigo-600 text-xs sm:text-sm"
                      >
                        Add +
                      </Button>
                    </div>
                  </div>

                  {/* Professional Qualification */}
                  <div>
                    <Label className="text-white text-lg">Professional Qualification *</Label>
                    <div className="space-y-4 mt-2">
                      {professionalEntries.map((entry, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2">
                          <Input placeholder="Exam" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                          <Input placeholder="Board/University" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                          <Input placeholder="Passing year" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                          <Input placeholder="Marks %" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                          <Input placeholder="Division" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                        </div>
                      ))}
                      <Button 
                        onClick={addProfessionalEntry}
                        className="bg-indigo-500 text-white hover:bg-indigo-600"
                      >
                        Add +
                      </Button>
                    </div>
                  </div>

                  {/* Extra Qualification */}
                  <div>
                    <Label className="text-white">Extra Qualification I expressed by coma *</Label>
                    <Textarea 
                      placeholder="Extra Qualification I expressed by coma"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                    />
                  </div>

                  {/* Work Experience */}
                  <div>
                    <Label className="text-white">Work Experience I separated by coma *</Label>
                    <Textarea 
                      placeholder="Work Experience I separated by coma"
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm">
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* PDF Preview Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg sm:text-xl font-bold text-white">A4 size PDF</CardTitle>
                  <Button className="bg-indigo-500 text-white hover:bg-indigo-600 text-xs sm:text-sm w-full sm:w-auto">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">This is A4 size paper. This page might not work for PWA user.</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1/1.4] bg-white rounded-lg p-2 sm:p-4">
                  {/* Mock Resume Preview */}
                  <div className="h-full flex flex-col space-y-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-24 bg-gray-300 rounded overflow-hidden">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-400 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded mb-1 w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded mb-1 w-1/2"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>

                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    </div>
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

export default Resume
