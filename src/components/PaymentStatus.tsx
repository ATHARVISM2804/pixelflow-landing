'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { useRouter } from 'next/navigation'

interface PaymentStatusProps {
  status: 'success' | 'failed'
  amount?: number
  paymentId?: string
  orderId?: string
  message?: string
}

export function PaymentStatus({ 
  status, 
  amount, 
  paymentId, 
  orderId, 
  message 
}: PaymentStatusProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.push('/dashboard')
  }

  const handleAddMoreMoney = () => {
    router.push('/add-money')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          ) : (
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          )}
          <CardTitle className={`text-xl ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-gray-300">
            {status === 'success' ? (
              <p>
                ₹{amount} has been successfully added to your wallet.
              </p>
            ) : (
              <p>
                {message || 'There was an issue processing your payment. Please try again.'}
              </p>
            )}
          </div>

          {status === 'success' && (
            <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
              {amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">₹{amount}</span>
                </div>
              )}
              {paymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payment ID:</span>
                  <span className="text-white font-mono text-xs">{paymentId}</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="text-white font-mono text-xs">{orderId}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleGoBack}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            
            {status === 'failed' && (
              <Button 
                onClick={handleAddMoreMoney}
                variant="outline"
                className="w-full border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
              >
                Try Again
              </Button>
            )}
            
            {status === 'success' && (
              <Button 
                onClick={handleAddMoreMoney}
                variant="outline"
                className="w-full border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
              >
                Add More Money
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentStatus