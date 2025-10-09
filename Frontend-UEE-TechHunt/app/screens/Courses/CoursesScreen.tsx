import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, StatusBar, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// ⚠️ Note: The type definitions for navigation params must be updated to include the addCourse function.
type Course = {
  id: string;
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

type RootStackParamList = {
  // Updated type to pass the function
  AddCourse: { addCourse: (newCourse: Course) => void }; 
  CourseDetails: { course: Course };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "AddCourse">;

export default function CoursesScreen() {
  const navigation = useNavigation<NavigationProp>();
  // ⚠️ Initial state with a consistent structure including rating and students
  const [courses, setCourses] = useState<Course[]>([ 
    {
      id: "1",
      title: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript to build modern websites.",
      thumbnail: "https://img.freepik.com/free-vector/web-development-concept_23-2148829706.jpg",
      instructor: "John Doe",
      contact: "0786378102",
      email: "john.doe@example.com",
      students: "12.5k",
      rating: 4.8, // Added rating
      level: "Beginner"
    },
    {
      id: "2",
      title: "UI/UX Design Masterclass",
      description: "Master Figma and design user-friendly, aesthetic interfaces.",
      thumbnail: "https://img.freepik.com/free-vector/user-experience-concept-illustration_114360-1098.jpg",
      instructor: "Jane Smith",
      contact: "0786378103",
      email: "jane.smith@example.com",
      students: "8.2k",
      rating: 4.9, // Added rating
      level: "Intermediate"
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Beginner", "Intermediate", "Advanced"];

  // 1. Function to add a new course
  const addCourse = (newCourse: Course) => {
    setCourses((prevCourses) => [newCourse, ...prevCourses]); // Add new course to the top
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // ⚠️ Filter courses by search query AND selected level
  const filteredCourses = courses.filter((course) => {
    const searchMatch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const levelMatch = selectedFilter === "All" || course.level === selectedFilter;
    return searchMatch && levelMatch;
  });

  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("CourseDetails", { course: item })}
      className="bg-slate-900 rounded-3xl mb-4 overflow-hidden border border-slate-800"
      style={{
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      }}
    >
      {/* Course Image with Overlay */}
      <View className="relative">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" />
        
        {/* Level Badge */}
        <View className="absolute top-3 left-3 bg-purple-500/90 backdrop-blur-xl px-3 py-1.5 rounded-full">
          <Text className="text-white text-xs font-bold">{item.level}</Text>
        </View>

        {/* Rating Badge */}
        <View className="absolute top-3 right-3 bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-full flex-row items-center">
          <Text className="text-yellow-400 text-xs mr-1">⭐</Text>
          {/* Ensure rating is displayed */}
          <Text className="text-white text-xs font-bold">
            {item.rating > 0 ? item.rating.toFixed(1) : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Course Content */}
      <View className="p-4">
        <Text className="text-xl font-black text-white mb-2 leading-tight">
          {item.title}
        </Text>
        <Text className="text-slate-400 text-sm mb-4 leading-relaxed">
          {item.description}
        </Text>

        {/* Instructor & Stats Row */}
        <View className="flex-row items-center justify-between pt-3 border-t border-slate-800">
          <View className="flex-row items-center flex-1">
            <View className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center mr-2">
              <Text className="text-white text-xs font-bold">
                {item.instructor.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-xs font-semibold">{item.instructor}</Text>
              {/* Ensure students is displayed */}
              <Text className="text-slate-500 text-xs">{item.students} students</Text>
            </View>
          </View>
          
          <View className="bg-purple-500/20 px-3 py-1.5 rounded-full">
            <Text className="text-purple-400 text-xs font-bold">View →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-3A7D99-950">
      <StatusBar barStyle="light-content" />
      
      {/* Header Section */}
      <View className="px-6 pt-12 pb-6">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-slate-900 rounded-full w-10 h-10 items-center justify-center border border-slate-800"
          >
            <Text className="text-white text-lg font-bold">←</Text>
          </TouchableOpacity>

          <View className="bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <Text className="text-slate-400 text-sm">
              {filteredCourses.length} Courses
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-4xl font-black text-white mb-2">
          Explore
        </Text>
        <Text className="text-xl text-purple-400 font-semibold mb-6">
          Popular Courses
        </Text>

        {/* Search Bar */}
        <View className="bg-slate-900 rounded-2xl px-5 py-4 mb-4 flex-row items-center border border-slate-800">
          <Text className="text-xl mr-3">🔍</Text>
          <TextInput 
            placeholder="Search courses..."
            placeholderTextColor="#64748b"
            className="flex-1 text-white text-base"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <View className="bg-slate-800 rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-slate-400 text-xs">✕</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-2"
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              className={`mr-3 px-5 py-2.5 rounded-full ${
                selectedFilter === filter 
                  ? "bg-purple-600" 
                  : "bg-slate-900 border border-slate-800"
              }`}
            >
              <Text className={`font-semibold text-sm ${
                selectedFilter === filter ? "text-white" : "text-slate-400"
              }`}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Course List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourse}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-slate-500 text-lg">No courses found matching your criteria.</Text>
            <Text className="text-slate-600 text-sm mt-2">Try adding a new one! 👆</Text>
          </View>
        )}
      />

      {/* Floating Add Button */}
      <View className="absolute bottom-6 left-6 right-6">
        <TouchableOpacity
          // 2. Pass the addCourse function as a route parameter
          onPress={() => navigation.navigate("AddCourse", { addCourse })}
          className="bg-purple-600 rounded-2xl py-4 flex-row items-center justify-center shadow-lg"
          style={{
            shadowColor: '#a855f7',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 24,
          }}
        >
          <Text className="text-2xl mr-2">➕</Text>
          <Text className="text-white text-lg font-bold">Add New Course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, Image, FlatList, TextInput } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";

// type RootStackParamList = {
//   AddCourse: undefined;
//   CourseDetails: { course: any }; // Add CourseDetails route with its parameter type
// };

// type NavigationProp = StackNavigationProp<RootStackParamList, "AddCourse">;

// export default function CoursesScreen() {
//   const navigation = useNavigation<NavigationProp>();
//   const [courses, setCourses] = useState([
//     {
//       id: "1",
//       title: "Web Development Fundamentals",
//       description: "Learn HTML, CSS, and JavaScript to build modern websites.",
//       thumbnail: "https://img.freepik.com/free-vector/web-development-concept_23-2148829706.jpg",
//       instructor: "John Doe",
//       contact: "0786378102",
//       email: "john.doe@example.com"
//     },
//     {
//       id: "2",
//       title: "UI/UX Design Masterclass",
//       description: "Master Figma and design user-friendly, aesthetic interfaces.",
//       thumbnail: "https://img.freepik.com/free-vector/user-experience-concept-illustration_114360-1098.jpg",
//       instructor: "Jane Smith",
//       contact: "0786378103",
//       email: "jane.smith@example.com"
//     },
//   ]);

//   const [searchQuery, setSearchQuery] = useState("");


//   const handleSearch = (text: string) => {
//     setSearchQuery(text);
//   }

//   const filteredCourses = courses.filter((course) =>
//     course.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderCourse = ({ item }: any) => (
//     <TouchableOpacity
//       onPress={() => navigation.navigate("CourseDetails", { course: item })}
//       className="bg-gray-100 p-4 rounded-2xl mb-4 shadow"
//     >
//       <Image
//         source={{ uri: item.thumbnail }}
//         className="w-full h-40 rounded-xl mb-3"
//         resizeMode="cover"
//       />
//       <Text className="text-lg font-bold text-gray-800 mb-1">{item.title}</Text>
//       <Text className="text-gray-600 text-sm">{item.description}</Text>
//     </TouchableOpacity>
//   );


//   return (
//     <View className="flex-1 bg-white px-5 pt-8">
//       <Text className="text-2xl font-bold mb-6 mt-8 text-purple-700">All Courses</Text>

//       {/* Search Section */}
//       <View className="flex-row items-center bg-gray-200 rounded-xl px-4 py-3 mb-4">
//         <Text>🔍</Text>
//         <TextInput 
//           placeholder="Search courses..."
//           className="ml-4 flex-1 text-gray-700"
//           value={searchQuery}
//           onChangeText={handleSearch}
//         />
//       </View>

//       {/* Courses Count */}
//       <Text className="text-gray-600 mb-4">
//         {filteredCourses.length} {filteredCourses.length === 1 ? "Course" : "Courses"} Available
//       </Text>

//       {/* Course List */}
//         <FlatList
//           data={filteredCourses}
//           keyExtractor={(item) => item.id}
//           renderItem={renderCourse}
//           showsVerticalScrollIndicator={false}
//         />

//       {/* Add Course Button */}
//       <TouchableOpacity
//         onPress={() => navigation.navigate("AddCourse")}
//         className="bg-purple-600 py-4 rounded-xl mt-6"
//       >
//         <Text className="text-white text-center text-lg font-semibold">➕ Add New Course</Text>
//       </TouchableOpacity>

//       {/* Go Back Button */}
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         className="bg-gray-300 py-3 rounded-xl mt-4"
//       >
//         <Text className="text-gray-800 text-center font-medium">Go Back</Text>
//       </TouchableOpacity>
//     </View>

//   );
// }
