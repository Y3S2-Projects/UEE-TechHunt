import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Progress from "react-native-progress";

const API_BASE_URL = "http://192.168.196.23:6000";

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rank, setRank] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [hasCv, setHasCv] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/cv/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Stats error:", err);
      Alert.alert("Error", "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const uploadCV = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (res.type !== "success") return;

      const formData = new FormData();
      formData.append("cv", {
        uri: res.uri,
        type: res.mimeType || "application/pdf",
        name: res.name || "cv.pdf",
      });

      setUploading(true);

      const response = await fetch(`${API_BASE_URL}/api/cv/upload`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("Success", "CV uploaded and analyzed successfully!");
        setHasCv(true);
        fetchStats();
      } else {
        Alert.alert("Failed", result.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const viewAnalysis = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/cv/latest`);
      const result = await res.json();

      if (result.success && result.data) {
        const { analysis } = result.data;
        setRank(analysis.rank);
        setSkills(analysis.skills);
      } else {
        Alert.alert("No Data", "No CV analysis found. Please upload first.");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      Alert.alert("Error", "Failed to load CV analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f5f7fa" }}
      contentContainerStyle={{ padding: 20, marginTop: 60 }}
    >
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 10 }}>
        Freelancer Dashboard
      </Text>
      <Text style={{ fontSize: 16, color: "#555", marginBottom: 20 }}>
        Upload your CV, analyze your skills, and view your freelancer rank.
      </Text>

      {/* Upload Button */}
      <TouchableOpacity
        onPress={uploadCV}
        style={{
          backgroundColor: "#007bff",
          padding: 14,
          borderRadius: 10,
          marginBottom: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          {uploading ? "Uploading..." : "Upload CV"}
        </Text>
      </TouchableOpacity>

      {/* View Analysis Button */}
      <TouchableOpacity
        onPress={viewAnalysis}
        style={{
          backgroundColor: "#00b894",
          padding: 14,
          borderRadius: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          View CV Analysis
        </Text>
      </TouchableOpacity>

      {/* Progress Loader */}
      {(uploading || loading) && (
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Progress.CircleSnail color={["#007bff", "#00b894"]} />
          <Text style={{ marginTop: 10 }}>
            {uploading ? "Uploading & Analyzing..." : "Loading..."}
          </Text>
        </View>
      )}

      {/* Analysis Section */}
      {skills.length > 0 && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 15,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            🧠 Extracted Skills
          </Text>
          {skills.map((skill, index) => (
            <Text key={index} style={{ color: "#333", marginBottom: 3 }}>
              • {skill}
            </Text>
          ))}
          <Text style={{ fontWeight: "700", marginTop: 10 }}>
            🏆 Rank: {rank}
          </Text>
        </View>
      )}

      {/* Stats Section */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 15,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          📊 CV Statistics
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : stats ? (
          <>
            <Text>📁 Total Uploads: {stats.uploadsCount}</Text>
            <Text>
              📚 Avg Skills per CV: {stats.avgSkillCount?.toFixed(1)}
            </Text>

            <Text style={{ marginTop: 10, fontWeight: "600" }}>
              🏆 Rank Distribution
            </Text>
            <Text>Level 1: {stats.rankDistribution?.level1}</Text>
            <Text>Level 2: {stats.rankDistribution?.level2}</Text>
            <Text>Top Rated: {stats.rankDistribution?.topRated}</Text>

            <Text style={{ marginTop: 10, fontWeight: "600" }}>🔥 Top Skills</Text>
            {stats.topSkills?.map((s: any, i: number) => (
              <Text key={i}>
                • {s.skill} ({s.count})
              </Text>
            ))}

            <Text style={{ marginTop: 10, fontWeight: "600" }}>
              🕒 Recent Uploads:
            </Text>
            {stats.recentUploads?.length > 0 ? (
              stats.recentUploads.map((u: any, i: number) => (
                <View key={i} style={{ marginTop: 5 }}>
                  <Text>📄 {u.originalName}</Text>
                  <Text style={{ color: "#555" }}>Rank: {u.analysis.rank}</Text>
                </View>
              ))
            ) : (
              <Text>No recent uploads</Text>
            )}
          </>
        ) : (
          <Text>No data available</Text>
        )}
      </View>
    </ScrollView>
  );
}
