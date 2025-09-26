import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import ProgressStepper from "../../components/ProgressStepper";
import OnboardingStep from "./OnboardingStep";

const steps = [
  { question: "What skills do you have?", key: "skills" },
  { question: "What are your goals?", key: "goals" },
  { question: "What is your availability?", key: "availability" },
];

type QuizScreenNavProp = StackNavigationProp<OnboardingStackParamList, "Quiz">;

type Props = {
  navigation: QuizScreenNavProp;
};

export default function OnboardingQuiz({ navigation }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNext = (answer: string) => {
    const stepKey = steps[currentStep].key;
    setAnswers({ ...answers, [stepKey]: answer });

    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate("ProfileSetup");
    }
  };

  return (
    <View className="flex-1 bg-purple-600">
      <View className="flex-1 px-6 py-20">
        {/* Header */}
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-white text-center py-20">
            Let’s Personalize Your Journey
          </Text>
          <Text className="text-base text-white text-opacity-80 text-center mt-1">
            Answer a few quick questions to get started
          </Text>
        </View>

        {/* Progress Stepper */}
        <View className="mb-6">
          <ProgressStepper
            currentStep={currentStep + 1}
            totalSteps={steps.length}
          />
        </View>

        {/* Step Card */}
        <View className="flex-1 items-center justify-center">
          <View className="w-full bg-yellow-300 rounded-3xl p-6 shadow-lg">
            <OnboardingStep
              question={steps[currentStep].question}
              onNext={handleNext}
            />
          </View>
        </View>

        {/* Footer with Step Count */}
        <View className="mt-6 py-10">
          <Text className="text-white text-opacity-80 text-center">
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Bottom Decorative Elements */}
        <View className="absolute bottom-20 left-4 w-20 h-20 bg-white bg-opacity-10 rounded-full" />
        <View className="absolute top-24 right-8 w-16 h-16 bg-yellow-400 bg-opacity-20 rounded-full" />
        <View className="absolute top-52 left-12 w-10 h-10 bg-pink-400 bg-opacity-30 rounded-full" />
      </View>
    </View>
  );
}