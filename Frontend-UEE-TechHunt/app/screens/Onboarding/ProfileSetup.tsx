import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-purple-600 px-6 py-10">
      {/* Title */}
      <Text className="text-3xl font-bold text-white text-center mb-8">
        Profile Setup
      </Text>

      {/* Avatar Picker */}
      <TouchableOpacity
        className="self-center w-28 h-28 rounded-full bg-white bg-opacity-20 items-center justify-center mb-8 overflow-hidden"
        onPress={pickImage}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} className="w-full h-full" />
        ) : (
          <Text className="text-white text-3xl">👤</Text>
        )}
      </TouchableOpacity>

      {/* Name Input */}
      <TextInput
        className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 text-gray-900 mb-6 shadow-sm"
        placeholder="Your Name"
        placeholderTextColor="#9ca3af"
        value={name}
        onChangeText={setName}
      />

      {/* Finish Button */}
      <TouchableOpacity
        className="w-full bg-yellow-400 py-4 rounded-2xl shadow-lg active:bg-yellow-500"
        onPress={() => console.log({ name, avatar })}
      >
        <Text className="text-purple-700 text-lg font-semibold text-center">
          Finish
        </Text>
      </TouchableOpacity>

      {/* Decorative Elements */}
      <View className="absolute bottom-20 left-4 w-20 h-20 bg-white bg-opacity-10 rounded-full" />
      <View className="absolute top-32 right-8 w-16 h-16 bg-pink-400 bg-opacity-20 rounded-full" />
      <View className="absolute top-52 left-12 w-10 h-10 bg-yellow-400 bg-opacity-30 rounded-full" />
    </View>
  );
}
