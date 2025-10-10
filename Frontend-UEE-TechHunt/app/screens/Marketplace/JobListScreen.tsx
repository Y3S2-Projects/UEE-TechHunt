// screens/Marketplace/JobListScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TextInput,
  Animated,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme";
import AnimatedCard from "../../components/AnimatedCard";
import { getAllJobs } from "../../services/jobService";
import FloatingChatIcon from "../../components/FloatingChatIcon";
import { useFocusEffect } from "@react-navigation/native";

// Enhanced category configuration with logos
const categoryConfig: any = {
  Design: {
    icon: "color-palette",
    logo: "brush",
    color: "#0c8a6dff",
    bg: "rgba(0, 255, 194, 0.15)",
    gradient: "rgba(0, 255, 194, 0.3)",
  },
  Development: {
    icon: "code-slash",
    logo: "terminal",
    color: "#ba8707ff",
    bg: "rgba(255, 184, 0, 0.15)",
    gradient: "rgba(255, 184, 0, 0.3)",
  },
  Writing: {
    icon: "create",
    logo: "document-text",
    color: "#3e679aff",
    bg: "rgba(0, 55, 255, 0.15)",
    gradient: "rgba(0, 64, 255, 0.3)",
  },
  Marketing: {
    icon: "megaphone",
    logo: "trending-up",
    color: "#cb557cff",
    bg: "rgba(255, 107, 157, 0.15)",
    gradient: "rgba(255, 107, 157, 0.3)",
  },
  "Video & Animation": {
    icon: "play-circle",
    logo: "film",
    color: "#7a61abff",
    bg: "rgba(157, 108, 255, 0.15)",
    gradient: "rgba(157, 108, 255, 0.3)",
  },
  "Music & Audio": {
    icon: "musical-notes",
    logo: "disc",
    color: "#FF5757",
    bg: "rgba(255, 87, 87, 0.15)",
    gradient: "rgba(255, 87, 87, 0.3)",
  },
};

export default function JobListScreen({ navigation, route }: any) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const categories = ["All", "Design", "Development", "Writing", "Marketing"];

  useEffect(() => {
    fetchJobs();
    // Animate header on mount
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [])
  );

  // Also refresh when route params change
  useEffect(() => {
    if (route.params?.refresh) {
      fetchJobs();
    }
  }, [route.params?.refresh]);

  // Filter jobs whenever dependencies change
  useEffect(() => {
    filterJobs();
  }, [searchQuery, selectedCategory, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log("Fetching jobs...");
      const res = await getAllJobs();
      console.log("Jobs fetched:", res);
      setJobs(res);
      setFilteredJobs(res);
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      Alert.alert("Error", err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    setFilteredJobs(filtered);
  };

  // Get category counts
  const getCategoryCounts = () => {
    const counts: any = { All: jobs.length };
    categories.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = jobs.filter((job) => job.category === cat).length;
      }
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const renderItem = ({ item, index }: any) => {
    const config = categoryConfig[item.category] || categoryConfig.Development;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("JobDetail", { job: item })}
        accessibilityLabel={`Open ${item.title} details`}
        activeOpacity={0.7}
      >
        <AnimatedCard delay={index * 80}>
          <View style={styles.jobCard}>
            {/* Gradient overlay */}
            <View
              style={[
                styles.cardGradientOverlay,
                {
                  backgroundColor: config.gradient,
                },
              ]}
            />

            {/* Colorful Top Border */}
            <View
              style={[styles.colorBar, { backgroundColor: config.color }]}
            />

            {/* Animated corner accent */}
            <View
              style={[styles.cornerAccent, { borderColor: config.color }]}
            />

            {/* Job Header */}
            <View style={styles.jobHeader}>
              <View
                style={[styles.companyBadge, { backgroundColor: config.bg }]}
              >
                <Ionicons name={config.logo} size={24} color={config.color} />
              </View>
              <View style={styles.jobHeaderText}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.company}>
                  {item.company || "Unknown Company"}
                </Text>
              </View>
              <PulsingDot color={config.color} />
            </View>

            {/* Job Description */}
            <Text style={styles.desc} numberOfLines={3}>
              {item.description}
            </Text>

            {/* Job Meta Info with colored icons */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <View
                  style={[
                    styles.metaIconBg,
                    { backgroundColor: "rgba(0, 255, 194, 0.2)" },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={Colors.PRIMARY}
                  />
                </View>
                <Text style={styles.metaText}>
                  {item.duration || "Flexible"}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <View
                  style={[
                    styles.metaIconBg,
                    { backgroundColor: "rgba(58, 125, 153, 0.2)" },
                  ]}
                >
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={Colors.SECONDARY}
                  />
                </View>
                <Text style={styles.metaText}>{item.location || "Remote"}</Text>
              </View>
            </View>

            {/* Job Footer */}
            <View style={styles.jobFooter}>
              <View style={styles.budgetContainer}>
                <Text style={styles.budgetLabel}>Budget</Text>
                <View style={styles.budgetBadge}>
                  <View style={styles.budgetIconBg}>
                    <Ionicons name="cash" size={16} color="#FFB800" />
                  </View>
                  <Text style={styles.budget}>
                    ${item.budget?.toLocaleString() ?? "—"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.applyBtn, { backgroundColor: config.color }]}
              >
                <Text style={styles.applyBtnText}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Category Tag */}
            {item.category && (
              <View
                style={[
                  styles.categoryTag,
                  {
                    backgroundColor: config.bg,
                    borderColor: config.color,
                  },
                ]}
              >
                <Ionicons name={config.icon} size={12} color={config.color} />
                <Text style={[styles.categoryTagText, { color: config.color }]}>
                  {item.category}
                </Text>
              </View>
            )}
          </View>
        </AnimatedCard>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }}
    >
      {/* Enhanced Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroGradient} />
        <View
          style={[
            styles.heroLightOrb,
            { backgroundColor: "rgba(0, 255, 195, 0.26)" },
          ]}
        />
        <View
          style={[
            styles.heroLightOrb2,
            { backgroundColor: "rgba(58, 124, 153, 0.55)" },
          ]}
        />

        <View style={styles.heroContent}>
          
         
            {/* Logo and Title */}
          <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/images/techhunt.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
          </View>
           <View style={styles.heroTextContainer}>

            <Text style={styles.h1}>Explore Micro-Jobs</Text>
            <Text style={styles.h2}>
              Find quick gigs, build your portfolio, and earn on your terms
            </Text>
          </View>

          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => navigation.navigate("JobPost")}
            accessibilityLabel="Post a new job"
          >
            <View style={styles.postBtnGlow} />
            <Ionicons name="add-circle" size={22} color={Colors.ACCENT} />
            <Text style={styles.postBtnText}>Post Job</Text>
            <Ionicons name="sparkles" size={18} color={Colors.ACCENT} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statsGlassOverlay} />
        <AnimatedStatBox
          number={jobs.length}
          label="Active Jobs"
          icon="briefcase"
          color={Colors.PRIMARY}
        />
        <View style={styles.statDivider} />
        <AnimatedStatBox
          number="500+"
          label="Freelancers"
          icon="people"
          color={Colors.SECONDARY}
        />
        <View style={styles.statDivider} />
        <AnimatedStatBox
          number="98%"
          label="Success Rate"
          icon="trophy"
          color="#FFB800"
        />
      </View>

      {/* Enhanced Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchGlassOverlay} />
        <View style={styles.searchIconBg}>
          <Ionicons name="search" size={20} color={Colors.PRIMARY} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, companies, or keywords..."
          placeholderTextColor="rgba(229,229,229,0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setSearchQuery("")}
          >
            <Ionicons name="close-circle" size={20} color="#FF6B9D" />
          </TouchableOpacity>
        )}
      </View>

      {/* Enhanced Category Filters with counts */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const config =
              item === "All"
                ? {
                    icon: "grid",
                    logo: "apps",
                    color: Colors.SECONDARY,
                    bg: "rgba(29, 109, 146, 0.15)",
                  }
                : categoryConfig[item] || categoryConfig.Development;

            const count = categoryCounts[item] || 0;

            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  selectedCategory === item && [
                    styles.categoryChipActive,
                    {
                      backgroundColor: config.color,
                      borderColor: config.color,
                      shadowColor: config.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 5,
                    },
                  ],
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Ionicons
                  name={config.icon}
                  size={18}
                  color={selectedCategory === item ? "#FFF" : config.color}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: selectedCategory === item ? "#FFF" : config.color,
                    },
                  ]}
                >
                  {item}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor:
                        selectedCategory === item
                          ? "rgba(255,255,255,0.25)"
                          : config.bg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countBadgeText,
                      {
                        color:
                          selectedCategory === item ? "#FFF" : config.color,
                      },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results Header with animation */}
      <View style={styles.resultsHeader}>
        <View style={styles.resultsLeft}>
          <View style={styles.resultsIconBg}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={Colors.PRIMARY}
            />
          </View>
          <Text style={styles.resultsText}>
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
            found
          </Text>
          {selectedCategory !== "All" && (
            <View style={styles.filterActiveBadge}>
              <Ionicons name="funnel" size={12} color={Colors.SECONDARY} />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options" size={18} color={Colors.SECONDARY} />
          <Text style={styles.filterBtnText}>Sort</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="briefcase-outline" size={56} color={Colors.PRIMARY} />
        <View style={styles.emptyIconAccent} />
      </View>
      <Text style={styles.emptyTitle}>No jobs found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your search or filters to find what you're looking for
      </Text>
      <TouchableOpacity
        style={styles.resetBtn}
        onPress={() => {
          setSearchQuery("");
          setSelectedCategory("All");
        }}
      >
        <Ionicons name="refresh" size={18} color={Colors.PRIMARY} />
        <Text style={styles.resetBtnText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.ACCENT} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCircle}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          </View>
          <Text style={styles.loadingText}>Loading opportunities...</Text>
          <Text style={styles.loadingSubtext}>
            Finding the best matches for you
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(i) => i._id ?? `${i.title}-${Math.random()}`}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}

      <FloatingChatIcon />
    </View>
  );
}

// Animated Stat Box Component
function AnimatedStatBox({ number, label, icon, color }: any) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[styles.statBox, { transform: [{ scale: scaleAnim }] }]}
    >
      <Animated.View
        style={[
          styles.statIconBg,
          { backgroundColor: `${color}20`, transform: [{ rotate }] },
        ]}
      >
        <Ionicons name={icon} size={22} color={color} />
      </Animated.View>
      <Text style={[styles.statNumber, { color }]}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

// Pulsing Dot Component
function PulsingDot({ color }: any) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
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

  return (
    <View style={styles.pulsingContainer}>
      <Animated.View
        style={[
          styles.pulsingDotOuter,
          {
            backgroundColor: `${color}40`,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <View style={[styles.pulsingDot, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ACCENT,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 255, 194, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingText: {
    color: Colors.TEXT,
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingSubtext: {
    color: Colors.MUTED,
    marginTop: 6,
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 100,
  },
  heroSection: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 24,
    position: "relative",
    overflow: "hidden",
    height: 320
  },
  heroGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: "rgba(0, 255, 194, 0.08)",
    borderRadius: 200,
    transform: [{ scaleX: 2 }],
  },
  heroLightOrb: {
    position: "absolute",
    top: -40,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 80,
    opacity: 0.7,
  },
  heroLightOrb2: {
    position: "absolute",
    top: 60,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.5,
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
  },
  logoContainer: {
    position: "relative",
    width: 90,
    height: 90,
    marginBottom: 16,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 255, 194, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  logoPulse: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.PRIMARY,
    opacity: 0.2,
  },
  heroTextContainer: {
    position: "relative",
    top: -50,
    marginBottom: 20,
  },
  h1: {
    color: Colors.PRIMARY,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  h2: {
    color: Colors.TEXT,
    fontSize: 15,
    marginTop: 10,
    lineHeight: 22,
    opacity: 0.85,
  },
  postBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 18,
    alignSelf: "flex-start",
    gap: 8,
    position: "relative",
    top: -30,
    overflow: "hidden",
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  postBtnGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 18,
  },
  postBtnText: {
    color: Colors.ACCENT,
    fontWeight: "700",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    position: "relative",
    overflow: "hidden",
  },
  statsGlassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "700",
  },
  statLabel: {
    color: Colors.MUTED,
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    gap: 12,
    position: "relative",
    overflow: "hidden",
  },
  searchGlassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 18,
  },
  searchIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 255, 194, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    color: Colors.TEXT,
    fontSize: 15,
  },
  clearBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 107, 157, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    marginBottom: 18,
    paddingLeft: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    gap: 8,
  },
  categoryChipActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  resultsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resultsIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 255, 194, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  resultsText: {
    color: Colors.TEXT,
    fontSize: 15,
    fontWeight: "600",
  },
  filterActiveBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(58, 125, 153, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(58, 125, 153, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(58, 125, 153, 0.3)",
  },
  filterBtnText: {
    color: Colors.SECONDARY,
    fontSize: 14,
    fontWeight: "600",
  },
  jobCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    position: "relative",
    overflow: "hidden",
  },
  cardGradientOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.15,
  },
  colorBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    zIndex: 1,
  },
  cornerAccent: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 8,
    opacity: 0.3,
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 14,
  },
  companyBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  jobHeaderText: {
    flex: 1,
  },
  title: {
    color: Colors.TEXT,
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  company: {
    color: Colors.MUTED,
    fontSize: 13,
    marginTop: 3,
    fontWeight: "500",
  },
  pulsingContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pulsingDotOuter: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  desc: {
    color: "rgba(229,229,229,0.75)",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  metaIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  metaText: {
    color: "rgba(229,229,229,0.8)",
    fontSize: 13,
    fontWeight: "500",
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  budgetContainer: {
    gap: 8,
  },
  budgetLabel: {
    color: Colors.MUTED,
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  budgetBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  budgetIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 184, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  budget: {
    color: Colors.TEXT,
    fontSize: 22,
    fontWeight: "700",
  },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  applyBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  categoryTag: {
    position: "absolute",
    top: 24,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.5,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 255, 194, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 194, 0.3)",
  },
  emptyIconAccent: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.2)",
  },
  emptyTitle: {
    color: Colors.TEXT,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 24,
  },
  emptyText: {
    color: Colors.MUTED,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 21,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 194, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  resetBtnText: {
    color: Colors.PRIMARY,
    fontWeight: "700",
    fontSize: 14,
  },

  logoImage: {
  width: 150,
  height: 150,
  borderRadius: 20,
  position: "relative",
  top: -20,
  left: 250, 
  },

});
