import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  ActivityIndicator,
  Platform,
  Keyboard
} from "react-native";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

interface ConversationalFeedbackProps {
  courseTitle: string;
  onFeedbackComplete?: (rating: number, feedback: string) => void;
  apiEndpoint: string;
}

export default function ConversationalFeedback({ 
  courseTitle, 
  onFeedbackComplete,
  apiEndpoint 
}: ConversationalFeedbackProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! 👋 I'd love to hear about your experience with "${courseTitle}". How would you rate it?`,
      isAI: true,
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [conversationStage, setConversationStage] = useState<'rating' | 'details' | 'complete'>('rating');
  const scrollViewRef = useRef<ScrollView>(null);

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
    addMessage(`${selectedRating} stars`, false);
    setIsLoading(true);

    try {
      const response = await axios.post(apiEndpoint, {
        rating: selectedRating,
        courseTitle,
        conversationStage: 'rating'
      });

      const aiResponse = response.data.message;
      addMessage(aiResponse, true);
      setConversationStage('details');
    } catch (error) {
      console.error('Rating API Error:', error);
      addMessage("Thanks for the rating! What did you think about the course?", true);
      setConversationStage('details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    addMessage(userMessage, false);
    setUserInput("");
    setIsLoading(true);

    // Dismiss keyboard
    Keyboard.dismiss();

    try {
      const response = await axios.post(apiEndpoint, {
        userMessage,
        rating,
        courseTitle,
        conversationStage,
        conversationHistory: messages.map(m => ({
          role: m.isAI ? 'assistant' : 'user',
          content: m.text
        }))
      });

      const aiResponse = response.data.message;
      addMessage(aiResponse, true);

      // Check if conversation should end
      if (response.data.shouldEnd) {
        setConversationStage('complete');
        if (onFeedbackComplete && rating) {
          const fullFeedback = messages
            .filter(m => !m.isAI)
            .map(m => m.text)
            .join(' ');
          onFeedbackComplete(rating, fullFeedback);
        }
      }
    } catch (error) {
      console.error('Message API Error:', error);
      addMessage("I appreciate your feedback! Is there anything else you'd like to share?", true);
    } finally {
      setIsLoading(false);
    }
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
        <Text className="text-slate-400 text-xs mt-0.5">Chat with our AI assistant</Text>
      </View>

      {/* Chat Area */}
      <ScrollView 
        ref={scrollViewRef}
        className="px-4 py-4"
        style={{ maxHeight: 400 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(renderMessage)}

        {/* Rating Buttons - Show only when stage is 'rating' and no rating selected */}
        {conversationStage === 'rating' && rating === null && (
          <View className="mb-4">
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

        {/* Loading Indicator */}
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

      {/* Input Area - Show only after rating is selected */}
      {rating !== null && conversationStage !== 'complete' && (
        <View className="px-4 py-3 border-t border-blue-500/20 bg-slate-900/30">
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
      )}

      {/* Completion Message */}
      {conversationStage === 'complete' && (
        <View className="px-4 py-4 bg-emerald-500/10 border-t border-emerald-500/20">
          <Text className="text-emerald-400 text-center font-semibold">
            ✓ Thank you for your valuable feedback!
          </Text>
        </View>
      )}
    </View>
  );
}