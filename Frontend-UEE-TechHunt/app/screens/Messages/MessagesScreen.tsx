import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MessagesScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-6">Messages Screen</Text>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-green-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold text-lg">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
