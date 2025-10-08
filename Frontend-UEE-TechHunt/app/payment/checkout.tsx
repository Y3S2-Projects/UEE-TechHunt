// app/payment/checkout.tsx
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { createPaymentIntent } from '../services/stripeService';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  // Example order details - replace with your actual data
  const orderAmount = 1999; // $19.99 in cents
  const currency = 'usd';

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);

      // Fetch payment intent from backend
      const {
        paymentIntent,
        ephemeralKey,
        customer,
      } = await createPaymentIntent(
        orderAmount,
        currency,
        'user123', // Replace with actual user ID
        'John Doe' // Replace with actual user name
      );

      // Initialize payment sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'TechHunt',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'John Doe',
        },
        returnURL: 'techhunt://stripe-redirect',
      });

      if (error) {
        Alert.alert('Error', error.message);
        setLoading(false);
        return;
      }

      setPaymentReady(true);
      setLoading(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentReady) return;

    setLoading(true);

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error: ${error.code}`, error.message);
      setLoading(false);
    } else {
      Alert.alert(
        'Success',
        'Your payment is confirmed!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={styles.container}>
      {/* Order Summary Card */}
      <View style={styles.summaryContainer}>
        <Text style={styles.title}>Order Summary</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Item</Text>
          <Text style={styles.value}>Premium Subscription</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.amount}>${(orderAmount / 100).toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Button */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Preparing payment...</Text>
        </View>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.payButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handlePayment}
          disabled={!paymentReady}
        >
          <Text style={styles.payButtonText}>Pay ${(orderAmount / 100).toFixed(2)}</Text>
        </Pressable>
      )}

      {/* Security Note */}
      <Text style={styles.securityNote}>🔒 Secure payment powered by Stripe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // THEME COLOR: Background (light gray)
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  // THEME COLOR: Card background (white)
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // THEME COLOR: Primary text (black)
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  // THEME COLOR: Secondary text (gray)
  label: {
    fontSize: 16,
    color: '#666666',
  },
  // THEME COLOR: Primary text (black)
  value: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  // THEME COLOR: Accent/Primary (blue)
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  // THEME COLOR: Border color (light gray)
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  // THEME COLOR: Primary button background (blue)
  payButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // THEME COLOR: Button text (white)
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  // THEME COLOR: Secondary text (gray)
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  // THEME COLOR: Muted text (light gray)
  securityNote: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#999999',
  },
});