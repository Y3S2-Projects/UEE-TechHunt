// controllers/paymentController.js
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Add debug logging
console.log('🔍 STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('🔍 STRIPE_SECRET_KEY starts with sk_test:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'));

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('❌ STRIPE_SECRET_KEY is not defined in .env file');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log('✅ Stripe initialized successfully');

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', userId, userName } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ 
        error: 'Amount must be at least 50 cents' 
      });
    }

    let customerId;
    if (userId) {
      const customer = await stripe.customers.create({
        metadata: {
          userId: userId,
          userName: userName || 'Guest User'
        }
      });
      customerId = customer.id;
    }

    let ephemeralKey;
    if (customerId) {
      ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customerId },
        { apiVersion: '2024-12-18.acacia' }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      metadata: { userId: userId || 'guest', userName: userName || 'Guest User' }
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey?.secret,
      customer: customerId,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('Payment status retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
};