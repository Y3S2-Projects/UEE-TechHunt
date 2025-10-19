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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme";
import { sendMessageToBot, getFallbackResponse } from "../../services/chatbotService";

const { width } = Dimensions.get("window");

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
      const response = await sendMessageToBot(messageToSend, sessionId);

      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

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

      const isConnectionError = error.message?.includes('connect') || 
                                error.message?.includes('network') ||
                                error.message?.includes('fetch');

      if (isConnectionError) {
        setIsOnline(false);
      }

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
    setTimeout(() => {
      onSend();
    }, 100);
  }, [onSend]);

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

      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.botIndicatorWrapper}>
              <View style={styles.botIndicator}>
                <Ionicons
                  name="sparkles"
                  size={20}
                  color={Colors.PRIMARY}
                />
              </View>
              <View
                style={[
                  styles.statusDot,
                  !isOnline && styles.statusDotOffline,
                ]}
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>SkillBot AI</Text>
              <View style={styles.statusRow}>
                <View style={[
                  styles.statusIndicator,
                  !isOnline && styles.statusIndicatorOffline
                ]} />
                <Text style={styles.headerSubtitle}>
                  {isTyping
                    ? "Thinking..."
                    : isOnline
                    ? "Online"
                    : "Offline Mode"}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearChat}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={Colors.MUTED}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Connection Status Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <View style={styles.offlineBannerContent}>
            <View style={styles.offlineBannerIcon}>
              <Ionicons name="cloud-offline" size={14} color="#FFB800" />
            </View>
            <Text style={styles.offlineBannerText}>
              Limited offline mode - some features unavailable
            </Text>
          </View>
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

      {/* Enhanced Quick Actions */}
      <View style={styles.quickActionsWrapper}>
        <View style={styles.quickActionsHeader}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsDivider} />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContainer}
        >
          <QuickActionButton
            icon="briefcase-outline"
            text="Job Applications"
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
          <QuickActionButton
            icon="help-circle-outline"
            text="Support"
            color={Colors.PRIMARY}
            onPress={() => handleQuickAction("I need help with the platform")}
          />
        </ScrollView>
      </View>

      {/* Enhanced Input Area */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
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
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color="#FFF"
              />
            )}
          </TouchableOpacity>
        </View>
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
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
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
            name="sparkles"
            size={14}
            color={Colors.PRIMARY}
          />
        </View>
      )}
      <View style={{ flex: 1, maxWidth: message.isBot ? "85%" : "80%" }}>
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
        </View>
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
          <Ionicons name="person" size={14} color={Colors.ACCENT} />
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
            toValue: -6,
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
          name="sparkles"
          size={14}
          color={Colors.PRIMARY}
        />
      </View>
      <View style={{ flex: 1, maxWidth: "85%" }}>
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
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.quickActionBtn,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.quickActionIconWrapper, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon as any} size={18} color={color} />
        </View>
        <Text style={styles.quickActionText}>{text}</Text>
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
    backgroundColor: Colors.CARD_BG,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 194, 0.08)",
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  botIndicatorWrapper: {
    position: "relative",
    marginRight: 14,
  },
  botIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 255, 194, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 194, 0.25)",
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.PRIMARY,
    borderWidth: 2,
    borderColor: Colors.CARD_BG,
  },
  statusDotOffline: {
    backgroundColor: "#FFB800",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.TEXT,
    letterSpacing: 0.3,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.PRIMARY,
  },
  statusIndicatorOffline: {
    backgroundColor: "#FFB800",
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.MUTED,
    fontWeight: "500",
  },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  offlineBanner: {
    backgroundColor: "rgba(255, 184, 0, 0.08)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 184, 0, 0.15)",
  },
  offlineBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  offlineBannerIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 184, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  offlineBannerText: {
    fontSize: 12,
    color: "#FFB800",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.ACCENT,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 12,
  },
  spacer: {
    height: 20,
  },
  messageBubbleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    gap: 10,
  },
  botBubbleContainer: {
    alignSelf: "flex-start",
  },
  userBubbleContainer: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 255, 194, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 255, 194, 0.3)",
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: Colors.CARD_BG,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.12)",
  },
  userBubble: {
    backgroundColor: Colors.PRIMARY,
    borderBottomRightRadius: 6,
  },
  errorBubble: {
    borderColor: "rgba(255, 184, 0, 0.3)",
    backgroundColor: "rgba(255, 184, 0, 0.06)",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
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
    marginLeft: 4,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  botTimestamp: {
    color: Colors.MUTED,
  },
  userTimestamp: {
    color: Colors.MUTED,
    textAlign: "right",
    marginRight: 4,
  },
  typingBubble: {
    paddingVertical: 16,
    paddingHorizontal: 18,
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
    opacity: 0.7,
  },
  quickActionsWrapper: {
    backgroundColor: Colors.CARD_BG,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 255, 194, 0.08)",
    paddingTop: 12,
    paddingBottom: 8,
  },
  quickActionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  quickActionsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  quickActionsDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0, 255, 194, 0.08)",
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  quickActionBtn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.12)",
    minWidth: 110,
    gap: 8,
  },
  quickActionIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.TEXT,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  inputWrapper: {
    backgroundColor: Colors.CARD_BG,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 255, 194, 0.08)",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    color: Colors.TEXT,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "rgba(0, 255, 194, 0.15)",
    lineHeight: 20,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(0, 255, 194, 0.25)",
    shadowOpacity: 0.1,
  },
});