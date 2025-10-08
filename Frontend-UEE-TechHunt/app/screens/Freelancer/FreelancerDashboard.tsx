import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
// ⚠️ NOTE: For actual charts, you would need to install a library like 'react-native-chart-kit'
// For example: import { BarChart } from "react-native-chart-kit";

// Get screen width for responsive chart sizing
const screenWidth = Dimensions.get("window").width;

type Stats = {
  projects: number;
  earnings: number;
  completedCourses: number;
};

// --- Custom Chart Component Placeholder ---
// This is a placeholder. You would replace this with an actual chart
// component from a library like 'react-native-chart-kit'.
const StatsChartPlaceholder = ({ stats }: { stats: Stats }) => {
  // Data structure for the chart (e.g., BarChart)
  const data = {
    labels: ["Projects", "Courses", "Earnings (k)"],
    datasets: [
      {
        data: [stats.projects, stats.completedCourses, stats.earnings / 1000], // Scale earnings for chart
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Purple
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0, // Only show whole numbers
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
        fontSize: 12,
    }
  };

  return (
    <View className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
      <Text className="text-lg font-semibold mb-3 text-purple-700">Performance Overview</Text>
      {/* ⚠️ Placeholder for the actual chart component.
        If using 'react-native-chart-kit', this would be:
        <BarChart
            data={data}
            width={screenWidth - 84} // Screen width minus padding
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            style={{ marginVertical: 8, borderRadius: 16 }}
        />
      */}
      <View className="h-[200px] w-full bg-purple-50 rounded-lg justify-center items-center">
        <Text className="text-gray-500 font-medium">
          [Interactive Chart Placeholder]
        </Text>
        <Text className="text-xs text-gray-400">
          (Install 'react-native-chart-kit' for the actual chart)
        </Text>
      </View>
    </View>
  );
};
// ------------------------------------------

export default function FreelancerDashboard() {
  const navigation = useNavigation();

  const [stats, setStats] = useState<Stats>({
    projects: 12,
    earnings: 1500,
    completedCourses: 8,
  });

  const [rank, setRank] = useState<string | null>(null);

  const extractSkillsAndRank = async (uri: string) => {
    // 💡 Simulating rank assignment
    const ranks = ["Apprentice", "Journeyman", "Master 🌟", "Top Rated Pro"];
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    setRank(randomRank);
    Alert.alert("CV Processed!", `Your provisional freelancer rank: ${randomRank}`);
  };

  const handleUploadCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (!result.canceled) {
        console.log("File selected:", result.assets[0].name, result.assets[0].uri);
        extractSkillsAndRank(result.assets[0].uri);
      } else {
        console.log("User canceled document picker");
      }
    } catch (error) {
      console.log("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const StatCard = ({ title, value, unit, colorClass, icon }: { title: string, value: number, unit: string, colorClass: string, icon: string }) => (
    <View className={`p-4 rounded-xl flex-1 mx-1 shadow-md ${colorClass}`}>
      <Text className="text-3xl font-bold text-white mb-1">{icon}</Text>
      <Text className="text-lg font-semibold text-white mb-1">{title}</Text>
      <Text className="text-2xl font-extrabold text-white">
        {value}{unit}
      </Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 px-5 pt-8">
      <Text className="text-4xl font-extrabold text-purple-800 mb-2">Dashboard</Text>
      <Text className="text-lg text-gray-500 mb-6">Welcome back to your workspace!</Text>

      {/* --- Statistics Cards --- */}
      <View className="mb-6">
        <Text className="text-xl font-bold mb-3 text-gray-700">Key Metrics</Text>
        <View className="flex-row justify-between -mx-1">
          <StatCard
            title="Projects"
            value={stats.projects}
            unit=""
            colorClass="bg-blue-600"
            icon="🛠️"
          />
          <StatCard
            title="Earnings"
            value={stats.earnings}
            unit="$"
            colorClass="bg-green-600"
            icon="💰"
          />
          <StatCard
            title="Courses"
            value={stats.completedCourses}
            unit=""
            colorClass="bg-orange-500"
            icon="🎓"
          />
        </View>
      </View>
      <View className="border-b border-gray-200 my-4" />

      {/* --- Interactive Chart --- */}
      <View className="mb-8">
        <StatsChartPlaceholder stats={stats} />
      </View>
      <View className="border-b border-gray-200 my-4" />

      {/* --- CV Upload and Rank --- */}
      <View className="mb-6 p-4 bg-white rounded-xl shadow-lg">
        <Text className="text-xl font-bold mb-3 text-gray-700">Get Your Official Rank</Text>
        <Text className="text-gray-600 mb-4">Upload your CV (PDF/Word) to automatically extract skills and determine your freelancer rank.</Text>

        <TouchableOpacity
          onPress={handleUploadCV}
          className="bg-purple-600 py-4 rounded-xl mb-4 shadow-md active:bg-purple-700"
        >
          <Text className="text-white text-center font-bold text-lg">
            ⬆️ Upload CV (PDF/Word)
          </Text>
        </TouchableOpacity>

        {rank && (
          <View className="bg-purple-100 p-4 rounded-xl border-l-4 border-purple-500 flex-row items-center justify-between">
            <Text className="text-purple-800 font-extrabold text-xl">
              🏆 Rank: {rank}
            </Text>
            <Text className="text-purple-600 text-3xl">🎉</Text>
          </View>
        )}
      </View>

      {/* --- Quick Actions --- */}
      <View className="mb-6">
        <Text className="text-xl font-bold mb-3 text-gray-700">Quick Actions</Text>
        <View className="flex-row justify-between">
            <TouchableOpacity className="flex-1 bg-blue-500 py-4 rounded-xl mr-2 shadow-md active:bg-blue-600">
            <Text className="text-white text-center font-semibold">View Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-green-500 py-4 rounded-xl ml-2 shadow-md active:bg-green-600">
            <Text className="text-white text-center font-semibold">Manage Courses</Text>
            </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        className="bg-gray-300 py-3 rounded-xl mt-6 mb-12 active:bg-gray-400"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-gray-700 text-center font-medium">← Go Back</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="items-center mb-6">
        <Text className="text-gray-400 text-sm">© 2024 UEE TechHunt | Powered by AI</Text>
      </View>
    </ScrollView>
  );
}