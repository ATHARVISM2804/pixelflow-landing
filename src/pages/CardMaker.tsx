'use client'

import React, { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, Download, ChevronLeft, ChevronRight } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useTermsNCondition } from "@/components/TermsNCondition"

const cardTypes = {
  aapar: { name: "AAPAR Card", icon: "📊", fields: ["employeeId", "name", "department"] },
  ayushman: { name: "Advance Ayushman Card", icon: "🏥", fields: ["beneficiaryId", "name", "familyId"] },
  ration: { name: "Ration Card", icon: "🌾", fields: ["rationNumber", "headOfFamily", "familyMembers"] },
  voter: { name: "Voter ID Card", icon: "🗳️", fields: ["epicNumber", "name", "constituency"] },
  // pan: { name: "PAN Card", icon: "💼", fields: ["panNumber", "name", "fatherName"] },
  driving: { name: "Driving License", icon: "🚗", fields: ["licenseNumber", "name", "dateOfBirth"] }
}

const stateNames = {
  // States
  ap: "Andhra Pradesh",
  ar: "Arunachal Pradesh", 
  as: "Assam",
  br: "Bihar",
  cg: "Chhattisgarh",
  ga: "Goa",
  gj: "Gujarat",
  hr: "Haryana",
  hp: "Himachal Pradesh",
  jh: "Jharkhand",
  ka: "Karnataka",
  kl: "Kerala",
  mp: "Madhya Pradesh",
  mh: "Maharashtra",
  mn: "Manipur",
  ml: "Meghalaya",
  mz: "Mizoram",
  nl: "Nagaland",
  or: "Odisha",
  pb: "Punjab",
  rj: "Rajasthan",
  sk: "Sikkim",
  tn: "Tamil Nadu",
  tg: "Telangana",
  tr: "Tripura",
  up: "Uttar Pradesh",
  uk: "Uttarakhand",
  wb: "West Bengal",
  
  // Union Territories
  an: "Andaman & Nicobar Islands",
  ch: "Chandigarh",
  dl: "Delhi",
  dd: "Daman & Diu",
  dn: "Dadra & Nagar Haveli",
  jk: "Jammu & Kashmir",
  la: "Ladakh",
  ld: "Lakshadweep",
  py: "Puducherry"
}

export function CardMaker() {
  const params = useParams<{ cardType?: string; stateCode?: string }>()
  const cardType = params?.cardType || ''
  const stateCode = params?.stateCode || ''
  const { openModal, modal } = useTermsNCondition()
  
  const [formData, setFormData] = useState({
    password: '',
    phoneNumber: 'No',
    selectedFile: null as File | null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const card = cardTypes[cardType as keyof typeof cardTypes]
  const stateName = stateNames[stateCode?.toLowerCase() as keyof typeof stateNames]

  if (!card || !stateName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
        <Sidebar />
        <div className="lg:ml-[280px] flex flex-col min-h-screen">
          <DashboardHeader title="Card Not Found" icon={FileText} />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-xl mb-4">Card type not available</p>
              <Link href="/free-cards">
                <Button>Back to Free Cards</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, selectedFile: file }))
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Show Aadhar-specific interface for aadhar card type
  if (cardType === 'aadhar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
        <Sidebar />

        <div className="lg:ml-[280px] flex flex-col min-h-screen">
          <DashboardHeader title={`Make Aadhaar (Cards)`} icon={FileText} showNewServiceButton={false} />

          <main className="flex-1 p-3 sm:p-6">
            <div className="mb-6">
              <Link href={`/free-cards/${stateCode}`}>
                <Button variant="outline" className="mb-4 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {stateName} Cards
                </Button>
              </Link>
            </div>

            {/* Notice Section */}
            <div className="mb-6">
              <Card className="bg-green-900/20 border border-green-500/30">
                <CardContent className="p-4">
                  <h3 className="text-green-400 font-semibold text-lg mb-2">Notice</h3>
                  <p className="text-green-300 text-sm">
                    We only support original aadhaar PDF files downloaded from UIDAI with valid signature.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Form */}
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Make Aadhaar (Cards)</CardTitle>
                  <p className="text-gray-400 text-sm">
                    Please enter the Aadhaar number in the input field(s) to generate the Aadhaar card(s).
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password Field */}
                  <div>
                    <Label className="text-white text-sm">Password</Label>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <Label className="text-white text-sm">
                      Select Aadhaar <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1 flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={triggerFileUpload}
                        className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
                      >
                        Choose File
                      </Button>
                      <span className="text-gray-400 text-sm">
                        {formData.selectedFile ? formData.selectedFile.name : 'No file chosen'}
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {/* Phone Number Dropdown */}
                  <div>
                    <Label className="text-white text-sm">Phone Number</Label>
                    <Select value={formData.phoneNumber} onValueChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}>
                      <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 rounded-lg font-medium text-lg"
                    disabled={!formData.selectedFile}
                  >
                    Submit
                  </Button>
                  
                  {/* Terms & Conditions Button */}
                  <Button 
                    onClick={openModal}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 mt-3"
                  >
                    Terms & Conditions
                  </Button>
                </CardContent>
              </Card>

              {/* Right Panel - Preview */}
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">Front and Back</CardTitle>
                    <Button className="bg-purple-500 text-white hover:bg-purple-600 text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Please click on the &lt; and &gt; to slide the images.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 rounded-lg p-6 min-h-[400px] relative">
                    {/* Card Preview Area */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Front Side */}
                      <div className="bg-gray-300 rounded-lg h-32 flex items-center justify-center">
                        <div className="w-16 h-20 bg-gray-400 rounded"></div>
                      </div>
                      {/* Back Side Info */}
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-400 rounded w-full"></div>
                        <div className="h-3 bg-gray-400 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-400 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-400 rounded w-2/3"></div>
                      </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-gray-500/20 border-gray-500/30 hover:bg-gray-500/30"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="text-center">
                        <div className="space-y-2">
                          <div className="h-2 bg-gray-400 rounded w-32 mx-auto"></div>
                          <div className="h-2 bg-gray-400 rounded w-24 mx-auto"></div>
                          <div className="h-2 bg-gray-400 rounded w-28 mx-auto"></div>
                          <div className="h-2 bg-gray-400 rounded w-20 mx-auto"></div>
                          <div className="h-2 bg-gray-400 rounded w-32 mx-auto"></div>
                          <div className="h-2 bg-gray-400 rounded w-16 mx-auto"></div>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-gray-500/20 border-gray-500/30 hover:bg-gray-500/30"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Profile Circle */}
                    <div className="absolute bottom-6 right-6">
                      <div className="w-20 h-20 bg-gray-400 rounded-full"></div>
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

  // For other card types, show the generic interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title={`${card.name} - ${stateName}`} icon={FileText} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="mb-6">
            <Link href={`/free-cards/${stateCode}`}>
              <Button variant="outline" className="mb-4 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {stateName} Cards
              </Button>
            </Link>
            <p className="text-gray-400 text-sm">Create your {card.name} for {stateName}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-2xl">{card.icon}</span>
                  Make {card.name}
                </CardTitle>
                <p className="text-gray-400 text-sm">Please enter the required details to generate your {card.name}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {card.fields.map((field) => (
                  <div key={field}>
                    <Label className="text-white text-sm capitalize">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                      <span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      value={formData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                    />
                  </div>
                ))}

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  Generate {card.name}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Preview</CardTitle>
                  <Button className="bg-indigo-500 text-white hover:bg-indigo-600 text-sm">
                    Download
                  </Button>
                </div>
                <p className="text-gray-400 text-sm">Your {card.name} preview will appear here</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1.6/1] bg-white rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">{card.icon}</span>
                    <p className="text-gray-600 text-lg font-semibold">{card.name}</p>
                    <p className="text-gray-500 text-sm">{stateName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Terms & Conditions Modal */}
      {modal}
    </div>
  )
}

export default CardMaker
