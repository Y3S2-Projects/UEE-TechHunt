import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import OnboardingQuiz from "../screens/Onboarding/OnboardingQuiz";
import ProfileSetup from "../screens/Onboarding/ProfileSetup";

export type OnboardingStackParamList = {
  Welcome: undefined;
  Quiz: undefined;
  ProfileSetup: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Quiz" component={OnboardingQuiz} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
    </Stack.Navigator>
  );
}
