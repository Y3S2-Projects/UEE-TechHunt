import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import OnboardingQuiz from "../screens/Onboarding/OnboardingQuiz";
import ProfileSetup from "../screens/Onboarding/ProfileSetup";
import WelcomeScreen from "../screens/WelcomeScreen";
import CoursesScreen from "../screens/Courses/CoursesScreen";
import MessagesScreen from "../screens/Messages/MessagesScreen";
import AddCourseScreen from "../screens/Courses/AddCourseScreen";

export type OnboardingStackParamList = {
  Welcome: undefined;
  Quiz: undefined;
  ProfileSetup: undefined;
  Messages: undefined;
  Courses: undefined;
  AddCourse: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Quiz" component={OnboardingQuiz} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="AddCourse" component={AddCourseScreen} />
    </Stack.Navigator> 
  );
}