import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { FileStack } from "lucide-react"
import { Link } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

const indianStates = [
  { name: "Andaman & Nicobar", code: "AN", color: "from-cyan-600 to-blue-500" },
  { name: "Andhra Pradesh", code: "AP", color: "from-cyan-500 to-cyan-600" },
  { name: "Arunachal Pradesh", code: "AR", color: "from-orange-600 to-yellow-500" },
  { name: "Assam", code: "AS", color: "from-sky-500 to-sky-600" },
  { name: "Bihar", code: "BR", color: "from-indigo-500 to-indigo-600" },
  { name: "Chandigarh", code: "CH", color: "from-emerald-600 to-teal-500" },
  { name: "Chhattisgarh", code: "CG", color: "from-green-600 to-blue-500" },
  { name: "Dadra & Nagar Haveli", code: "DN", color: "from-lime-600 to-green-500" },
  { name: "Daman & Diu", code: "DD", color: "from-rose-600 to-pink-500" },
  { name: "Delhi", code: "DL", color: "from-gray-600 to-gray-500" },
  { name: "Goa", code: "GA", color: "from-yellow-600 to-orange-500" },
  { name: "Gujarat", code: "GJ", color: "from-blue-500 to-blue-600" },
  { name: "Haryana", code: "HR", color: "from-stone-500 to-stone-600" },
  { name: "Himachal Pradesh", code: "HP", color: "from-green-500 to-green-600" },
  { name: "Jammu & Kashmir", code: "JK", color: "from-blue-700 to-indigo-600" },
  { name: "Jharkhand", code: "JH", color: "from-rose-500 to-rose-600" },
  { name: "Karnataka", code: "KA", color: "from-amber-500 to-amber-600" },
  { name: "Kerala", code: "KL", color: "from-emerald-500 to-emerald-600" },
  { name: "Ladakh", code: "LA", color: "from-slate-600 to-gray-600" },
  { name: "Lakshadweep", code: "LD", color: "from-sky-600 to-cyan-500" },
  { name: "Madhya Pradesh", code: "MP", color: "from-orange-600 to-red-500" },
  { name: "Maharashtra", code: "MH", color: "from-orange-500 to-orange-600" },
  { name: "Manipur", code: "MN", color: "from-pink-600 to-red-500" },
  { name: "Meghalaya", code: "ML", color: "from-green-600 to-teal-500" },
  { name: "Mizoram", code: "MZ", color: "from-indigo-600 to-blue-500" },
  { name: "Nagaland", code: "NL", color: "from-red-600 to-pink-500" },
  { name: "Odisha", code: "OR", color: "from-lime-500 to-lime-600" },
  { name: "Punjab", code: "PB", color: "from-yellow-500 to-yellow-600" },
  { name: "Puducherry", code: "PY", color: "from-amber-600 to-orange-500" },
  { name: "Rajasthan", code: "RJ", color: "from-pink-500 to-pink-600" },
  { name: "Sikkim", code: "SK", color: "from-teal-600 to-green-500" },
  { name: "Tamil Nadu", code: "TN", color: "from-red-500 to-red-600" },
  { name: "Telangana", code: "TS", color: "from-violet-500 to-violet-600" },
  { name: "Tripura", code: "TR", color: "from-purple-600 to-pink-500" },
  { name: "Uttar Pradesh", code: "UP", color: "from-purple-500 to-purple-600" },
  { name: "Uttarakhand", code: "UK", color: "from-blue-600 to-purple-500" },
  { name: "West Bengal", code: "WB", color: "from-teal-500 to-teal-600" }
];


export function FreeCards() {
  const [search, setSearch] = useState('')

  const filteredStates = indianStates.filter(
    state =>
      state.name.toLowerCase().includes(search.toLowerCase()) ||
      state.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Free Cards - Select State" icon={FileStack} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-white   text-lg font-bold ">Select your state to access government card services</p>
            {/* State Search Input */}
            <input
              type="text"
              placeholder="Search state..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mt-4 w-full max-w-xs bg-gray-800/50 border border-gray-700/50 text-white rounded px-3 py-2 placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredStates.map((state) => (
              <Link key={state.code} to={`/free-cards/${state.code.toLowerCase()}`}>
                <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group h-full">
                  <CardContent className="p-4 sm:p-6 text-center space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl bg-gradient-to-br ${state.color} flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg`}>
                        <span className="text-white font-bold text-lg sm:text-xl">{state.code}</span>
                      </div>
                      
                      <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                        {state.name}
                      </h3>
                    </div>
                    
                    <div className="inline-block px-2 sm:px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                      <span className="text-green-400 text-xs font-medium">State Cards</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default FreeCards
