'use client'


import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Fixed card names (should match CardPriceContext)
const CARD_NAMES = [
  'Aadhar',
  'Aayushmaan',
  'AePDSRation',
  'Apaar',
  'CardMaker',
  'Cards',
  'Did Card',
  'Driving License',
  'Free Cards',
  'IdCard',
  'IMPDSRation',
  'Kundali',
  'PanCard',
  'Passport Photo',
  'Pdf Processor',
  'Resume',
  'State Cards',
  'Uan',
  'Vaccine',
  'Voter',
  'Voter Slip',
];

interface Card {
  _id?: string;
  name: string;
  price: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/cards';

const AdminPanel: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editPrices, setEditPrices] = useState<{ [key: string]: number }>({});
  // Add Card form state
  const [newCardName, setNewCardName] = useState('');
  const [newCardPrice, setNewCardPrice] = useState<number>(0);
  const [addCardLoading, setAddCardLoading] = useState(false);
  // Add Card handler
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardName.trim()) return;
    setAddCardLoading(true);
    try {
      await axios.post(API_URL, { name: newCardName.trim(), price: newCardPrice });
      setNewCardName('');
      setNewCardPrice(0);
  fetchAndSyncCards();
    } catch (err) {
      alert('Failed to add card');
    }
    setAddCardLoading(false);
  };


  useEffect(() => {
    fetchAndSyncCards();
    // eslint-disable-next-line
  }, []);

  // Fetch cards from backend, add missing ones, then update state
  const fetchAndSyncCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const cardsData: Card[] = Array.isArray(res.data) ? res.data : [];
      // Find missing card names
      const backendNames = cardsData.map((c) => c.name);
      const missing = CARD_NAMES.filter((name) => !backendNames.includes(name));
      // Add missing cards to backend (default price 0)
      for (const name of missing) {
        await axios.post(API_URL, { name, price: 0 });
      }
      // Fetch again to get updated list
      const res2 = await axios.get(API_URL);
      const allCards: Card[] = Array.isArray(res2.data) ? res2.data : [];
      // Sort by CARD_NAMES order
      allCards.sort((a, b) => CARD_NAMES.indexOf(a.name) - CARD_NAMES.indexOf(b.name));
      setCards(allCards);
      setEditPrices(allCards.reduce((acc: any, card: Card) => { acc[card._id || card.name] = card.price; return acc; }, {}));
    } catch (err: any) {
      setError('Failed to fetch cards');
    }
    setLoading(false);
  };

  const handlePriceChange = (id: string, price: number) => {
    setEditPrices({ ...editPrices, [id]: price });
  };

  const handleSave = async (id: string) => {
    try {
      await axios.put(`${API_URL}/${id}/price`, { price: editPrices[id] });
  fetchAndSyncCards();
    } catch (err) {
      alert('Failed to update price');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel - Card Prices</h1>

      {/* Add Card Form */}
      <form onSubmit={handleAddCard} className="mb-8 flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Card Name</label>
          <input
            type="text"
            value={newCardName}
            onChange={e => setNewCardName(e.target.value)}
            className="border rounded px-2 py-1 w-48"
            placeholder="Enter card name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Price (₹)</label>
          <input
            type="number"
            value={newCardPrice}
            onChange={e => setNewCardPrice(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
            min={0}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={addCardLoading}
        >
          {addCardLoading ? 'Adding...' : 'Add Card'}
        </button>
      </form>

      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Card Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr key={card._id}>
              <td className="border px-4 py-2">{card.name}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={editPrices[card._id]}
                  onChange={e => handlePriceChange(card._id, Number(e.target.value))}
                  className="border rounded px-2 py-1 w-24"
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleSave(card._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;

