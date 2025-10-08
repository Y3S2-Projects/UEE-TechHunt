// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import paymentRoutes from './routes/payment.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test if env variables are loaded
console.log('✅ Environment variables loaded');
console.log('🔍 STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('🔍 PORT:', process.env.PORT || 5000);

// Payment routes
app.use('/api/payment', paymentRoutes);

// Your other routes...

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});