# Razorpay Integration Guide

This project has been integrated with Razorpay payment gateway for processing payments in the wallet system.

## Setup Instructions

### 1. Environment Variables

#### Frontend (.env)
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

#### Backend (.env)
```
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### 2. Razorpay Account Setup

1. Create a Razorpay account at [https://razorpay.com](https://razorpay.com)
2. Go to Account & Settings > API Keys
3. Generate API Keys (Key ID and Key Secret)
4. Replace the placeholder values in the .env files

### 3. Test Mode vs Live Mode

- For testing: Use test API keys (starts with `rzp_test_`)
- For production: Use live API keys (starts with `rzp_live_`)

## Features Implemented

### Frontend
- **Payment Gateway Integration**: Complete Razorpay checkout integration
- **Wallet System**: Local wallet with balance management
- **Transaction History**: Real-time transaction tracking
- **Error Handling**: Comprehensive error handling and user feedback
- **Payment Status**: Success/failure feedback with toast notifications

### Backend
- **Order Creation**: RESTful API to create Razorpay orders
- **Payment Verification**: Secure signature verification
- **Payment Details**: Fetch payment information
- **Refund Support**: API for processing refunds

## API Endpoints

### POST `/api/payments/create-order`
Creates a new Razorpay order for payment processing.

**Request Body:**
```json
{
  "amount": 500,
  "currency": "INR",
  "receipt": "order_12345"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_razorpay_id",
    "amount": 50000,
    "currency": "INR",
    "receipt": "order_12345"
  }
}
```

### POST `/api/payments/verify`
Verifies the payment signature and processes the payment.

**Request Body:**
```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature",
  "amount": 500,
  "userId": "user_123"
}
```

### GET `/api/payments/:paymentId`
Retrieves payment details by payment ID.

### POST `/api/payments/refund`
Processes refunds for payments.

## Security Features

1. **Signature Verification**: All payments are verified using HMAC SHA256
2. **Server-Side Validation**: Payment verification happens on the backend
3. **Environment Variables**: Sensitive keys are stored securely
4. **Error Handling**: Comprehensive error handling for failed payments

## Usage in Components

### Basic Payment Flow
```typescript
import { useRazorpay } from '@/hooks/useRazorpay'

const { initiatePayment, isLoading, error } = useRazorpay({
  onSuccess: (paymentData) => {
    // Handle successful payment
  },
  onFailure: (error) => {
    // Handle payment failure
  }
})

// Trigger payment
await initiatePayment(amount, planDetails)
```

### Wallet Management
```typescript
import { useWallet } from '@/context/WalletContext'

const { balance, addToWallet, addTransaction } = useWallet()

// Add money to wallet
addToWallet(500)

// Add transaction record
addTransaction({
  amount: 500,
  type: 'credit',
  description: 'Wallet recharge',
  date: new Date().toISOString(),
  status: 'success'
})
```

## Testing

### Test Card Numbers (Razorpay Test Mode)
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- Any future date for expiry
- Any CVV

### Test UPI ID
- `success@razorpay`
- `failure@razorpay`

## Production Checklist

- [ ] Replace test API keys with live keys
- [ ] Enable live mode in Razorpay dashboard
- [ ] Verify webhook URLs (if using webhooks)
- [ ] Test with real payment methods
- [ ] Implement proper error logging
- [ ] Set up payment failure alerts

## Troubleshooting

### Common Issues

1. **Payment Gateway Not Loading**
   - Check if Razorpay script is loaded properly
   - Verify API keys are correct

2. **Payment Verification Failed**
   - Ensure signature verification is implemented correctly
   - Check if webhook secret matches

3. **Orders Not Creating**
   - Verify backend API endpoints are working
   - Check CORS settings for API calls

### Support

For Razorpay specific issues, refer to:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)