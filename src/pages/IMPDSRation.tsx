import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FileCheck,
  User,
  Bell,
  Moon,
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

export function IMPDSRation() {
  const [rationNumber, setRationNumber] = useState('')

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="flex flex-col">
        <DashboardHeader title="Make IMPDS Ration Slip (Cards)" icon={FileCheck} showNewServiceButton={false} />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Make IMPDS Ration Slip (Cards)</CardTitle>
                <p className="text-gray-400 text-sm">Please enter the details in the input field(s) to generate the IMPDS Ration card(s).</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white">Ration Number <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Ration Number"
                    value={rationNumber}
                    onChange={(e) => setRationNumber(e.target.value)}
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
                  <p className="text-gray-600">IMPDS ration slip preview will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default IMPDSRation
 
