import React, { useState } from 'react'
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
  Bell,
  Upload,
  Download,
  FileImage,
  Moon
} from "lucide-react"
import Sidebar from "@/components/Sidebar"

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
    photo: null,
    logo: null,
    sign: null
  })

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }))
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

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-indigo-400" />
              <span className="text-2xl font-bold text-white">Identity Cards</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">Hey, atharv golait</span>
            <Moon className="h-5 w-5 text-slate-400" />
            <Bell className="h-5 w-5 text-slate-400" />
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </header>

        {/* Top Banner */}
        <div className="bg-gradient-to-r from-green-500 to-purple-500 p-3 text-center">
          <p className="text-white text-sm">Tell your friends about ID Maker — share the love! ❤️</p>
        </div>

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
              </CardHeader>
              <CardContent>
                {/* ID Card Preview */}
                <div className="bg-blue-600 rounded-lg p-4 max-w-sm mx-auto">
                  {/* Card Header */}
                  <div className="bg-white rounded-t-lg p-3 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-800">SCHOOL NAME</h3>
                    <p className="text-xs text-gray-600">School Subtitle</p>
                  </div>
                  
                  {/* Card Body */}
                  <div className="bg-white p-4">
                    <div className="flex gap-3">
                      {/* Photo placeholder */}
                      <div className="w-16 h-20 bg-blue-100 rounded border flex items-center justify-center">
                        <User className="h-8 w-8 text-blue-400" />
                      </div>
                      
                      {/* Student Info */}
                      <div className="flex-1 text-xs space-y-1">
                        <div><strong>Name:</strong> Student Name</div>
                        <div><strong>Father:</strong> Father Name</div>
                        <div><strong>Class:</strong> Class</div>
                        <div><strong>Roll No:</strong> Roll Number</div>
                        <div><strong>DOB:</strong> Date of Birth</div>
                        <div><strong>Session:</strong> 2023-24</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs">
                      <div><strong>Address:</strong> Student Address</div>
                      <div className="mt-2 text-center">
                        <div className="text-xs">Principal Signature</div>
                        <div className="border-t border-gray-300 w-20 mx-auto mt-1"></div>
                      </div>
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

export default IdCard