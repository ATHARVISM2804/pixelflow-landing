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
  Vote,
  User,
  Bell,
  Moon,
} from "lucide-react"
import Sidebar from "@/components/Sidebar"

export function VoterSlip() {
  const [formData, setFormData] = useState({
    epicNumber: '',
    state: '',
    template: ''
  })

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between px-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <Vote className="h-5 w-5 text-indigo-400" />
            <span className="text-2xl font-bold text-white">Make Voter Slip (Cards)</span>
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

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Make Voter Slip (Cards)</CardTitle>
                <p className="text-gray-400 text-sm">Please enter the details in the input field(s) to generate the Free Voter slip.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white">Epic Number <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Epic Number"
                    value={formData.epicNumber}
                    onChange={(e) => setFormData({...formData, epicNumber: e.target.value})}
                    className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" 
                  />
                </div>

                <div>
                  <Label className="text-white">State <span className="text-red-500">*</span></Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="Andaman & Nicobar Islands" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="andaman">Andaman & Nicobar Islands</SelectItem>
                      <SelectItem value="andhra">Andhra Pradesh</SelectItem>
                      <SelectItem value="arunachal">Arunachal Pradesh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Template <span className="text-red-500">*</span></Label>
                  <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="New" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="old">Old</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <p className="text-gray-600">Voter slip preview will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default VoterSlip
