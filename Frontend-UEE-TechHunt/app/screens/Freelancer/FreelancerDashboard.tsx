import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Progress from "react-native-progress";
import * as FileSystem from "expo-file-system";

// IMPORTANT: Replace with your computer's IP address
// Find it by running: ipconfig (Windows) or ifconfig (Mac/Linux)
const API_BASE_URL = "http://192.168.196.23:6000";

// --- Theme Colors ---
const COLORS = {
  primary: "#4F46E5", // Deep Indigo/Violet for main actions
  secondary: "#10B981", // Emerald Green for success/secondary actions
  background: "#F9FAFB", // Light Gray Background
  card: "#FFFFFF", // White for cards
  textPrimary: "#1F2937", // Dark Slate for main text
  textSecondary: "#6B7280", // Gray for secondary text
  rankBadge: "#FBBF24", // Amber for rank
  danger: "#EF4444",
};

// --- Component Definition (Functionality Unchanged) ---

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rank, setRank] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [serverStatus, setServerStatus] = useState<string>("checking");

  useEffect(() => {
    checkServerConnection();
  }, []);

  // Check if server is reachable
  const checkServerConnection = async () => {
    try {
      console.log("Checking server connection...");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setServerStatus("connected");
        console.log("✅ Server connected");
        fetchStats();
      } else {
        setServerStatus("error");
        Alert.alert("Connection Error", "Server responded but with error");
      }
    } catch (err: any) {
      console.error("Server connection error:", err);
      setServerStatus("disconnected");
      Alert.alert(
        "Cannot Connect to Server",
        `Please check:\n\n1. Server is running (node server.js)\n2. IP address is correct: ${API_BASE_URL}\n3. Both devices on same WiFi\n\nError: ${err.message}`
      );
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_BASE_URL}/api/cv/stats`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      console.error("Stats error:", err);
      if (err.name === "AbortError") {
        Alert.alert("Timeout", "Request took too long. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadCV = async () => {
    try {
      console.log("Opening document picker...");
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      console.log("Document picker result:", res);

      if (res.canceled || !res.assets || res.assets.length === 0) {
        console.log("User cancelled or no file selected");
        return;
      }

      const file = res.assets[0];
      console.log("Selected file:", file);

      setUploading(true);

      // Method 1: Using expo-file-system (More reliable for React Native)
      try {
        console.log("Uploading using FileSystem.uploadAsync...");
        
        const uploadResult = await FileSystem.uploadAsync(
          `${API_BASE_URL}/api/cv/upload`,
          file.uri,
          {
            fieldName: "cv",
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          }
        );

        console.log("Upload result:", uploadResult);

        if (uploadResult.status === 200) {
          const result = JSON.parse(uploadResult.body);
          
          if (result.success) {
            Alert.alert("Success", "CV uploaded and analyzed successfully!");
            setRank(result.data.analysis.rank);
            setSkills(result.data.analysis.skills);
            await fetchStats();
          } else {
            Alert.alert("Failed", result.error || "Something went wrong");
          }
        } else {
          Alert.alert("Upload Failed", `Server returned status ${uploadResult.status}`);
        }
      } catch (uploadErr: any) {
        console.error("FileSystem upload error:", uploadErr);
        
        // Fallback to XMLHttpRequest method
        console.log("Trying fallback upload method...");
        await uploadWithXHR(file);
      }

    } catch (err: any) {
      console.error("Upload error:", err);
      Alert.alert(
        "Error",
        `Upload failed: ${err.message}\n\nPlease ensure server is running.`
      );
    } finally {
      setUploading(false);
    }
  };

  // Fallback upload method using XMLHttpRequest
  const uploadWithXHR = async (file: any) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.timeout = 30000; // 30 seconds
      
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          console.log(`Upload progress: ${progress.toFixed(2)}%`);
        }
      });

      xhr.addEventListener("load", async () => {
        console.log("XHR load event, status:", xhr.status);
        
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            if (result.success) {
              Alert.alert("Success", "CV uploaded and analyzed successfully!");
              setRank(result.data.analysis.rank);
              setSkills(result.data.analysis.skills);
              await fetchStats();
              resolve(result);
            } else {
              Alert.alert("Failed", result.error || "Something went wrong");
              reject(new Error(result.error));
            }
          } catch (e) {
            Alert.alert("Error", "Invalid response from server");
            reject(e);
          }
        } else {
          Alert.alert("Upload Failed", `Server returned status ${xhr.status}`);
          reject(new Error(`Status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        console.error("XHR error event");
        Alert.alert("Network Error", "Failed to connect to server");
        reject(new Error("Network error"));
      });

      xhr.addEventListener("timeout", () => {
        console.error("XHR timeout event");
        Alert.alert("Timeout", "Upload took too long. Please try again.");
        reject(new Error("Timeout"));
      });

      const formData = new FormData();
      formData.append("cv", {
        uri: file.uri,
        type: file.mimeType || "application/pdf",
        name: file.name || "cv.pdf",
      } as any);

      xhr.open("POST", `${API_BASE_URL}/api/cv/upload`);
      xhr.send(formData);
    });
  };

  const viewAnalysis = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_BASE_URL}/api/cv/latest`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await res.json();

      if (result.success && result.data) {
        const { analysis } = result.data;
        setRank(analysis.rank);
        setSkills(analysis.skills);
        Alert.alert("Success", "CV analysis loaded!");
      } else {
        Alert.alert("No Data", "No CV analysis found. Please upload a CV first.");
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      Alert.alert("Error", "Failed to load CV analysis.");
    } finally {
      setLoading(false);
    }
  };

  // --- Render (Themed Frontend) ---

  const getStatusStyle = () => {
    switch (serverStatus) {
      case "connected":
        return {
          backgroundColor: "#D1FAE5", // Light green
          borderColor: COLORS.secondary,
          color: COLORS.secondary,
          icon: "✅",
          message: "Connected",
        };
      case "checking":
        return {
          backgroundColor: "#FEF3C7", // Light yellow
          borderColor: COLORS.rankBadge,
          color: COLORS.rankBadge,
          icon: "⏳",
          message: "Checking...",
        };
      case "disconnected":
      case "error":
      default:
        return {
          backgroundColor: "#FEE2E2", // Light red
          borderColor: COLORS.danger,
          color: COLORS.danger,
          icon: "❌",
          message: "Disconnected",
        };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header and Server Status */}
      <View style={styles.header}>
        <Text style={styles.title}>Freelancer Dashboard</Text>
        <Text style={styles.subtitle}>
          Analyze your CV, boost your profile, and track your rank.
        </Text>

        <View
          style={[
            styles.statusPill,
            { borderColor: statusStyle.borderColor, backgroundColor: statusStyle.backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {statusStyle.icon} Server: {statusStyle.message}
          </Text>
          {serverStatus === "disconnected" && (
            <TouchableOpacity onPress={checkServerConnection}>
              <Text style={styles.retryText}>
                Retry Connection
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Upload Button */}
        <TouchableOpacity
          onPress={uploadCV}
          disabled={uploading || serverStatus !== "connected"}
          style={[
            styles.button,
            { backgroundColor: COLORS.primary },
            (uploading || serverStatus !== "connected") && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {uploading ? "Uploading CV..." : "⬆️ Upload & Analyze CV"}
          </Text>
        </TouchableOpacity>

        {/* View Analysis Button */}
        <TouchableOpacity
          onPress={viewAnalysis}
          disabled={loading || serverStatus !== "connected"}
          style={[
            styles.button,
            { backgroundColor: COLORS.secondary },
            (loading || serverStatus !== "connected") && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            👁️ View Latest Analysis
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Loader */}
      {(uploading || loading) && (
        <View style={styles.loaderContainer}>
          <Progress.CircleSnail
            color={[COLORS.primary, COLORS.secondary]}
            size={40}
            thickness={3}
          />
          <Text style={styles.loaderText}>
            {uploading ? "Analyzing CV content..." : "Loading Data..."}
          </Text>
        </View>
      )}

      {/* Analysis Section */}
      {skills.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ Your Latest Analysis</Text>

          <View style={styles.rankBadgeContainer}>
            <Text style={styles.rankBadgeText}>
              🏆 Freelancer Rank: {rank || "N/A"}
            </Text>
          </View>

          <Text style={styles.skillsTitle}>🧠 Extracted Skills:</Text>
          <View style={styles.skillsList}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Stats Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Platform Statistics</Text>

        {loading && !stats ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : stats ? (
          <>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>📁 Total Uploads</Text>
              <Text style={styles.statValue}>{stats.uploadsCount || 0}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>📚 Avg Skills per CV</Text>
              <Text style={styles.statValue}>
                {stats.avgSkillCount?.toFixed(1) || "0.0"}
              </Text>
            </View>

            <Text style={styles.subCardTitle}>🏆 Rank Distribution</Text>
            <View style={styles.statItem}>
              <Text style={styles.statSubText}>Level 1</Text>
              <Text style={styles.statSubValue}>{stats.rankDistribution?.level1 || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statSubText}>Level 2</Text>
              <Text style={styles.statSubValue}>{stats.rankDistribution?.level2 || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statSubText}>Top Rated</Text>
              <Text style={styles.statSubValue}>{stats.rankDistribution?.topRated || 0}</Text>
            </View>
            
            <Text style={styles.subCardTitle}>🔥 Top Skills</Text>
            {stats.topSkills && stats.topSkills.length > 0 ? (
              stats.topSkills.slice(0, 3).map((s: any, i: number) => ( // Showing top 3 for cleaner look
                <View key={i} style={styles.statItem}>
                  <Text style={styles.statSubText}>
                    {s.skill}
                  </Text>
                  <Text style={styles.statSubValue}>
                    {s.count} times
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No skills data yet</Text>
            )}

            <Text style={styles.subCardTitle}>🕒 Recent Uploads</Text>
            {stats.recentUploads && stats.recentUploads.length > 0 ? (
              stats.recentUploads.slice(0, 2).map((u: any, i: number) => ( // Showing top 2
                <View key={i} style={styles.recentUploadItem}>
                  <Text style={styles.recentUploadName}>
                    📄 {u.originalName || "Unknown"}
                  </Text>
                  <Text style={styles.recentUploadDetails}>
                    Rank: {u.analysis?.rank || "N/A"} • Skills: {u.analysis?.skills?.length || 0}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>
                No recent uploads
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.noDataText}>No platform data available yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

// --- Stylesheet for the Attractive Theme ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 80, // More space for a modern feel
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  statusPill: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: "700",
    fontSize: 14,
  },
  retryText: {
    color: COLORS.primary,
    textDecorationLine: "underline",
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  actionsContainer: {
    marginBottom: 25,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    // Premium shadow for buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.card,
    fontSize: 18,
    fontWeight: "700",
  },
  loaderContainer: {
    alignItems: "center",
    marginBottom: 25,
    padding: 15,
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  loaderText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    // Soft, noticeable shadow for a "lifted" look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 15,
    marginBottom: 8,
  },
  rankBadgeContainer: {
    backgroundColor: COLORS.rankBadge,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    alignSelf: "flex-start",
    // Subtle shadow for the badge
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  rankBadgeText: {
    fontWeight: "800",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  skillPill: {
    backgroundColor: "#E5E7EB",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingLeft: 10,
  },
  statSubText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statSubValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  recentUploadItem: {
    paddingVertical: 8,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
    marginBottom: 8,
  },
  recentUploadName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  recentUploadDetails: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  noDataText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 10,
  },
});