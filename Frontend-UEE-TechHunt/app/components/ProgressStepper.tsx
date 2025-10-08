import React from "react";
import { View, Text } from "react-native";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressStepper({
  currentStep,
  totalSteps,
}: ProgressStepperProps) {
  return (
    <View>
      {/* Progress Bar */}
      <View className="flex-row mb-3">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            className="flex-1 mx-1 h-2 rounded-full overflow-hidden"
            style={{
              backgroundColor: index < currentStep ? "#FBBF24" : "rgba(255, 255, 255, 0.3)",
            }}
          />
        ))}
      </View>

      {/* Step Text */}
      <View className="flex-row justify-between px-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <Text
            key={index}
            className={`text-xs font-semibold ${
              index < currentStep ? "text-yellow-300" : "text-white text-opacity-50"
            }`}
          >
            {index + 1}
          </Text>
        ))}
      </View>
    </View>
  );
}