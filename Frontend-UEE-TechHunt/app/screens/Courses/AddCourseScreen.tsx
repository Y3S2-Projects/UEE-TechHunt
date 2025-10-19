import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// ⚠️ IMPORTANT: Replace with your computer's local IP address.
const API_URL = "http://192.168.8.141:6000/api/courses";

// Define the Course type to match the backend schema
type Course = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  contact: string;
  email: string;
  students: string;
  rating: number;
  level: string;
};

// Define the route parameter type, ensuring the function expects the correct Course type
type AddCourseRouteProp = RouteProp<
  { AddCourse: { addCourse: (newCourse: Course) => void } },
  'AddCourse'
>;

// Define navigation prop type for better type safety
type NavigationProp = StackNavigationProp<{ Courses: undefined }>;

export default function AddCourseScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddCourseRouteProp>();
  const addCourseToState = route.params?.addCourse;

  // State for all course fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [instructor, setInstructor] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState("0");
  const [rating, setRating] = useState("0");
  const [level, setLevel] = useState("Beginner");
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // Basic validation
    if (!title || !description || !thumbnail || !instructor || !contact || !email) {
      Alert.alert("Missing Fields", "Please fill out all required fields.");
      return;
    }
    
    // More specific validation for rating
    const ratingValue = parseFloat(rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      Alert.alert("Invalid Rating", "Please enter a rating between 0 and 5.");
      return;
    }
    
    // Prevent multiple submissions
    if (isLoading) return;
    setIsLoading(true);

    const newCourseData = {
      title,
      description,
      thumbnail,
      instructor,
      contact,
      email,
      students,
      rating: ratingValue,
      level,
    };
    
    try {
      // --- API Call to Backend ---
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourseData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Handle backend validation errors or other issues
        const errorMessage = Array.isArray(result.error) ? result.error.join('\n') : result.error;
        throw new Error(errorMessage || "An error occurred while saving the course.");
      }

      // If successful, update the CoursesScreen state with the new course from the database
      if (addCourseToState) {
        addCourseToState(result.data); // result.data contains the saved course with its _id
      }
      
      Alert.alert("Success", `"${title}" has been saved successfully!`);
      navigation.goBack();

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Save Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1 bg-slate-950 px-6 pt-10" contentContainerStyle={{ paddingBottom: 50 }}>
        <Text className="text-3xl font-bold text-purple-400 mb-6">Add New Course</Text>

        {/* Input Fields */}
        <TextInput placeholder="Course Title" value={title} onChangeText={setTitle} className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900"/>
        <TextInput placeholder="Instructor Name" value={instructor} onChangeText={setInstructor} className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900"/>
        <TextInput placeholder="Instructor Email" value={email} onChangeText={setEmail} keyboardType="email-address" className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900"/>
        <TextInput placeholder="Instructor Contact" value={contact} onChangeText={setContact} keyboardType="phone-pad" className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900"/>
        <TextInput placeholder="Number of Students (e.g., 5.5k)" value={students} onChangeText={setStudents} className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900"/>
        <TextInput placeholder="Rating (0.0 to 5.0)" value={rating} onChangeText={setRating} keyboardType="numeric" className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900"/>
        <TextInput placeholder="Thumbnail Image URL" value={thumbnail} onChangeText={setThumbnail} className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900"/>
        <TextInput placeholder="Course Description" value={description} onChangeText={setDescription} multiline numberOfLines={3} className="border border-slate-800 rounded-xl p-4 mb-6 text-white bg-slate-900 h-28" style={{ textAlignVertical: 'top' }}/>
        
        <Text className="text-lg font-semibold text-white mb-3">Select Level:</Text>
        <View className="flex-row mb-8">
          {levels.map((lvl) => (
            <TouchableOpacity key={lvl} onPress={() => setLevel(lvl)} className={`mr-3 px-5 py-3 rounded-full ${level === lvl ? "bg-purple-600 border-purple-500" : "bg-slate-900 border-slate-800"} border-2`}>
              <Text className={`font-semibold text-sm ${level === lvl ? "text-white" : "text-slate-400"}`}>{lvl}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleSave} disabled={isLoading} className={`py-4 rounded-xl mb-4 ${isLoading ? 'bg-green-800' : 'bg-green-600'}`}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">💾 Save Course</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-slate-800 py-3 rounded-xl border border-slate-700">
          <Text className="text-slate-300 text-center font-medium">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}