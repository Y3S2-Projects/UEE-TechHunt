import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Progress from "react-native-progress";
import * as FileSystem from "expo-file-system";

// IMPORTANT: Replace with your computer's IP address
const API_BASE_URL = "http://localhost:6000";

// --- Dark Theme Colors ---
const COLORS = {
  primary: "#00FFC2", // Purple
  textPrimary2: "#000000",
  primaryLight: "#00FFC2",
  secondary: "#10B981", // Emerald
  secondaryLight: "#00FFC2",
  background: "#0F172A", // Dark Slate
  backgroundLight: "#1E293B",
  card: "#1E293B",
  cardHover: "#334155",
  textPrimary: "#ffffffff",
  textSecondary: "#94A3B8",
  accent: "#F59E0B", // Amber
  danger: "#EF4444",
  success: "#10B981",
  border: "#334155",
};

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rank, setRank] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [serverStatus, setServerStatus] = useState<string>("checking");
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [buttonScale] = useState(new Animated.Value(1));

  const navigation = useNavigation();

  useEffect(() => {
    checkServerConnection();
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for status
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
        console.log("Server connected");
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
    animateButton();
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

  const uploadWithXHR = async (file: any) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.timeout = 30000;
      
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
    animateButton();
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

  const getStatusStyle = () => {
    switch (serverStatus) {
      case "connected":
        return {
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          borderColor: COLORS.success,
          color: COLORS.success,
          icon: "✅",
          message: "Connected",
          glow: true,
        };
      case "checking":
        return {
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          borderColor: COLORS.accent,
          color: COLORS.accent,
          icon: "⏳",
          message: "Checking...",
          glow: false,
        };
      case "disconnected":
      case "error":
      default:
        return {
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          borderColor: COLORS.danger,
          color: COLORS.danger,
          icon: "❌",
          message: "Disconnected",
          glow: false,
        };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated Background Gradient Effect */}
      <View style={styles.backgroundGradient} />

      {/* Back Button */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>{"←"}</Text>
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>
          <Text style={styles.titleGradient}>Freelancer</Text> Dashboard
        </Text>
        <Text style={styles.subtitle}>
          Analyze your CV, boost your profile, and track your rank.
        </Text>

        <Animated.View
          style={[
            styles.statusPill,
            { 
              borderColor: statusStyle.borderColor, 
              backgroundColor: statusStyle.backgroundColor,
              transform: [{ scale: statusStyle.glow ? pulseAnim : 1 }],
            },
          ]}
        >
          <View style={styles.statusContent}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {statusStyle.icon} Server: {statusStyle.message}
            </Text>
            {statusStyle.glow && (
              <View style={[styles.statusDot, { backgroundColor: statusStyle.color }]} />
            )}
          </View>
          {serverStatus === "disconnected" && (
            <TouchableOpacity onPress={checkServerConnection}>
              <Text style={styles.retryText}>Retry Connection</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View 
        style={[
          styles.actionsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPress={uploadCV}
            disabled={uploading || serverStatus !== "connected"}
            style={[
              styles.button,
              styles.primaryButton,
              (uploading || serverStatus !== "connected") && styles.buttonDisabled,
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>⬆️</Text>
              <Text style={styles.uploadButtonText}>
                {uploading ? "Uploading CV..." : "Upload & Analyze CV"}
              </Text>
            </View>
            {!uploading && serverStatus === "connected" && (
              <View style={styles.buttonShine} />
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          onPress={viewAnalysis}
          disabled={loading || serverStatus !== "connected"}
          style={[
            styles.button,
            styles.secondaryButton,
            (loading || serverStatus !== "connected") && styles.buttonDisabled,
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>👁️</Text>
            <Text style={styles.buttonText}>View Latest Analysis</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Progress Loader */}
      {(uploading || loading) && (
        <Animated.View 
          style={[
            styles.loaderContainer,
            { opacity: fadeAnim },
          ]}
        >
          <Progress.CircleSnail
            color={[COLORS.primary, COLORS.secondary, COLORS.accent]}
            size={50}
            thickness={4}
          />
          <Text style={styles.loaderText}>
            {uploading ? "Analyzing CV content..." : "Loading Data..."}
          </Text>
        </Animated.View>
      )}

      {/* Analysis Section */}
      {skills.length > 0 && (
        <Animated.View 
          style={[
            styles.card,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.cardTitle}>✨ Your Latest Analysis</Text>

          <View style={styles.rankBadgeContainer}>
            <View style={styles.rankBadgeGlow} />
            <Text style={styles.rankBadgeText}>
              🏆 Freelancer Rank: {rank || "N/A"}
            </Text>
          </View>

          <Text style={styles.skillsTitle}>🧠 Extracted Skills:</Text>
          <View style={styles.skillsList}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillPill}>
                <View style={styles.skillPillGradient} />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Stats Section */}
      <Animated.View 
        style={[
          styles.card,
          { opacity: fadeAnim },
        ]}
      >
        <Text style={styles.cardTitle}>📊 Platform Statistics</Text>

        {loading && !stats ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : stats ? (
          <>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>📁 Total Uploads</Text>
              <View style={styles.statValueContainer}>
                <Text style={styles.statValue}>{stats.uploadsCount || 0}</Text>
              </View>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>📚 Avg Skills per CV</Text>
              <View style={styles.statValueContainer}>
                <Text style={styles.statValue}>
                  {stats.avgSkillCount?.toFixed(1) || "0.0"}
                </Text>
              </View>
            </View>

            <Text style={styles.subCardTitle}>🏆 Rank Distribution</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statCardValue}>{stats.rankDistribution?.level1 || 0}</Text>
                <Text style={styles.statCardLabel}>Level 1</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardValue}>{stats.rankDistribution?.level2 || 0}</Text>
                <Text style={styles.statCardLabel}>Level 2</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardValue}>{stats.rankDistribution?.topRated || 0}</Text>
                <Text style={styles.statCardLabel}>Top Rated</Text>
              </View>
            </View>
            
            <Text style={styles.subCardTitle}>🔥 Top Skills</Text>
            {stats.topSkills && stats.topSkills.length > 0 ? (
              stats.topSkills.slice(0, 3).map((s: any, i: number) => (
                <View key={i} style={styles.topSkillItem}>
                  <View style={styles.topSkillRank}>
                    <Text style={styles.topSkillRankText}>#{i + 1}</Text>
                  </View>
                  <Text style={styles.topSkillText}>{s.skill}</Text>
                  <View style={styles.topSkillBadge}>
                    <Text style={styles.topSkillCount}>{s.count}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No skills data yet</Text>
            )}

            <Text style={styles.subCardTitle}>🕒 Recent Uploads</Text>
            {stats.recentUploads && stats.recentUploads.length > 0 ? (
              stats.recentUploads.slice(0, 2).map((u: any, i: number) => (
                <View key={i} style={styles.recentUploadItem}>
                  <View style={styles.recentUploadIndicator} />
                  <View style={styles.recentUploadContent}>
                    <Text style={styles.recentUploadName}>
                      📄 {u.originalName || "Unknown"}
                    </Text>
                    <Text style={styles.recentUploadDetails}>
                      Rank: {u.analysis?.rank || "N/A"} • Skills: {u.analysis?.skills?.length || 0}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No recent uploads</Text>
            )}
          </>
        ) : (
          <Text style={styles.noDataText}>No platform data available yet.</Text>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  titleGradient: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  statusPill: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    fontWeight: "700",
    fontSize: 15,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  retryText: {
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 8,
    fontSize: 14,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  button: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  uploadButtonText: {
    color: COLORS.textPrimary2,
    fontSize: 17,
    fontWeight: "700",
  }
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  buttonShine: {
    position: "absolute",
    top: 0,
    left: -100,
    width: 100,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  loaderContainer: {
    alignItems: "center",
    marginBottom: 30,
    padding: 24,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loaderText: {
    marginTop: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  subCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  rankBadgeContainer: {
    position: "relative",
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 20,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  rankBadgeGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  rankBadgeText: {
    fontWeight: "800",
    fontSize: 17,
    color: COLORS.background,
  },
  skillsTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillPill: {
    position: "relative",
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  skillPillGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  skillText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  statValueContainer: {
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  topSkillItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topSkillRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  topSkillRankText: {
    color: COLORS.textPrimary,
    fontWeight: "800",
    fontSize: 14,
  },
  topSkillText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  topSkillBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topSkillCount: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  recentUploadItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recentUploadIndicator: {
    width: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
    marginRight: 12,
  },
  recentUploadContent: {
    flex: 1,
  },
  recentUploadName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  recentUploadDetails: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  noDataText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
});