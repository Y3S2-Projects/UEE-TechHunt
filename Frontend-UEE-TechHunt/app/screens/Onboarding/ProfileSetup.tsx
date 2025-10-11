import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const isFormValid = name.trim() && email.trim() && password.trim();

  return (
    <View style={{ flex: 1, backgroundColor: '#0A1F2F' }}>
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 40, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Background Elements */}
        <View style={{ backgroundColor: '#00FFC2', opacity: 0.15 }} className="absolute top-20 -right-10 w-40 h-40 rounded-full" />
        <View style={{ backgroundColor: '#00FFAB', opacity: 0.2 }} className="absolute top-60 -left-16 w-52 h-52 rounded-full" />
        <View style={{ backgroundColor: '#3A7D99', opacity: 0.25 }} className="absolute bottom-32 right-8 w-36 h-36 rounded-full" />
        <View style={{ backgroundColor: '#00FFC2', opacity: 0.1 }} className="absolute bottom-64 left-12 w-28 h-28 rounded-full" />

        {/* Energetic Title with Emoji */}
        <View className="items-center mb-8">
          <View className="flex-row items-center justify-center mb-2 mt-6">
            <Text className="text-4xl mr-2">⚡</Text>
            <Text style={{ color: '#00FFC2' }} className="text-4xl font-bold">
              Almost There!
            </Text>
            <Text className="text-4xl ml-2">⚡</Text>
          </View>
          <Text style={{ color: '#E5E5E5', opacity: 0.8 }} className="text-base text-center">
            Let's personalize your experience
          </Text>
        </View>

        {/* Avatar Picker with Glow Effect */}
        <View className="items-center mb-8">
          <TouchableOpacity
            style={{ 
              backgroundColor: '#00FFC2',
              shadowColor: '#00FFC2',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 20,
              elevation: 10,
            }}
            className="w-32 h-32 rounded-full items-center justify-center overflow-hidden"
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <Text className="text-5xl mb-1">📸</Text>
                <Text style={{ color: '#0A1F2F' }} className="text-xs font-bold">
                  TAP ME
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={{ color: '#00FFC2' }} className="text-sm font-semibold mt-3">
            Choose your avatar
          </Text>
        </View>

        {/* Name Input with Icon */}
        <View className="mb-6">
          <Text style={{ color: '#E5E5E5' }} className="text-sm font-semibold mb-2 ml-1">
            What should we call you? 🎯
          </Text>
          <View style={{ 
            backgroundColor: '#E5E5E5',
            borderWidth: 2,
            borderColor: name.length > 0 ? '#00FFC2' : '#3A7D99',
          }} className="flex-row items-center rounded-2xl px-4 py-4 shadow-lg">
            <Text className="text-2xl mr-3">👋</Text>
            <TextInput
              style={{ color: '#0A1F2F', flex: 1 }}
              className="text-base font-medium"
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />
            {name.length > 0 && (
              <Text className="text-xl">✨</Text>
            )}
          </View>
        </View>

        {/* Email Input with Icon */}
        <View className="mb-6">
          <Text style={{ color: '#E5E5E5' }} className="text-sm font-semibold mb-2 ml-1">
            What is your email? 📧
          </Text>
          <View style={{ 
            backgroundColor: '#E5E5E5',
            borderWidth: 2,
            borderColor: email.length > 0 ? '#00FFC2' : '#3A7D99',
          }} className="flex-row items-center rounded-2xl px-4 py-4 shadow-lg">
            <Text className="text-2xl mr-3">✉️</Text>
            <TextInput
              style={{ color: '#0A1F2F', flex: 1 }}
              className="text-base font-medium"
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {email.length > 0 && (
              <Text className="text-xl">✨</Text>
            )}
          </View>
        </View>

        {/* Password Input with Icon */}
        <View className="mb-8">
          <Text style={{ color: '#E5E5E5' }} className="text-sm font-semibold mb-2 ml-1">
            What is your password? 🔐
          </Text>
          <View style={{ 
            backgroundColor: '#E5E5E5',
            borderWidth: 2,
            borderColor: password.length > 0 ? '#00FFC2' : '#3A7D99',
          }} className="flex-row items-center rounded-2xl px-4 py-4 shadow-lg">
            <Text className="text-2xl mr-3">🔒</Text>
            <TextInput
              style={{ color: '#0A1F2F', flex: 1 }}
              className="text-base font-medium"
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />
            {password.length > 0 && (
              <Text className="text-xl">✨</Text>
            )}
          </View>
        </View>

        {/* Energetic Finish Button */}
        <TouchableOpacity
          style={{ 
            backgroundColor: isFormValid ? '#00FFC2' : '#3A7D99',
            shadowColor: isFormValid ? '#00FFC2' : '#3A7D99',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 12,
            opacity: isFormValid ? 1 : 0.5,
          }}
          className="w-full py-5 rounded-2xl mb-4"
          onPress={() => console.log({ name, email, password, avatar })}
          activeOpacity={0.85}
          disabled={!isFormValid}
        >
          <View className="flex-row items-center justify-center">
            <Text style={{ color: '#0A1F2F' }} className="text-xl font-bold mr-2">
              Let's Go!
            </Text>
            <Text className="text-2xl">🚀</Text>
          </View>
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View className="items-center mt-6">
          <View className="flex-row items-center gap-2">
            <View style={{ backgroundColor: '#00FFC2' }} className="w-3 h-3 rounded-full" />
            <View style={{ backgroundColor: '#00FFC2' }} className="w-3 h-3 rounded-full" />
            <View style={{ backgroundColor: '#00FFC2' }} className="w-3 h-3 rounded-full" />
            <View style={{ backgroundColor: '#00FFC2' }} className="w-8 h-3 rounded-full" />
          </View>
          <Text style={{ color: '#E5E5E5', opacity: 0.6 }} className="text-xs mt-2">
            Final step
          </Text>
        </View>

        {/* Floating Action Elements */}
        <View style={{ backgroundColor: '#00FFAB', opacity: 0.4 }} className="absolute top-44 right-6 w-12 h-12 rounded-full" />
        <View style={{ backgroundColor: '#3A7D99', opacity: 0.4 }} className="absolute bottom-80 left-8 w-16 h-16 rounded-full" />
        <View style={{ backgroundColor: '#00FFC2', opacity: 0.3 }} className="absolute top-96 left-4 w-8 h-8 rounded-full" />
        <View style={{ backgroundColor: '#00FFAB', opacity: 0.35 }} className="absolute bottom-48 right-12 w-10 h-10 rounded-full" />
      </ScrollView>
    </View>
  );
}