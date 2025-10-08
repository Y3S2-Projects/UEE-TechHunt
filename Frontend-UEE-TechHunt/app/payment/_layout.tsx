// app/payment/_layout.tsx
import { useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { Stack } from 'expo-router';
import Constants from 'expo-constants';

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Deep link handler component
function DeepLinkHandler({ children }: { children: React.ReactNode }) {
  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          console.log('Stripe URL handled');
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

  return <>{children}</>;
}

export default function PaymentLayout() {
  return (
    <StripeProvider
      publishableKey={PUBLISHABLE_KEY}
      merchantIdentifier="merchant.identifier" // Required for Apple Pay
      urlScheme="techhunt" //  app's URL scheme
    >
      <DeepLinkHandler>
        <Stack
          screenOptions={{
            headerShown: true,
            headerTitle: 'Payment',
          }}
        />
      </DeepLinkHandler>
    </StripeProvider>
  );
}