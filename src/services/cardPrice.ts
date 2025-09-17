// Fetches card prices from the backend and returns a name-price map
export async function fetchCardPrices(): Promise<Record<string, number>> {
  const API_HOST = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const API_URL = `${API_HOST.replace(/\/$/, '')}/api`;
  const response = await fetch(`${API_URL}/cards`); // Update URL if needed
  if (!response.ok) throw new Error('Failed to fetch card prices');
  const cards = await response.json();
  // cards is expected to be an array of { name, price }
  const priceMap: Record<string, number> = {};
  for (const card of cards) {
    priceMap[card.name] = card.price;
  }
  return priceMap;
}

// Example usage:
// import { fetchCardPrices } from './services/cardPrice';
// const prices = await fetchCardPrices();
// console.log(prices);
// console.log(prices);
