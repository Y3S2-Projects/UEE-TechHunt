import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingStack from "./OnboardingStack";

const RootStack = createStackNavigator();

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Onboarding" component={OnboardingStack} />
    </RootStack.Navigator>
  );
}
