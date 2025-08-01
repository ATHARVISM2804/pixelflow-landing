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
  DollarSign,
  User,
  Bell,
  Moon,
  CreditCard,
  Wallet,
  Plus,
  History,
  CheckCircle
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

export function AddMoney() {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [customAmount, setCustomAmount] = useState('')

  const predefinedAmounts = [50, 100, 200, 500, 1000, 2000]
  
  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
    { id: 'wallet', name: 'Digital Wallet', icon: '💰' }
  ]

  const recentTransactions = [
    { id: 1, amount: 500, method: 'UPI', date: '2024-01-15', status: 'Success' },
    { id: 2, amount: 200, method: 'Card', date: '2024-01-14', status: 'Success' },
    { id: 3, amount: 1000, method: 'Net Banking', date: '2024-01-13', status: 'Success' }
  ]

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString())
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setAmount(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Add Money" icon={DollarSign} showNewServiceButton={false} />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wallet Balance Card */}
            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm mb-1">Current Balance</p>
                    <p className="text-3xl font-bold">₹0.00</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Wallet className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Money Form */}
            <Card className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-indigo-400" />
                  Add Money to Wallet
                </CardTitle>
                <p className="text-gray-400 text-sm">Choose an amount and payment method to add money to your wallet</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Predefined Amounts */}
                <div>
                  <Label className="text-white">Select Amount</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {predefinedAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant={amount === amt.toString() ? "default" : "outline"}
                        className={`${
                          amount === amt.toString() 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                        onClick={() => handleAmountSelect(amt)}
                      >
                        ₹{amt}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <Label className="text-white">Or Enter Custom Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount (Min: ₹10)"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <Label className="text-white">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {paymentMethods.map((method) => (
                      <Button
                        key={method.id}
                        variant={paymentMethod === method.id ? "default" : "outline"}
                        className={`${
                          paymentMethod === method.id 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                        } flex items-center gap-2 justify-start`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <span>{method.icon}</span>
                        {method.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {amount && paymentMethod && (
                  <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-white">
                      <span>Amount:</span>
                      <span>₹{amount}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Payment Method:</span>
                      <span>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Transaction Fee:</span>
                      <span>₹0</span>
                    </div>
                    <hr className="border-gray-600" />
                    <div className="flex justify-between text-white font-semibold">
                      <span>Total Amount:</span>
                      <span>₹{amount}</span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  disabled={!amount || !paymentMethod}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="lg:col-span-3 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="h-5 w-5 text-indigo-400" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Plus className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">₹{transaction.amount}</p>
                          <p className="text-gray-400 text-sm">{transaction.method} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 text-sm">{transaction.status}</span>
                      </div>
                    </div>
                  ))}
                  
                  {recentTransactions.length === 0 && (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">No transactions yet</p>
                      <p className="text-gray-500 text-sm">Your transaction history will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AddMoney
      