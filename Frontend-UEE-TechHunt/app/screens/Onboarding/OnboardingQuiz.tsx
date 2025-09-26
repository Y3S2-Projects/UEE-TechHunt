import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import ProgressStepper from "../../components/ProgressStepper";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
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
    <View style={styles.container}>
      <ProgressStepper
        currentStep={currentStep + 1}
        totalSteps={steps.length}
      />
      <OnboardingStep
        question={steps[currentStep].question}
        onNext={handleNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
});