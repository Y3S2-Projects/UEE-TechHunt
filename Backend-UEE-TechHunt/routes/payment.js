// routes/payment.js
import express from 'express';
import { createPaymentIntent, getPaymentStatus } from '../controllers/paymentController.js';

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Get payment status (optional)
router.get('/payment-status/:paymentIntentId', getPaymentStatus);

export default router;