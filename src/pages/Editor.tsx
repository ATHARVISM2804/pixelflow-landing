import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Home,
  CreditCard,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  User,
  Edit3,
  FileStack,
  Bell,
  DollarSign,
  MessageSquare,
  Download,
  RotateCcw,
  RotateCw,
  AlertTriangle,
  Play,
  Upload,
  Moon,
  ToggleLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export function Editor() {
  const [brightness, setBrightness] = useState([100])
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      {/* Custom Sidebar */}
      <div className="hidden lg:block bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/50">
        <div className="px-6 py-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">ID Maker</span>
          </div>
        </div>
        
        <div className="px-3 py-4">
          <div className="space-y-2">
            <button 
              onClick={() => { window.location.href = "/dashboard" }}
              className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </button>
            
            <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Services</div>
            
            <button 
              onClick={() => { window.location.href = "/passport-photo" }}
              className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4" />
                <span>Passport Photo</span>
              </div>
            </button>
            
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <div className="flex items-center gap-3">
                <Edit3 className="h-4 w-4" />
                <span>Editor</span>
              </div>
            </div>
            
            <button className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4" />
                <span>Cards</span>
              </div>
            </button>
            
            <button className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <FileStack className="h-4 w-4" />
                <span>Free Cards</span>
              </div>
            </button>
            
            <button className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4" />
                <span>Kundli</span>
              </div>
            </button>
            
            <button className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4" />
                <span>Page Maker</span>
              </div>
            </button>
            
            <button className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4" />
                <span>Resume Maker</span>
              </div>
            </button>
            
            <button className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4" />
                <span>ID Cards</span>
              </div>
            </button>
            
            <button className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4" />
                <span>Add Money</span>
              </div>
            </button>
            
            <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Other</div>
            
            <button className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4" />
                <span>Contact</span>
              </div>
            </button>
            
            <button className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </div>
            </button>
            
            <button className="w-full text-left p-2 mt-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </div>
            </button>
            
            <div className="mt-8 flex items-center justify-between px-3">
              <ToggleLeft className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Edit3 className="h-5 w-5 text-indigo-400" />
              <span className="text-2xl font-bold text-white">Image Editor</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">Hey, Ashish Ranjan</span>
            <Bell className="h-5 w-5 text-slate-400" />
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <Moon className="h-5 w-5 text-slate-400" />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Editor Panel */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-white">Free Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Control Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30">
                    Brightness
                  </Button>
                  <Button variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50">
                    Saturation
                  </Button>
                  <Button variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50">
                    Inversion
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50">
                    Grayscale
                  </Button>
                  <Button variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50">
                    Quality
                  </Button>
                </div>

                {/* Brightness Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-300 text-sm">Brightness</label>
                    <span className="text-gray-300 text-sm">{brightness[0]}%</span>
                  </div>
                  <Slider
                    value={brightness}
                    onValueChange={setBrightness}
                    max={200}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-3">
                  <Button variant="outline" size="sm" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50">
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>

                {/* Width & Height Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm">Width</label>
                    <Input
                      placeholder="Width"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm">Height</label>
                    <Input
                      placeholder="Height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50">
                    Reset
                  </Button>
                  <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white">Image</CardTitle>
                  <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-gray-400 text-sm">Processed image after edit will be visible here</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] bg-white rounded-lg p-6 flex items-center justify-center">
                  <div className="w-full max-w-sm space-y-6">
                    {/* Mock image placeholder with elements */}
                    <div className="flex gap-4">
                      <div className="w-20 h-16 bg-gray-400 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    
                    <div className="w-24 h-24 bg-gray-300 rounded-full ml-auto"></div>
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

export default Editor;
