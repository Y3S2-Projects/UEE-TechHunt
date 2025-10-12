import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';

type ProfileDashboardNavProp = StackNavigationProp<
  OnboardingStackParamList,
  'ProfileDashboard'
>;
type ProfileDashboardRouteProp = RouteProp<
  OnboardingStackParamList,
  'ProfileDashboard'
>;

type Props = {
  navigation: ProfileDashboardNavProp;
  route: ProfileDashboardRouteProp;
};

export default function ProfileDashboard({ navigation, route }: Props) {
  const user = route?.params?.user || { name: 'User', email: 'user@example.com' };

  const handleProfilePress = () => {
    navigation.navigate('Account', { user });
  };

  const stats = [
    { icon: '📚', label: 'Courses', value: '12', color: '#00FFC2' },
    { icon: '⏱️', label: 'Hours', value: '48', color: '#3A7D99' },
    { icon: '🏆', label: 'Completed', value: '5', color: '#00FFAB' },
    { icon: '🎯', label: 'Goals', value: '3/5', color: '#FF6B6B' },
  ];

  const quickActions = [
    { icon: '📖', title: 'Courses Section', screen: 'Courses' as const, color: '#00FFC2' },
    { icon: '💼', title: 'Job Market', screen: 'JobList' as const, color: '#3A7D99' },
    { icon: '⭐', title: 'Freelancer', screen: 'FreelancerDashboard' as const, color: '#00FFAB' },
    { icon: '🤖', title: 'Skillbot', screen: 'ChatBot' as const, color: '#FF6B6B' },
  ];

  const recentActivity = [
    { title: 'Completed React Basics', time: '2 hours ago', icon: '✅' },
    { title: 'Started Node.js Course', time: '1 day ago', icon: '🚀' },
    { title: 'Earned JavaScript Badge', time: '3 days ago', icon: '🏅' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#0A1F2F' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ paddingTop: 60, paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#E5E5E5', fontSize: 16, opacity: 0.8, marginBottom: 4 }}>
                Welcome back,
              </Text>
              <Text style={{ color: '#00FFC2', fontSize: 28, fontWeight: 'bold' }}>
                {user.name.split(' ')[0]} 👋
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleProfilePress}
              style={{
                backgroundColor: '#00FFC2',
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 28 }}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {stats.map((stat, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#E5E5E5',
                  borderRadius: 16,
                  padding: 16,
                  width: '48%',
                  borderLeftWidth: 4,
                  borderLeftColor: stat.color,
                }}
              >
                <Text style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</Text>
                <Text style={{ color: '#0A1F2F', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
                  {stat.value}
                </Text>
                <Text style={{ color: '#3A7D99', fontSize: 14 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ color: '#E5E5E5', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Quick Actions
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(action.screen)}
                style={{
                  backgroundColor: action.color + '20',
                  borderRadius: 16,
                  padding: 20,
                  width: '48%',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: action.color,
                }}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 40, marginBottom: 8 }}>{action.icon}</Text>
                <Text
                  style={{
                    color: '#E5E5E5',
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ color: '#E5E5E5', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Recent Activity
          </Text>
          <View style={{ backgroundColor: '#E5E5E5', borderRadius: 16, padding: 16 }}>
            {recentActivity.map((activity, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: index < recentActivity.length - 1 ? 1 : 0,
                  borderBottomColor: '#3A7D9930',
                }}
              >
                <View
                  style={{
                    backgroundColor: '#00FFC230',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{activity.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#0A1F2F',
                      fontSize: 14,
                      fontWeight: '600',
                      marginBottom: 2,
                    }}
                  >
                    {activity.title}
                  </Text>
                  <Text style={{ color: '#3A7D99', fontSize: 12 }}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Learning Progress */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ color: '#E5E5E5', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Learning Progress
          </Text>
          <View style={{ backgroundColor: '#E5E5E5', borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: '#0A1F2F', fontSize: 16, fontWeight: '600' }}>
                Overall Progress
              </Text>
              <Text style={{ color: '#00FFC2', fontSize: 16, fontWeight: 'bold' }}>68%</Text>
            </View>
            <View
              style={{
                backgroundColor: '#3A7D9930',
                height: 12,
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  backgroundColor: '#00FFC2',
                  width: '68%',
                  height: '100%',
                  borderRadius: 6,
                }}
              />
            </View>
            <Text style={{ color: '#3A7D99', fontSize: 12, marginTop: 8 }}>
              Keep going! You're doing great 🎉
            </Text>
          </View>
        </View>

        {/* Continue Learning CTA */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Courses')}
            style={{
              backgroundColor: '#00FFC2',
              borderRadius: 16,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#0A1F2F',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 4,
                }}
              >
                Continue Learning
              </Text>
              <Text style={{ color: '#0A1F2F', fontSize: 14, opacity: 0.8 }}>
                Pick up where you left off
              </Text>
            </View>
            <Text style={{ fontSize: 32 }}>🚀</Text>
          </TouchableOpacity>
        </View>

        {/* Achievements Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ color: '#E5E5E5', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Recent Achievements
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {[
                { emoji: '🥇', title: 'First Course', color: '#FFD700' },
                { emoji: '🔥', title: '7 Day Streak', color: '#FF6B6B' },
                { emoji: '⭐', title: 'Top Learner', color: '#00FFAB' },
                { emoji: '💪', title: 'Quiz Master', color: '#3A7D99' },
              ].map((achievement, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: achievement.color + '30',
                    borderRadius: 12,
                    padding: 16,
                    alignItems: 'center',
                    width: 100,
                    borderWidth: 2,
                    borderColor: achievement.color,
                  }}
                >
                  <Text style={{ fontSize: 40, marginBottom: 8 }}>{achievement.emoji}</Text>
                  <Text
                    style={{
                      color: '#E5E5E5',
                      fontSize: 12,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    {achievement.title}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}