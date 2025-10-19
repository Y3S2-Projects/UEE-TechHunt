// services/stripeService.ts
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.141:5000';

interface PaymentIntentResponse {
  paymentIntent: string;
  ephemeralKey?: string;
  customer?: string;
  publishableKey: string;
}

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  userId?: string,
  userName?: string
): Promise<PaymentIntentResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        userId,
        userName
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create payment intent error:', error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentIntentId: string) => {
  try {
    const response = await fetch(
      `${API_URL}/api/payment/payment-status/${paymentIntentId}`
    );

    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Get payment status error:', error);
    throw error;
  }
};