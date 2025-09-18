import { useState, useCallback } from 'react';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/services/paymentApi';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseRazorpayOptions {
  onSuccess?: (paymentData: any) => void;
  onFailure?: (error: any) => void;
}

export const useRazorpay = ({ onSuccess, onFailure }: UseRazorpayOptions = {}) => {
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

  const initiatePayment = useCallback(async (amount: number, planDetails?: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load Razorpay script
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
  }, [loadRazorpayScript, onSuccess, onFailure]);

  return {
    initiatePayment,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};