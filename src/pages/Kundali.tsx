'use client'

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
  Star,
  User,
  Bell,
  Moon,
  Download
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

export function Kundali() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    hour: '',
    min: '',
    sec: '',
    language: 'english',
    city: ''
  })

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const seconds = Array.from({ length: 60 }, (_, i) => i)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Kundli" icon={Star} showNewServiceButton={false} />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Make Kundli</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Name <span className="text-red-500">*</span></Label>
                    <Input 
                      placeholder="Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" 
                    />
                  </div>
                  <div>
                    <Label className="text-white">Gender <span className="text-red-500">*</span></Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                        <SelectValue placeholder="Male" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem className='text-white' value="male">Male</SelectItem>
                        <SelectItem className='text-white' value="female">Female</SelectItem>
                        <SelectItem className='text-white' value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <Label className="text-white">Date of Birth</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <Label className="text-sm text-gray-400">Day <span className="text-red-500">*</span></Label>
                      <Select value={formData.day} onValueChange={(value) => setFormData({...formData, day: value})}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="1" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {days.map((day) => (
                            <SelectItem key={day} value={day.toString()} className="text-white">{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-400">Month <span className="text-red-500">*</span></Label>
                      <Select value={formData.month} onValueChange={(value) => setFormData({...formData, month: value})}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="1" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {months.map((month) => (
                            <SelectItem key={month} value={month.toString()} className="text-white">{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-400">Year <span className="text-red-500">*</span></Label>
                      <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="2023" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()} className="text-white">{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Time of Birth */}
                <div>
                  <Label className="text-white">Time of Birth</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <Label className="text-sm text-gray-400">Hour <span className="text-red-500">*</span></Label>
                      <Select value={formData.hour} onValueChange={(value) => setFormData({...formData, hour: value})}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="0" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {hours.map((hour) => (
                            <SelectItem key={hour} value={hour.toString()} className="text-white">{hour}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-400">Min <span className="text-red-500">*</span></Label>
                      <Select value={formData.min} onValueChange={(value) => setFormData({...formData, min: value})}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="0" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {minutes.map((min) => (
                            <SelectItem key={min} value={min.toString()} className="text-white">{min}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-400">Sec <span className="text-red-500">*</span></Label>
                      <Select value={formData.sec} onValueChange={(value) => setFormData({...formData, sec: value})}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="0" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {seconds.map((sec) => (
                            <SelectItem key={sec} value={sec.toString()} className="text-white">{sec}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <Label className="text-white">Language <span className="text-red-500">*</span></Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="english" className="text-white">English</SelectItem>
                      <SelectItem value="hindi" className="text-white">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select City */}
                <div>
                  <Label className="text-white">Select City <span className="text-red-500">*</span></Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})}>
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="mumbai" className="text-white">Mumbai</SelectItem>
                      <SelectItem value="delhi" className="text-white">Delhi</SelectItem>
                      <SelectItem value="bangalore" className="text-white">Bangalore</SelectItem>
                      <SelectItem value="chennai" className="text-white">Chennai</SelectItem>
                      <SelectItem value="kolkata" className="text-white">Kolkata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  Submit
                </Button>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white">Kundli Preview</CardTitle>
                  <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                    <Download className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1/1.4] bg-white rounded-lg p-4">
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Kundli preview will appear here after form submission</p>
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

export default Kundali

