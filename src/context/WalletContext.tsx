'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  getWalletBalance, 
  getTransactionHistory, 
  addMoneyToWallet, 
  deductMoneyFromWallet,
  syncWalletWithBackend,
  WalletTransaction 
} from '@/services/walletApi'

interface WalletContextType {
  balance: number
  addToWallet: (amount: number, paymentDetails?: any) => Promise<boolean>
  deductFromWallet: (amount: number, description?: string, cardName?: string) => Promise<boolean>
  transactions: WalletTransaction[]
  addTransaction: (transaction: Omit<WalletTransaction, 'id'>) => void
  refreshWallet: () => Promise<void>
  refreshTransactions: () => Promise<void>
  isLoading: boolean
  error: string | null
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
  userId?: string
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children, userId }) => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refresh wallet balance from backend
  const refreshWallet = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Don't fetch if no user is authenticated
      if (!userId) {
        setBalance(0)
        setIsLoading(false)
        return
      }
      
      const response = await getWalletBalance(userId)
      if (response.success && response.wallet) {
        setBalance(response.wallet.balance)
      } else {
        setError(response.message || 'Failed to get wallet balance')
      }
    } catch (error) {
      console.error('Error refreshing wallet:', error)
      setError('Failed to refresh wallet')
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh transactions from backend
  const refreshTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Don't fetch if no user is authenticated
      if (!userId) {
        setTransactions([])
        setIsLoading(false)
        return
      }
      
      const response = await getTransactionHistory(userId, { limit: 20 })
      if (response.success && response.transactions) {
        setTransactions(response.transactions)
      } else {
        setError(response.message || 'Failed to get transactions')
      }
    } catch (error) {
      console.error('Error refreshing transactions:', error)
      setError('Failed to refresh transactions')
    } finally {
      setIsLoading(false)
    }
  }

  // Load wallet data from backend on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      // First, try to sync with backend
      const syncWallet = async () => {
        try {
          // Get local data for migration
          const savedBalance = localStorage.getItem('wallet_balance')
          const savedTransactions = localStorage.getItem('wallet_transactions')
          
          const localBalance = savedBalance ? parseFloat(savedBalance) : 0
          const localTransactions = savedTransactions ? JSON.parse(savedTransactions) : []

          // Sync with backend
          await syncWalletWithBackend(userId, localBalance, localTransactions)
          
          // Load from backend
          await refreshWallet()
          await refreshTransactions()

          // Clear local storage after successful sync
          if (savedBalance || savedTransactions) {
            localStorage.removeItem('wallet_balance')
            localStorage.removeItem('wallet_transactions')
          }
        } catch (error) {
          console.error('Error syncing wallet:', error)
          // Fallback to local storage
          const savedBalance = localStorage.getItem('wallet_balance')
          const savedTransactions = localStorage.getItem('wallet_transactions')
          
          if (savedBalance) {
            setBalance(parseFloat(savedBalance))
          }
          
          if (savedTransactions) {
            const localTxns = JSON.parse(savedTransactions)
            // Convert old format to new format
            const convertedTxns: WalletTransaction[] = localTxns.map((txn: Transaction) => ({
              id: txn.id,
              amount: txn.amount,
              type: txn.type,
              originalType: txn.type === 'credit' ? 'WALLET_RECHARGE' : 'WALLET_DEBIT',
              description: txn.description,
              status: txn.status,
              date: txn.date,
              paymentId: txn.paymentId,
              orderId: txn.orderId
            }))
            setTransactions(convertedTxns)
          }
        }
      }

      syncWallet()
    }
  }, [userId])

  const addToWallet = async (amount: number, paymentDetails?: any): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await addMoneyToWallet(
        userId,
        amount,
        paymentDetails?.description || 'Wallet recharge',
        {
          paymentGateway: paymentDetails?.paymentGateway || 'manual',
          gatewayOrderId: paymentDetails?.orderId,
          gatewayPaymentId: paymentDetails?.paymentId,
          gatewaySignature: paymentDetails?.signature,
          planDetails: paymentDetails?.planDetails
        }
      )

      if (response.success && response.wallet) {
        setBalance(response.wallet.balance)
        // Refresh transactions to get the latest
        await refreshTransactions()
        return true
      } else {
        setError(response.message || 'Failed to add money to wallet')
        return false
      }
    } catch (error) {
      console.error('Error adding to wallet:', error)
      setError('Failed to add money to wallet')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deductFromWallet = async (amount: number, description?: string, cardName?: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await deductMoneyFromWallet(
        userId,
        amount,
        description || 'Wallet deduction',
        cardName
      )

      if (response.success && response.wallet) {
        setBalance(response.wallet.balance)
        // Refresh transactions to get the latest
        await refreshTransactions()
        return true
      } else {
        setError(response.message || 'Failed to deduct money from wallet')
        return false
      }
    } catch (error) {
      console.error('Error deducting from wallet:', error)
      setError('Failed to deduct money from wallet')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const addTransaction = (transaction: Omit<WalletTransaction, 'id'>) => {
    const newTransaction: WalletTransaction = {
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
      addTransaction,
      refreshWallet,
      refreshTransactions,
      isLoading,
      error
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
        addToWallet: async () => false,
        deductFromWallet: async () => false,
        transactions: [],
        addTransaction: () => {},
        refreshWallet: async () => {},
        refreshTransactions: async () => {},
        isLoading: false,
        error: null
      };
    }
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}