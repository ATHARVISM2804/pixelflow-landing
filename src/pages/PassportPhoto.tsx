import React from 'react'
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
  Plus,
  User,
  Bell,
} from "lucide-react"
import Sidebar from "@/components/Sidebar"

export function PassportPhoto() {
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
              <span className="text-2xl font-bold text-white">Passport Size Photo</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-all">
              <Plus className="h-4 w-4 mr-2" />
              New Service Request
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-300">Hey, Ashish Ranjan</span>
              <Bell className="h-5 w-5 text-slate-400" />
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <p className="text-gray-400">Create passport size photos in one click</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Form Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-indigo-400" />
                    Information
                  </div>
                </CardTitle>
                <div className="space-y-2 mt-2">
                  <p className="text-indigo-400 text-sm">Hindi: फोटो अपलोड करने से पहले, फोटो का आकार करें 35 x 17 मि (280 x 210 पिक्सेल) ।</p>
                  <p className="text-gray-400 text-sm">English: Before uploading the photo, resize the photo to 35 x 17 or 280 x 210 pixels.</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Select Photo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button variant="outline" className="w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                      Choose File
                    </Button>
                    <Button variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                      Multiple
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Name</Label>
                    <Input 
                      placeholder="Enter name" 
                      className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Date</Label>
                    <Input type="date" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white" />
                  </div>

                  <div>
                    <Label className="text-white">Number</Label>
                    <Input type="number" placeholder="Images range 1 to 30" className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500" />
                  </div>

                  <div>
                    <Label className="text-white">Page Size</Label>
                    <Select>
                      <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                        <SelectValue placeholder="A4-Full page (30 photos)" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="a4-full">A4-Full page (30 photos)</SelectItem>
                        <SelectItem value="a4-half">A4-Half page (15 photos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Background Color</Label>
                    <Input type="color" className="mt-1 h-10 bg-gray-800/50 border-gray-700/50" />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>A4 size PDF</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1/1.4] bg-white rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Preview will appear here</p>
                </div>
                <Button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PassportPhoto
