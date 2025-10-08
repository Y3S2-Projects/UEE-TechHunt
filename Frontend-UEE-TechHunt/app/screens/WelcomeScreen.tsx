import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRouter } from "expo-router";
import { OnboardingStackParamList } from "../navigation/OnboardingStack";

type WelcomeScreenNavProp = StackNavigationProp<
  OnboardingStackParamList,
  "Welcome"
>;

type Props = {
  navigation: WelcomeScreenNavProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-purple-600">
      <View className="flex-1 justify-center items-center px-6">
        {/* Hero Section */}
        <View className="items-center mb-12">
          {/* App Icon/Logo Placeholder */}
          <View className="w-24 h-24 bg-white bg-opacity-20 rounded-full mb-8 items-center justify-center">
            <Text className="text-4xl text-white font-bold">SB</Text>
          </View>
          
          {/* Welcome Title */}
          <Text className="text-4xl font-bold text-white text-center mb-4">
            Welcome to
          </Text>
          <Text className="text-5xl font-bold text-yellow-400 text-center mb-6">
            SkillBuilder
          </Text>
          
          {/* Subtitle */}
          <Text className="text-lg text-white text-opacity-80 text-center">
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
              <Text className="text-white text-opacity-70 text-sm">Personalized</Text>
            </View>
            <View className="items-center">
              <View className="w-12 h-12 bg-green-400 rounded-full items-center justify-center mb-2">
                <Text className="text-xl">📈</Text>
              </View>
              <Text className="text-white text-opacity-70 text-sm">Progress</Text>
            </View>
            <View className="items-center">
              <View className="w-12 h-12 bg-pink-400 rounded-full items-center justify-center mb-2">
                <Text className="text-xl">🏆</Text>
              </View>
              <Text className="text-white text-opacity-70 text-sm">Achievements</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View className="w-full px-8">
          <TouchableOpacity
            className="bg-white rounded-2xl py-4 px-8"
            onPress={() => navigation.navigate("Quiz")}
          >
            <Text className="text-purple-700 font-bold text-lg text-center">
              Start Your Journey
            </Text>
          </TouchableOpacity>
          
          {/* TEST PAYMENT BUTTON - TEMPORARY */}
          <TouchableOpacity
            className="mt-4 py-4 px-8 bg-green-500 rounded-2xl"
            onPress={() => {
              try {
                router.push('/payment/checkout');
              } catch (error) {
                console.log('Navigation error:', error);
              }
            }}
          >
            <Text className="text-white font-bold text-lg text-center">
              💳 Test Payment Gateway
            </Text>
          </TouchableOpacity>
          
          {/* Secondary Action */}
          <TouchableOpacity
            className="mt-4 py-3 px-6 border-2 border-white border-opacity-30 rounded-xl"
            onPress={() => {
              // Add navigation to login or skip if needed
              console.log("Secondary action");
            }}
          >
            <Text className="text-white text-opacity-90 font-medium text-center">
              Already have an account?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom decorative elements */}
        <View className="absolute bottom-20 left-4 w-20 h-20 bg-white bg-opacity-10 rounded-full" />
        <View className="absolute top-32 right-8 w-16 h-16 bg-yellow-400 bg-opacity-20 rounded-full" />
        <View className="absolute top-48 left-12 w-8 h-8 bg-pink-400 bg-opacity-30 rounded-full" />
      </View>
    </View>
  );
}