import express from 'express';
import { handleConversationalFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/conversational', handleConversationalFeedback);

export default router;