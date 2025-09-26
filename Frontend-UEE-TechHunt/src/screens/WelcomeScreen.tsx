import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../navigation/OnboardingStack";

type WelcomeScreenNavProp = StackNavigationProp<
  OnboardingStackParamList,
  "Welcome"
>;

type Props = {
  navigation: WelcomeScreenNavProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      <View className="flex-1 justify-center items-center px-6">
        {/* Hero Section */}
        <View className="items-center mb-12">
          {/* App Icon/Logo Placeholder */}
          <View className="w-24 h-24 bg-white/20 rounded-full mb-8 items-center justify-center shadow-lg">
            <Text className="text-4xl text-white font-bold">SB</Text>
          </View>
          
          {/* Welcome Title */}
          <Text className="text-4xl font-bold text-white text-center mb-4 tracking-wide">
            Welcome to
          </Text>
          <Text className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-center mb-6">
            SkillBuilder
          </Text>
          
          {/* Subtitle */}
          <Text className="text-lg text-white/80 text-center leading-6 max-w-xs">
            Unlock your potential and build the skills that matter most
          </Text>
        </View>

        {/* Features Section */}
        <View className="w-full mb-12">
          <View className="flex-row justify-around">
            <View className="items-center">
              <View className="w-12 h-12 bg-yellow-400 rounded-full items-center justify-center mb-2">
                <Text className="text-xl">🎯</Text>
              </View>
              <Text className="text-white/70 text-sm">Personalized</Text>
            </View>
            <View className="items-center">
              <View className="w-12 h-12 bg-green-400 rounded-full items-center justify-center mb-2">
                <Text className="text-xl">📈</Text>
              </View>
              <Text className="text-white/70 text-sm">Progress</Text>
            </View>
            <View className="items-center">
              <View className="w-12 h-12 bg-pink-400 rounded-full items-center justify-center mb-2">
                <Text className="text-xl">🏆</Text>
              </View>
              <Text className="text-white/70 text-sm">Achievements</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View className="w-full px-8">
          <TouchableOpacity
            className="bg-white rounded-2xl py-4 px-8 shadow-xl active:scale-95 transform transition-transform"
            onPress={() => navigation.navigate("Quiz")}
          >
            <Text className="text-purple-700 font-bold text-lg text-center">
              Start Your Journey
            </Text>
          </TouchableOpacity>
          
          {/* Secondary Action */}
          <TouchableOpacity
            className="mt-4 py-3 px-6 border-2 border-white/30 rounded-xl active:bg-white/10"
            onPress={() => {
              // Add navigation to login or skip if needed
              console.log("Secondary action");
            }}
          >
            <Text className="text-white/90 font-medium text-center">
              Already have an account?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom decorative elements */}
        <View className="absolute bottom-20 left-4 w-20 h-20 bg-white/10 rounded-full" />
        <View className="absolute top-32 right-8 w-16 h-16 bg-yellow-400/20 rounded-full" />
        <View className="absolute top-48 left-12 w-8 h-8 bg-pink-400/30 rounded-full" />
      </View>
    </SafeAreaView>
  );
}