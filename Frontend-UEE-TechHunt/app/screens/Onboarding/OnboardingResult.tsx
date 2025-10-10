import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";

const { width } = Dimensions.get("window");

type ResultScreenNavProp = StackNavigationProp<
  OnboardingStackParamList,
  "OnboardingResult"
>;
type ResultScreenRouteProp = RouteProp<
  OnboardingStackParamList,
  "OnboardingResult"
>;

type Props = {
  navigation: ResultScreenNavProp;
  route: ResultScreenRouteProp;
};

export default function OnboardingResult({ navigation, route }: Props) {
  const { result, answers } = route.params;

  // Handle case where AI might not return proper structure
  const profile = result?.profile || {};
  const learningPath = result?.learningPath || {};
  const recommendedProjects = result?.recommendedProjects || [];
  const estimatedTime = result?.estimatedCompletionTime || "3-6 months";

  const handleStartLearning = () => {
    // Navigate to main app or profile setup
    navigation.navigate("ProfileSetup");
  };

  const renderPhaseCard = (
    phaseKey: string,
    phaseData: any,
    index: number
  ) => {
    const colors = ["#00FFC2", "#3A7D99", "#00FFAB"];
    const bgColors = ["#00FFC220", "#3A7D9920", "#00FFAB20"];

    return (
      <View key={phaseKey} className="mb-4">
        <View className="flex-row items-start">
          {/* Step Number Circle */}
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: colors[index % 3] }}
          >
            <Text style={{ color: '#0A1F2F' }} className="font-bold text-lg">{index + 1}</Text>
          </View>

          {/* Content */}
          <View className="flex-1 ml-4">
            <Text style={{ color: '#0A1F2F' }} className="text-xl font-bold mb-1">
              {phaseData.title || `Phase ${index + 1}`}
            </Text>
            <Text style={{ color: '#3A7D99' }} className="text-sm mb-3">
              ⏱️ {phaseData.duration || "4-6 weeks"}
            </Text>

            {/* Courses */}
            {phaseData.courses && phaseData.courses.length > 0 && (
              <View
                className="p-4 rounded-2xl mb-3"
                style={{ backgroundColor: bgColors[index % 3] }}
              >
                <Text style={{ color: '#0A1F2F' }} className="font-semibold mb-2">
                  📚 Courses:
                </Text>
                {phaseData.courses.map((course: string, idx: number) => (
                  <Text key={idx} style={{ color: '#0A1F2F' }} className="text-sm mb-1">
                    • {course}
                  </Text>
                ))}
              </View>
            )}

            {/* Skills to Learn */}
            {phaseData.skills && phaseData.skills.length > 0 && (
              <View>
                <Text style={{ color: '#0A1F2F' }} className="font-semibold mb-2">
                  🎯 Skills you'll gain:
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {phaseData.skills.map((skill: string, idx: number) => (
                    <View
                      key={idx}
                      style={{ backgroundColor: '#E5E5E5', borderWidth: 1, borderColor: '#3A7D99' }}
                      className="px-3 py-1 rounded-full"
                    >
                      <Text style={{ color: '#0A1F2F' }} className="text-xs">{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Connector Line */}
        {index < Object.keys(learningPath).length - 1 && (
          <View style={{ backgroundColor: '#3A7D99' }} className="ml-6 w-0.5 h-6" />
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A1F2F' }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View className="items-center pt-16 pb-8 px-6">
          <View style={{ backgroundColor: '#00FFC2' }} className="w-24 h-24 rounded-full items-center justify-center mb-4">
            <Text className="text-5xl">🎉</Text>
          </View>
          <Text style={{ color: '#E5E5E5' }} className="text-3xl font-bold text-center mb-2">
            Welcome Aboard!
          </Text>
          <Text style={{ color: '#E5E5E5', opacity: 0.9 }} className="text-center text-base">
            Your personalized learning journey is ready
          </Text>
        </View>

        {/* Profile Summary Card */}
        <View style={{ backgroundColor: '#E5E5E5' }} className="mx-6 rounded-3xl p-6 shadow-lg mb-6">
          <Text style={{ color: '#0A1F2F' }} className="text-2xl font-bold mb-4">
            Your Profile
          </Text>

          <View className="flex-row gap-3 mb-4">
            <View style={{ backgroundColor: '#00FFC220' }} className="flex-1 rounded-2xl p-4">
              <Text style={{ color: '#3A7D99' }} className="text-xs mb-1">Track</Text>
              <Text style={{ color: '#0A1F2F' }} className="text-base font-bold">
                {profile.primaryTrack || answers?.selectedTrack || "Not set"}
              </Text>
            </View>

            <View style={{ backgroundColor: '#3A7D9920' }} className="flex-1 rounded-2xl p-4">
              <Text style={{ color: '#3A7D99' }} className="text-xs mb-1">Level</Text>
              <Text style={{ color: '#0A1F2F' }} className="text-base font-bold capitalize">
                {profile.experienceLevel || answers?.experienceLevel || "Not set"}
              </Text>
            </View>
          </View>

          {/* Strengths */}
          {profile.strengthAreas && profile.strengthAreas.length > 0 && (
            <View className="mb-4">
              <Text style={{ color: '#0A1F2F' }} className="text-sm font-semibold mb-2">
                💪 Your Strengths
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {profile.strengthAreas.map((skill: string, idx: number) => (
                  <View
                    key={idx}
                    style={{ backgroundColor: '#00FFAB30' }}
                    className="px-3 py-2 rounded-full"
                  >
                    <Text style={{ color: '#0A1F2F' }} className="text-xs font-medium">
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Areas to Improve */}
          {profile.improvementAreas && profile.improvementAreas.length > 0 && (
            <View>
              <Text style={{ color: '#0A1F2F' }} className="text-sm font-semibold mb-2">
                📈 Areas to Improve
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {profile.improvementAreas.map((skill: string, idx: number) => (
                  <View
                    key={idx}
                    style={{ backgroundColor: '#3A7D9930' }}
                    className="px-3 py-2 rounded-full"
                  >
                    <Text style={{ color: '#0A1F2F' }} className="text-xs font-medium">
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Learning Path */}
        <View style={{ backgroundColor: '#E5E5E5' }} className="mx-6 rounded-3xl p-6 shadow-lg mb-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text style={{ color: '#0A1F2F' }} className="text-2xl font-bold">
              Learning Path
            </Text>
            <View style={{ backgroundColor: '#00FFC230' }} className="px-3 py-1 rounded-full">
              <Text style={{ color: '#0A1F2F' }} className="text-xs font-semibold">
                ⏱️ {estimatedTime}
              </Text>
            </View>
          </View>

          {Object.keys(learningPath).length > 0 ? (
            Object.entries(learningPath).map(([key, value], index) =>
              renderPhaseCard(key, value, index)
            )
          ) : (
            <Text style={{ color: '#3A7D99' }} className="text-center py-8">
              Your personalized learning path will appear here
            </Text>
          )}
        </View>

        {/* Recommended Projects */}
        {recommendedProjects.length > 0 && (
          <View style={{ backgroundColor: '#E5E5E5' }} className="mx-6 rounded-3xl p-6 shadow-lg mb-6">
            <Text style={{ color: '#0A1F2F' }} className="text-2xl font-bold mb-4">
              🚀 Recommended Projects
            </Text>
            {recommendedProjects.map((project: string, idx: number) => (
              <View
                key={idx}
                style={{ backgroundColor: '#3A7D9920' }}
                className="p-4 rounded-2xl mb-3"
              >
                <View className="flex-row items-center">
                  <View style={{ backgroundColor: '#00FFC2' }} className="w-8 h-8 rounded-full items-center justify-center mr-3">
                    <Text style={{ color: '#0A1F2F' }} className="font-bold">{idx + 1}</Text>
                  </View>
                  <Text style={{ color: '#0A1F2F' }} className="flex-1 font-medium">
                    {project}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Motivational Quote */}
        <View style={{ backgroundColor: '#00FFC2' }} className="mx-6 rounded-3xl p-6 shadow-lg mb-6">
          <Text style={{ color: '#0A1F2F' }} className="text-1xl font-bold mb-2 text-center">
            "Every expert was once a beginner"
          </Text>
          <Text style={{ color: '#0A1F2F', opacity: 0.8 }} className="text-center text-sm">
            Your journey starts now. Stay consistent and you'll achieve your goals!
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={{  }} className="absolute bottom-0 left-0 right-0 px-6 py-3 mb-12">
        <TouchableOpacity
          onPress={handleStartLearning}
          style={{ backgroundColor: '#00FFC2' }}
          className="py-4 rounded-full shadow-lg"
          activeOpacity={0.8}
        >
          <Text style={{ color: '#0A1F2F' }} className="text-center font-bold text-lg py-1">
            Start My Learning Journey 🚀
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}