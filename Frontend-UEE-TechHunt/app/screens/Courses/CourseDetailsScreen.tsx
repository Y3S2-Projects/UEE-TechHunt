import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack"; // adjust path

type CourseDetailsRouteProp = RouteProp<OnboardingStackParamList, "CourseDetails">;
type CourseDetailsNavProp = StackNavigationProp<OnboardingStackParamList, "CourseDetails">;

export default function CourseDetailsScreen() {
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation<CourseDetailsNavProp>();
  const { course } = route.params;

  return (
    <View className="flex-1 bg-white px-5 pt-8">
      <Image
        source={{ uri: course.thumbnail }}
        className="w-full h-64 rounded-xl mb-4"
        resizeMode="cover"
      />
      <Text className="text-3xl font-bold mb-2 text-purple-700">{course.title}</Text>
      <Text className="text-gray-700 text-lg mb-6">{course.description}</Text>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-gray-300 py-3 rounded-xl"
      >
        <Text className="text-gray-800 text-center font-medium">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
