import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import OnboardingQuiz from "../screens/Onboarding/OnboardingQuiz";
import OnboardingResult from "../screens/Onboarding/OnboardingResult";
import ProfileSetup from "../screens/Onboarding/ProfileSetup";
import CoursesScreen from "../screens/Courses/CoursesScreen";
import MessagesScreen from "../screens/Messages/MessagesScreen";
import AddCourseScreen from "../screens/Courses/AddCourseScreen";
import CourseDetailsScreen from "../screens/Courses/CourseDetailsScreen";

// Type definitions for navigation
export type OnboardingStackParamList = {
  Welcome: undefined;
  Quiz: undefined;
  OnboardingResult: {
    result: {
      profile?: {
        primaryTrack?: string;
        experienceLevel?: string;
        strengthAreas?: string[];
        improvementAreas?: string[];
      };
      learningPath?: Record<string, any>;
      recommendedProjects?: string[];
      estimatedCompletionTime?: string;
    };
    answers: {
      selectedTrack: string;
      experienceLevel: string;
      skills: string[];
      goals: string;
    };
  };
  ProfileSetup: undefined;
  Messages: undefined;
  Courses: undefined;
  AddCourse: undefined;
  CourseDetails: { course: { id: string; title: string; description: string; thumbnail: string } };
  FreelancerDashboard: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#0A1F2F" },
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      <Stack.Screen name="Quiz" component={OnboardingQuiz} />
      <Stack.Screen 
        name="OnboardingResult" 
        component={OnboardingResult}
        options={{
          gestureEnabled: false, // Prevent going back after completing quiz
        }}
      />
      <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="AddCourse" component={AddCourseScreen} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
      <Stack.Screen name="FreelancerDashboard" component={require("../screens/Freelancer/FreelancerDashboard").default} />
    </Stack.Navigator> 
  );
}