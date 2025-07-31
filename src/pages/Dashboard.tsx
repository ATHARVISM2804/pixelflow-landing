import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Home,
  Plus,
  User,
  Bell,
  FileStack,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  MessageSquare,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"

export function Dashboard() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <span className="text-lg sm:text-2xl font-bold text-white">Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium shadow-lg transition-all text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Service Request</span>
              <span className="sm:hidden">New</span>
            </Button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-slate-300 hidden md:inline">Hey, Ashish Ranjan</span>
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[{
              label: 'Balance',
              value: '0',
              icon: DollarSign,
              color: 'from-indigo-500 to-indigo-600'
            },
            {
              label: 'Cards',
              value: '0',
              icon: CreditCard,
              color: 'from-violet-500 to-purple-600'
            },
            {
              label: 'Transactions',
              value: '0',
              icon: Activity,
              color: 'from-blue-500 to-cyan-600'
            },
            {
              label: 'Payments',
              value: '0',
              icon: TrendingUp,
              color: 'from-pink-500 to-rose-600'
            }].map((stat, index) => (
              <Card key={index} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cards History */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                Cards History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800/50 hover:bg-gray-800/20">
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Req ID</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Txn ID</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden sm:table-cell">Card Type</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden md:table-cell">Charges</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden lg:table-cell">Date</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Files</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 sm:py-12">
                        <div className="text-slate-400">
                          <FileStack className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
                          <p className="text-base sm:text-lg font-medium">No Data Found</p>
                          <p className="text-xs sm:text-sm mt-1">Your card history will appear here</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-xs sm:text-sm text-slate-400 gap-2">
                  <span>Showing 1 to 5 of 0 entries</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs">
                      ← Prev
                    </Button>
                    <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs">
                      Next →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800/50 hover:bg-gray-800/20">
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Ref ID</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden sm:table-cell">User ID</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Description</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden md:table-cell">Credit</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden md:table-cell">Debit</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Amount</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden lg:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 sm:py-12">
                        <div className="text-slate-400">
                          <Activity className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
                          <p className="text-base sm:text-lg font-medium">No Data Found</p>
                          <p className="text-xs sm:text-sm mt-1">Your transactions will appear here</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-xs sm:text-sm text-slate-400 gap-2">
                  <span>Showing 1 to 5 of 0 entries</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs">
                      ← Prev
                    </Button>
                    <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs">
                      Next →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800/50 hover:bg-gray-800/20">
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Order ID</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Txn ID</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Amount</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Payment Ship</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 sm:py-12">
                        <div className="text-slate-400">
                          <DollarSign className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
                          <p className="text-base sm:text-lg font-medium">No Data Found</p>
                          <p className="text-xs sm:text-sm mt-1">Your payment history will appear here</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-xs sm:text-sm text-slate-400 gap-2">
                  <span>Showing 1 to 5 of 0 entries</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs">
                      ← Prev
                    </Button>
                    <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs">
                      Next →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default Dashboard;
