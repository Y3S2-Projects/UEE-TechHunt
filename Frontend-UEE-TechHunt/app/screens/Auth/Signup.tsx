import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';

type SignupScreenNavProp = StackNavigationProp<OnboardingStackParamList, 'Signup'>;

type Props = {
  navigation: SignupScreenNavProp;
};

export default function Signup({ navigation }: Props) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // TODO: Replace with your actual API call
      // const response = await fetch('YOUR_API_URL/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.fullName,
      //     email: formData.email,
      //     password: formData.password,
      //   }),
      // });
      // const data = await response.json();

      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        
        // Store user data (use AsyncStorage or your state management)
        // AsyncStorage.setItem('user', JSON.stringify(userData));
        
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('ProfileDashboard', {
                user: {
                  name: formData.fullName,
                  email: formData.email,
                },
              });
            },
          },
        ]);
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A1F2F' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: 60, paddingHorizontal: 24, marginBottom: 32 }}>
          <Text style={{ color: '#00FFC2', fontSize: 40, fontWeight: 'bold', marginBottom: 8 }}>
            Create Account
          </Text>
          <Text style={{ color: '#E5E5E5', fontSize: 16, opacity: 0.8 }}>
            Join us and start your learning journey
          </Text>
        </View>

        {/* Form Card */}
        <View style={{ backgroundColor: '#E5E5E5', marginHorizontal: 24, borderRadius: 24, padding: 24 }}>
          {/* Full Name Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#0A1F2F', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
              Full Name
            </Text>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: '#3A7D99',
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 12 }}>👤</Text>
              <TextInput
                style={{ flex: 1, paddingVertical: 14, color: '#0A1F2F', fontSize: 16 }}
                placeholder="John Doe"
                placeholderTextColor="#3A7D99"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#0A1F2F', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
              Email Address
            </Text>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: '#3A7D99',
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 12 }}>📧</Text>
              <TextInput
                style={{ flex: 1, paddingVertical: 14, color: '#0A1F2F', fontSize: 16 }}
                placeholder="john@example.com"
                placeholderTextColor="#3A7D99"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#0A1F2F', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
              Password
            </Text>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: '#3A7D99',
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 12 }}>🔒</Text>
              <TextInput
                style={{ flex: 1, paddingVertical: 14, color: '#0A1F2F', fontSize: 16 }}
                placeholder="••••••••"
                placeholderTextColor="#3A7D99"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ fontSize: 20 }}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#0A1F2F', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
              Confirm Password
            </Text>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: '#3A7D99',
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 12 }}>🔒</Text>
              <TextInput
                style={{ flex: 1, paddingVertical: 14, color: '#0A1F2F', fontSize: 16 }}
                placeholder="••••••••"
                placeholderTextColor="#3A7D99"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Text style={{ fontSize: 20 }}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            style={{
              backgroundColor: '#00FFC2',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 16,
            }}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#0A1F2F" />
            ) : (
              <Text style={{ color: '#0A1F2F', fontSize: 18, fontWeight: 'bold' }}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={{ color: '#3A7D99', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>

        {/* Login Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ color: '#E5E5E5', fontSize: 14 }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#00FFC2', fontSize: 14, fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}