const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface CreateOrderData {
  amount: number;
  currency?: string;
  receipt?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  message?: string;
}

export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount: number;
  userId?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  payment?: {
    orderId: string;
    paymentId: string;
    amount: number;
    status: string;
  };
  message?: string;
}

// Create Razorpay order
export const createRazorpayOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return {
      success: false,
      message: 'Failed to create order'
    };
  }
};

// Verify payment
export const verifyRazorpayPayment = async (data: VerifyPaymentData): Promise<PaymentVerificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      message: 'Payment verification failed'
    };
  }
};

// Get payment details
export const getPaymentDetails = async (paymentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return {
      success: false,
      message: 'Failed to fetch payment details'
    };
  }
};

// ========================
// TEST API FUNCTIONS
// ========================

// Test Razorpay configuration
export const testRazorpayConfig = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/test/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error testing Razorpay config:', error);
    return {
      success: false,
      message: 'Failed to test configuration'
    };
  }
};

// Create dummy order for testing
export const createDummyOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/test/create-dummy-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating dummy order:', error);
    return {
      success: false,
      message: 'Failed to create dummy order'
    };
  }
};

// Verify dummy payment for testing
export const verifyDummyPayment = async (data: VerifyPaymentData): Promise<PaymentVerificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/test/verify-dummy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying dummy payment:', error);
    return {
      success: false,
      message: 'Dummy payment verification failed'
    };
  }
};

// Test wallet operations
export const testWalletOperations = async (amount: number, operation: 'add' | 'deduct' = 'add') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/test/wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, operation }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error testing wallet operations:', error);
    return {
      success: false,
      message: 'Failed to test wallet operations'
    };
  }
};