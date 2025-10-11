// screens/Marketplace/JobDetailScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme";
import * as Animatable from "react-native-animatable";
import FloatingChatIcon from "../../components/FloatingChatIcon";

export default function JobDetailScreen({ route, navigation }: any) {
  const { job } = route.params;
  const [bid, setBid] = useState("");
  const [message, setMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const submitBid = () => {
    if (!bid) {
      return Alert.alert("Enter a bid", "Please enter a numeric bid amount.");
    }
    if (!message.trim()) {
      return Alert.alert("Add a message", "Please add a brief message with your bid.");
    }

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert(
      "Bid Submitted! 🎉",
      `You offered LKR ${parseInt(bid).toLocaleString()} for "${job.title}". The employer will review your proposal.`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
    setBid("");
    setMessage("");
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? "Removed from saved" : "Saved!",
      isSaved
        ? "Job removed from your saved list"
        : "Job added to your saved list for later"
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.ACCENT} />

      {/* Header with Back Button */}
      <Animatable.View animation="fadeInDown" duration={600} style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSave}>
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={22}
              color={isSaved ? Colors.PRIMARY : Colors.TEXT}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="share-social-outline" size={22} color={Colors.TEXT} />
          </TouchableOpacity>
        </View>
      </Animatable.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Job Header */}
        <Animatable.View animation="fadeInUp" delay={100} style={styles.jobHeader}>
          <View style={styles.companyIcon}>
            <Ionicons name="business" size={32} color={Colors.PRIMARY} />
          </View>
          <View style={styles.jobHeaderText}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company || "Unknown Company"}</Text>
          </View>
        </Animatable.View>

        {/* Quick Info Cards */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Ionicons name="cash-outline" size={20} color={Colors.PRIMARY} />
            <Text style={styles.infoLabel}>Budget</Text>
            <Text style={styles.infoValue}>
              LKR {job.budget?.toLocaleString() ?? "—"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color={Colors.PRIMARY} />
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{job.duration || "Flexible"}</Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="location-outline" size={20} color={Colors.PRIMARY} />
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{job.location || "Remote"}</Text>
          </View>
        </Animatable.View>

        {/* Main Content Card */}
        <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
          {/* Description Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Job Description</Text>
            </View>
            <Text style={styles.body}>{job.description}</Text>
          </View>

          {/* Requirements Section (if available) */}
          {job.requirements && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.PRIMARY} />
                <Text style={styles.sectionTitle}>Requirements</Text>
              </View>
              <Text style={styles.body}>{job.requirements}</Text>
            </View>
          )}

          {/* Skills Section (if available) */}
          {job.skills && job.skills.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="code-slash-outline" size={20} color={Colors.PRIMARY} />
                <Text style={styles.sectionTitle}>Required Skills</Text>
              </View>
              <View style={styles.skillsContainer}>
                {job.skills.map((skill: string, idx: number) => (
                  <View key={idx} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Employer Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>About Employer</Text>
            </View>
            <View style={styles.employerInfo}>
              <View style={styles.employerAvatar}>
                <Text style={styles.employerInitial}>
                  {job.company?.[0]?.toUpperCase() || "?"}
                </Text>
              </View>
              <View style={styles.employerDetails}>
                <Text style={styles.employerName}>{job.company || "Unknown"}</Text>
                <View style={styles.employerStats}>
                  <Ionicons name="star" size={14} color={Colors.PRIMARY} />
                  <Text style={styles.employerStatText}>4.8 (120 reviews)</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bid Form */}
          <View style={styles.bidSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pricetag-outline" size={20} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Place Your Bid</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Bid Amount (LKR)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>LKR</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Enter your bid"
                  placeholderTextColor={Colors.MUTED}
                  value={bid}
                  onChangeText={setBid}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cover Message</Text>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder="Why are you the best fit for this job?"
                placeholderTextColor={Colors.MUTED}
                value={message}
                onChangeText={setMessage}
                style={[styles.input, styles.textArea]}
              />
              <Text style={styles.charCount}>{message.length}/500</Text>
            </View>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={submitBid}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>Submit Your Bid</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.ACCENT} />
              </TouchableOpacity>
            </Animated.View>

            {/* Help Section */}
            <TouchableOpacity
              style={styles.helpBtn}
              onPress={() => navigation.navigate("ChatBot")}
            >
              <Ionicons name="help-circle-outline" size={20} color={Colors.PRIMARY} />
              <Text style={styles.helpBtnText}>Need help with bidding? Ask SkillBot</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <FloatingChatIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ACCENT,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.CARD_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.CARD_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  companyIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "rgba(0, 255, 194, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  jobHeaderText: {
    flex: 1,
  },
  title: {
    color: Colors.TEXT,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  company: {
    color: Colors.MUTED,
    fontSize: 14,
    marginTop: 4,
  },
  infoCards: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.CARD_BG,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.1)",
  },
  infoLabel: {
    color: Colors.MUTED,
    fontSize: 11,
    marginTop: 8,
    textTransform: "uppercase",
  },
  infoValue: {
    color: Colors.TEXT,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.CARD_BG,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.1)",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    color: Colors.TEXT,
    fontWeight: "700",
    fontSize: 16,
  },
  body: {
    color: Colors.MUTED,
    lineHeight: 22,
    fontSize: 14,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    backgroundColor: "rgba(0, 255, 194, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.2)",
  },
  skillText: {
    color: Colors.PRIMARY,
    fontSize: 12,
    fontWeight: "600",
  },
  employerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  employerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  employerInitial: {
    color: Colors.ACCENT,
    fontSize: 20,
    fontWeight: "700",
  },
  employerDetails: {
    flex: 1,
  },
  employerName: {
    color: Colors.TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
  employerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  employerStatText: {
    color: Colors.MUTED,
    fontSize: 12,
  },
  bidSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 255, 194, 0.1)",
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.TEXT,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.ACCENT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.2)",
  },
  inputPrefix: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: "700",
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.ACCENT,
    color: Colors.TEXT,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.2)",
  },
  charCount: {
    color: Colors.MUTED,
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
  },
  submitBtn: {
    flexDirection: "row",
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  submitBtnText: {
    color: Colors.ACCENT,
    fontWeight: "800",
    fontSize: 16,
  },
  helpBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 8,
  },
  helpBtnText: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: "600",
  },
});