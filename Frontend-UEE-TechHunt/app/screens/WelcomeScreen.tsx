import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
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
    <View style={{ flex: 1, backgroundColor: '#0A1F2F' }}>
      <View className="flex-1 justify-center items-center px-6">
        {/* Hero Section */}
        <View className="items-center mb-12">
          {/* App Icon/Logo Placeholder */}
          <View style={{ backgroundColor: '#3A7D99' }} className="w-24 h-24 rounded-full mb-8 items-center justify-center">
            <Image 
              source={require('../../assets/techhunt.png')} 
              style={{ width: 150, height: 150 }}
              resizeMode="contain"
            />
          </View>
          
          {/* Welcome Title */}
          <Text style={{ color: '#E5E5E5' }} className="text-4xl font-bold text-center mb-4">
            Welcome to
          </Text>
          <Text style={{ color: '#00FFC2' }} className="text-5xl font-bold text-center mb-6">
            TechHunt
          </Text>
          
          {/* Subtitle */}
          <Text style={{ color: '#E5E5E5', opacity: 0.8 }} className="text-lg text-center">
            Unlock your potential and build the skills that matter most
          </Text>
        </View>

        {/* Features Section */}
        <View className="w-full mb-12">
          <View className="flex-row justify-around">
            <View className="items-center">
              <View style={{ backgroundColor: '#00FFC2' }} className="w-12 h-12 rounded-full items-center justify-center mb-2">
                <Text className="text-xl">🎯</Text>
              </View>
              <Text style={{ color: '#E5E5E5', opacity: 0.7 }} className="text-sm">Personalized</Text>
            </View>
            <View className="items-center">
              <View style={{ backgroundColor: '#00FFAB' }} className="w-12 h-12 rounded-full items-center justify-center mb-2">
                <Text className="text-xl">📈</Text>
              </View>
              <Text style={{ color: '#E5E5E5', opacity: 0.7 }} className="text-sm">Progress</Text>
            </View>
            <View className="items-center">
              <View style={{ backgroundColor: '#3A7D99' }} className="w-12 h-12 rounded-full items-center justify-center mb-2">
                <Text className="text-xl">🏆</Text>
              </View>
              <Text style={{ color: '#E5E5E5', opacity: 0.7 }} className="text-sm">Achievements</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View className="w-full px-8">
          <TouchableOpacity
            style={{ backgroundColor: '#00FFC2' }}
            className="rounded-2xl py-4 px-8"
            onPress={() => navigation.navigate("Quiz")}
          >
            <Text style={{ color: '#0A1F2F' }} className="font-bold text-lg text-center">
              Start Your Journey
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
          className="bg-white rounded-2xl py-4 px-8 mt-5"
          onPress={() => navigation.navigate("Courses")}
          >
            <Text className="text-purple-700 font-bold text-lg text-center">Courses Section</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          className="bg-gray-400 rounded-2xl py-4 px-8 mt-5"
          onPress={() => navigation.navigate("FreelancerDashboard")}
          >
            <Text className="text-purple-700 font-bold text-lg text-center">Freelancer Dashboard</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity 
          className="bg-white rounded-2xl py-4 px-8 mt-5"
          onPress={() => navigation.navigate("Messages")}
          >
            <Text className="text-purple-700 font-bold text-lg text-center">Messages Section</Text>
          </TouchableOpacity> */}
          
          {/* TEST PAYMENT BUTTON - TEMPORARY */}
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
          
          {/* Secondary Action */}
          <TouchableOpacity
            style={{ borderColor: '#3A7D99', borderWidth: 2 }}
            className="mt-4 py-3 px-6 rounded-xl"
            onPress={() => {
              // Add navigation to login or skip if needed
              console.log("Secondary action");
            }}
          >
            <Text style={{ color: '#E5E5E5', opacity: 0.9 }} className="font-medium text-center">
              Already have an account?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom decorative elements */}
        <View style={{ backgroundColor: '#3A7D99', opacity: 0.3 }} className="absolute bottom-20 left-4 w-20 h-20 rounded-full" />
        <View style={{ backgroundColor: '#00FFC2', opacity: 0.2 }} className="absolute top-32 right-8 w-16 h-16 rounded-full" />
        <View style={{ backgroundColor: '#00FFAB', opacity: 0.3 }} className="absolute top-48 left-12 w-8 h-8 rounded-full" />
      </View>
    </View>
  );
}