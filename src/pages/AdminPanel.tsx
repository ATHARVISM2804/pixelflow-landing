'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Settings, 
  DollarSign, 
  Activity, 
  Users,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { fetchTotalUsersCount } from '@/services/userService';

interface Transaction {
  _id: string;
  uid: string;
  cardName?: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  date: string;
  category?: string;
  paymentGateway?: string;
  currency?: string;
}

interface Card {
  _id: string;
  name: string;
  price: number;
}

// Configure API URLs consistently with other files
const API_HOST = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const TRANSACTIONS_URL = `${API_HOST.replace(/\/$/, '')}/api/transactions`;
const CARDS_URL = `${API_HOST.replace(/\/$/, '')}/api/cards`;

const AdminPanel: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Date filter state
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Cards state
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardPrice, setNewCardPrice] = useState('');
  
  // Users state
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [usersLoading, setUsersLoading] = useState(true);
  
  // Pagination state for transactions
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  // Fetch all transactions
  const fetchTransactions = async () => {
    setPaymentsLoading(true);
    try {
      const res = await axios.get(TRANSACTIONS_URL);
      const transactionsData: Transaction[] = Array.isArray(res.data) ? res.data : [];
      // Sort by date (newest first)
      transactionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(transactionsData);
      setFilteredTransactions(transactionsData);
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to fetch transactions');
    }
    setPaymentsLoading(false);
  };

  // Fetch all cards
  const fetchCards = async () => {
    setCardsLoading(true);
    try {
      const res = await axios.get(CARDS_URL);
      const cardsData: Card[] = Array.isArray(res.data) ? res.data : [];
      setCards(cardsData);
    } catch (err: any) {
      console.error('Failed to fetch cards:', err);
      setError('Failed to fetch cards');
    }
    setCardsLoading(false);
  };

  // Fetch total users count from Firestore
  const fetchTotalUsers = async () => {

    
    setUsersLoading(true);
    try {
      const count = await fetchTotalUsersCount();
      setTotalUsers(count);
    } catch (err: any) {
      console.error('Failed to fetch total users:', err);
      // Don't set error state as this is not critical for admin functionality
    }
    setUsersLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    fetchCards();
    fetchTotalUsers();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTransactions();
      fetchCards();
      fetchTotalUsers();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Card management functions
  const updateCardPrice = async (cardId: string, newPrice: number) => {
    try {
      await axios.put(`${CARDS_URL}/${cardId}/price`, { price: newPrice });
      await fetchCards(); // Refresh cards
      setEditingCard(null);
      setEditingPrice('');
    } catch (err: any) {
      console.error('Failed to update card price:', err);
      setError('Failed to update card price');
    }
  };

  const addNewCard = async () => {
    if (!newCardName.trim() || !newCardPrice.trim()) return;
    
    try {
      await axios.post(CARDS_URL, { 
        name: newCardName.trim(), 
        price: parseFloat(newCardPrice) 
      });
      await fetchCards(); // Refresh cards
      setNewCardName('');
      setNewCardPrice('');
    } catch (err: any) {
      console.error('Failed to add card:', err);
      setError('Failed to add card');
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    
    try {
      await axios.delete(`${CARDS_URL}/${cardId}`);
      await fetchCards(); // Refresh cards
    } catch (err: any) {
      console.error('Failed to delete card:', err);
      setError('Failed to delete card');
    }
  };

  const startEditingPrice = (cardId: string, currentPrice: number) => {
    setEditingCard(cardId);
    setEditingPrice(currentPrice.toString());
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setEditingPrice('');
  };

  const savePrice = (cardId: string) => {
    const price = parseFloat(editingPrice);
    if (isNaN(price) || price < 0) {
      setError('Please enter a valid price');
      return;
    }
    updateCardPrice(cardId, price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter transactions by date range
  const filterTransactionsByDate = () => {
    if (!fromDate && !toDate) {
      setFilteredTransactions(transactions);
      setCurrentPage(1);
      return;
    }

    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate + 'T23:59:59') : null; // Include end of day

      if (from && to) {
        return transactionDate >= from && transactionDate <= to;
      } else if (from) {
        return transactionDate >= from;
      } else if (to) {
        return transactionDate <= to;
      }
      return true;
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  // Clear date filters
  const clearDateFilters = () => {
    setFromDate('');
    setToDate('');
    setFilteredTransactions(transactions);
    setCurrentPage(1);
  };

  // Apply date filter when dates change
  useEffect(() => {
    filterTransactionsByDate();
    // eslint-disable-next-line
  }, [fromDate, toDate, transactions]);

  // Pagination logic - use filtered transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Stats calculations - use filtered transactions
  const totalTransactions = filteredTransactions.length;
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const successfulTransactions = filteredTransactions.filter(t => t.status === 'success').length;
  const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending').length;
  const failedTransactions = filteredTransactions.filter(t => t.status === 'failed').length;

  if (paymentsLoading || cardsLoading || usersLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 flex items-center justify-center">
      <div className="text-red-400 text-lg">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />
      
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Admin Panel - Cards & Payments" icon={Settings} showNewServiceButton={false} />
        
        <main className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-slate-400 mb-1 truncate">Total Users</p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">{totalUsers}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-2">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-slate-400 mb-1 truncate">Total Transactions</p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">{totalTransactions}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-2">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-slate-400 mb-1 truncate">Total Revenue</p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">₹{totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-2">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-slate-400 mb-1 truncate">Successful</p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-400">{successfulTransactions}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-2">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-slate-400 mb-1 truncate">Failed/Pending</p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-red-400">{failedTransactions + pendingTransactions}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-2">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Refresh Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              onClick={fetchTotalUsers}
              className="bg-yellow-600 text-white hover:bg-yellow-700 text-sm sm:text-base px-4 py-2"
              disabled={usersLoading}
            >
              {usersLoading ? 'Refreshing...' : 'Refresh Users'}
            </Button>
            <Button
              onClick={fetchCards}
              className="bg-purple-600 text-white hover:bg-purple-700 text-sm sm:text-base px-4 py-2"
              disabled={cardsLoading}
            >
              {cardsLoading ? 'Refreshing...' : 'Refresh Cards'}
            </Button>
            <Button
              onClick={fetchTransactions}
              className="bg-indigo-600 text-white hover:bg-indigo-700 text-sm sm:text-base px-4 py-2"
              disabled={paymentsLoading}
            >
              {paymentsLoading ? 'Refreshing...' : 'Refresh Payments'}
            </Button>
          </div>

          {/* Card Price Settings Section */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                  <span>Card Price Settings</span>
                </div>
                <span className="text-sm font-normal text-gray-400">({cards.length} cards)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {/* Add New Card Form */}
              <div className="mb-6 p-4 sm:p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  Add New Card
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Input
                    placeholder="Card Name"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base h-10 sm:h-11"
                  />
                  <Input
                    placeholder="Price (₹)"
                    type="number"
                    value={newCardPrice}
                    onChange={(e) => setNewCardPrice(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base h-10 sm:h-11"
                  />
                  <Button
                    onClick={addNewCard}
                    disabled={!newCardName.trim() || !newCardPrice.trim()}
                    className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base h-10 sm:h-11 sm:col-span-2 lg:col-span-1"
                  >
                    <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                    Add Card
                  </Button>
                </div>
              </div>

              {/* Cards Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800/50 hover:bg-gray-800/20">
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-3 sm:px-4">Card Name</TableHead>
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-3 sm:px-4">Current Price</TableHead>
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-3 sm:px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cards.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 sm:py-12">
                          <div className="text-slate-400">
                            <Settings className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                            <p className="text-base sm:text-lg font-medium">No Cards Found</p>
                            <p className="text-xs sm:text-sm mt-1 text-gray-500">Add cards to manage their prices</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cards.map((card) => (
                        <TableRow key={card._id} className="border-gray-800/50 hover:bg-gray-800/20">
                          <TableCell className="text-white font-medium text-sm sm:text-base px-3 sm:px-4 py-3 sm:py-4">
                            <div className="truncate max-w-[120px] sm:max-w-none" title={card.name}>
                              {card.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300 px-3 sm:px-4 py-3 sm:py-4">
                            {editingCard === card._id ? (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <Input
                                  type="number"
                                  value={editingPrice}
                                  onChange={(e) => setEditingPrice(e.target.value)}
                                  className="w-20 sm:w-24 bg-gray-700/50 border-gray-600 text-white text-sm h-8 sm:h-9"
                                  autoFocus
                                />
                                <div className="flex gap-1 sm:gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => savePrice(card._id)}
                                    className="bg-green-600 text-white hover:bg-green-700 p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-9"
                                  >
                                    <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={cancelEditing}
                                    className="bg-gray-600 text-white hover:bg-gray-700 p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-9"
                                  >
                                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <span className="font-medium text-sm sm:text-base">₹{card.price}</span>
                                <Button
                                  size="sm"
                                  onClick={() => startEditingPrice(card._id, card.price)}
                                  className="bg-blue-600 text-white hover:bg-blue-700 p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-9"
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="px-3 sm:px-4 py-3 sm:py-4">
                            <Button
                              size="sm"
                              onClick={() => deleteCard(card._id)}
                              className="bg-red-600 text-white hover:bg-red-700 p-1.5 sm:p-2 h-8 w-8 sm:h-9 sm:w-9"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Payments Section */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                  <span>All User Payments</span>
                </div>
                <span className="text-sm font-normal text-gray-400">({totalTransactions} {fromDate || toDate ? 'filtered' : 'total'})</span>
              </CardTitle>
              
              {/* Date Filter */}
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <span>Filter by Date Range</span>
                  {(fromDate || toDate) && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      {filteredTransactions.length} results
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">From Date</label>
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white text-sm h-9"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">To Date</label>
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white text-sm h-9"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={clearDateFilters}
                      disabled={!fromDate && !toDate}
                      className="bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 text-sm h-9 w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                  <div className="flex items-end">
                    <div className="text-xs text-gray-400 p-2 bg-gray-700/30 rounded border border-gray-600/50 w-full">
                      Total Revenue: <span className="font-semibold text-white">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800/50 hover:bg-gray-800/20">
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-2 sm:px-4 whitespace-nowrap">User ID</TableHead>
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-2 sm:px-4 whitespace-nowrap">Type</TableHead>
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-2 sm:px-4">Description</TableHead>
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-2 sm:px-4 whitespace-nowrap">Amount</TableHead>
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-2 sm:px-4 whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-2 sm:px-4 whitespace-nowrap">Gateway</TableHead>
                      <TableHead className="text-gray-300 text-xs sm:text-sm font-medium px-2 sm:px-4 whitespace-nowrap">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 sm:py-12">
                          <div className="text-slate-400">
                            <Activity className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                            <p className="text-base sm:text-lg font-medium">No Payments Found</p>
                            <p className="text-xs sm:text-sm mt-1 text-gray-500">Payment history will appear here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentTransactions.map((transaction) => (
                        <TableRow key={transaction._id} className="border-gray-800/50 hover:bg-gray-800/20">
                          <TableCell className="text-white font-mono text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
                            <div className="max-w-16 sm:max-w-20 truncate" title={transaction.uid}>
                              {transaction.uid.substring(0, 8)}...
                            </div>
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 whitespace-nowrap">
                              {transaction.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-300 px-2 sm:px-4 py-2 sm:py-3">
                            <div className="max-w-32 sm:max-w-48 truncate text-xs sm:text-sm" title={transaction.description}>
                              {transaction.description}
                            </div>
                          </TableCell>
                          <TableCell className="text-white font-medium px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              transaction.status === 'success' 
                                ? 'bg-green-500/20 text-green-400' 
                                : transaction.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {transaction.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
                            <div className="max-w-20 truncate" title={transaction.paymentGateway || 'N/A'}>
                              {transaction.paymentGateway || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                            <div className="hidden sm:block">
                              {formatDate(transaction.date)}
                            </div>
                            <div className="sm:hidden">
                              {new Date(transaction.date).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {filteredTransactions.length > transactionsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 text-xs sm:text-sm text-slate-400 gap-3 sm:gap-2">
                  <span className="text-center sm:text-left">
                    Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} entries
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      ← Prev
                    </Button>
                    <span className="px-2 sm:px-3 py-1 bg-slate-700/50 rounded text-slate-300 text-xs sm:text-sm min-w-[60px] text-center">
                      {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;

