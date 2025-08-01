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
  Car,
  User,
  Bell,
  Moon,
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

export function DrivingLicense() {
  const [formData, setFormData] = useState({
    criteria: '',
    licenseNumber: '',
    dateOfBirth: ''
  })

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="flex flex-col">
        <DashboardHeader title="Make Driving Licence Slip (Cards)" icon={Car} showNewServiceButton={false} />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Make Driving Licence Slip (Cards)</CardTitle>
                <p className="text-gray-400 text-sm">Please enter the details in the input field(s) to generate the Driving Licence slip(s).</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white">Criteria <span className="text-red-500">*</span></Label>
                  <Select value={formData.criteria} onValueChange={(value) => setFormData({...formData, criteria: value})}>
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="DL No" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="dl-no">DL No</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Driving Licence Number <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Driving Licence Number"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" 
                  />
                </div>

                <div>
                  <Label className="text-white">Date of Birth <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="DD-MM-YYY"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" 
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  Submit
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">HTML Page Preview</CardTitle>
                  <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                    Print
                  </Button>
                </div>
                <p className="text-gray-400 text-sm">Easily print this page with print button.</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1/1.4] bg-white rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Driving license slip preview will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DrivingLicense
