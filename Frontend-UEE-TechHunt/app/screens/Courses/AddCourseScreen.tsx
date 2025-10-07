import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AddCourseScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleSave = () => {
    if (!title || !description || !thumbnail) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    // Normally here you'd save to backend or context
    Alert.alert("Success", "Course saved successfully!");
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold text-purple-700 mb-6">Add New Course</Text>

      <TextInput
        placeholder="Course Title"
        value={title}
        onChangeText={setTitle}
        className="border border-gray-300 rounded-xl p-4 mb-4"
      />

      <TextInput
        placeholder="Course Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        className="border border-gray-300 rounded-xl p-4 mb-4"
      />

      <TextInput
        placeholder="Thumbnail Image URL"
        value={thumbnail}
        onChangeText={setThumbnail}
        className="border border-gray-300 rounded-xl p-4 mb-6"
      />

      <TouchableOpacity
        onPress={handleSave}
        className="bg-green-600 py-4 rounded-xl mb-4"
      >
        <Text className="text-white text-center font-semibold text-lg">💾 Save Course</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-gray-300 py-3 rounded-xl"
      >
        <Text className="text-gray-800 text-center font-medium">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
