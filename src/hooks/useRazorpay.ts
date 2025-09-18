import { useState, useCallback } from 'react';
import { 
  createRazorpayOrder, 
  verifyRazorpayPayment,
  createDummyOrder,
  verifyDummyPayment,
  testRazorpayConfig
} from '@/services/paymentApi';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseRazorpayOptions {
  onSuccess?: (paymentData: any) => void;
  onFailure?: (error: any) => void;
  testMode?: boolean; // Add test mode option
}

export const useRazorpay = ({ onSuccess, onFailure, testMode = false }: UseRazorpayOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleTestPayment = useCallback(async (amount: number, planDetails?: any) => {
    try {
      console.log('🧪 TEST MODE: Simulating Razorpay payment flow');
      
      // Test Razorpay configuration first
      const configTest = await testRazorpayConfig();
      console.log('Config test result:', configTest);

      // Create dummy order
      const orderResponse = await createDummyOrder({
        amount,
        currency: 'INR',
        receipt: `test_receipt_${Date.now()}`
      });

      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(orderResponse.message || 'Failed to create dummy order');
      }

      const { order } = orderResponse;

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate dummy payment data
      const dummyPaymentData = {
        razorpay_order_id: order.id,
        razorpay_payment_id: `dummy_pay_${Date.now()}`,
        razorpay_signature: `dummy_signature_${Date.now()}`
      };

      // Verify dummy payment
      const verificationResponse = await verifyDummyPayment({
        ...dummyPaymentData,
        amount: amount,
      });

      if (verificationResponse.success) {
        console.log('🎉 TEST MODE: Payment simulation successful');
        onSuccess?.({
          ...verificationResponse.payment,
          amount: amount,
          orderId: order.id,
          paymentId: dummyPaymentData.razorpay_payment_id
        });
      } else {
        throw new Error(verificationResponse.message || 'Dummy payment verification failed');
      }
    } catch (error) {
      console.error('Test payment error:', error);
      throw error;
    }
  }, [onSuccess]);

  const initiatePayment = useCallback(async (amount: number, planDetails?: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // If in test mode, handle dummy payment flow
      if (testMode) {
        return await handleTestPayment(amount, planDetails);
      }

      // Load Razorpay script for real payments
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order on backend
      const orderResponse = await createRazorpayOrder({
        amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      });

      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const { order } = orderResponse;

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'PixelFlow',
        description: planDetails ? `${planDetails.label}` : 'Add Money to Wallet',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResponse = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount,
            });

            if (verificationResponse.success) {
              onSuccess?.(verificationResponse.payment);
            } else {
              throw new Error(verificationResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onFailure?.(error);
            setError(error instanceof Error ? error.message : 'Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          plan: planDetails?.value || 'custom',
          amount: amount
        },
        theme: {
          color: '#6366f1' // Indigo color to match your app theme
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal closed');
            setIsLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
      onFailure?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [loadRazorpayScript, handleTestPayment, testMode, onSuccess, onFailure]);

  return {
    initiatePayment,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};