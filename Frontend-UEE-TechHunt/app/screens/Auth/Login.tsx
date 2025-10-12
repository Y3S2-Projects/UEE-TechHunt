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

type LoginScreenNavProp = StackNavigationProp<OnboardingStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavProp;
};

export default function Login({ navigation }: Props) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // TODO: Replace with your actual API call
      // const response = await fetch('YOUR_API_URL/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
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
        // AsyncStorage.setItem('token', data.token);

        navigation.navigate('ProfileDashboard', {
          user: {
            name: 'John Doe',
            email: formData.email,
          },
        });
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A1F2F' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: 80, paddingHorizontal: 24, marginBottom: 48 }}>
          <Text style={{ color: '#00FFC2', fontSize: 40, fontWeight: 'bold', marginBottom: 8 }}>
            Welcome Back
          </Text>
          <Text style={{ color: '#E5E5E5', fontSize: 16, opacity: 0.8 }}>
            Login to continue your learning journey
          </Text>
        </View>

        {/* Illustration */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View
            style={{
              backgroundColor: '#00FFC2',
              width: 120,
              height: 120,
              borderRadius: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 60 }}>🎓</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={{ backgroundColor: '#E5E5E5', marginHorizontal: 24, borderRadius: 24, padding: 24 }}>
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
          <View style={{ marginBottom: 12 }}>
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

          {/* Forgot Password */}
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginBottom: 24 }}
            onPress={() => Alert.alert('Forgot Password', 'Password reset link will be sent to your email')}
          >
            <Text style={{ color: '#3A7D99', fontSize: 14, fontWeight: '600' }}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
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
              <Text style={{ color: '#0A1F2F', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#3A7D99' }} />
            <Text style={{ color: '#3A7D99', paddingHorizontal: 12, fontSize: 14 }}>OR</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#3A7D99' }} />
          </View>

          {/* Social Login Buttons */}
          <TouchableOpacity
            onPress={() => handleSocialLogin('Google')}
            style={{
              backgroundColor: '#FFFFFF',
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#3A7D99',
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 24, marginRight: 12 }}>🔵</Text>
            <Text style={{ color: '#0A1F2F', fontSize: 16, fontWeight: '600' }}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocialLogin('Facebook')}
            style={{
              backgroundColor: '#FFFFFF',
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#3A7D99',
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 24, marginRight: 12 }}>📘</Text>
            <Text style={{ color: '#0A1F2F', fontSize: 16, fontWeight: '600' }}>
              Continue with Facebook
            </Text>
          </TouchableOpacity>
        </View>

        {/* Signup Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ color: '#E5E5E5', fontSize: 14 }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: '#00FFC2', fontSize: 14, fontWeight: 'bold' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}