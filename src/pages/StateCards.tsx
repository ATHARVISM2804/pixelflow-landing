'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
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
  { id: "driving", name: "Driving License", description: "Vehicle driving permit", icon: "🚗", color: "from-yellow-500 to-yellow-600" },
  { id: "did", name: "Disabled Identification (DID) Card", description: "Card for persons with disabilities", icon: "♿", color: "from-pink-500 to-pink-600" },
  { id: "uan", name: "UAN Card", description: "Universal Account Number Card", icon: "🔢", color: "from-cyan-500 to-cyan-600" }
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

// Use Google image links for logos
const cardLogos: Record<string, string> = {
  aadhar: "https://e7.pngegg.com/pngimages/279/962/png-clipart-aadhaar-uidai-identity-document-permanent-account-number-india-india-text-logo.png",
  aapar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxYY0cc_5ki8XH4g7EEvkoslYZneckQVmzNMWc5GhD_xNpMByr3NVHMsvmDO9E25JmTMy_q_txtMblK6FFd5jtZejqtoGBKm8Xn1rI11XcNcfGs8MaVco0q1RpfwJpY5tXb7oQH5N4cc0TDfVF960s2hGZ76hkdceAvdCZ_dhhlPrmpoIvltY4TmPB0fHE/s544/APAAR%20IDs%20Creation%20Link,%20Apply%20Process.png",
  abc: "https://play-lh.googleusercontent.com/Yem4hjyVQv-1kZdr92bKhNP0m3-zmP1YTgZ-gmwbqJs0TI5-we8j-RJ3rho5BykWeWA",
  ayushman: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwVc6JGxgAbpcWRQxUr9TImLUPmqe4C34b4Q&s",
  ration: "https://pbs.twimg.com/media/E2A7Qv0UcAENXgr.jpg",
  voter: "https://i.cdn.newsbytesapp.com/images/l28820230821125444.jpeg",
  pan: "https://w7.pngwing.com/pngs/157/146/png-transparent-pan-card.png",
  driving: "https://cdni.iconscout.com/illustration/premium/thumb/driving-license-illustration-svg-png-download-4397188.png",
  did: "https://www.did-card.co.uk/wp-content/uploads/sites/42/2020/10/Footer-Logo3-200x149.png",
  uan: "https://www.jagranimages.com/images/newimg/26062024/26_06_2024-uan_card_23746246.webp"
}

export function StateCards() {
  const params = useParams<{ stateCode?: string }>()
  const stateCode = params?.stateCode || ''
  const stateName = stateNames[stateCode?.toLowerCase() as keyof typeof stateNames]
  const [search, setSearch] = useState('')

  if (!stateName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
        <Sidebar />
        <div className="lg:ml-[280px] flex flex-col min-h-screen">
          <DashboardHeader title="State Not Found" icon={FileText} />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-xl mb-4">State cards not available yet</p>
              <Link href="/free-cards">
                <Button>Back to States</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Filter cards by search input (name or description)
  const filteredCards = defaultCards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title={`${stateName} - Free Cards`} icon={FileText} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="mb-6">
            <Link href="/free-cards">
              <Button variant="outline" className="mb-4 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to States
              </Button>
            </Link>
            <div className='flex items-center justify-between'>
              <p className="text-white   text-lg font-bold">Available free cards for {stateName}</p>
              {/* Card Search Input */}
              <input
                type="text"
                placeholder="Search card..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mt-4 w-full max-w-xs bg-gray-800/50 border border-gray-700/50 text-white rounded px-3 py-2 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCards.map((card) => {
              // Route override for Aadhaar and PAN
              let to = `/card/${card.id}/${stateCode}`;
              if (card.id === "aadhar") to = "/aadhaar";
              if (card.id === "pan") to = "/pan";
              if (card.id === "voter") to = "/voter";
              if (card.id === "aapar") to = "/apaar";
              if (card.id === "ayushman") to = "/abha";
              if (card.id === "did") to = "/did";
              if (card.id === "uan") to = "/uan";
              if (card.id === "abc") to = "/abc";
              return (
                <Link key={card.id} href={to}>
                  <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group">
                    <CardContent className="p-4 sm:p-6 text-center space-y-4">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg`}>
                        {cardLogos[card.id] ? (
                          <img
                            src={cardLogos[card.id]}
                            alt={`${card.name} logo`}
                            className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                          />
                        ) : (
                          <span className="text-2xl sm:text-3xl">{card.icon}</span>
                        )}
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
