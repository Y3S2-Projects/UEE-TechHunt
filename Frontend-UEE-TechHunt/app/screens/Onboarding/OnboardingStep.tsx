import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

type Props = {
  question: string;
  onNext: (answer: string) => void;
};

export default function OnboardingStep({ question, onNext }: Props) {
  const [answer, setAnswer] = useState("");

  return (
    <View className="w-full">
      {/* Question */}
      <Text className="text-xl font-bold text-gray-900 mb-4 text-center">
        {question}
      </Text>

      {/* Input */}
      <TextInput
        className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 text-gray-900 mb-6 shadow-sm"
        placeholder="Type your answer"
        placeholderTextColor="#9ca3af"
        value={answer}
        onChangeText={setAnswer}
      />

      {/* Next Button */}
      <TouchableOpacity
        className="w-full bg-purple-600 py-4 rounded-2xl shadow-lg active:bg-purple-700"
        onPress={() => onNext(answer)}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Next →
        </Text>
      </TouchableOpacity>
    </View>
  );
}
