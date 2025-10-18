// app/screens.Courses/AfterPayCourse.tsx
import React, { useState } from "react";
import { 
  View, Text, Image, TouchableOpacity, Alert, ScrollView, StatusBar 
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ConversationalFeedback from "./ConversationalFeedback";

export default function AfterPayCourse() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse course data
  const course = params.courseData 
    ? JSON.parse(params.courseData as string) 
    : {
        title: "Premium Course",
        description: "Course description",
        thumbnail: "https://via.placeholder.com/800x400",
        instructor: "Instructor",
        contact: "+1234567890",
        email: "instructor@example.com"
      };

  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleRate = (rate: number) => setRating(rate);

  const handleFeedbackComplete = async (feedbackRating: number, feedbackText: string) => {
    try {
      console.log('Feedback submitted:', { feedbackRating, feedbackText });
      Alert.alert(
        "Thank you! 🎉",
        "Your feedback helps us improve the learning experience.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error saving feedback:', error);
      Alert.alert("Error", "Could not save feedback. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="relative">
          <Image
            source={{ uri: course.thumbnail }}
            className="w-full h-96"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950" />

          {/* Back Button */}
<TouchableOpacity
  onPress={() => router.replace("/screens/Courses/CoursesScreen")}
  className="absolute top-12 left-5 bg-black/50 backdrop-blur-xl rounded-full w-10 h-10 items-center justify-center"
  style={{ backdropFilter: 'blur(20px)' }}
>
  <Text className="text-white text-xl font-bold">←</Text>
</TouchableOpacity>


          {/* Like Button */}
          <View className="absolute top-12 right-5 flex-row gap-2">
            <TouchableOpacity
              onPress={handleLike}
              className="bg-white/20 backdrop-blur-xl rounded-full w-10 h-10 items-center justify-center"
            >
              <Text className="text-xl">{isLiked ? "❤️" : "🤍"}</Text>
            </TouchableOpacity>
          </View>

          {/* Enrolled Badge */}
          <View className="absolute bottom-9 left-6">
            <View className="bg-emerald-500/90 backdrop-blur-xl px-6 py-2 rounded-full flex-row items-center">
              <Text className="text-white font-bold mr-2">✓</Text>
              <Text className="text-white font-bold">Enrolled</Text>
            </View>
          </View>
        </View>

        {/* Content Card */}
        <View className="bg-slate-950 -mt-8 rounded-t-3xl px-6 pt-6 pb-8">
          {/* Course Badge */}
          <View className="flex-row items-center mb-4">
            <View className="bg-purple-500/20 px-4 py-1.5 rounded-full mr-2">
              <Text className="text-purple-400 text-xs font-semibold uppercase tracking-wider">
                Featured Course
              </Text>
            </View>
            <View className="bg-emerald-500/20 px-4 py-1.5 rounded-full">
              <Text className="text-emerald-400 text-xs font-semibold">⭐ 4.8</Text>
            </View>
          </View>

          <Text className="text-4xl font-black mb-3 text-white leading-tight">
            {course.title}
          </Text>
          <Text className="text-slate-400 text-base mb-6 leading-relaxed">
            {course.description}
          </Text>

          {/* Stats */}
          <View className="flex-row justify-between mb-6 bg-slate-900/50 rounded-2xl p-4">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-white">{likes}</Text>
              <Text className="text-slate-500 text-xs mt-1">Likes</Text>
            </View>
            <View className="w-px bg-slate-800" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-white">12.5k</Text>
              <Text className="text-slate-500 text-xs mt-1">Students</Text>
            </View>
            <View className="w-px bg-slate-800" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-white">24h</Text>
              <Text className="text-slate-500 text-xs mt-1">Duration</Text>
            </View>
          </View>

          {/* Instructor Card */}
          <View className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-5 mb-6 border border-purple-500/20">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center mr-3">
                <Text className="text-white text-xl font-bold">
                  {course.instructor.charAt(0)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-lg">{course.instructor}</Text>
                <Text className="text-slate-400 text-sm">Course Instructor</Text>
              </View>
              <TouchableOpacity 
                className="bg-white/10 px-4 py-2 rounded-full"
                onPress={() => {
                  router.push({
                    pathname: '/screens/Messages/ChatMiddleScreen',
                    params: {
                      instructor: course.instructor,
                      contact: course.contact,
                      email: course.email,
                    }
                  });
                }}
              >
                <Text className="text-white font-semibold text-sm">Chat</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-slate-400 text-sm">📞 {course.contact}</Text>
          </View>

          {/* Rating Section */}
          {/* <View className="mb-6">
            <Text className="text-white font-bold text-lg mb-3">Rate this course</Text>
            <View className="flex-row items-center bg-slate-900/50 rounded-2xl p-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRate(star)} className="mr-2">
                  <Text className="text-3xl">{star <= rating ? "⭐" : "☆"}</Text>
                </TouchableOpacity>
              ))}
              {rating > 0 && <Text className="text-slate-400 ml-2 font-semibold">{rating}.0</Text>}
            </View>
          </View> */}

          {/* Conversational Feedback */}
          <View className="mb-6">
            <ConversationalFeedback
              courseTitle={course.title}
              apiEndpoint="http://localhost:5000/api/feedback/conversational"
              onFeedbackComplete={handleFeedbackComplete}
            />
          </View>

          {/* Access Course Materials */}
          {/* <TouchableOpacity className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl py-4 items-center mb-4">
            <Text className="text-white font-bold text-lg">Access Course Materials</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </View>
  );
}
