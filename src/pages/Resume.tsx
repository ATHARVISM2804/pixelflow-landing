import React, { useState } from 'react'
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

export function Resume() {
  const [academicEntries, setAcademicEntries] = useState([{ exam: '', board: '', year: '', marks: '', division: '' }])
  const [professionalEntries, setProfessionalEntries] = useState([{ exam: '', board: '', year: '', marks: '', division: '' }])

  const addAcademicEntry = () => {
    setAcademicEntries([...academicEntries, { exam: '', board: '', year: '', marks: '', division: '' }])
  }

  const addProfessionalEntry = () => {
    setProfessionalEntries([...professionalEntries, { exam: '', board: '', year: '', marks: '', division: '' }])
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-indigo-400" />
              <span className="text-2xl font-bold text-white">Resume Maker</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">Hey, Ashish Ranjan</span>
            <Bell className="h-5 w-5 text-slate-400" />
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Form Section */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Make Resume @2/-</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Type *</Label>
                      <Select>
                        <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="Resume" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="resume">Resume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Photo</Label>
                      <Button variant="outline" className="w-full mt-1 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white">Name *</Label>
                      <Input placeholder="Name" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <Label className="text-white">Phone *</Label>
                      <Input placeholder="Phone" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <Label className="text-white">Email *</Label>
                      <Input placeholder="Email" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
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
                    <Label className="text-white text-lg">Academic Qualification *</Label>
                    <div className="space-y-4 mt-2">
                      {academicEntries.map((entry, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2">
                          <Input placeholder="Exam" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                          <Input placeholder="Board/University" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                          <Input placeholder="Passing year" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                          <Input placeholder="Marks %" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                          <Input placeholder="Division" className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                        </div>
                      ))}
                      <Button 
                        onClick={addAcademicEntry}
                        className="bg-indigo-500 text-white hover:bg-indigo-600"
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

                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* PDF Preview Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white">A4 size PDF</CardTitle>
                  <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-gray-400 text-sm">This is A4 size paper. This page might not work for PWA user.</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1/1.4] bg-white rounded-lg p-4">
                  {/* Mock Resume Preview */}
                  <div className="h-full flex flex-col space-y-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-24 bg-gray-300 rounded"></div>
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
