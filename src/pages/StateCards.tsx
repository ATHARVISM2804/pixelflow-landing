import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

const defaultCards = [
  { id: "aadhar", name: "Aadhar Card", description: "Official identity document", icon: "🆔", color: "from-blue-500 to-blue-600" },
  { id: "aapar", name: "AAPAR Card", description: "Annual Performance Assessment", icon: "📊", color: "from-green-500 to-green-600" },
  { id: "abc", name: "ABC Card", description: "Academic Bank of Credits", icon: "🎓", color: "from-purple-500 to-purple-600" },
  { id: "ayushman", name: "Advance Ayushman Card", description: "Health insurance scheme", icon: "🏥", color: "from-red-500 to-red-600" },
  { id: "ration", name: "Ration Card", description: "Food security card", icon: "🌾", color: "from-orange-500 to-orange-600" },
  { id: "voter", name: "Voter ID Card", description: "Electoral identity card", icon: "🗳️", color: "from-indigo-500 to-indigo-600" },
  { id: "pan", name: "PAN Card", description: "Permanent Account Number", icon: "💼", color: "from-teal-500 to-teal-600" },
  { id: "driving", name: "Driving License", description: "Vehicle driving permit", icon: "🚗", color: "from-yellow-500 to-yellow-600" }
]

const stateNames = {
  mh: "Maharashtra", hp: "Himachal Pradesh", pb: "Punjab", gj: "Gujarat", rj: "Rajasthan",
  up: "Uttar Pradesh", br: "Bihar", wb: "West Bengal", tn: "Tamil Nadu", ka: "Karnataka",
  kl: "Kerala", ap: "Andhra Pradesh", ts: "Telangana", or: "Odisha", jh: "Jharkhand",
  as: "Assam", hr: "Haryana", mp: "Madhya Pradesh", cg: "Chhattisgarh", uk: "Uttarakhand",
  ga: "Goa", mn: "Manipur", ml: "Meghalaya", tr: "Tripura", mz: "Mizoram",
  nl: "Nagaland", ar: "Arunachal Pradesh", sk: "Sikkim", dl: "Delhi", jk: "Jammu & Kashmir",
  la: "Ladakh", ch: "Chandigarh", py: "Puducherry", an: "Andaman & Nicobar",
  dn: "Dadra & Nagar Haveli", dd: "Daman & Diu", ld: "Lakshadweep"
}

export function StateCards() {
  const { stateCode } = useParams<{ stateCode: string }>()
  const stateName = stateNames[stateCode?.toLowerCase() as keyof typeof stateNames]

  if (!stateName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
        <Sidebar />
        <div className="lg:ml-[280px] flex flex-col min-h-screen">
          <DashboardHeader title="State Not Found" icon={FileText} />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-xl mb-4">State cards not available yet</p>
              <Link to="/free-cards">
                <Button>Back to States</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title={`${stateName} - Free Cards`} icon={FileText} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="mb-6">
            <Link to="/free-cards">
              <Button variant="outline" className="mb-4 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to States
              </Button>
            </Link>
            <p className="text-gray-400 text-sm">Available free cards for {stateName}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {defaultCards.map((card) => {
              // Route override for Aadhaar and PAN
              let to = `/card/${card.id}/${stateCode}`;
              if (card.id === "aadhar") to = "/aadhaar";
              if (card.id === "pan") to = "/pan";
              if (card.id === "voter") to = "/voter";
              return (
                <Link key={card.id} to={to}>
                  <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group">
                    <CardContent className="p-4 sm:p-6 text-center space-y-4">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg`}>
                        <span className="text-2xl sm:text-3xl">{card.icon}</span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {card.name}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {card.description}
                        </p>
                      </div>
                      <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                        <span className="text-green-400 text-xs font-medium">Free</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  )
}

export default StateCards
