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
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Cards state
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardPrice, setNewCardPrice] = useState('');
  
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

  useEffect(() => {
    fetchTransactions();
    fetchCards();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTransactions();
      fetchCards();
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

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // Stats calculations
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const successfulTransactions = transactions.filter(t => t.status === 'success').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;

  if (paymentsLoading || cardsLoading) return (
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
        
        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400 mb-1">Total Transactions</p>
                    <p className="text-xl sm:text-3xl font-bold text-white">{totalTransactions}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400 mb-1">Total Revenue</p>
                    <p className="text-xl sm:text-3xl font-bold text-white">₹{totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400 mb-1">Successful</p>
                    <p className="text-xl sm:text-3xl font-bold text-green-400">{successfulTransactions}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/50 transition-all">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400 mb-1">Failed/Pending</p>
                    <p className="text-xl sm:text-3xl font-bold text-red-400">{failedTransactions + pendingTransactions}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={fetchCards}
              className="bg-purple-600 text-white hover:bg-purple-700"
              disabled={cardsLoading}
            >
              {cardsLoading ? 'Refreshing...' : 'Refresh Cards'}
            </Button>
            <Button
              onClick={fetchTransactions}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={paymentsLoading}
            >
              {paymentsLoading ? 'Refreshing...' : 'Refresh Payments'}
            </Button>
          </div>

          {/* Card Price Settings Section */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                Card Price Settings
                <span className="text-sm font-normal text-gray-400">({cards.length} cards)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add New Card Form */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-green-500" />
                  Add New Card
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Card Name"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Input
                    placeholder="Price (₹)"
                    type="number"
                    value={newCardPrice}
                    onChange={(e) => setNewCardPrice(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={addNewCard}
                    disabled={!newCardName.trim() || !newCardPrice.trim()}
                    className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Card
                  </Button>
                </div>
              </div>

              {/* Cards Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800/50 hover:bg-gray-800/20">
                      <TableHead className="text-gray-300">Card Name</TableHead>
                      <TableHead className="text-gray-300">Current Price</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cards.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          <div className="text-slate-400">
                            <Settings className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
                            <p className="text-base sm:text-lg font-medium">No Cards Found</p>
                            <p className="text-xs sm:text-sm mt-1">Add cards to manage their prices</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cards.map((card) => (
                        <TableRow key={card._id} className="border-gray-800/50 hover:bg-gray-800/20">
                          <TableCell className="text-white font-medium">
                            {card.name}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {editingCard === card._id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={editingPrice}
                                  onChange={(e) => setEditingPrice(e.target.value)}
                                  className="w-24 bg-gray-700/50 border-gray-600 text-white"
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  onClick={() => savePrice(card._id)}
                                  className="bg-green-600 text-white hover:bg-green-700 p-1"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={cancelEditing}
                                  className="bg-gray-600 text-white hover:bg-gray-700 p-1"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">₹{card.price}</span>
                                <Button
                                  size="sm"
                                  onClick={() => startEditingPrice(card._id, card.price)}
                                  className="bg-blue-600 text-white hover:bg-blue-700 p-1"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => deleteCard(card._id)}
                              className="bg-red-600 text-white hover:bg-red-700 p-1"
                            >
                              <Trash2 className="h-3 w-3" />
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
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                All User Payments
                <span className="text-sm font-normal text-gray-400">({totalTransactions} total)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800/50 hover:bg-gray-800/20">
                      <TableHead className="text-gray-300">User ID</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Description</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Gateway</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-slate-400">
                            <Activity className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
                            <p className="text-base sm:text-lg font-medium">No Payments Found</p>
                            <p className="text-xs sm:text-sm mt-1">Payment history will appear here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentTransactions.map((transaction) => (
                        <TableRow key={transaction._id} className="border-gray-800/50 hover:bg-gray-800/20">
                          <TableCell className="text-white font-mono text-sm">
                            <div className="max-w-20 truncate" title={transaction.uid}>
                              {transaction.uid.substring(0, 8)}...
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                              {transaction.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-300 max-w-48">
                            <div className="truncate" title={transaction.description}>
                              {transaction.description}
                            </div>
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'success' 
                                ? 'bg-green-500/20 text-green-400' 
                                : transaction.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {transaction.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {transaction.paymentGateway || 'N/A'}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {formatDate(transaction.date)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {transactions.length > transactionsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-xs sm:text-sm text-slate-400 gap-2">
                  <span>
                    Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, transactions.length)} of {transactions.length} entries
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      ← Prev
                    </Button>
                    <span className="px-3 py-1 bg-slate-700/50 rounded text-slate-300 text-xs">
                      {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-slate-300 text-xs"
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

