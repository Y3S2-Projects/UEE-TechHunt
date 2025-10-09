import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import ProgressStepper from "../../components/ProgressStepper";

const { width } = Dimensions.get("window");

// Your n8n webhook URL
const N8N_WEBHOOK_URL = "https://sasin00.app.n8n.cloud/webhook-test/onboarding-quiz";

type QuizScreenNavProp = StackNavigationProp<OnboardingStackParamList, "Quiz">;

type Props = {
  navigation: QuizScreenNavProp;
};

interface Track {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

interface ExperienceLevel {
  id: string;
  name: string;
  description: string;
  years: string;
}

const tracks: Track[] = [
  {
    id: "SE",
    name: "Software Engineering",
    emoji: "💻",
    color: "#00FFC2",
    description: "Build applications & systems",
  },
  {
    id: "IT",
    name: "IT & Infrastructure",
    emoji: "🖥️",
    color: "#3A7D99",
    description: "Manage networks & systems",
  },
  {
    id: "QA",
    name: "Quality Assurance",
    emoji: "🧪",
    color: "#00FFAB",
    description: "Test & ensure quality",
  },
  {
    id: "UIUX",
    name: "UI/UX Design",
    emoji: "🎨",
    color: "#00FFC2",
    description: "Design user experiences",
  },
];

const experienceLevels: ExperienceLevel[] = [
  {
    id: "beginner",
    name: "Beginner",
    description: "Just starting out",
    years: "0-1 years",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "Some experience",
    years: "1-3 years",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Experienced professional",
    years: "3+ years",
  },
];

const skillsByTrack: Record<string, string[]> = {
  SE: ["JavaScript", "Python", "React", "Node.js", "Git", "SQL", "TypeScript", "Docker"],
  IT: ["Cloud Computing", "Networking", "Linux", "Security", "Docker", "AWS", "Azure"],
  QA: ["Testing", "Automation", "Selenium", "JIRA", "API Testing", "Postman", "Cypress"],
  UIUX: ["Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing", "Sketch"],
};

export default function OnboardingQuiz({ navigation }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    selectedTrack: "",
    experienceLevel: "",
    skills: [] as string[],
    goals: "",
  });

  const totalSteps = 4;

  // Helper function to get available skills based on selected track
  const getAvailableSkills = (): string[] => {
    const trackId = tracks.find((t) => t.name === answers.selectedTrack)?.id || "SE";
    return skillsByTrack[trackId] || skillsByTrack.SE;
  };

  // Check if current step can proceed
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return answers.selectedTrack !== "";
      case 2:
        return answers.experienceLevel !== "";
      case 3:
        return answers.skills.length > 0;
      case 4:
        return answers.goals.trim().length > 10;
      default:
        return false;
    }
  };

  // Handle skill toggle
  const toggleSkill = (skill: string) => {
    setAnswers((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  // Handle navigation
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      submitToN8N();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit data to n8n
  const submitToN8N = async () => {
    setLoading(true);

    try {
      const payload = {
        userId: `user_${Date.now()}`,
        question1: answers.selectedTrack,
        question2: answers.experienceLevel,
        question3: answers.skills,
        question4: answers.goals,
        timestamp: new Date().toISOString(),
      };

      console.log("Submitting to n8n:", payload);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("n8n Response:", result);

      // Navigate to results screen with the data
      navigation.navigate("OnboardingResult", { 
        result: result.data || result,
        answers: answers 
      });
    } catch (error) {
      console.error("Error submitting to n8n:", error);
      Alert.alert(
        "Connection Error",
        "Failed to process your responses. Please check your internet connection and try again.",
        [
          {
            text: "Retry",
            onPress: () => submitToN8N(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A1F2F' }} className="items-center justify-center">
        <ActivityIndicator size="large" color="#00FFC2" />
        <Text style={{ color: '#E5E5E5' }} className="text-xl font-semibold mt-4">
          Creating your learning path...
        </Text>
        <Text style={{ color: '#E5E5E5', opacity: 0.7 }} className="mt-2 px-8 text-center">
          AI is analyzing your responses
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A1F2F' }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-8 mt-20">
          <Text style={{ color: '#E5E5E5' }} className="text-3xl font-bold text-center">
            {currentStep === 1 && "Choose Your Path"}
            {currentStep === 2 && "Your Experience"}
            {currentStep === 3 && "Your Skills"}
            {currentStep === 4 && "Your Goals"}
          </Text>
          <Text style={{ color: '#E5E5E5', opacity: 0.8 }} className="text-base text-center mt-2">
            {currentStep === 1 && "What area interests you most?"}
            {currentStep === 2 && "How would you rate your experience?"}
            {currentStep === 3 && "Select skills you already have"}
            {currentStep === 4 && "What do you want to achieve?"}
          </Text>
        </View>

        {/* Progress Stepper */}
        <View className="px-6 mb-6">
          <ProgressStepper currentStep={currentStep} totalSteps={totalSteps} />
        </View>

        {/* Content Card */}
        <View className="px-6">
          <View style={{ backgroundColor: '#E5E5E5' }} className="rounded-3xl p-6 shadow-lg min-h-[400px]">
            {/* Step 1: Track Selection */}
            {currentStep === 1 && (
              <View className="gap-3">
                {tracks.map((track) => (
                  <TouchableOpacity
                    key={track.id}
                    onPress={() =>
                      setAnswers((prev) => ({ ...prev, selectedTrack: track.name }))
                    }
                    style={{
                      borderWidth: 2,
                      borderColor: answers.selectedTrack === track.name ? '#00FFC2' : '#D1D5DB',
                      backgroundColor: answers.selectedTrack === track.name ? '#00FFC220' : '#FFFFFF',
                    }}
                    className="p-4 rounded-2xl"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center">
                      <View
                        className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                        style={{ backgroundColor: track.color + "20" }}
                      >
                        <Text className="text-3xl">{track.emoji}</Text>
                      </View>
                      <View className="flex-1">
                        <Text style={{ color: '#0A1F2F' }} className="text-lg font-bold">
                          {track.name}
                        </Text>
                        <Text style={{ color: '#3A7D99' }} className="text-sm mt-1">
                          {track.description}
                        </Text>
                      </View>
                      {answers.selectedTrack === track.name && (
                        <View style={{ backgroundColor: '#00FFC2' }} className="w-6 h-6 rounded-full items-center justify-center">
                          <Text style={{ color: '#0A1F2F' }} className="text-xs">✓</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Step 2: Experience Level */}
            {currentStep === 2 && (
              <View className="gap-3">
                {experienceLevels.map((level) => (
                  <TouchableOpacity
                    key={level.id}
                    onPress={() =>
                      setAnswers((prev) => ({ ...prev, experienceLevel: level.id }))
                    }
                    style={{
                      borderWidth: 2,
                      borderColor: answers.experienceLevel === level.id ? '#00FFC2' : '#D1D5DB',
                      backgroundColor: answers.experienceLevel === level.id ? '#00FFC220' : '#FFFFFF',
                    }}
                    className="p-5 rounded-2xl"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text style={{ color: '#0A1F2F' }} className="text-xl font-bold">
                          {level.name}
                        </Text>
                        <Text style={{ color: '#3A7D99' }} className="text-sm mt-1">
                          {level.description}
                        </Text>
                        <Text style={{ color: '#3A7D99', opacity: 0.7 }} className="text-xs mt-1">
                          {level.years}
                        </Text>
                      </View>
                      {answers.experienceLevel === level.id && (
                        <View style={{ backgroundColor: '#00FFC2' }} className="w-6 h-6 rounded-full items-center justify-center">
                          <Text style={{ color: '#0A1F2F' }} className="text-xs">✓</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Step 3: Skills Selection */}
            {currentStep === 3 && (
              <View>
                <Text style={{ color: '#3A7D99' }} className="text-sm mb-4">
                  Selected: {answers.skills.length} skill{answers.skills.length !== 1 ? "s" : ""}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {getAvailableSkills().map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      onPress={() => toggleSkill(skill)}
                      style={{
                        backgroundColor: answers.skills.includes(skill) ? '#00FFC2' : '#FFFFFF',
                        borderWidth: 2,
                        borderColor: answers.skills.includes(skill) ? '#00FFC2' : '#D1D5DB',
                      }}
                      className="px-4 py-3 rounded-full"
                      activeOpacity={0.7}
                    >
                      <Text
                        style={{
                          color: answers.skills.includes(skill) ? '#0A1F2F' : '#3A7D99',
                        }}
                        className="font-semibold"
                      >
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Step 4: Goals */}
            {currentStep === 4 && (
              <View>
                <Text style={{ color: '#3A7D99' }} className="text-sm mb-4">
                  Tell us about your learning objectives (minimum 10 characters)
                </Text>
                <TextInput
                  value={answers.goals}
                  onChangeText={(text) =>
                    setAnswers((prev) => ({ ...prev, goals: text }))
                  }
                  placeholder="E.g., I want to become a full-stack developer and build my own startup..."
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#0A1F2F',
                    borderWidth: 2,
                    borderColor: '#D1D5DB',
                  }}
                  className="rounded-2xl p-4 text-base min-h-[200px]"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={{ color: '#3A7D99', opacity: 0.7 }} className="text-xs mt-2 text-right">
                  {answers.goals.length} characters
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Navigation Buttons */}
        <View className="px-6 mt-6 flex-row justify-between">
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={handleBack}
              style={{ backgroundColor: '#3A7D99', opacity: 0.5 }}
              className="px-8 py-4 rounded-full"
              activeOpacity={0.7}
            >
              <Text style={{ color: '#E5E5E5' }} className="font-bold text-base">Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleNext}
            disabled={!canProceed()}
            style={{ backgroundColor: canProceed() ? '#00FFC2' : '#9CA3AF' }}
            className="px-8 py-4 rounded-full ml-auto"
            activeOpacity={0.7}
          >
            <Text style={{ color: '#0A1F2F' }} className="font-bold text-base">
              {currentStep === totalSteps ? "Complete" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Step Indicator */}
        <View className="mt-6">
          <Text style={{ color: '#E5E5E5', opacity: 0.7 }} className="text-center">
            Step {currentStep} of {totalSteps}
          </Text>
        </View>
      </ScrollView>

      {/* Decorative Elements */}
      <View style={{ backgroundColor: '#3A7D99', opacity: 0.3 }} className="absolute bottom-20 left-4 w-20 h-20 rounded-full" />
      <View style={{ backgroundColor: '#00FFC2', opacity: 0.2 }} className="absolute top-24 right-8 w-16 h-16 rounded-full" />
      <View style={{ backgroundColor: '#00FFAB', opacity: 0.3 }} className="absolute top-52 left-12 w-10 h-10 rounded-full" />
    </View>
  );
}