import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  Animated,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  ChatBot: undefined;
};

export default function FloatingChatIcon() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const pulse = useRef(new Animated.Value(1)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const [showTooltip, setShowTooltip] = useState(true);
  const tooltipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bounce entry animation
    Animated.spring(bounce, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Show tooltip briefly
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(tooltipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(tooltipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowTooltip(false));
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(pulse, {
        toValue: 0.9,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(pulse, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    navigation.navigate("ChatBot");
  };

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: bounce }],
        },
      ]}
    >
      {/* Tooltip */}
      {showTooltip && (
        <Animated.View
          style={[
            styles.tooltip,
            {
              opacity: tooltipAnim,
              transform: [
                {
                  translateY: tooltipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.tooltipText}>Need help?</Text>
          <View style={styles.tooltipArrow} />
        </Animated.View>
      )}

      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* Main button */}
      <Animated.View
        style={[
          styles.mainButton,
          {
            transform: [{ scale: pulse }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={styles.touchable}
          activeOpacity={0.8}
        >
          {/* Bot Avatar */}
          <View style={styles.botAvatar}>
            {/* Bot Head */}
            <View style={styles.botHead}>
              {/* Eyes */}
              <View style={styles.eyesContainer}>
                <View style={styles.eye}>
                  <View style={styles.pupil} />
                </View>
                <View style={styles.eye}>
                  <View style={styles.pupil} />
                </View>
              </View>

              {/* Antenna */}
              <View style={styles.antenna}>
                <View style={styles.antennaBall} />
              </View>
            </View>

            {/* Smile */}
            <View style={styles.smile} />
          </View>

          {/* Notification dot */}
          <View style={styles.notificationDot}>
            <View style={styles.notificationDotInner} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      

      {/* Shadow */}
      <View style={styles.shadow} />
    </Animated.View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    right: 25,
    alignItems: "center",
  },
  tooltip: {
    position: "absolute",
    bottom: 80,
    right: 0,
    backgroundColor: "#071824",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.3)",
    shadowColor: "#00FFC2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipText: {
    color: "#E5E5E5",
    fontSize: 14,
    fontWeight: "600",
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -6,
    right: 20,
    width: 12,
    height: 12,
    backgroundColor: "#071824",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.3)",
    transform: [{ rotate: "45deg" }],
  },
  glowRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00FFC2",
  },
  shadow: {
    position: "absolute",
    bottom: -5,
    width: 50,
    height: 8,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  mainButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00FFC2",
    shadowColor: "#00FFC2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  touchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
  },
  botAvatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  botHead: {
    width: 36,
    height: 36,
    backgroundColor: "#0A1F2F",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00FFC2",
  },
  eyesContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  eye: {
    width: 8,
    height: 10,
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  pupil: {
    width: 4,
    height: 4,
    backgroundColor: "#0A1F2F",
    borderRadius: 2,
    marginBottom: 1,
  },
  antenna: {
    position: "absolute",
    top: -8,
    width: 2,
    height: 8,
    backgroundColor: "#0A1F2F",
  },
  antennaBall: {
    position: "absolute",
    top: -4,
    left: -2,
    width: 6,
    height: 6,
    backgroundColor: "#00FFC2",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#0A1F2F",
  },
  smile: {
    marginTop: 2,
    width: 16,
    height: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#0A1F2F",
  },
  notificationDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF4444",
    borderWidth: 2,
    borderColor: "#00FFC2",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",

  },
   helperTextContainer: {
    position: "absolute",
    bottom: -25,
    backgroundColor: "rgba(11, 28, 40, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 194, 0.3)",
  },
  helperText: {
    color: "#00FFC2",
    fontSize: 10,
    fontWeight: "700",
  },
});