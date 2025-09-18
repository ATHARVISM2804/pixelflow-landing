'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  balance: number
  addToWallet: (amount: number) => void
  deductFromWallet: (amount: number) => boolean
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
}

interface Transaction {
  id: string
  amount: number
  type: 'credit' | 'debit'
  description: string
  date: string
  status: 'success' | 'pending' | 'failed'
  paymentId?: string
  orderId?: string
}

const WalletContext = createContext<WalletContextType | null>(null)

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Load wallet data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBalance = localStorage.getItem('wallet_balance')
      const savedTransactions = localStorage.getItem('wallet_transactions')
      
      if (savedBalance) {
        setBalance(parseFloat(savedBalance))
      }
      
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      }
    }
  }, [])

  // Save to localStorage whenever balance or transactions change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wallet_balance', balance.toString())
    }
  }, [balance])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wallet_transactions', JSON.stringify(transactions))
    }
  }, [transactions])

  const addToWallet = (amount: number) => {
    setBalance(prev => prev + amount)
  }

  const deductFromWallet = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount)
      return true
    }
    return false
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    setTransactions(prev => [newTransaction, ...prev])
  }

  return (
    <WalletContext.Provider value={{
      balance,
      addToWallet,
      deductFromWallet,
      transactions,
      addTransaction
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) {
    // During SSR, provide a default context to prevent errors
    if (typeof window === 'undefined') {
      return {
        balance: 0,
        addToWallet: () => {},
        deductFromWallet: () => false,
        transactions: [],
        addTransaction: () => {}
      };
    }
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}