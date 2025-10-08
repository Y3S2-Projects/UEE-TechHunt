// components/PaymentButton.tsx
// Reusable component to trigger checkout from anywhere in your app

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface PaymentButtonProps {
  amount: number;
  label?: string;
  style?: any;
  textStyle?: any;
}

export default function PaymentButton({
  amount,
  label = 'Checkout',
  style,
  textStyle,
}: PaymentButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to checkout screen
    // You can pass amount and other data via router params if needed
    router.push('./payment/checkout');
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        style,
        { opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {label} ${(amount / 100).toFixed(2)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF', // THEME COLOR: Primary button (blue)
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // THEME COLOR: Button text (white)
    fontSize: 16,
    fontWeight: '600',
  },
});