'use client'

import React, { useState, useEffect } from 'react'
// import { useTransactions } from '@/hooks/useTransactions';
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
  Plus,
  User,
  Bell,
  FileStack,
  DollarSign,
  Home,
  Activity,
  TrendingUp,
  MessageSquare,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import axios from "axios";
import { auth } from "../auth/firebase.ts";
import { useAuth } from '../auth/AuthContext';
import { fetchCardPrices } from '../services/cardPrice';
import { useWallet } from '@/context/WalletContext';

// import { User } from 'firebase/auth'

interface Transaction {
  _id: string;
  uid: string;
  cardName: string;
  amount: number;
  type: string;
  date: string;
}


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function Dashboard() {
  // Assuming you have the user's UID from authentication
  // console.log(auth.currentUser?.uid);
  const uid = auth.currentUser?.uid;
  console.log("User ID:", uid);
  // const { transactions, loading, error, createCard } = useTransactions(uid);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [data, setData] = useState();

  const [stats, setStats] = useState({
    balance: 0,
    cards: 0,
    transactionCount: 0,
    // payments: 0
  });

  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [prices, setPrices] = useState<Record<string, number>>({});
  
  // Wallet integration
  const { balance: walletBalance, transactions: walletTransactions, refreshWallet, refreshTransactions } = useWallet();

  // Remove the stats calculation useEffect and instead use a function to calculate stats
  function calculateStats(transactions: Transaction[]) {
    // Sum only debits (CARD_CREATION)
    const totalDebits = transactions
      .filter((t) => t.type === 'CARD_CREATION')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const cardTransactions = transactions.filter((t) => t.type === 'CARD_CREATION');
    const rechargeTransactions = transactions.filter((t) => t.type === 'RECHARGE');
    return {
      balance: totalDebits,
      cards: cardTransactions.length,
      transactionCount: transactions.length,
      // payments: rechargeTransactions.length
    };
  }

  useEffect(() => {
    // Fetch prices on mount
    fetchCardPrices()
      .then((fetchedPrices) => {
        setPrices(fetchedPrices);
        console.log("Fetched Prices:", fetchedPrices);
        console.log(fetchedPrices['Uan']);
      })
      .catch((err) => {
        console.error('Error fetching card prices:', err);
        setPrices({});
      });
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/transactions/user/${uid}`);
        setTransactions(response.data);

        // Calculate stats and set
        setStats(calculateStats(response.data));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // const handleCreateCard = async () => {
  //   try {
  //     setIsCreatingCard(true);
  //     const cardName = `Card_${Date.now()}`; // You can replace this with a form input
  //     await createCard({ 
  //       cardName, 
  //       amount: 2,
  //       cardType: 'ID_CARD' // Add the required cardType
  //     });
  //     // Optionally show success message
  //   } catch (err) {
  //     console.error('Error creating card:', err);
  //     // Optionally show error message
  //   } finally {
  //     setIsCreatingCard(false);
  //   }
  // };


  // Update the stats array in the render
  const statsData = [{
    label: 'Wallet Balance',
    value: `₹${walletBalance.toFixed(2)}`,
    icon: DollarSign,
    color: 'from-green-500 to-green-600'
  },
  {
    label: 'Total Spent',
    value: `₹${stats.balance}`,
    icon: DollarSign,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    label: 'Cards',
    value: stats.cards.toString(),
    icon: CreditCard,
    color: 'from-violet-500 to-purple-600'
  },
  {
    label: 'Transactions',
    value: stats.transactionCount.toString(),
    icon: Activity,
    color: 'from-blue-500 to-cyan-600'
  }];

  const totalPages = Math.ceil(transactions.length / pageSize);
  // Reverse transactions to show latest first
  const paginatedTransactions = [...transactions].reverse().slice((page - 1) * pageSize, page * pageSize);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const renderTransactionHistory = () => (
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          </TableCell>
        </TableRow>
      ) : paginatedTransactions.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8 sm:py-12">
            <div className="text-slate-400">
              <Activity className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-medium">No Data Found</p>
              <p className="text-xs sm:text-sm mt-1">Your transactions will appear here</p>
            </div>
          </TableCell>
        </TableRow>
      ) : (
        paginatedTransactions.map((transaction) => (
          <TableRow key={transaction._id} className="border-gray-800/50 hover:bg-gray-800/20">
            <TableCell className="text-slate-300 hidden sm:table-cell">
              {/* {transaction.uid ? `${transaction.uid.slice(0, 8)}...` : ""} */}
              { user?.displayName || user?.email?.split('@')[0] || 'User' }
            </TableCell>
            <TableCell className="text-slate-300">{transaction.cardName}</TableCell>
            <TableCell className="text-slate-300 hidden md:table-cell">
              {/* Credit column: leave blank or show "-" */}
              -
            </TableCell>
            <TableCell className="text-slate-300 hidden md:table-cell">
              {/* Debit column: show amount * price for CARD_CREATION */}
              {transaction.type === "CARD_CREATION" && prices[transaction.cardName]
                ? `₹${transaction.amount * prices[transaction.cardName]}`
                : "-"}
            </TableCell>
            <TableCell className="text-slate-300">
              {/* Amount column: always show the raw amount */}
              ₹{transaction.amount}
            </TableCell>
            <TableCell className="text-slate-300 hidden lg:table-cell">
              {transaction.date ? new Date(transaction.date).toLocaleDateString() : ""}
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  );
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Dashboard" icon={Home} />

        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* <div className="flex justify-end">
            <Button 
              // onClick={handleCreateCard}
              disabled={isCreatingCard}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreatingCard ? 'Creating...' : 'Create New Card'}
            </Button>
          </div> */}
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {statsData.map((stat, index) => (
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
          {/* 
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
          */}

        

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
                      {/* <TableHead className="text-slate-300 text-xs sm:text-sm">Ref ID</TableHead> */}
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden sm:table-cell">Name</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Description</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden md:table-cell">Credit</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden md:table-cell">Debit</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm">Amount</TableHead>
                      <TableHead className="text-slate-300 text-xs sm:text-sm hidden lg:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  {renderTransactionHistory()}
                </Table>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-xs sm:text-sm text-slate-400 gap-2">
                  <span>
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, transactions.length)} of {transactions.length} entries
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs"
                      onClick={handlePrev}
                      disabled={page === 1}
                    >
                      ← Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs"
                      onClick={handleNext}
                      disabled={page === totalPages || transactions.length === 0}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Wallet Transactions */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                Recent Wallet Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {walletTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' 
                          ? 'bg-green-500/20' 
                          : 'bg-red-500/20'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                        ) : (
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm sm:text-base">
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {transaction.status === 'success' && (
                        <span className="text-green-400 text-xs sm:text-sm font-medium">Success</span>
                      )}
                      {transaction.status === 'failed' && (
                        <span className="text-red-400 text-xs sm:text-sm font-medium">Failed</span>
                      )}
                      {transaction.status === 'pending' && (
                        <span className="text-yellow-400 text-xs sm:text-sm font-medium">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {walletTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">No wallet transactions yet</p>
                    <p className="text-gray-500 text-sm">Your wallet transaction history will appear here</p>
                  </div>
                )}
                
                {walletTransactions.length > 5 && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border border-blue-600 bg-blue-900/60 text-white transition-colors"
                      onClick={() => {/* Navigate to AddMoney page */}}
                    >
                      View All Transactions
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          {/* <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
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
          </Card> */}
        </main>
      </div>
    </div>
  )
}

export default Dashboard;
