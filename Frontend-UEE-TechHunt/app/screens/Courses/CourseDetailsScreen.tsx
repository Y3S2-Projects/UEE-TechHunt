import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, StatusBar } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { LinearGradient } from 'expo-linear-gradient';

type CourseDetailsRouteProp = RouteProp<OnboardingStackParamList, "CourseDetails">;
type CourseDetailsNavProp = StackNavigationProp<OnboardingStackParamList, "CourseDetails">;

export default function CourseDetailsScreen() {
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation<CourseDetailsNavProp>();
  const { course } = route.params;

  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };
  
  const handleRate = (rate: number) => setRating(rate);
  const handleEnroll = () => Alert.alert("Success!", `You have enrolled in ${course.title}`);

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section with Parallax Effect */}
        <View className="relative">
          <Image
            source={{ uri: course.thumbnail }}
            className="w-full h-96"
            resizeMode="cover"
          />
          
          {/* Gradient Overlay */}
          <View className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950" />
          
          {/* Back Button - Floating */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-5 bg-black/50 backdrop-blur-xl rounded-full w-10 h-10 items-center justify-center"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            <Text className="text-white text-xl font-bold">←</Text>
          </TouchableOpacity>

          {/* Quick Actions - Floating */}
          <View className="absolute top-12 right-5 flex-row gap-2">
            <TouchableOpacity
              onPress={handleLike}
              className="bg-white/20 backdrop-blur-xl rounded-full w-10 h-10 items-center justify-center"
            >
              <Text className="text-xl">{isLiked ? "❤️" : "🤍"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Card - Overlapping Design */}
        <View className="bg-slate-950 -mt-8 rounded-t-3xl px-6 pt-6">
          
          {/* Course Badge */}
          <View className="flex-row items-center mb-4">
            <View className="bg-purple-500/20 px-4 py-1.5 rounded-full mr-2">
              <Text className="text-purple-400 text-xs font-semibold uppercase tracking-wider">
                Featured Course
              </Text>
            </View>
            <View className="bg-emerald-500/20 px-4 py-1.5 rounded-full">
              <Text className="text-emerald-400 text-xs font-semibold">
                ⭐ 4.8
              </Text>
            </View>
          </View>

          {/* Course Title */}
          <Text className="text-4xl font-black mb-3 text-white leading-tight">
            {course.title}
          </Text>
          
          <Text className="text-slate-400 text-base mb-6 leading-relaxed">
            {course.description}
          </Text>

          {/* Stats Row */}
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
                onPress={() =>
                  navigation.navigate("Chat", {
                    instructor: course.instructor,
                    contact: course.contact,
                    email: course.email,
                  })
                }
              >
                <Text className="text-white font-semibold text-sm">Chat</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-slate-400 text-sm">📞 {course.contact}</Text>
          </View>

          {/* Rating Section */}
          <View className="mb-6">
            <Text className="text-white font-bold text-lg mb-3">Rate this course</Text>
            <View className="flex-row items-center bg-slate-900/50 rounded-2xl p-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star} 
                  onPress={() => handleRate(star)}
                  className="mr-2"
                >
                  <Text className="text-3xl">
                    {star <= rating ? "⭐" : "☆"}
                  </Text>
                </TouchableOpacity>
              ))}
              {rating > 0 && (
                <Text className="text-slate-400 ml-2 font-semibold">
                  {rating}.0
                </Text>
              )}
            </View>
          </View>

          {/* Enroll Button */}
          <TouchableOpacity
            onPress={handleEnroll}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl py-4 mb-8 shadow-lg shadow-purple-500/50"
            style={{
              shadowColor: '#a855f7',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 24,
            }}
          >
            <Text className="text-white text-center font-bold text-lg tracking-wide">
              Enroll Now - Start Learning
            </Text>
          </TouchableOpacity>

          {/* What You'll Learn */}
          <View className="mb-8">
            <Text className="text-white font-bold text-xl mb-4">What you'll learn</Text>
            {[
              "Master the fundamentals and advanced concepts",
              "Build real-world projects from scratch",
              "Get lifetime access to course materials",
              "Join our exclusive community"
            ].map((item, index) => (
              <View key={index} className="flex-row items-center mb-3">
                <View className="w-6 h-6 rounded-full bg-emerald-500/20 items-center justify-center mr-3">
                  <Text className="text-emerald-400 text-sm">✓</Text>
                </View>
                <Text className="text-slate-300 flex-1">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}




// import React from "react";
// import { View, Text, Image, TouchableOpacity, Button } from "react-native";
// import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { OnboardingStackParamList } from "../../navigation/OnboardingStack"; // adjust path

// type CourseDetailsRouteProp = RouteProp<OnboardingStackParamList, "CourseDetails">;
// type CourseDetailsNavProp = StackNavigationProp<OnboardingStackParamList, "CourseDetails">;

// export default function CourseDetailsScreen() {
//   const route = useRoute<CourseDetailsRouteProp>();
//   const navigation = useNavigation<CourseDetailsNavProp>();
//   const { course } = route.params;

//   return (
//     <View className="flex-1 bg-white px-5 pt-8 mt-20">

//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         className="bg-gray-300 py-3 rounded-xl mb-5"
//       >
//         <Text className="text-gray-800 text-center font-medium">{"<"}  Go Back</Text>
//       </TouchableOpacity>

//       <Image
//         source={{ uri: course.thumbnail }}
//         className="w-full h-64 rounded-xl mb-4"
//         resizeMode="cover"
//       />
//       <Text className="text-3xl font-bold mb-2 text-purple-700">{course.title}</Text>
//       <Text className="text-gray-700 text-lg mb-6">{course.description}</Text>

//       <TouchableOpacity className="w-1/2 mb-2" onPress={() => navigation.navigate("Chat", { instructor: course.instructor , contact: course.contact, email: course.email})}>
//         <Text className="bg-purple-100 p-2 rounded-md">Chat with {course.instructor}</Text>
//       </TouchableOpacity>

//       <Text className="text-gray-700 text-lg mb-6">Contact: {course.contact}</Text>
//     </View>
//   );
// }