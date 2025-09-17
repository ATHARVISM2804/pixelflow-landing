import axios from 'axios';

// Configure API URL for Next.js environment
const API_HOST = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${API_HOST.replace(/\/$/, '')}/api`;

const CARD_CHARGES = {
    AADHAAR: 2,
    ID_CARD: 2,
    EDITED_IMAGE: 1
};

export interface CardData {
    uid: string;
    cardName: string;
    amount: number;
    cardType: 'AADHAAR' | 'ID_CARD' | 'EDITED_IMAGE';
    metadata?: any;
}

export const cardApi = {
    createCard: async (data: CardData) => {
        const payload = {
            ...data,
            amount: CARD_CHARGES[data.cardType],
            type: 'CARD_CREATION'
        };
        
        try {
            const response = await axios.post(`${API_URL}/transactions/card`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCardsByUser: async (uid: string) => {
        try {
            const response = await axios.get(`${API_URL}/transactions/user/${uid}`);
            return response.data.filter((tx: any) => tx.type === 'CARD_CREATION');
        } catch (error) {
            throw error;
        }
    },

    createAadhaarCard: async (data: Omit<CardData, 'amount' | 'cardType'>) => {
        const payload = {
            ...data,
            amount: CARD_CHARGES.AADHAAR,
            cardType: 'AADHAAR',
            type: 'CARD_CREATION'
        };
        
        try {
            const response = await axios.post(`${API_URL}/transactions/card`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createIdCard: async (data: Omit<CardData, 'amount' | 'cardType'>) => {
        const payload = {
            ...data,
            amount: CARD_CHARGES.ID_CARD,
            cardType: 'ID_CARD',
            type: 'CARD_CREATION'
        };
        
        try {
            const response = await axios.post(`${API_URL}/transactions/card`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createEditedImage: async (data: Omit<CardData, 'amount' | 'cardType'>) => {
        const payload = {
            ...data,
            amount: CARD_CHARGES.EDITED_IMAGE,
            cardType: 'EDITED_IMAGE',
            type: 'CARD_CREATION'
        };
        
        try {
            const response = await axios.post(`${API_URL}/transactions/card`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};


