import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

// Define the route parameter type
type AddCourseRouteProp = RouteProp<
  { AddCourse: { addCourse: (newCourse: any) => void } },
  "AddCourse"
>;

export default function AddCourseScreen() {
  const navigation = useNavigation();
  const route = useRoute<AddCourseRouteProp>();
  const addCourse = route.params?.addCourse; // Get the function passed from CoursesScreen

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [instructor, setInstructor] = useState("");
  const [level, setLevel] = useState("Beginner"); // Default or initial level

  const handleSave = () => {
    // Basic validation
    if (!title || !description || !thumbnail || !instructor) {
      Alert.alert("Missing Fields", "Please fill out all required fields.");
      return;
    }

    // Create a unique ID for the new course (using timestamp as a simple unique ID)
    const newCourse = {
      id: Date.now().toString(),
      title,
      description,
      thumbnail,
      instructor,
      // Default/placeholder values for other fields
      contact: "N/A",
      email: "N/A",
      students: "0",
      rating: 0.0,
      level: level,
    };

    if (addCourse) {
      addCourse(newCourse); // Call the function to add the course to CoursesScreen state
      Alert.alert("Success", `${title} has been added to your courses!`);
      navigation.goBack();
    } else {
      Alert.alert("Error", "Could not add course. The required function is missing.");
    }
  };

  // Helper for level selection UI
  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <View className="flex-1 bg-slate-950 px-6 pt-10">
      <Text className="text-3xl font-bold text-purple-400 mb-6">Add New Course</Text>

      {/* Input Fields */}
      <TextInput
        placeholder="Course Title"
        placeholderTextColor="#64748b"
        value={title}
        onChangeText={setTitle}
        className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900"
      />

      <TextInput
        placeholder="Instructor Name"
        placeholderTextColor="#64748b"
        value={instructor}
        onChangeText={setInstructor}
        className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900"
      />

      <TextInput
        placeholder="Course Description"
        placeholderTextColor="#64748b"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        className="border border-slate-800 rounded-xl p-4 mb-4 text-white bg-slate-900 h-28"
        style={{ textAlignVertical: 'top' }}
      />

      <TextInput
        placeholder="Thumbnail Image URL (e.g., https://...)"
        placeholderTextColor="#64748b"
        value={thumbnail}
        onChangeText={setThumbnail}
        className="border border-slate-800 rounded-xl p-4 mb-6 text-white bg-slate-900"
      />
      
      {/* Level Selector */}
      <Text className="text-lg font-semibold text-white mb-3">Select Level:</Text>
      <View className="flex-row mb-8">
        {levels.map((lvl) => (
          <TouchableOpacity
            key={lvl}
            onPress={() => setLevel(lvl)}
            className={`mr-3 px-5 py-3 rounded-full ${
              level === lvl 
                ? "bg-purple-600 border-purple-500" 
                : "bg-slate-900 border-slate-800"
            } border-2`}
          >
            <Text className={`font-semibold text-sm ${
              level === lvl ? "text-white" : "text-slate-400"
            }`}>
              {lvl}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-green-600 py-4 rounded-xl mb-4"
      >
        <Text className="text-white text-center font-bold text-lg">💾 Save Course</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-slate-800 py-3 rounded-xl border border-slate-700"
      >
        <Text className="text-slate-300 text-center font-medium">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// export default function AddCourseScreen() {
//   const navigation = useNavigation();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [thumbnail, setThumbnail] = useState("");

//   const handleSave = () => {
//     if (!title || !description || !thumbnail) {
//       Alert.alert("Missing Fields", "Please fill out all fields.");
//       return;
//     }

//     // Normally here you'd save to backend or context
//     Alert.alert("Success", "Course saved successfully!");
//     navigation.goBack();
//   };

//   return (
//     <View className="flex-1 bg-white px-6 pt-10">
//       <Text className="text-2xl font-bold text-purple-700 mb-6">Add New Course</Text>

//       <TextInput
//         placeholder="Course Title"
//         value={title}
//         onChangeText={setTitle}
//         className="border border-gray-300 rounded-xl p-4 mb-4"
//       />

//       <TextInput
//         placeholder="Course Description"
//         value={description}
//         onChangeText={setDescription}
//         multiline
//         numberOfLines={3}
//         className="border border-gray-300 rounded-xl p-4 mb-4"
//       />

//       <TextInput
//         placeholder="Thumbnail Image URL"
//         value={thumbnail}
//         onChangeText={setThumbnail}
//         className="border border-gray-300 rounded-xl p-4 mb-6"
//       />

//       <TouchableOpacity
//         onPress={handleSave}
//         className="bg-green-600 py-4 rounded-xl mb-4"
//       >
//         <Text className="text-white text-center font-semibold text-lg">💾 Save Course</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         className="bg-gray-300 py-3 rounded-xl"
//       >
//         <Text className="text-gray-800 text-center font-medium">Cancel</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
