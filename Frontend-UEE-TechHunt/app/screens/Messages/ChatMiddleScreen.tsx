import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
// Assuming you have a type definition for your navigation stack
// import { OnboardingStackParamList } from "../../navigation/OnboardingStack"; 

// NOTE: I'm defining a placeholder type here since the original import is relative
type OnboardingStackParamList = {
    Chat: { instructor: string; contact: string; email: string };
    Chat2: { instructor: string; contact: string; email: string };
    // ... other screens
};

type ChatScreenRouteProp = RouteProp<OnboardingStackParamList, "Chat">;
type ChatScreenNavProp = StackNavigationProp<OnboardingStackParamList, "Chat">;

export default function ChatMiddleScreen() {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavProp>();
  // Assuming route.params contains all necessary data passed from CourseDetails
  const { instructor, contact, email } = route.params; 
  
  return (
    <View className="flex-1 justify-center items-center bg-slate-950 px-6">
      <Text className="text-3xl font-black text-white mb-2">
        Start a Chat
      </Text>
      <Text className="text-xl text-green-400 font-bold mb-10 text-center">
        Connect with {instructor}
      </Text>

      {/* Go To Chat Button */}
      <TouchableOpacity
        // Ensure you pass all required params to Chat2
        onPress={() => navigation.navigate("Chat2", { instructor, contact, email })}
        className="bg-green-600 w-full py-4 rounded-xl mb-4"
        style={{
            shadowColor: '#green-600',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
        }}
      >
        <Text className="text-white font-bold text-lg text-center">💬 Send a Message</Text>
      </TouchableOpacity>

      {/* Go Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-slate-800 w-full py-3 rounded-xl border border-slate-700"
      >
        <Text className="text-slate-300 font-semibold text-lg text-center">Go Back to Course</Text>
      </TouchableOpacity>
    </View>
  );
}