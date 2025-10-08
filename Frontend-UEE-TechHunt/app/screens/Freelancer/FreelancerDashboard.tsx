import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

// Chart placeholder (install react-native-chart-kit if needed)
const screenWidth = Dimensions.get("window").width;

type Stats = {
  projects: number;
  earnings: number;
  completedCourses: number;
  uploadsCount?: number;
};

export default function FreelancerDashboard() {
  const navigation = useNavigation();

  const [stats, setStats] = useState<Stats>({
    projects: 12,
    earnings: 1500,
    completedCourses: 8,
    uploadsCount: 0,
  });

  const [rank, setRank] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // <-- UPDATE this to your backend IP or localhost
  const BACKEND_BASE = "http://192.168.1.10:6000"; // Android emulator
  // const BACKEND_BASE = "http://192.168.1.10:6000"; // real device

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND_BASE}/api/cv/stats`);
      if (res.data) {
        setStats(prev => ({
          ...prev,
          projects: res.data.projects,
          earnings: res.data.earnings,
          completedCourses: res.data.completedCourses,
          uploadsCount: res.data.uploadsCount,
        }));
      }
    } catch (err) {
      if (err instanceof Error) {
        console.warn("Error fetching stats:", err.message);
      } else {
        console.warn("Error fetching stats:", err);
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Upload CV to backend
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
        setLoading(true);

        // @ts-ignore
        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name;
        const fileType = fileName.endsWith(".pdf")
          ? "application/pdf"
          : fileName.endsWith(".docx")
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/msword";

        const formData = new FormData();
        formData.append("cv", {
          uri: fileUri,
          name: fileName,
          type: fileType,
        } as any); // 👈 cast to any for TypeScript


        const res = await axios.post(`${BACKEND_BASE}/api/cv/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setLoading(false);

        if (res.data.success) {
          setRank(res.data.data.analysis.rank);
          Alert.alert(
            "CV Uploaded Successfully!",
            `Your freelancer rank is: ${res.data.data.analysis.rank}`
          );
          fetchStats(); // Refresh stats including uploads count
        } else {
          Alert.alert("Upload Failed", "Please try again.");
        }
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      Alert.alert("Error", "Failed to upload CV.");
    }
  };

  // Stat card
  const StatCard = ({
    title,
    value,
    unit,
    colorClass,
    icon,
  }: {
    title: string;
    value: number;
    unit: string;
    colorClass: string;
    icon: string;
  }) => (
    <View
      style={{
        flex: 1,
        marginHorizontal: 4,
        padding: 16,
        borderRadius: 16,
        backgroundColor: colorClass,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <Text style={{ fontSize: 18, fontWeight: "600", color: "#fff", marginTop: 4 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 4 }}>
        {value}
        {unit}
      </Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb", padding: 16 }}>
      <Text style={{ fontSize: 32, fontWeight: "800", color: "#5b21b6", marginTop: 50}}>
        Freelancer Dashboard
      </Text>
      <Text style={{ fontSize: 16, color: "#6b7280", marginBottom: 16 }}>
        Welcome back! Track your stats and upload your CV to get ranked.
      </Text>

      {/* --- Stats cards --- */}
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        <StatCard title="Projects" value={stats.projects} unit="" colorClass="#2563eb" icon="🛠️" />
        <StatCard title="Earnings" value={stats.earnings} unit="$" colorClass="#16a34a" icon="💰" />
        <StatCard title="Courses" value={stats.completedCourses} unit="" colorClass="#f97316" icon="🎓" />
      </View>

      {/* --- CV Upload --- */}
      <View style={{ backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Upload CV</Text>
        <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
          Upload your CV (PDF/Word) to extract skills and determine your freelancer rank.
        </Text>

        <TouchableOpacity
          onPress={handleUploadCV}
          style={{
            backgroundColor: "#7c3aed",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>⬆️ Upload CV</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#7c3aed" />}
        {rank && (
          <View
            style={{
              backgroundColor: "#ede9fe",
              padding: 16,
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: "#7c3aed",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#5b21b6" }}>
              🏆 Rank: {rank}
            </Text>
            <Text style={{ fontSize: 24 }}>🎉</Text>
          </View>
        )}
      </View>

      {/* --- Quick Actions --- */}
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#3b82f6",
            padding: 14,
            borderRadius: 12,
            marginRight: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>View Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#10b981",
            padding: 14,
            borderRadius: 12,
            marginLeft: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Manage Courses</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#d1d5db",
          padding: 12,
          borderRadius: 12,
          marginBottom: 24,
          alignItems: "center",
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#374151", fontWeight: "500" }}>← Go Back</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Text style={{ color: "#9ca3af", fontSize: 12 }}>
          © 2024 UEE TechHunt
        </Text>
      </View>
    </ScrollView>
  );
}
