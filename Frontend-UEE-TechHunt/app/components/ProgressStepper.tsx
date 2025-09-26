import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  currentStep: number;
  totalSteps: number;
};

export default function ProgressStepper({ currentStep, totalSteps }: Props) {
  return (
    <View style={styles.container}>
      <Text>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 20 },
});
