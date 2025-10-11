// screens/Marketplace/ChatBotScreen.tsx
import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme";
import { sendMessageToBot, getFallbackResponse } from "../../services/chatbotService";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isError?: boolean;
}

export default function ChatBotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      text: "Hi! I'm SkillBot — your intelligent assistant for SkillConnect. 🤖",
      isBot: true,
      timestamp: new Date(),
    },
    {
      id: "welcome-2",
      text: "I can help you with job applications, bidding, payments, and platform features. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>(
    `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );
  const [isOnline, setIsOnline] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const onSend = useCallback(async () => {
    if (!inputText.trim() || isTyping) return;

    const messageToSend = inputText.trim();
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageToSend,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Send message to n8n chatbot
      const response = await sendMessageToBot(messageToSend, sessionId);

      // Update session ID if provided
      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      // Simulate typing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: response.response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsOnline(true);
    } catch (error: any) {
      console.error("Error getting bot response:", error);

      // Check if it's a connection error
      const isConnectionError = error.message?.includes('connect') || 
                                error.message?.includes('network') ||
                                error.message?.includes('fetch');

      if (isConnectionError) {
        setIsOnline(false);
      }

      // Use fallback response
      const fallbackReply = getFallbackResponse(messageToSend);

      const botMessage: Message = {
        id: `bot-fallback-${Date.now()}`,
        text: isConnectionError 
          ? `⚠️ I'm currently offline. Here's what I know:\n\n${fallbackReply}`
          : fallbackReply,
        isBot: true,
        timestamp: new Date(),
        isError: isConnectionError,
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputText, sessionId, isTyping]);

  const handleQuickAction = useCallback((message: string) => {
    setInputText(message);
    // Auto-send after setting text
    setTimeout(() => {
      onSend();
    }, 100);
  }, [onSend]);

  const handleRetry = useCallback(() => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages]
        .reverse()
        .find((msg) => !msg.isBot);
      
      if (lastUserMessage) {
        setInputText(lastUserMessage.text);
        setTimeout(() => onSend(), 100);
      }
    }
  }, [messages, onSend]);

  const handleClearChat = useCallback(() => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all messages?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setMessages([
              {
                id: "welcome-1",
                text: "Chat cleared! How can I help you?",
                isBot: true,
                timestamp: new Date(),
              },
            ]);
            setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
          },
        },
      ]
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.ACCENT} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botIndicator}>
            <View
              style={[
                styles.botIndicatorInner,
                !isOnline && styles.botIndicatorOffline,
              ]}
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>SkillBot AI</Text>
            <Text style={styles.headerSubtitle}>
              {isTyping
                ? "Typing..."
                : isOnline
                ? "Online • Ready to help"
                : "Offline • Using local knowledge"}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.infoBtn} onPress={handleClearChat}>
          <Ionicons
            name="trash-outline"
            size={20}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {/* Connection Status Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#FFB800" />
          <Text style={styles.offlineBannerText}>
            Limited offline mode - some features unavailable
          </Text>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickActionButton
          icon="briefcase-outline"
          text="Apply"
          color="#00D4FF"
          onPress={() => handleQuickAction("How do I apply for jobs?")}
        />
        <QuickActionButton
          icon="cash-outline"
          text="Payments"
          color="#FFB800"
          onPress={() => handleQuickAction("How do payments work?")}
        />
        <QuickActionButton
          icon="pricetag-outline"
          text="Bidding"
          color="#9D6CFF"
          onPress={() => handleQuickAction("How to submit a bid?")}
        />
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask SkillBot anything..."
          placeholderTextColor={Colors.MUTED}
          multiline
          maxLength={500}
          onSubmitEditing={onSend}
          editable={!isTyping}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isTyping) && styles.sendButtonDisabled,
          ]}
          onPress={onSend}
          disabled={!inputText.trim() || isTyping}
        >
          {isTyping ? (
            <ActivityIndicator size="small" color={Colors.ACCENT} />
          ) : (
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? Colors.ACCENT : Colors.MUTED}
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageBubbleContainer,
        message.isBot ? styles.botBubbleContainer : styles.userBubbleContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {message.isBot && (
        <View style={styles.botAvatar}>
          <Ionicons
            name="chatbubble-ellipses"
            size={16}
            color={Colors.PRIMARY}
          />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          message.isBot ? styles.botBubble : styles.userBubble,
          message.isError && styles.errorBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isBot ? styles.botText : styles.userText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            message.isBot ? styles.botTimestamp : styles.userTimestamp,
          ]}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      {!message.isBot && (
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={16} color="#FFF" />
        </View>
      )}
    </Animated.View>
  );
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={styles.messageBubbleContainer}>
      <View style={styles.botAvatar}>
        <Ionicons
          name="chatbubble-ellipses"
          size={16}
          color={Colors.PRIMARY}
        />
      </View>
      <View
        style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}
      >
        <View style={styles.typingDots}>
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: dot1 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: dot2 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: dot3 }] }]}
          />
        </View>
      </View>
    </View>
  );
}

function QuickActionButton({
  text,
  icon,
  color,
  onPress,
}: {
  text: string;
  icon: string;
  color: string;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.quickActionBtn,
          {
            backgroundColor: `${color}20`,
            borderColor: `${color}40`,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Ionicons name={icon as any} size={16} color={color} />
        <Text style={[styles.quickActionText, { color }]}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ACCENT,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 194, 0.1)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  botIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 255, 194, 0.15)",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  botIndicatorInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY,
  },
  botIndicatorOffline: {
    backgroundColor: "#FFB800",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.TEXT,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.MUTED,
    marginTop: 2,
  },
  infoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 255, 194, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 184, 0, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 184, 0, 0.2)",
    gap: 8,
  },
  offlineBannerText: {
    fontSize: 12,
    color: "#FFB800",
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.ACCENT,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  spacer: {
    height: 20,
  },
  messageBubbleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
    gap: 8,
  },
  botBubbleContainer: {
    alignSelf: "flex-start",
  },
  userBubbleContainer: {
    alignSelf: "flex-end",
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.CARD_BG,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.3)",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: Colors.CARD_BG,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.1)",
  },
  userBubble: {
    backgroundColor: Colors.PRIMARY,
    borderBottomRightRadius: 4,
  },
  errorBubble: {
    borderColor: "rgba(255, 184, 0, 0.3)",
    backgroundColor: "rgba(255, 184, 0, 0.05)",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botText: {
    color: Colors.TEXT,
  },
  userText: {
    color: Colors.ACCENT,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 6,
  },
  botTimestamp: {
    color: Colors.MUTED,
  },
  userTimestamp: {
    color: "rgba(10, 31, 47, 0.6)",
    textAlign: "right",
  },
  typingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.PRIMARY,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.CARD_BG,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 255, 194, 0.1)",
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.CARD_BG,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: Colors.ACCENT,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.TEXT,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.2)",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(0, 255, 194, 0.3)",
  },
});