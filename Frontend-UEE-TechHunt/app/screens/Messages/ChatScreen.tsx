import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Linking,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// --- Type Definitions ---
type Message = {
  id: string;
  text: string;
  sender: "instructor" | "me";
  timestamp: number;
};

type OnboardingStackParamList = {
  Chat2: { instructor: string; contact: string; email: string };
  // ... other screens in your stack
};

type ChatScreenRouteProp = RouteProp<OnboardingStackParamList, "Chat2">;
type ChatScreenNavProp = StackNavigationProp<OnboardingStackParamList, "Chat2">;

// --- Helper for Auto-Reply Text ---
const generateInstructorResponse = (userMessage: string, instructorName: string): string => {
  const lowerCaseMsg = userMessage.toLowerCase();

  if (lowerCaseMsg.includes("hello") || lowerCaseMsg.includes("hi")) {
    return `Hello! I'm ${instructorName}. How may I assist you with the course today?`;
  }
  if (lowerCaseMsg.includes("assignment") || lowerCaseMsg.includes("deadline")) {
    return `Please check the course syllabus for assignment details and deadlines. I can guide you if you have a specific query.`;
  }
  if (lowerCaseMsg.includes("contact") || lowerCaseMsg.includes("call")) {
    return `If it's urgent, you can call or email me using the icons above.`;
  }
  return `That's a great question! Let me check on that and get back to you shortly.`;
};


export default function ChatScreen() {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavProp>();
  const { instructor, contact, email } = route.params;

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: `Hi, I'm ${instructor}. How can I help you today?`, sender: "instructor", timestamp: Date.now() - 5000 },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = React.useRef<FlatList<Message>>(null);

  // Scroll to bottom on message update
  useEffect(() => {
    setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);


  // --- Interactive Handlers ---

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const userMessageText = inputText;
    const newMessage: Message = {
      id: Date.now().toString() + 'me',
      text: userMessageText,
      sender: "me",
      timestamp: Date.now(),
    };

    // 1. Add user message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");

    // 2. Simulate Instructor typing and replying
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateInstructorResponse(userMessageText, instructor);
      const instructorReply: Message = {
        id: Date.now().toString() + 'instructor',
        text: replyText,
        sender: "instructor",
        timestamp: Date.now() + 1000,
      };

      setMessages((prevMessages) => [...prevMessages, instructorReply]);
      setIsTyping(false);
    }, 1500); // 1.5 second delay for "typing"
  };

  const handleCall = useCallback(() => {
    // Basic validation before attempting call
    if (contact && contact.match(/^[0-9\s\-\(\)]+$/)) {
      Linking.openURL(`tel:${contact.replace(/[\s\-\(\)]/g, '')}`);
    } else {
      Alert.alert("Error", "Contact number is not valid.");
    }
  }, [contact]);

  const handleEmail = useCallback(() => {
     if (email && email.includes('@')) {
       Linking.openURL(`mailto:${email}`);
     } else {
       Alert.alert("Error", "Email address is not valid.");
     }
  }, [email]);


  // --- Message Rendering ---

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";
    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View
        className={`m-2 px-4 py-2 rounded-2xl max-w-[80%] 
          ${isMe
            // Your bubble style: Purple background, flat bottom-right corner, on the right
            ? "bg-purple-600 self-end rounded-br-md" 
            // Instructor bubble style: Dark gray background, flat top-left corner, on the left
            : "bg-slate-800 self-start rounded-tl-md"  
          }`}
        // Using a subtle border instead of elevation on the dark background
        style={{ borderWidth: isMe ? 0 : 1, borderColor: '#334155' }} 
      >
        <Text
          className={`text-base ${
            isMe ? "text-white" : "text-slate-200"
          }`}
        >
          {item.text}
        </Text>
        <Text className={`text-xs mt-1 ${isMe ? "text-purple-200 self-end" : "text-slate-400 self-start"}`}>
          {time}
        </Text>
      </View>
    );
  };


  // --- Main Render ---

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-950" // Dark background
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar barStyle="light-content" />

      {/* Header with Call/Email Actions */}
      <View className="flex-row items-center justify-between bg-slate-900 p-4 pt-12 shadow-lg border-b border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 ml-2">
          <Text className="text-purple-400 text-2xl font-bold">{"←"}</Text>
        </TouchableOpacity>

        <View className="flex-1 ml-4">
          <Text className="text-white text-lg font-semibold">{instructor}</Text>
          <Text className={`text-sm ${isTyping ? 'text-yellow-400' : 'text-green-400'}`}>
            {isTyping ? "Typing..." : "Online"}
          </Text>
        </View>

        {/* Action Icons */}
        <View className="flex-row">
          <TouchableOpacity onPress={handleCall} className="p-2 mx-1">
            <Text className="text-purple-400 text-xl">📞</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEmail} className="p-2 mx-1">
            <Text className="text-purple-400 text-xl">✉️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Input area */}
      <View className="flex-row items-center border-t border-slate-800 p-3 bg-slate-900 pb-6">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#64748b" // slate-500
          className="flex-1 bg-slate-800 rounded-full px-4 py-3 text-base text-white border border-slate-700"
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={inputText.trim().length === 0 || isTyping}
          className={`ml-2 rounded-full p-3 ${
            inputText.trim().length > 0 && !isTyping ? "bg-purple-600" : "bg-slate-700"
          }`}
          style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center' }}
        >
          {/* Send Icon */}
          <Text className="text-white text-xl font-bold">➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}