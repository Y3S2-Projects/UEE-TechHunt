import axios from 'axios';

// Add this to your backend routes
export const handleConversationalFeedback = async (req, res) => {
  try {
    const { 
      rating, 
      courseTitle, 
      conversationStage, 
      userMessage,
      conversationHistory 
    } = req.body;

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ 
        message: "Thanks for sharing! What did you enjoy most about the course?",
        shouldEnd: false 
      });
    }

    let systemPrompt = '';
    let shouldEnd = false;

    // Stage 1: User just selected a rating
    if (conversationStage === 'rating') {
      if (rating >= 4) {
        systemPrompt = `You are a friendly course feedback assistant. The user just rated "${courseTitle}" ${rating} stars (positive). Ask them ONE specific follow-up question about what they enjoyed most or found most valuable. Keep it conversational and brief (1-2 sentences max). Use emojis sparingly.`;
      } else {
        systemPrompt = `You are a friendly course feedback assistant. The user just rated "${courseTitle}" ${rating} stars (needs improvement). Ask them ONE specific follow-up question about what could be improved or what challenges they faced. Keep it conversational and brief (1-2 sentences max). Be empathetic.`;
      }
    } 
    // Stage 2: Getting detailed feedback
    else if (conversationStage === 'details') {
      // Check if we have enough feedback (at least 2 user messages)
      const userMessages = conversationHistory?.filter(m => m.role === 'user') || [];
      
      if (userMessages.length >= 2) {
        systemPrompt = `You are a friendly course feedback assistant. The user has shared feedback about "${courseTitle}". Thank them warmly and ask if there's anything else they'd like to add. If they say no or give a brief response, thank them and end the conversation. Keep responses brief (1-2 sentences). This should be wrapping up.`;
        shouldEnd = userMessages.length >= 3; // End after 3 user messages
      } else {
        systemPrompt = `You are a friendly course feedback assistant collecting detailed feedback about "${courseTitle}". Based on the conversation, ask ONE relevant follow-up question to get more specific insights. Keep it brief (1-2 sentences max). Be conversational and encouraging.`;
      }
    }

    // Build messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory.slice(-6)); // Keep last 6 messages for context
    }

    // Add current user message if provided
    if (userMessage) {
      messages.push({ role: 'user', content: userMessage });
    }

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
        messages: messages,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    return res.json({
      message: aiMessage,
      shouldEnd: shouldEnd
    });

  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    
    // Fallback responses if OpenAI fails
    const { conversationStage, rating } = req.body;
    let fallbackMessage = "Thank you for sharing! Is there anything else you'd like to tell us about your experience?";
    
    if (conversationStage === 'rating') {
      fallbackMessage = rating >= 4 
        ? "That's great to hear! What did you find most valuable about the course?"
        : "Thanks for your honest feedback. What aspects do you think could be improved?";
    }

    return res.json({
      message: fallbackMessage,
      shouldEnd: false
    });
  }
};

// Example route setup (add to your routes file)
// router.post('/api/feedback/conversational', handleConversationalFeedback);