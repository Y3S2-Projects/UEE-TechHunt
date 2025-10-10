// services/chatbotService.ts
import { Platform } from 'react-native';

const N8N_WEBHOOK_URL = 'https://kishara.app.n8n.cloud/webhook/82c95d34-94b7-4a31-bb6e-59a3f1a25eb5/chat';

// Timeout configuration
const REQUEST_TIMEOUT = 30000; // 30 seconds

export interface ChatMessage {
  message: string;
  sessionId?: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  sessionId?: string;
  error?: string;
}

/**
 * Send a message to the n8n chatbot
 * @param message - The user's message
 * @param sessionId - Optional session ID for conversation continuity
 * @returns Promise with bot response and session ID
 */
export const sendMessageToBot = async (
  message: string,
  sessionId?: string
): Promise<ChatResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const payload = {
  chatInput: message.trim(),
  sessionId: sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  timestamp: new Date().toISOString(),
};
    

    console.log('Sending message to bot:', payload);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Bot response:', data);

    // Handle different response formats from n8n
    const botResponse = 
      data.response || 
      data.output || 
      data.message || 
      data.text ||
      (typeof data === 'string' ? data : null);

    if (!botResponse) {
      throw new Error('Invalid response format from bot');
    }

    return {
      response: botResponse,
      sessionId: data.sessionId || payload.sessionId,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    console.error('Error sending message to bot:', error);

    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }

    if (error.message.includes('CORS')) {
      throw new Error('Network configuration error - please check your connection');
    }

    if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to chatbot service - please check your internet connection');
    }

    throw error;
  }
};

/**
 * Test connection to the chatbot service
 * @returns Promise<boolean> - true if connection is successful
 */
export const testBotConnection = async (): Promise<boolean> => {
  try {
    const response = await sendMessageToBot('test', `test-${Date.now()}`);
    return !!response.response;
  } catch (error) {
    console.error('Bot connection test failed:', error);
    return false;
  }
};

/**
 * Get fallback response when bot is unavailable
 * @param message - User's message
 * @returns Fallback response string
 */
export const getFallbackResponse = (message: string): string => {
  const lowerText = message.toLowerCase();

  // Greeting responses
  if (lowerText.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! I'm SkillBot, your assistant for SkillConnect. I can help you with job applications, bidding, payments, and platform features. What would you like to know?";
  }

  // Application help
  if (lowerText.includes('apply') || lowerText.includes('application')) {
    return "To apply for a job:\n\n1. Browse available jobs in the Marketplace\n2. Open the job details you're interested in\n3. Click 'Submit Bid'\n4. Enter your proposed amount and timeline\n5. Add a personalized message\n6. Submit your application\n\nMake sure your profile is complete with your skills and experience!";
  }

  // Payment help
  if (lowerText.includes('payment') || lowerText.includes('pay') || lowerText.includes('money')) {
    return "Payment Process:\n\n✓ Payments are held securely in escrow\n✓ Released when employer marks job as complete\n✓ You can track all transactions in your Profile\n✓ Typically processed within 24-48 hours\n✓ Multiple payment methods supported\n\nFor payment issues, contact support from your profile.";
  }

  // Bidding help
  if (lowerText.includes('bid') || lowerText.includes('offer') || lowerText.includes('proposal')) {
    return "Bidding Tips:\n\n💡 Research similar jobs to price competitively\n💡 Include a detailed timeline\n💡 Highlight relevant experience\n💡 Be professional and clear\n💡 Respond quickly to employer questions\n\nYou can edit or withdraw bids before acceptance.";
  }

  // Profile help
  if (lowerText.includes('profile') || lowerText.includes('account')) {
    return "Profile Management:\n\n• Add your skills and certifications\n• Upload portfolio samples\n• Set your availability\n• Update contact information\n• View your ratings and reviews\n\nA complete profile increases your chances of getting hired!";
  }

  // Job search help
  if (lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('job')) {
    return "Finding Jobs:\n\n🔍 Use filters to narrow your search\n🔍 Set up job alerts for your skills\n🔍 Check the 'Recommended' section\n🔍 Save jobs to apply later\n🔍 Follow employers you're interested in\n\nNew jobs are posted daily!";
  }

  // Rating/Review help
  if (lowerText.includes('rating') || lowerText.includes('review') || lowerText.includes('feedback')) {
    return "Ratings & Reviews:\n\n⭐ Both employers and freelancers can rate each other\n⭐ Reviews appear on your profile\n⭐ Higher ratings improve visibility\n⭐ Be professional to maintain good ratings\n⭐ Report inappropriate reviews to support";
  }

  // Help/Support
  if (lowerText.includes('help') || lowerText.includes('support') || lowerText.includes('problem')) {
    return "I'm here to help! I can assist with:\n\n✓ Applying for jobs\n✓ Submitting and managing bids\n✓ Payment questions\n✓ Profile setup\n✓ Platform features\n✓ General guidelines\n\nWhat specific question do you have?";
  }

  // Default response
  return "I can help you with:\n\n• Applying for jobs\n• Submitting bids\n• Payment information\n• Profile management\n• Platform features\n\nPlease ask me a specific question, or choose a quick action below!";
};