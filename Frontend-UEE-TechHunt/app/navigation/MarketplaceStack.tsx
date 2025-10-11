// navigation/MarketplaceStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import JobListScreen from "../screens/Marketplace/JobListScreen";
import JobDetailScreen from "../screens/Marketplace/JobDetailScreen";
import JobPostScreen from "../screens/Marketplace/JobPostScreen";
import ChatBotScreen from "../screens/Marketplace/ChatBotScreen";

export type MarketplaceParamList = {
  JobList: undefined;
  JobDetail: { job: any };
  JobPost: undefined;
  ChatBot: undefined;
};

const Stack = createStackNavigator<MarketplaceParamList>();

export default function MarketplaceStack() {
  return (
    <Stack.Navigator
  screenOptions={{
    headerShown: false,
    presentation: "card",
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    }),
  }}
>
      <Stack.Screen name="JobList" component={JobListScreen} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} />
      <Stack.Screen name="JobPost" component={JobPostScreen} />
      <Stack.Screen name="ChatBot" component={ChatBotScreen} />
    </Stack.Navigator>
  );
}
