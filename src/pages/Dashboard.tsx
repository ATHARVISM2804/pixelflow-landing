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
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import {
  Home,
  CreditCard,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  User,
  ChevronRight,
  CheckCircle,
  Clock,
  FileStack,
  Bell,
  Search,
  Download,
  Eye,
  Edit3,
  Calendar,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Dashboard() {
  return (
    <SidebarProvider defaultOpen>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        {/* Sidebar */}
        <Sidebar className="hidden lg:block bg-slate-800/80 backdrop-blur-xl border-r border-slate-700/50">
          <SidebarHeader className="px-6 py-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">ID Maker</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-3 py-4">
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton isActive className="bg-slate-700/50 text-white rounded-xl">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <div className="text-xs text-slate-400 uppercase tracking-wider px-3 py-2 mt-4">Services</div>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <CreditCard className="h-4 w-4" />
                  <span>Passport Photo</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <Edit3 className="h-4 w-4" />
                  <span>Editor</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <FileText className="h-4 w-4" />
                  <span>Cards</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <FileStack className="h-4 w-4" />
                  <span>Free Cards</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <DollarSign className="h-4 w-4" />
                  <span>Kundli</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <FileText className="h-4 w-4" />
                  <span>Page Maker</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <FileText className="h-4 w-4" />
                  <span>Resume Maker</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <DollarSign className="h-4 w-4" />
                  <span>Add Money</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <div className="text-xs text-slate-400 uppercase tracking-wider px-3 py-2 mt-4">Other</div>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl">
                  <HelpCircle className="h-4 w-4" />
                  <span>FAQ</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem className="mt-auto">
                <SidebarMenuButton className="text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-col">
          {/* Header */}
          <header className="flex h-16 items-center justify-between px-6 bg-slate-800/60 backdrop-blur-xl border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-slate-400" />
                <span className="text-2xl font-bold text-white">Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-all">
                <Plus className="h-4 w-4 mr-2" />
                New Service Request
              </Button>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300">Hey, Ashish Ranjan</span>
                <Bell className="h-5 w-5 text-slate-400" />
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* WhatsApp Channel Banner */}
            <Card className="bg-gradient-to-r from-green-600 to-green-700 border-0 text-white overflow-hidden relative">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Follow Whatsapp Channel 📱</h3>
                      <p className="text-green-100 text-sm">Follow our WhatsApp Channel to stay updated with the latest news and updates about our services. Don't miss out on important information!</p>
                    </div>
                  </div>
                  <Button className="bg-white text-green-600 hover:bg-green-50 px-6 py-2 rounded-lg font-semibold">
                    Follow Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
                label: 'Balance',
                value: '0',
                icon: DollarSign,
                color: 'from-blue-500 to-blue-600'
              },
              {
                label: 'Cards',
                value: '0',
                icon: CreditCard,
                color: 'from-purple-500 to-purple-600'
              },
              {
                label: 'Transactions',
                value: '0',
                icon: Activity,
                color: 'from-green-500 to-green-600'
              },
              {
                label: 'Payments',
                value: '0',
                icon: TrendingUp,
                color: 'from-orange-500 to-orange-600'
              }].map((stat, index) => (
                <Card key={index} className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cards History */}
            <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                  Cards History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-slate-700/20">
                        <TableHead className="text-slate-300">Req ID</TableHead>
                        <TableHead className="text-slate-300">Txn ID</TableHead>
                        <TableHead className="text-slate-300">Card Type</TableHead>
                        <TableHead className="text-slate-300">Card Holder Name</TableHead>
                        <TableHead className="text-slate-300">Charges</TableHead>
                        <TableHead className="text-slate-300">Date</TableHead>
                        <TableHead className="text-slate-300">Files</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="text-slate-400">
                            <FileStack className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No Data Found</p>
                            <p className="text-sm mt-1">Your card history will appear here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
                    <span>Showing 1 to 5 of 0 entries</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300">
                        ← Prev
                      </Button>
                      <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300">
                        Next →
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <Activity className="h-5 w-5 text-green-500" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-slate-700/20">
                        <TableHead className="text-slate-300">Ref ID</TableHead>
                        <TableHead className="text-slate-300">User ID</TableHead>
                        <TableHead className="text-slate-300">Description</TableHead>
                        <TableHead className="text-slate-300">Credit</TableHead>
                        <TableHead className="text-slate-300">Debit</TableHead>
                        <TableHead className="text-slate-300">Amount</TableHead>
                        <TableHead className="text-slate-300">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="text-slate-400">
                            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No Data Found</p>
                            <p className="text-sm mt-1">Your transactions will appear here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
                    <span>Showing 1 to 5 of 0 entries</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300">
                        ← Prev
                      </Button>
                      <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300">
                        Next →
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-slate-700/20">
                        <TableHead className="text-slate-300">Order ID</TableHead>
                        <TableHead className="text-slate-300">Txn ID</TableHead>
                        <TableHead className="text-slate-300">Amount</TableHead>
                        <TableHead className="text-slate-300">Date</TableHead>
                        <TableHead className="text-slate-300">Payment Ship</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="text-slate-400">
                            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No Data Found</p>
                            <p className="text-sm mt-1">Your payment history will appear here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
                    <span>Showing 1 to 5 of 0 entries</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300">
                        ← Prev
                      </Button>
                      <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300">
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
    </SidebarProvider>
  )
}

export default Dashboard;
