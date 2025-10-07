import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  AddCourse: undefined;
  // Add other routes here if needed
};

type NavigationProp = StackNavigationProp<RootStackParamList, "AddCourse">;

export default function CoursesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [courses, setCourses] = useState([
    {
      id: "1",
      title: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript to build modern websites.",
      thumbnail: "https://img.freepik.com/free-vector/web-development-concept_23-2148829706.jpg",
    },
    {
      id: "2",
      title: "UI/UX Design Masterclass",
      description: "Master Figma and design user-friendly, aesthetic interfaces.",
      thumbnail: "https://img.freepik.com/free-vector/user-experience-concept-illustration_114360-1098.jpg",
    },
  ]);

  const renderCourse = ({ item }: any) => (
    <View className="bg-gray-100 p-4 rounded-2xl mb-4 shadow">
      <Image
        source={{ uri: item.thumbnail }}
        className="w-full h-40 rounded-xl mb-3"
        resizeMode="cover"
      />
      <Text className="text-lg font-bold text-gray-800 mb-1">{item.title}</Text>
      <Text className="text-gray-600 text-sm">{item.description}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white px-5 pt-8">
      <Text className="text-2xl font-bold mb-6 text-purple-700">All Courses</Text>

      {/* Course List */}
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourse}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Course Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("AddCourse")}
        className="bg-purple-600 py-4 rounded-xl mt-6"
      >
        <Text className="text-white text-center text-lg font-semibold">➕ Add New Course</Text>
      </TouchableOpacity>

      {/* Go Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-gray-300 py-3 rounded-xl mt-4"
      >
        <Text className="text-gray-800 text-center font-medium">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
