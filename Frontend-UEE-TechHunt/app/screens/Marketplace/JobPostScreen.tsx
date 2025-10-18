
// screens/Marketplace/JobPostScreen.tsx
// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../theme";
import { postJob } from "../../services/jobService";

export default function JobPostScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [desc, setDesc] = useState("");
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("Remote");
  const [category, setCategory] = useState("Development");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { name: "Development", icon: "code-slash" },
    { name: "Design", icon: "color-palette" },
    { name: "Writing", icon: "create" },
    { name: "Marketing", icon: "megaphone" },
    { name: "Video & Animation", icon: "videocam" },
    { name: "Music & Audio", icon: "musical-notes" },
  ];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handlePreview = () => {
    if (!title.trim()) {
      return Alert.alert("Missing Title", "Please enter a job title to preview.");
    }
    if (!desc.trim()) {
      return Alert.alert("Missing Description", "Please provide a job description to preview.");
    }
    setShowPreview(true);
  };

  const handlePost = async () => {
    // Validation
    if (!title.trim()) {
      return Alert.alert("Missing Title", "Please enter a job title.");
    }
    if (!desc.trim()) {
      return Alert.alert("Missing Description", "Please provide a job description.");
    }
    if (!budget || isNaN(Number(budget))) {
      return Alert.alert("Invalid Budget", "Please enter a valid numeric budget.");
    }

    setIsPosting(true);

    try {
      const jobData = {
        title: title.trim(),
        company: company.trim() || "Anonymous",
        description: desc.trim(),
        requirements: requirements.trim(),
        budget: Number(budget),
        duration: duration || "Flexible",
        location: location || "Remote",
        category,
        skills,
        image,
      };

      console.log("Posting job data:", jobData);
      const response = await postJob(jobData);
      console.log("Job posted successfully:", response);

      // Clear form
      setTitle("");
      setCompany("");
      setDesc("");
      setRequirements("");
      setBudget("");
      setDuration("");
      setLocation("Remote");
      setCategory("Development");
      setSkills([]);
      setImage(null);

      Alert.alert(
        "Success! 🎉",
        "Your job has been posted successfully. Freelancers will start bidding soon!",
        [
          {
            text: "View Jobs",
            onPress: () => {
              navigation.navigate("JobList", { refresh: Date.now() });
            },
          },
        ]
      );
    } catch (err: any) {
      console.error("Error posting job:", err);
      const errorMessage = err.message || "Failed to post job. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsPosting(false);
    }
  };

  const PreviewModal = () => (
    <Modal
      visible={showPreview}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPreview(false)}
    >
      <View style={styles.modalOverlay}>
        <Animatable.View 
          animation="slideInUp" 
          duration={400}
          style={styles.modalContent}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Job Preview</Text>
              <Text style={styles.modalSubtitle}>How your job will appear</Text>
            </View>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowPreview(false)}
            >
              <Ionicons name="close" size={24} color={Colors.TEXT} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.previewScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Job Image */}
            {image && (
              <Animatable.View animation="fadeIn" duration={600}>
                <Image source={{ uri: image }} style={styles.previewImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(10, 31, 47, 0.9)']}
                  style={styles.imageGradient}
                />
              </Animatable.View>
            )}

            {/* Job Content */}
            <View style={styles.previewBody}>
              {/* Category Badge */}
              <View style={styles.previewBadge}>
                <Ionicons 
                  name={categories.find(c => c.name === category)?.icon as any || "briefcase"} 
                  size={14} 
                  color={Colors.PRIMARY} 
                />
                <Text style={styles.previewBadgeText}>{category}</Text>
              </View>

              {/* Title */}
              <Text style={styles.previewTitle}>{title}</Text>

              {/* Company */}
              {company && (
                <View style={styles.previewCompany}>
                  <Ionicons name="business" size={16} color={Colors.MUTED} />
                  <Text style={styles.previewCompanyText}>{company}</Text>
                </View>
              )}

              {/* Meta Info */}
              <View style={styles.previewMeta}>
                <View style={styles.previewMetaItem}>
                  <Ionicons name="cash" size={18} color={Colors.PRIMARY} />
                  <Text style={styles.previewMetaText}>
                    LKR {Number(budget).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.previewMetaItem}>
                  <Ionicons name="time" size={18} color={Colors.PRIMARY} />
                  <Text style={styles.previewMetaText}>{duration || "Flexible"}</Text>
                </View>
                <View style={styles.previewMetaItem}>
                  <Ionicons name="location" size={18} color={Colors.PRIMARY} />
                  <Text style={styles.previewMetaText}>{location}</Text>
                </View>
              </View>

              {/* Description */}
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Description</Text>
                <Text style={styles.previewText}>{desc}</Text>
              </View>

              {/* Requirements */}
              {requirements && (
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Requirements</Text>
                  <Text style={styles.previewText}>{requirements}</Text>
                </View>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Required Skills</Text>
                  <View style={styles.previewSkills}>
                    {skills.map((skill, idx) => (
                      <Animatable.View 
                        key={idx}
                        animation="bounceIn"
                        delay={idx * 50}
                        style={styles.previewSkillChip}
                      >
                        <Ionicons name="checkmark-circle" size={14} color={Colors.PRIMARY} />
                        <Text style={styles.previewSkillText}>{skill}</Text>
                      </Animatable.View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setShowPreview(false)}
            >
              <Ionicons name="create" size={20} color={Colors.PRIMARY} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postFromPreviewBtn}
              onPress={() => {
                setShowPreview(false);
                handlePost();
              }}
              disabled={isPosting}
            >
              {isPosting ? (
                <ActivityIndicator color={Colors.ACCENT} />
              ) : (
                <>
                  <Ionicons name="rocket" size={20} color={Colors.ACCENT} />
                  <Text style={styles.postFromPreviewBtnText}>Post Now</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.ACCENT} />

      {/* Header */}
      <LinearGradient
        colors={[Colors.ACCENT, 'rgba(10, 31, 47, 0.95)']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Animatable.Text animation="fadeInDown" style={styles.h1}>
            Create Job Post
          </Animatable.Text>
          <Animatable.Text animation="fadeInDown" delay={100} style={styles.h2}>
            Connect with talented freelancers worldwide 🚀
          </Animatable.Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEnabled={true}
      >
        <Animatable.View animation="fadeInUp" duration={600} style={styles.form}>
          {/* Job Title */}
          <Animatable.View animation="fadeInUp" delay={100} style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="star" size={12} color="#FF4444" /> Job Title
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="briefcase" size={20} color={Colors.PRIMARY} />
              <TextInput
                placeholder="e.g., Build a mobile app for iOS & Android"
                placeholderTextColor={Colors.MUTED}
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </Animatable.View>

          {/* Company Name */}
          <Animatable.View animation="fadeInUp" delay={150} style={styles.inputGroup}>
            <Text style={styles.label}>Company Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business" size={20} color={Colors.PRIMARY} />
              <TextInput
                placeholder="Your company or personal brand"
                placeholderTextColor={Colors.MUTED}
                style={styles.input}
                value={company}
                onChangeText={setCompany}
              />
            </View>
          </Animatable.View>

          {/* Category Selection */}
          <Animatable.View animation="fadeInUp" delay={200} style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="grid" size={12} color={Colors.PRIMARY} /> Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((cat, idx) => (
                <Animatable.View
                  key={cat.name}
                  animation="bounceIn"
                  delay={idx * 50}
                >
                  <TouchableOpacity
                    style={[
                      styles.categoryChip,
                      category === cat.name && styles.categoryChipActive,
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <Ionicons 
                      name={cat.icon as any} 
                      size={16} 
                      color={category === cat.name ? Colors.ACCENT : Colors.PRIMARY} 
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        category === cat.name && styles.categoryTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </ScrollView>
          </Animatable.View>

          {/* Description */}
          <Animatable.View animation="fadeInUp" delay={250} style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="star" size={12} color="#FF4444" /> Description
            </Text>
            <View style={[styles.inputWrapper, styles.textArea]}>
              <TextInput
                placeholder="Describe your project in detail... What are you building? What's your vision?"
                placeholderTextColor={Colors.MUTED}
                style={styles.textAreaInput}
                value={desc}
                onChangeText={setDesc}
                multiline
                numberOfLines={6}
              />
            </View>
            <View style={styles.charCountRow}>
              <Ionicons name="document-text" size={12} color={Colors.MUTED} />
              <Text style={styles.charCount}>{desc.length}/2000 characters</Text>
            </View>
          </Animatable.View>

          {/* Requirements */}
          <Animatable.View animation="fadeInUp" delay={300} style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="checkbox" size={12} color={Colors.PRIMARY} /> Requirements
            </Text>
            <View style={[styles.inputWrapper, styles.textArea]}>
              <TextInput
                placeholder="What skills, experience, or qualifications do you need?"
                placeholderTextColor={Colors.MUTED}
                style={styles.textAreaInput}
                value={requirements}
                onChangeText={setRequirements}
                multiline
                numberOfLines={4}
              />
            </View>
          </Animatable.View>

          {/* Skills Tags */}
          <Animatable.View animation="fadeInUp" delay={350} style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="code-slash" size={12} color={Colors.PRIMARY} /> Required Skills
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="add-circle" size={20} color={Colors.PRIMARY} />
              <TextInput
                placeholder="Type a skill and press + or Enter"
                placeholderTextColor={Colors.MUTED}
                style={styles.input}
                value={skillInput}
                onChangeText={setSkillInput}
                onSubmitEditing={addSkill}
              />
              <TouchableOpacity style={styles.addSkillBtn} onPress={addSkill}>
                <Ionicons name="add" size={22} color={Colors.ACCENT} />
              </TouchableOpacity>
            </View>
            {skills.length > 0 && (
              <View style={styles.skillsContainer}>
                {skills.map((skill, idx) => (
                  <Animatable.View
                    key={idx}
                    animation="bounceIn"
                    duration={400}
                    style={styles.skillChip}
                  >
                    <Ionicons name="checkmark-circle" size={14} color={Colors.PRIMARY} />
                    <Text style={styles.skillText}>{skill}</Text>
                    <TouchableOpacity onPress={() => removeSkill(skill)}>
                      <Ionicons name="close-circle" size={16} color="#FF4444" />
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>
            )}
          </Animatable.View>

          {/* Budget & Duration Row */}
          <View style={styles.row}>
            <Animatable.View 
              animation="fadeInLeft" 
              delay={400}
              style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}
            >
              <Text style={styles.label}>
                <Ionicons name="star" size={12} color="#FF4444" /> Budget (LKR)
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="cash" size={20} color={Colors.PRIMARY} />
                <TextInput
                  placeholder="10000"
                  placeholderTextColor={Colors.MUTED}
                  keyboardType="numeric"
                  style={styles.input}
                  value={budget}
                  onChangeText={setBudget}
                />
              </View>
            </Animatable.View>

            <Animatable.View 
              animation="fadeInRight" 
              delay={400}
              style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}
            >
              <Text style={styles.label}>
                <Ionicons name="time" size={12} color={Colors.PRIMARY} /> Duration
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar" size={20} color={Colors.PRIMARY} />
                <TextInput
                  placeholder="1-2 weeks"
                  placeholderTextColor={Colors.MUTED}
                  style={styles.input}
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
            </Animatable.View>
          </View>

          {/* Location */}
          <Animatable.View animation="fadeInUp" delay={450} style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="location" size={12} color={Colors.PRIMARY} /> Location
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="globe" size={20} color={Colors.PRIMARY} />
              <TextInput
                placeholder="Remote, On-site, or Hybrid"
                placeholderTextColor={Colors.MUTED}
                style={styles.input}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </Animatable.View>

          {/* Image Upload */}
          <Animatable.View animation="fadeInUp" delay={500} style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="image" size={12} color={Colors.PRIMARY} /> Job Image
            </Text>
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {image ? (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: image }} style={styles.uploadedImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(10, 31, 47, 0.7)']}
                    style={styles.imageOverlay}
                  />
                  <TouchableOpacity
                    style={styles.removeImageBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      setImage(null);
                    }}
                  >
                    <Ionicons name="trash" size={20} color="#FF4444" />
                  </TouchableOpacity>
                  <View style={styles.changeImageBtn}>
                    <Ionicons name="camera" size={18} color={Colors.PRIMARY} />
                    <Text style={styles.changeImageText}>Change Image</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Animatable.View 
                    animation="pulse" 
                    iterationCount="infinite"
                    style={styles.uploadIcon}
                  >
                    <Ionicons name="cloud-upload" size={48} color={Colors.PRIMARY} />
                  </Animatable.View>
                  <Text style={styles.uploadText}>Tap to upload cover image</Text>
                  <Text style={styles.uploadSubtext}>
                    📸 Recommended: 1200x675px (16:9)
                  </Text>
                  <Text style={styles.uploadSubtext}>
                    Max size: 5MB • JPG, PNG
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animatable.View>

          {/* Action Buttons */}
          <Animatable.View animation="fadeInUp" delay={550}>
            {/* Preview Button */}
            <TouchableOpacity 
              style={styles.previewBtn}
              onPress={handlePreview}
            >
              <Ionicons name="eye" size={22} color={Colors.PRIMARY} />
              <Text style={styles.previewBtnText}>Preview Before Posting</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.PRIMARY} />
            </TouchableOpacity>

            {/* Post Button */}
            <TouchableOpacity
              style={[styles.postBtn, isPosting && styles.postBtnDisabled]}
              onPress={handlePost}
              disabled={isPosting}
            >
              {isPosting ? (
                <ActivityIndicator color={Colors.ACCENT} size="small" />
              ) : (
                <>
                  <Ionicons name="rocket" size={22} color={Colors.ACCENT} />
                  <Text style={styles.postBtnText}>Post Job Now</Text>
                  <Ionicons name="arrow-forward" size={20} color={Colors.ACCENT} />
                </>
              )}
            </TouchableOpacity>
          </Animatable.View>

          {/* Helper Text */}
          <View style={styles.helperBox}>
            <Ionicons name="information-circle" size={20} color={Colors.PRIMARY} />
            <Text style={styles.helperText}>
              Your job will be visible to thousands of freelancers instantly!
            </Text>
          </View>
        </Animatable.View>
      </ScrollView>

      {/* Preview Modal */}
      <PreviewModal />
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
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 255, 194, 0.1)',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 194, 0.3)',
  },
  headerText: {
    flex: 1,
  },
  h1: {
    color: Colors.TEXT,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  h2: {
    color: Colors.MUTED,
    fontSize: 14,
    marginTop: 6,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  form: {
    backgroundColor: Colors.CARD_BG,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: Colors.TEXT,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(0, 255, 194, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0, 255, 194, 0.2)",
    gap: 12,
  },
  input: {
    flex: 1,
    color: Colors.TEXT,
    fontSize: 15,
    fontWeight: "500",
  },
  textArea: {
    paddingTop: 14,
    paddingBottom: 14,
    minHeight: 140,
    alignItems: 'flex-start',
  },
  textAreaInput: {
    flex: 1,
    color: Colors.TEXT,
    fontSize: 15,
    fontWeight: "500",
    textAlignVertical: "top",
    minHeight: 120,
    width: '100%',
  },
  charCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    justifyContent: 'flex-end',
  },
  charCount: {
    color: Colors.MUTED,
    fontSize: 12,
    fontWeight: "600",
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 194, 0.08)',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "rgba(0, 255, 194, 0.2)",
    gap: 8,
  },
  categoryChipActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  categoryText: {
    color: Colors.TEXT,
    fontSize: 13,
    fontWeight: "700",
  },
  categoryTextActive: {
    color: Colors.ACCENT,
  },
  addSkillBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 194, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1.5,
    borderColor: "rgba(0, 255, 194, 0.3)",
  },
  skillText: {
    color: Colors.PRIMARY,
    fontSize: 13,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
  },
  imageUpload: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 194, 0.3)",
    borderStyle: "dashed",
  },
  uploadPlaceholder: {
    padding: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(0, 255, 194, 0.05)',
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadText: {
    color: Colors.TEXT,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
  uploadSubtext: {
    color: Colors.MUTED,
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  imagePreview: {
    position: "relative",
  },
  uploadedImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  removeImageBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 31, 47, 0.9)',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: '#FF4444',
  } as ViewStyle,
  changeImageBtn: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(10, 31, 47, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 194, 0.5)',
  } as ViewStyle,
  changeImageText: {
    color: Colors.PRIMARY,
    fontSize: 13,
    fontWeight: '700',
  } as TextStyle,
  postBtn: {
    flexDirection: "row",
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  postBtnDisabled: {
    opacity: 0.6,
  } as ViewStyle,
  postBtnText: {
    color: Colors.ACCENT,
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 0.5,
  } as TextStyle,
  previewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 8,
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 255, 194, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 194, 0.3)',
  } as ViewStyle,
  previewBtnText: {
    color: Colors.PRIMARY,
    fontSize: 15,
    fontWeight: "700",
  } as TextStyle,
  helperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0, 255, 194, 0.08)',
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 194, 0.2)',
  } as ViewStyle,
  helperText: {
    flex: 1,
    color: Colors.TEXT,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  } as TextStyle,
  // Preview Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  } as ViewStyle,
  modalContent: {
    backgroundColor: Colors.CARD_BG,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  } as ViewStyle,
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 194, 0.1)',
  } as ViewStyle,
  modalTitle: {
    color: Colors.TEXT,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  } as TextStyle,
  modalSubtitle: {
    color: Colors.MUTED,
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  } as TextStyle,
  closeModalBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 194, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 194, 0.2)',
  } as ViewStyle,
  previewScroll: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  } as ViewStyle,
  previewBody: {
    padding: 20,
  } as ViewStyle,
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 255, 194, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 194, 0.3)',
  } as ViewStyle,
  previewBadgeText: {
    color: Colors.PRIMARY,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,
  previewTitle: {
    color: Colors.TEXT,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    lineHeight: 32,
  } as TextStyle,
  previewCompany: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  } as ViewStyle,
  previewCompanyText: {
    color: Colors.MUTED,
    fontSize: 15,
    fontWeight: '600',
  } as TextStyle,
  previewMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 255, 194, 0.1)',
  } as ViewStyle,
  previewMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  } as ViewStyle,
  previewMetaText: {
    color: Colors.TEXT,
    fontSize: 14,
    fontWeight: '700',
  } as TextStyle,
  previewSection: {
    marginBottom: 24,
  } as ViewStyle,
  previewSectionTitle: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.3,
  } as TextStyle,
  previewText: {
    color: Colors.TEXT,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  } as TextStyle,
  previewSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  } as ViewStyle,
  previewSkillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 194, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 194, 0.3)',
  } as ViewStyle,
  previewSkillText: {
    color: Colors.PRIMARY,
    fontSize: 13,
    fontWeight: '700',
  } as TextStyle,
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 255, 194, 0.1)',
    backgroundColor: Colors.ACCENT,
  } as ViewStyle,
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 255, 194, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 194, 0.3)',
  } as ViewStyle,
  editBtnText: {
    color: Colors.PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  } as TextStyle,
  postFromPreviewBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Colors.PRIMARY,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  postFromPreviewBtnText: {
    color: Colors.ACCENT,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  } as TextStyle,
});