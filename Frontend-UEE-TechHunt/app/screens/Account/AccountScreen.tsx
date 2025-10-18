import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useRouter } from 'expo-router';

type AccountScreenNavProp = StackNavigationProp<
  OnboardingStackParamList,
  'Account'
>;
type AccountScreenRouteProp = RouteProp<OnboardingStackParamList, 'Account'>;

type Props = {
  navigation: AccountScreenNavProp;
  route: AccountScreenRouteProp;
};

export default function AccountScreen({ navigation, route }: Props) {
  const router = useRouter();
  const user = route?.params?.user || { name: 'User', email: 'user@example.com' };
  const [isPremium, setIsPremium] = useState(false); // Check from backend/storage
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleUpgradeToPremium = () => {
    try {
      router.push('/payment/checkout');
    } catch (error) {
      console.log('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate to payment gateway');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Clear AsyncStorage
            // AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ]
    );
  };

  const accountOptions = [
    {
      section: 'Account',
      items: [
        { icon: '👤', title: 'Edit Profile', action: () => console.log('Edit Profile') },
        { icon: '📧', title: 'Email', subtitle: user.email, action: null },
        { icon: '🔒', title: 'Change Password', action: () => console.log('Change Password') },
        { icon: '🔔', title: 'Notifications', action: null, toggle: true, value: notifications, onToggle: setNotifications },
      ],
    },
    {
      section: 'Preferences',
      items: [
        { icon: '🌙', title: 'Dark Mode', action: null, toggle: true, value: darkMode, onToggle: setDarkMode },
        { icon: '🌐', title: 'Language', subtitle: 'English', action: () => console.log('Language') },
        { icon: '💾', title: 'Download Quality', subtitle: 'High', action: () => console.log('Download Quality') },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: '❓', title: 'Help Center', action: () => console.log('Help Center') },
        { icon: '📝', title: 'Terms & Conditions', action: () => console.log('Terms') },
        { icon: '🔐', title: 'Privacy Policy', action: () => console.log('Privacy') },
        { icon: '⭐', title: 'Rate Us', action: () => console.log('Rate Us') },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#0A1F2F' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: 60, paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#3A7D9930',
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <Text style={{ fontSize: 20 }}>←</Text>
            </TouchableOpacity>
            <Text style={{ color: '#E5E5E5', fontSize: 24, fontWeight: 'bold', flex: 1 }}>
              Account Settings
            </Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ backgroundColor: '#E5E5E5', borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  backgroundColor: '#00FFC2',
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <Text style={{ fontSize: 36 }}>👤</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#0A1F2F', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
                  {user.name}
                </Text>
                <Text style={{ color: '#3A7D99', fontSize: 14 }}>{user.email}</Text>
              </View>
            </View>

            {/* Premium Badge or Upgrade Button */}
            {isPremium ? (
              <View
                style={{
                  backgroundColor: '#FFD70030',
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#FFD700',
                }}
              >
                <Text style={{ fontSize: 24, marginRight: 12 }}>👑</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#0A1F2F', fontSize: 14, fontWeight: 'bold' }}>
                    Premium Member
                  </Text>
                  <Text style={{ color: '#3A7D99', fontSize: 12 }}>Enjoying all benefits</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleUpgradeToPremium}
                style={{
                  backgroundColor: '#00FFC2',
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 20, marginRight: 8 }}>⚡</Text>
                    <Text style={{ color: '#0A1F2F', fontSize: 16, fontWeight: 'bold' }}>
                      Upgrade to Premium
                    </Text>
                  </View>
                  <Text style={{ color: '#0A1F2F', fontSize: 12, opacity: 0.8 }}>
                    Unlock exclusive features and content
                  </Text>
                </View>
                <Text style={{ fontSize: 24 }}>→</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Premium Benefits (if not premium) */}
        {!isPremium && (
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <View style={{ backgroundColor: '#3A7D9920', borderRadius: 16, padding: 20 }}>
              <Text style={{ color: '#E5E5E5', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                Premium Benefits
              </Text>
              {[
                { icon: '🚀', text: 'Access to all premium courses' },
                { icon: '📥', text: 'Download courses for offline learning' },
                { icon: '🎯', text: 'Personalized career guidance' },
                { icon: '💬', text: 'Priority support from instructors' },
                { icon: '🏆', text: 'Exclusive certifications' },
                { icon: '🎁', text: 'Early access to new features' },
              ].map((benefit, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 20, marginRight: 12 }}>{benefit.icon}</Text>
                  <Text style={{ color: '#E5E5E5', fontSize: 14 }}>{benefit.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settings Sections */}
        {accountOptions.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <Text
              style={{
                color: '#E5E5E5',
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 12,
                opacity: 0.6,
              }}
            >
              {section.section}
            </Text>
            <View style={{ backgroundColor: '#E5E5E5', borderRadius: 16, overflow: 'hidden' }}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  onPress={item.action || undefined}
                  disabled={!item.action && !item.toggle}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: '#3A7D9920',
                  }}
                  activeOpacity={item.action || item.toggle ? 0.7 : 1}
                >
                  <Text style={{ fontSize: 24, marginRight: 16 }}>{item.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#0A1F2F', fontSize: 16, fontWeight: '600' }}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text style={{ color: '#3A7D99', fontSize: 14, marginTop: 2 }}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#3A7D99', true: '#00FFC2' }}
                      thumbColor="#FFFFFF"
                    />
                  ) : (
                    item.action && <Text style={{ color: '#3A7D99', fontSize: 20 }}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ backgroundColor: '#E5E5E5', borderRadius: 16, padding: 16 }}>
            <Text style={{ color: '#0A1F2F', fontSize: 14, textAlign: 'center', marginBottom: 4 }}>
              TechHunt v1.0.0
            </Text>
            <Text style={{ color: '#3A7D99', fontSize: 12, textAlign: 'center' }}>
              Made with ❤️ for learners
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 24, marginBottom: 40 }}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: '#FF6B6B30',
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: '#FF6B6B',
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#FF6B6B', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
              🚪 Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}