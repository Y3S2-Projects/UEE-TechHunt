import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button } from "react-native-elements";

type Props = {
  question: string;
  onNext: (answer: string) => void;
};

export default function OnboardingStep({ question, onNext }: Props) {
  const [answer, setAnswer] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your answer"
        value={answer}
        onChangeText={setAnswer}
      />
      <Button title="Next" onPress={() => onNext(answer)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  question: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
