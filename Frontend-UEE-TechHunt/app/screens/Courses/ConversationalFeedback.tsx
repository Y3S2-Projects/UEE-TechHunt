import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  ActivityIndicator,
  Animated,
  Keyboard
} from "react-native";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

interface FeedbackCategory {
  id: string;
  label: string;
  emoji: string;
}

interface ConversationalFeedbackProps {
  courseTitle: string;
  onFeedbackComplete?: (rating: number, feedback: string, categories?: string[]) => void;
  apiEndpoint: string;
}

const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  { id: 'instructor', label: 'Instructor', emoji: '🧑‍🏫' },
  { id: 'content', label: 'Content depth', emoji: '💡' },
  { id: 'length', label: 'Course length', emoji: '🕒' },
  { id: 'quality', label: 'Audio/video', emoji: '🎧' },
  { id: 'experience', label: 'App experience', emoji: '📱' },
];

type FlowStage = 'rating' | 'micro-feedback' | 'chat-invite' | 'ai-chat' | 'complete';

export default function ConversationalFeedback({ 
  courseTitle, 
  onFeedbackComplete,
  apiEndpoint 
}: ConversationalFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [flowStage, setFlowStage] = useState<FlowStage>('rating');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>("");
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (flowStage === 'micro-feedback' || flowStage === 'chat-invite') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [flowStage]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const addMessage = (text: string, isAI: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isAI,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleRatingSelect = async (selectedRating: number) => {
    setRating(selectedRating);
    
    // Save rating immediately
    try {
      await axios.post(apiEndpoint, {
        rating: selectedRating,
        courseTitle,
        stage: 'rating'
      });
    } catch (error) {
      console.error('Rating save error:', error);
    }

    // Move to micro-feedback stage
    setTimeout(() => {
      setFlowStage('micro-feedback');
    }, 300);
  };

  const handleCategorySelect = async (categoryId: string) => {
    const newCategories = [...selectedCategories, categoryId];
    setSelectedCategories(newCategories);

    // Save category feedback
    try {
      await axios.post(apiEndpoint, {
        rating,
        courseTitle,
        categories: newCategories,
        stage: 'micro-feedback'
      });
    } catch (error) {
      console.error('Category save error:', error);
    }

    // Move to chat invite
    setTimeout(() => {
      setFlowStage('chat-invite');
    }, 500);
  };

  const handleChatInviteResponse = (wantsChat: boolean) => {
    if (wantsChat) {
      // Initialize AI chat
      const welcomeMessage = rating && rating < 5 
        ? `Hey! 👋 I'd love to understand what could make this course ${5} stars.`
        : `Hey! 👋 I'd love to hear more about your experience!`;
      
      addMessage(welcomeMessage, true);
      setFlowStage('ai-chat');
    } else {
      // Complete without chat
      completeFeedback();
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    addMessage(userMessage, false);
    setUserInput("");
    setIsLoading(true);

    Keyboard.dismiss();

    try {
      const response = await axios.post(apiEndpoint, {
        userMessage,
        rating,
        courseTitle,
        categories: selectedCategories,
        stage: 'ai-chat',
        conversationHistory: messages.map(m => ({
          role: m.isAI ? 'assistant' : 'user',
          content: m.text
        }))
      });

      const aiResponse = response.data.message || response.data.summary;
      
      if (aiResponse) {
        addMessage(aiResponse, true);
        setAiSummary(aiResponse);
      }

      // Complete after showing AI response
      setTimeout(() => {
        completeFeedback();
      }, 2500);
    } catch (error) {
      console.error('Message API Error:', error);
      const fallbackMessage = "Thank you for sharing that feedback. We'll work on improving the course!";
      addMessage(fallbackMessage, true);
      setAiSummary(fallbackMessage);
      
      setTimeout(() => {
        completeFeedback();
      }, 2500);
    } finally {
      setIsLoading(false);
    }
  };

  const completeFeedback = () => {
    setFlowStage('complete');
    
    if (onFeedbackComplete && rating) {
      const fullFeedback = messages
        .filter(m => !m.isAI)
        .map(m => m.text)
        .join(' ');
      onFeedbackComplete(rating, fullFeedback, selectedCategories);
    }

    // Auto-close after 2 seconds
    setTimeout(() => {
      // You can add a callback here to close the component if needed
    }, 2000);
  };

  const renderMessage = (message: Message) => {
    if (message.isAI) {
      return (
        <View key={message.id} className="mb-4 flex-row">
          <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-2">
            <Text className="text-white text-sm">🤖</Text>
          </View>
          <View className="flex-1 bg-slate-800/50 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
            <Text className="text-slate-200 text-sm leading-5">{message.text}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View key={message.id} className="mb-4 flex-row justify-end">
          <View className="bg-blue-600 rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
            <Text className="text-white text-sm leading-5">{message.text}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View className="bg-blue-500/10 rounded-2xl border border-blue-500/20 overflow-hidden">
      {/* Header */}
      <View className="bg-slate-900/50 px-4 py-3 border-b border-blue-500/20">
        <Text className="text-white font-bold text-lg">Share Your Feedback</Text>
        <Text className="text-slate-400 text-xs mt-0.5">
          {flowStage === 'rating' && 'How would you rate this course?'}
          {flowStage === 'micro-feedback' && 'What made it great?'}
          {flowStage === 'chat-invite' && 'Want to share more?'}
          {flowStage === 'ai-chat' && 'Chat with our AI assistant'}
          {flowStage === 'complete' && 'Thank you!'}
        </Text>
      </View>

      {/* Content Area */}
      <View className="px-4 py-4" style={{ minHeight: 180 }}>
        {/* Stage 1: Rating Selection */}
        {flowStage === 'rating' && (
          <View>
            <Text className="text-slate-300 text-center mb-4 text-base">
              How would you rate "{courseTitle}"?
            </Text>
            <View className="flex-row flex-wrap gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRatingSelect(star)}
                  className="bg-slate-800/70 px-4 py-3 rounded-xl border border-blue-500/30 items-center min-w-[60px]"
                >
                  <Text className="text-2xl mb-1">⭐</Text>
                  <Text className="text-white text-xs font-semibold">{star} Star</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Stage 2: Micro Feedback */}
        {flowStage === 'micro-feedback' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View className="items-center mb-3">
              <Text className="text-3xl mb-2">{'⭐'.repeat(rating || 0)}</Text>
              <Text className="text-slate-300 text-center text-base font-medium">
                Thanks! What made it a {rating}-star experience?
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2 justify-center mt-4">
              {FEEDBACK_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategorySelect(category.id)}
                  className="bg-slate-800/70 px-3 py-2.5 rounded-lg border border-blue-500/30 flex-row items-center"
                >
                  <Text className="text-lg mr-1.5">{category.emoji}</Text>
                  <Text className="text-white text-xs font-medium">{category.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Stage 3: Chat Invite */}
        {flowStage === 'chat-invite' && (
          <Animated.View style={{ opacity: fadeAnim }} className="items-center">
            <View className="bg-emerald-500/10 rounded-xl p-4 mb-4 border border-emerald-500/20">
              <Text className="text-emerald-400 text-center text-base font-semibold mb-1">
                ✓ Got it!
              </Text>
              <Text className="text-slate-300 text-center text-sm">
                Selected: {FEEDBACK_CATEGORIES.find(c => c.id === selectedCategories[0])?.emoji} {FEEDBACK_CATEGORIES.find(c => c.id === selectedCategories[0])?.label}
              </Text>
            </View>
            <Text className="text-slate-300 text-center text-base mb-4">
              Want to tell us more? 💬
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => handleChatInviteResponse(true)}
                className="bg-blue-600 px-6 py-3 rounded-xl flex-1"
              >
                <Text className="text-white text-center font-semibold">Yes, share more</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChatInviteResponse(false)}
                className="bg-slate-800/70 px-6 py-3 rounded-xl flex-1 border border-slate-600"
              >
                <Text className="text-slate-300 text-center font-semibold">No thanks</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Stage 4: AI Chat */}
        {flowStage === 'ai-chat' && (
          <View>
            <ScrollView 
              ref={scrollViewRef}
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {messages.map(renderMessage)}

              {isLoading && (
                <View className="flex-row items-center mb-4">
                  <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-2">
                    <Text className="text-white text-sm">🤖</Text>
                  </View>
                  <View className="bg-slate-800/50 rounded-2xl rounded-tl-sm p-3">
                    <ActivityIndicator size="small" color="#60a5fa" />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View className="mt-3 pt-3 border-t border-blue-500/20">
              <View className="flex-row items-center bg-slate-800/50 rounded-xl px-3 py-2">
                <TextInput
                  value={userInput}
                  onChangeText={setUserInput}
                  placeholder="Type your response..."
                  placeholderTextColor="#64748b"
                  className="flex-1 text-white py-2"
                  multiline
                  maxLength={500}
                  editable={!isLoading}
                  returnKeyType="send"
                  blurOnSubmit={false}
                  onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity
                  onPress={handleSendMessage}
                  disabled={!userInput.trim() || isLoading}
                  className="ml-2 w-10 h-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: userInput.trim() && !isLoading ? '#0ea5e9' : '#334155'
                  }}
                >
                  <Text className="text-white text-lg">➤</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Stage 5: Complete */}
        {flowStage === 'complete' && (
          <View className="py-4">
            <View className="items-center mb-4">
              <Text className="text-5xl mb-3">🎉</Text>
              <Text className="text-emerald-400 text-center text-xl font-bold mb-2">
                Thank you for your feedback!
              </Text>
            </View>
            
            {/* Show AI Summary Response */}
            {aiSummary && (
              <View className="bg-slate-800/50 rounded-xl p-4 border border-blue-500/20 mb-3">
                <View className="flex-row items-start mb-2">
                  <Text className="text-lg mr-2">💡</Text>
                  <Text className="text-blue-400 font-semibold text-sm flex-1">Our Response:</Text>
                </View>
                <Text className="text-slate-300 text-sm leading-5">
                  {aiSummary}
                </Text>
              </View>
            )}
            
            <Text className="text-slate-400 text-center text-sm px-4">
              Your input helps us improve the learning experience
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}