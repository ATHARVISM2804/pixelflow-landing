import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  User,
  Bell,
  Plus,
  Moon,
  CreditCard,
  FileCheck,
  Car,
  Vote,
  Shield
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import { Link } from "react-router-dom"

const freeCards = [
  {
    id: 1,
    title: "AePDS Ration Slip",
    description: "Generate AePDS ration card slip",
    icon: Shield,
    bgColor: "from-gray-600 to-gray-700",
    iconBg: "bg-gray-600",
    path: "/aepds-ration"
  },
  {
    id: 2,
    title: "Driving Licence Slip",
    description: "Create driving license slip",
    icon: Car,
    bgColor: "from-green-500 to-green-600",
    iconBg: "bg-green-500",
    path: "/driving-license"
  },
  {
    id: 3,
    title: "IMPDS Ration Slip",
    description: "Generate IMPDS ration slip",
    icon: FileCheck,
    bgColor: "from-amber-600 to-amber-700",
    iconBg: "bg-amber-600",
    path: "/impds-ration"
  },
  {
    id: 4,
    title: "Voter Slip",
    description: "Create voter ID slip",
    icon: Vote,
    bgColor: "from-red-500 to-red-600",
    iconBg: "bg-red-500",
    path: "/voter-slip"
  }
]

export function Cards() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
              <span className="text-lg sm:text-2xl font-bold text-white">All Free Cards</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium shadow-lg transition-all text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Service Request</span>
              <span className="sm:hidden">New</span>
            </Button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-slate-300 hidden md:inline">Hey, atharv golait</span>
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {freeCards.map((card) => (
              <Link key={card.id} to={card.path}>
                <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group">
                  <CardContent className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                    {/* Icon Circle */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-800/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${card.iconBg} flex items-center justify-center`}>
                        <card.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Card Title */}
                    <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {card.title}
                    </h3>
                    
                    {/* Free Badge */}
                    <div className="inline-block px-2 sm:px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                      <span className="text-green-400 text-xs sm:text-sm font-medium">Free</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-8 sm:mt-12">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
                  Free Card Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Features:</h4>
                    <ul className="text-gray-400 space-y-1 text-xs sm:text-sm">
                      <li>• No cost - completely free</li>
                      <li>• Quick generation</li>
                      <li>• Professional templates</li>
                      <li>• Download ready files</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Supported Formats:</h4>
                    <ul className="text-gray-400 space-y-1 text-xs sm:text-sm">
                      <li>• PDF format</li>
                      <li>• High resolution images</li>
                      <li>• Print-ready quality</li>
                      <li>• Multiple size options</li>
                    </ul>
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

export default Cards

