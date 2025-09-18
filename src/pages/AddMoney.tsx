'use client'

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
  CheckCircle,
  Loader2,
  XCircle
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useRazorpay } from "@/hooks/useRazorpay"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/context/WalletContext"

export function AddMoney() {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  
  const { toast } = useToast()
  const { balance, addToWallet, addTransaction, transactions } = useWallet()

  const { initiatePayment, isLoading, error, clearError } = useRazorpay({
    onSuccess: (paymentData) => {
      const paymentAmount = paymentData?.amount || parseInt(amount)
      
      // Add money to wallet
      addToWallet(paymentAmount)
      
      // Add transaction record
      addTransaction({
        amount: paymentAmount,
        type: 'credit',
        description: `Wallet recharge - ${planOptions.find(p => p.value === selectedPlan)?.label || 'Custom amount'}`,
        date: new Date().toISOString(),
        status: 'success',
        paymentId: paymentData?.paymentId,
        orderId: paymentData?.orderId
      })
      
      toast({
        title: "Payment Successful!",
        description: `₹${paymentAmount} has been added to your wallet.`,
        variant: "default",
      })
      
      // Reset form
      setSelectedPlan('')
      setAmount('')
      setPaymentMethod('')
      setCustomAmount('')
    },
    onFailure: (error) => {
      // Add failed transaction record
      addTransaction({
        amount: parseInt(amount) || 0,
        type: 'credit',
        description: `Failed wallet recharge - ${planOptions.find(p => p.value === selectedPlan)?.label || 'Custom amount'}`,
        date: new Date().toISOString(),
        status: 'failed'
      })
      
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      })
    }
  })

  const predefinedAmounts = [50, 100, 200, 500, 1000, 2000]

  // Add plan options as per screenshot
  const planOptions = [
    { value: '22-10', label: '₹ 22 Plan – 10 Cards', amount: 22 },
    { value: '55-25', label: '₹ 55 Plan – 25 Cards', amount: 55 },
    { value: '110-50', label: '₹ 110 Plan – 50 Cards', amount: 110 },
    { value: '220-100', label: '₹ 220 Plan – 100 Cards', amount: 220 },
    { value: '385-175', label: '₹ 385 Plan – 175 Cards', amount: 385 },
    { value: '550-250', label: '₹ 550 Plan – 250 Cards', amount: 550 },
    { value: '1100-500', label: '₹ 1100 Plan – 500 Cards', amount: 1100 },
  ]

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
    { id: 'wallet', name: 'Digital Wallet', icon: '💰' }
  ]

  const recentTransactions = transactions.slice(0, 5) // Show only last 5 transactions

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString())
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setAmount(value)
  }

  const handlePayment = async () => {
    if (!amount || !selectedPlan || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please select a plan and payment method.",
        variant: "destructive",
      })
      return
    }

    const selectedPlanDetails = planOptions.find(p => p.value === selectedPlan)
    
    await initiatePayment(parseInt(amount), selectedPlanDetails)
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
                    <p className="text-3xl font-bold">₹{balance.toFixed(2)}</p>
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
                {/* Plan Selection */}
                <div>
                  <Label className="text-white">Select Plan <span className="text-red-500">*</span></Label>
                  <Select
                    value={selectedPlan}
                    onValueChange={val => {
                      setSelectedPlan(val)
                      const plan = planOptions.find(p => p.value === val)
                      if (plan) {
                        setAmount(plan.amount.toString())
                        setCustomAmount('')
                      }
                    }}
                  >
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="Select Plan" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {planOptions.map(plan => (
                        <SelectItem key={plan.value} value={plan.value} className="text-white">
                          {plan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Predefined Amounts */}
                {/* <div>
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
                </div> */}

                {/* Custom Amount */}
                {/* <div>
                  <Label className="text-white">Or Enter Custom Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount (Min: ₹10)"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                  />
                </div> */}

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
                  disabled={(!amount && !selectedPlan) || !paymentMethod || isLoading}
                  onClick={handlePayment}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                {error && (
                  <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearError}
                      className="mt-1 text-red-400 hover:text-red-300"
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit' 
                            ? 'bg-green-500/20' 
                            : 'bg-red-500/20'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <Plus className="h-5 w-5 text-green-400" />
                          ) : (
                            <CreditCard className="h-5 w-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {transaction.description} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {transaction.status === 'success' && (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 text-sm capitalize">{transaction.status}</span>
                          </>
                        )}
                        {transaction.status === 'failed' && (
                          <>
                            <XCircle className="h-4 w-4 text-red-400" />
                            <span className="text-red-400 text-sm capitalize">{transaction.status}</span>
                          </>
                        )}
                        {transaction.status === 'pending' && (
                          <>
                            <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />
                            <span className="text-yellow-400 text-sm capitalize">{transaction.status}</span>
                          </>
                        )}
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

