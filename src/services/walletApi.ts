const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface WalletBalance {
  userId: string;
  balance: number;
  currency: string;
  formattedBalance: string;
  lastTransactionAt: string;
  isActive: boolean;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  originalType: string;
  description: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  date: string;
  paymentId?: string;
  orderId?: string;
  cardName?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  metadata?: any;
}

export interface WalletStats {
  currentBalance: number;
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
  creditCount: number;
  debitCount: number;
  recentTransactionsCount: number;
  walletCreatedAt: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface WalletResponse extends ApiResponse<WalletBalance> {
  wallet?: WalletBalance;
}

export interface TransactionResponse extends ApiResponse<WalletTransaction[]> {
  transactions?: WalletTransaction[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface WalletStatsResponse extends ApiResponse<WalletStats> {
  stats?: WalletStats;
}

export interface AddMoneyResponse extends ApiResponse<any> {
  wallet?: WalletBalance;
  transaction?: WalletTransaction;
}

// Get wallet balance for a user
export const getWalletBalance = async (userId: string): Promise<WalletResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallet/${userId}/balance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return {
      success: false,
      message: 'Failed to get wallet balance'
    };
  }
};

// Add money to wallet
export const addMoneyToWallet = async (
  userId: string,
  amount: number,
  description?: string,
  paymentDetails?: {
    paymentGateway?: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewaySignature?: string;
    planDetails?: any;
  }
): Promise<AddMoneyResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallet/${userId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        description: description || 'Wallet recharge',
        ...paymentDetails
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding money to wallet:', error);
    return {
      success: false,
      message: 'Failed to add money to wallet'
    };
  }
};

// Deduct money from wallet
export const deductMoneyFromWallet = async (
  userId: string,
  amount: number,
  description?: string,
  cardName?: string
): Promise<AddMoneyResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallet/${userId}/deduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        description: description || 'Wallet deduction',
        cardName: cardName || 'Card Purchase'
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deducting money from wallet:', error);
    return {
      success: false,
      message: 'Failed to deduct money from wallet'
    };
  }
};

// Get transaction history
export const getTransactionHistory = async (
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    type?: string;
    status?: string;
  } = {}
): Promise<TransactionResponse> => {
  try {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.type) params.append('type', options.type);
    if (options.status) params.append('status', options.status);

    const response = await fetch(
      `${API_BASE_URL}/api/wallet/${userId}/transactions?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return {
      success: false,
      message: 'Failed to get transaction history'
    };
  }
};

// Get wallet statistics
export const getWalletStats = async (userId: string): Promise<WalletStatsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallet/${userId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting wallet stats:', error);
    return {
      success: false,
      message: 'Failed to get wallet statistics'
    };
  }
};

// Sync local storage with backend (for migration)
export const syncWalletWithBackend = async (
  userId: string,
  localBalance: number,
  localTransactions: any[]
): Promise<ApiResponse<any>> => {
  try {
    // First check if user already has a wallet
    const walletResponse = await getWalletBalance(userId);
    
    if (walletResponse.success && walletResponse.wallet) {
      // Wallet exists, return current balance
      return {
        success: true,
        message: 'Wallet already exists',
        data: walletResponse.wallet
      };
    }

    // If local balance exists, add it to backend
    if (localBalance > 0) {
      const addResponse = await addMoneyToWallet(
        userId,
        localBalance,
        'Migration from local storage'
      );
      
      if (addResponse.success) {
        return {
          success: true,
          message: 'Local wallet migrated to backend successfully',
          data: addResponse.wallet
        };
      }
    }

    // Create empty wallet
    const emptyWalletResponse = await getWalletBalance(userId);
    return emptyWalletResponse;

  } catch (error) {
    console.error('Error syncing wallet with backend:', error);
    return {
      success: false,
      message: 'Failed to sync wallet with backend'
    };
  }
};