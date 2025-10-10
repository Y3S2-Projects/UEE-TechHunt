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
  Chat2: { instructor: string; contact:string; email: string };
  // ... other screens in your stack
};

type ChatScreenRouteProp = RouteProp<OnboardingStackParamList, "Chat2">;
type ChatScreenNavProp = StackNavigationProp<OnboardingStackParamList, "Chat2">;

// --- Helper for Auto-Reply Text ---
const generateInstructorResponse = (userMessage: string, instructorName: string): string => {
  const lowerCaseMsg = userMessage.toLowerCase();

  // --- Greetings & General Inquiries ---
  if (lowerCaseMsg.includes("hello") || lowerCaseMsg.includes("hi") || lowerCaseMsg.includes("hey")) {
    return `Hello! I'm ${instructorName}. How may I assist you with the course today? 👋`;
  }
  if (lowerCaseMsg.includes("how are you") || lowerCaseMsg.includes("how's it going")) {
    return `I'm doing well, thank you! Ready to help you learn. What's on your mind?`;
  }
  if (lowerCaseMsg.includes("help") || lowerCaseMsg.includes("stuck") || lowerCaseMsg.includes("don't understand")) {
    return `Of course, I'm here to help. Could you please tell me which lesson or topic you're struggling with?`;
  }
  if (lowerCaseMsg.includes("thank you") || lowerCaseMsg.includes("thanks") || lowerCaseMsg.includes("appreciate it")) {
    return `You're very welcome! Happy to help. Let me know if anything else comes up.`;
  }
  if (lowerCaseMsg.includes("who are you") || lowerCaseMsg.includes("your name")) {
    return `I'm ${instructorName}, your instructor for this course. I'm excited to help you on your learning journey!`;
  }
  if (lowerCaseMsg.includes("ok") || lowerCaseMsg.includes("got it") || lowerCaseMsg.includes("understood")) {
    return `Great! Glad to hear that's clear now.`;
  }
  if (lowerCaseMsg.includes("bye") || lowerCaseMsg.includes("see you")) {
    return `Goodbye for now! Happy learning, and don't hesitate to reach out again if you need anything.`;
  }
  if (lowerCaseMsg.includes("sorry") || lowerCaseMsg.includes("my mistake")) {
    return `No problem at all! Learning is a process of trial and error. What's the next question?`;
  }
  if (lowerCaseMsg.includes("confused") || lowerCaseMsg.includes("lost")) {
    return `It's okay to feel confused sometimes. Let's break it down. Can you tell me what part specifically is unclear?`;
  }
  if (lowerCaseMsg.includes("awesome") || lowerCaseMsg.includes("great course") || lowerCaseMsg.includes("love it")) {
    return `I'm so glad to hear you're enjoying the course! That's what I aim for. Thank you for the feedback! 😊`;
  }
  if (lowerCaseMsg.includes("boring") || lowerCaseMsg.includes("not engaging")) {
    return `I'm sorry to hear that. I appreciate the feedback. Is there a specific topic you found slow? I'm always looking to improve the content.`;
  }

  // --- Course Information ---
  if (lowerCaseMsg.includes("course details") || lowerCaseMsg.includes("about this course") || lowerCaseMsg.includes("overview")) {
    return `You can find the complete course overview, including all modules and topics covered, on the main course page.`;
  }
  if (lowerCaseMsg.includes("prerequisites") || lowerCaseMsg.includes("what do i need to know")) {
    return `The prerequisites are listed in the course description. Generally, a basic understanding of the fundamentals is recommended, but we cover a lot from the ground up!`;
  }
  if (lowerCaseMsg.includes("how long is this course") || lowerCaseMsg.includes("duration")) {
    return `The course contains about 20 hours of video content. Most students complete it in 4-6 weeks, but you have lifetime access, so you can go at your own pace!`;
  }
  if (lowerCaseMsg.includes("next lesson") || lowerCaseMsg.includes("what's next")) {
    return `After this module, we'll be diving into the next major topic. You can see the full syllabus on the course curriculum page.`;
  }
  if (lowerCaseMsg.includes("is this for beginners") || lowerCaseMsg.includes("beginner friendly")) {
    return `Yes, this course is designed for absolute beginners. We start with the fundamentals and build up from there. No prior experience is required!`;
  }
  if (lowerCaseMsg.includes("advanced course") || lowerCaseMsg.includes("for experts")) {
    return `This is a more advanced course. A solid understanding of the fundamentals is required. Please check the prerequisites section for more details.`;
  }
  if (lowerCaseMsg.includes("updated") || lowerCaseMsg.includes("latest version")) {
    return `Yes, the course content is regularly updated to reflect the latest industry standards. The last major update was just a few months ago.`;
  }
  if (lowerCaseMsg.includes("language") || lowerCaseMsg.includes("subtitles")) {
    return `The course is taught in English. Subtitles are available in English, Spanish, and French. You can enable them in the video player settings.`;
  }
  if (lowerCaseMsg.includes("syllabus") || lowerCaseMsg.includes("curriculum")) {
    return `The full syllabus is available on the main course page. It lists every video, resource, and project included.`;
  }
  if (lowerCaseMsg.includes("pacing") || lowerCaseMsg.includes("too fast") || lowerCaseMsg.includes("too slow")) {
    return `You can adjust the video playback speed using the settings in the player. Feel free to slow it down or speed it up to a pace that's comfortable for you.`;
  }
  if (lowerCaseMsg.includes("another course") || lowerCaseMsg.includes("what to learn next")) {
    return `After mastering this, a great next step would be my course on a more advanced topic. It builds directly on the skills you've learned here.`;
  }
  if (lowerCaseMsg.includes("compare") || lowerCaseMsg.includes("vs") || lowerCaseMsg.includes("this or that")) {
    return `Both technologies are great! In this course, we focus on one because it's more beginner-friendly. I explain the key differences in the introductory module.`;
  }

  // --- Pricing & Payment ---
  if (lowerCaseMsg.includes("price") || lowerCaseMsg.includes("cost") || lowerCaseMsg.includes("how much") || lowerCaseMsg.includes("fee")) {
    return `For the most current pricing, please check the main course page. We sometimes have promotions running! 💰`;
  }
  if (lowerCaseMsg.includes("discount") || lowerCaseMsg.includes("coupon") || lowerCaseMsg.includes("offer")) {
    return `Any available discounts or coupon codes will be automatically applied or displayed on the course enrollment page.`;
  }
  if (lowerCaseMsg.includes("payment method") || lowerCaseMsg.includes("pay with") || lowerCaseMsg.includes("credit card") || lowerCaseMsg.includes("paypal")) {
    return `We accept all major credit cards as well as PayPal. You can select your preferred method at checkout.`;
  }
  if (lowerCaseMsg.includes("refund") || lowerCaseMsg.includes("money back")) {
    return `We have a 30-day money-back guarantee. If you're not satisfied for any reason, you can request a full refund through your account dashboard.`;
  }
  if (lowerCaseMsg.includes("invoice") || lowerCaseMsg.includes("receipt")) {
    return `You will receive an email with your receipt after purchase. You can also find a copy in your account's purchase history.`;
  }
  if (lowerCaseMsg.includes("lifetime access")) {
    return `Yes, your purchase includes lifetime access to all course materials, including all future updates, for a single one-time payment!`;
  }
  if (lowerCaseMsg.includes("free") || lowerCaseMsg.includes("trial")) {
    return `You can watch the first few lectures for free to get a feel for the course. The full course and all its resources require a one-time purchase.`;
  }
  if (lowerCaseMsg.includes("subscription") || lowerCaseMsg.includes("monthly fee")) {
    return `This course is a one-time purchase for lifetime access. It is not a subscription model.`;
  }
  if (lowerCaseMsg.includes("team access") || lowerCaseMsg.includes("for my company") || lowerCaseMsg.includes("bulk")) {
    return `We do offer team plans and bulk discounts. Please contact our business support team for a quote.`;
  }
  if (lowerCaseMsg.includes("gift") || lowerCaseMsg.includes("buy for a friend")) {
    return `Yes, you can gift this course! Look for the "Gift this course" option on the enrollment page.`;
  }

  // --- Content & Resources ---
  if (lowerCaseMsg.includes("download files") || lowerCaseMsg.includes("source code") || lowerCaseMsg.includes("project files")) {
    return `Yes, all project files and source code are available for download. Look for the "Resources" tab under each video lecture.`;
  }
  if (lowerCaseMsg.includes("slides") || lowerCaseMsg.includes("pdf") || lowerCaseMsg.includes("presentation")) {
    return `The presentation slides for this module are available for download in the "Resources" section in PDF format.`;
  }
  if (lowerCaseMsg.includes("quiz") || lowerCaseMsg.includes("test") || lowerCaseMsg.includes("assessment")) {
    return `There's a quiz at the end of each major section to help you test your knowledge. Your scores won't affect your final certificate.`;
  }
  if (lowerCaseMsg.includes("video quality") || lowerCaseMsg.includes("blurry") || lowerCaseMsg.includes("resolution")) {
    return `All videos are available in 1080p HD. Please check the video player settings (the gear icon) to adjust the resolution if it looks blurry.`;
  }
  if (lowerCaseMsg.includes("transcript")) {
    return `A full text transcript is available for each video lecture. Click the "Transcript" button below the player to follow along.`;
  }
  if (lowerCaseMsg.includes("recommended books") || lowerCaseMsg.includes("further reading")) {
    return `That's a great initiative! I've included a list of recommended books and articles in the final lesson of this module.`;
  }
  if (lowerCaseMsg.includes("software") || lowerCaseMsg.includes("tools") || lowerCaseMsg.includes("install")) {
    return `In the first section, "Getting Started," there's a dedicated lecture on how to download and install all the necessary software.`;
  }
  if (lowerCaseMsg.includes("real world") || lowerCaseMsg.includes("practical example")) {
    return `Absolutely. We will build a complete real-world application from scratch to apply everything we've learned.`;
  }
  if (lowerCaseMsg.includes("best practices") || lowerCaseMsg.includes("coding standards")) {
    return `I emphasize industry best practices throughout the course, especially in the sections on code structure and maintainability.`;
  }
  if (lowerCaseMsg.includes("version control") || lowerCaseMsg.includes("git") || lowerCaseMsg.includes("github")) {
    return `Version control is crucial. We have a whole section dedicated to Git and how to use GitHub for your projects.`;
  }
  if (lowerCaseMsg.includes("deployment") || lowerCaseMsg.includes("hosting") || lowerCaseMsg.includes("go live")) {
    return `The final module covers how to deploy your application to a live server so you can share it with the world.`;
  }
  if (lowerCaseMsg.includes("typo") || lowerCaseMsg.includes("mistake in video")) {
    return `Thank you for catching that! Can you tell me the lesson and timestamp? I'll get that corrected.`;
  }

  // --- Assignments & Projects ---
  if (lowerCaseMsg.includes("assignment") || lowerCaseMsg.includes("homework") || lowerCaseMsg.includes("deadline")) {
    return `You can find all assignment details, requirements, and deadlines in the "Assignments" tab on the course dashboard.`;
  }
  if (lowerCaseMsg.includes("submit") || lowerCaseMsg.includes("upload assignment")) {
    return `To submit your work, please go to the relevant assignment page and use the "Upload File" button.`;
  }
  if (lowerCaseMsg.includes("feedback") || lowerCaseMsg.includes("review my code") || lowerCaseMsg.includes("grade")) {
    return `I provide personalized feedback on all major project submissions. Please allow 2-3 business days for a review after you submit.`;
  }
  if (lowerCaseMsg.includes("late submission") || lowerCaseMsg.includes("extension")) {
    return `I understand that things can come up. The deadlines are flexible since it's a self-paced course, so just submit it when you're ready.`;
  }
  if (lowerCaseMsg.includes("solution") || lowerCaseMsg.includes("see the answer")) {
    return `The official solutions for the exercises are provided in the next lecture. I highly recommend trying to solve them on your own first!`;
  }
  if (lowerCaseMsg.includes("portfolio") || lowerCaseMsg.includes("project for my portfolio")) {
    return `The final capstone project in this course is a perfect piece to include in your professional portfolio.`;
  }
  if (lowerCaseMsg.includes("debugging") || lowerCaseMsg.includes("error") || lowerCaseMsg.includes("code not working")) {
    return `Debugging is a key skill! Can you please paste the code snippet and the exact error message you're seeing? I'll help you figure it out.`;
  }
  if (lowerCaseMsg.includes("cheating") || lowerCaseMsg.includes("plagiarism")) {
    return `All submitted work must be your own. Plagiarism is taken very seriously. It's okay to get help, but the final work must be yours.`;
  }

  // --- Tutor/Instructor Interaction ---
  if (lowerCaseMsg.includes("contact") || lowerCaseMsg.includes("call") || lowerCaseMsg.includes("email")) {
    return `For urgent matters, feel free to use the call or email icons at the top of the screen. For course questions, asking here is best!`;
  }
  if (lowerCaseMsg.includes("office hours") || lowerCaseMsg.includes("live session") || lowerCaseMsg.includes("webinar")) {
    return `I hold live Q&A sessions every two weeks. You'll get an announcement with the schedule and link.`;
  }
  if (lowerCaseMsg.includes("one-on-one") || lowerCaseMsg.includes("private session") || lowerCaseMsg.includes("personal help")) {
    return `While I can't offer private one-on-one sessions, I'm happy to answer any specific questions you post here or in the Q&A section.`;
  }
  if (lowerCaseMsg.includes("your experience") || lowerCaseMsg.includes("background")) {
    return `I've been a professional in this field for over 10 years. You can learn more about my background on my profile page linked from the course description.`;
  }
  if (lowerCaseMsg.includes("availability") || lowerCaseMsg.includes("when are you online")) {
    return `I check messages several times a day on weekdays. I'll always try to get back to you within 24 hours.`;
  }
  if (lowerCaseMsg.includes("is this live") || lowerCaseMsg.includes("are you a bot") || lowerCaseMsg.includes("robot")) {
    return `I use some automated responses for common questions to get you an answer quickly! For more complex issues, I (${instructorName}) will reply personally.`;
  }

  // --- Technical & Platform Issues ---
  if (lowerCaseMsg.includes("video not playing") || lowerCaseMsg.includes("video error") || lowerCaseMsg.includes("can't load")) {
    return `Sorry to hear that. Please try refreshing the page or clearing your browser cache. If the issue persists, let me know which video it is.`;
  }
  if (lowerCaseMsg.includes("login problem") || lowerCaseMsg.includes("can't log in") || lowerCaseMsg.includes("password")) {
    return `For account or login issues, you'll need to contact the platform's support team directly. There should be a "Help" or "Support" link on the site.`;
  }
  if (lowerCaseMsg.includes("audio") || lowerCaseMsg.includes("no sound")) {
    return `Please ensure your device's volume is up and not muted. Also, check the volume control within the video player itself.`;
  }
  if (lowerCaseMsg.includes("slow") || lowerCaseMsg.includes("buffering")) {
    return `Video buffering can sometimes be due to your internet connection. Try lowering the video quality in the player settings to see if that helps.`;
  }
  if (lowerCaseMsg.includes("app") || lowerCaseMsg.includes("mobile") || lowerCaseMsg.includes("on my phone")) {
    return `Yes, you can access the entire course on our mobile app, available for both iOS and Android. You can even download lessons for offline viewing.`;
  }
  if (lowerCaseMsg.includes("offline") || lowerCaseMsg.includes("no internet")) {
    return `With our mobile app, you can download entire sections of the course for offline viewing on a plane or when you have no internet.`;
  }
  if (lowerCaseMsg.includes("bug") || lowerCaseMsg.includes("glitch") || lowerCaseMsg.includes("platform issue")) {
    return `If you think you've found a bug with the website or app itself, please report it to the platform's main support channel. They handle that side of things.`;
  }
  if (lowerCaseMsg.includes("dark mode")) {
    return `Yes, the course player supports dark mode. You can toggle it in your account settings on the main website.`;
  }
  if (lowerCaseMsg.includes("notifications") || lowerCaseMsg.includes("email spam")) {
    return `You can manage your email notification preferences in your account settings to control which updates you receive.`;
  }

  // --- Progress & Certification ---
  if (lowerCaseMsg.includes("certificate") || lowerCaseMsg.includes("completion")) {
    return `Yes, upon successfully completing all the lessons and quizzes, you will receive a certificate of completion. 🎓`;
  }
  if (lowerCaseMsg.includes("get my certificate") || lowerCaseMsg.includes("download certificate")) {
    return `Once you've completed 100% of the course, a button to download your certificate will appear on your course dashboard.`;
  }
  if (lowerCaseMsg.includes("progress") || lowerCaseMsg.includes("how am i doing")) {
    return `You can track your progress on the main course dashboard. It will show you which lessons you've completed with a checkmark.`;
  }
  if (lowerCaseMsg.includes("validity") || lowerCaseMsg.includes("certificate expire")) {
    return `Your certificate of completion does not have an expiration date.`;
  }
  if (lowerCaseMsg.includes("share certificate") || lowerCaseMsg.includes("linkedin")) {
    return `Absolutely! Your certificate will have a unique URL that you can easily share on your LinkedIn profile or add to your resume.`;
  }
  if (lowerCaseMsg.includes("exam") || lowerCaseMsg.includes("final test")) {
    return `There is no final exam. Your completion is based on finishing all the video modules and the final capstone project.`;
  }
  if (lowerCaseMsg.includes("credits") || lowerCaseMsg.includes("college credit")) {
    return `This course does not offer college credit. It's intended for professional development and building job-ready skills.`;
  }

  // --- Community & Ratings ---
  if (lowerCaseMsg.includes("community") || lowerCaseMsg.includes("forum") || lowerCaseMsg.includes("other students") || lowerCaseMsg.includes("discord")) {
    return `We have a dedicated Q&A section for each lecture where you can interact with other students. We also have a Discord server; the link is in the first lecture!`;
  }
  if (lowerCaseMsg.includes("leave a review") || lowerCaseMsg.includes("rating") || lowerCaseMsg.includes("feedback on course")) {
    return `I'd love that! You'll be prompted to leave a review after you've completed a portion of the course. Your feedback is incredibly valuable!`;
  }
  if (lowerCaseMsg.includes("see reviews") || lowerCaseMsg.includes("ratings")) {
    return `You can see ratings and reviews from other students on the main course landing page, right below the title.`;
  }

  // --- Career & Jobs ---
  if (lowerCaseMsg.includes("job") || lowerCaseMsg.includes("career") || lowerCaseMsg.includes("get hired")) {
    return `Many students have used the skills from this course to advance their careers or land new jobs. The final module has some tips on building your portfolio.`;
  }
  if (lowerCaseMsg.includes("interview") || lowerCaseMsg.includes("job interview questions")) {
    return `The last module includes a bonus section on common technical interview questions related to this topic to help you prepare.`;
  }
  if (lowerCaseMsg.includes("freelance") || lowerCaseMsg.includes("get clients")) {
    return `The skills you learn here are highly sought after by freelance clients. In the final module, I share some tips on finding your first freelance project.`;
  }
  if (lowerCaseMsg.includes("career advice") || lowerCaseMsg.includes("what should i learn")) {
    return `That's a big question! It depends on your goals. After this course, popular paths are to specialize in front-end or back-end development. We can discuss what's best for you.`;
  }

  // --- Default Fallback ---
  return `That's a great question! I'll need to check on that specifically. In the meantime, have you checked the Q&A section for that lecture? Someone may have already asked.`;
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