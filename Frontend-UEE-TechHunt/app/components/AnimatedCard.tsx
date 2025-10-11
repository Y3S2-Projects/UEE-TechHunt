// components/AnimatedCard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import Colors from "../theme";

export default function AnimatedCard({ children, style, delay = 0 }: any) {
  return (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={delay}
      style={[styles.card, style]}
      useNativeDriver
    >
      <View>{children}</View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.CARD_BG,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
});
