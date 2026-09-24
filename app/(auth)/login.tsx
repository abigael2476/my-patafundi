import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { Header } from '../../src/components/common/Header';
import { useAuth } from '../../src/context/AuthContext';
import { UserRole } from '../../src/types';

export default function LoginScreen() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  const [email, setEmail] = useState('alex.kariuki@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    if (role === 'client') {
      setEmail('alex.kariuki@example.com');
    } else if (role === 'fundi') {
      setEmail('john.mboya@patafundi.com');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login(email, password, selectedRole);
      router.replace('/(tabs)' as any);
    } catch (e: any) {
      setError(e.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showBack title="" transparent />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title */}
          <View style={styles.headerBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed" size={28} color={COLORS.accent} />
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to your PataFundi account to continue.
            </Text>
          </View>

          {/* Role Selection Tabs */}
          <View style={styles.roleTabsContainer}>
            <TouchableOpacity
              style={[styles.roleTab, selectedRole === 'client' && styles.activeRoleTab]}
              onPress={() => handleRoleSelect('client')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person"
                size={16}
                color={selectedRole === 'client' ? COLORS.textWhite : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'client' && styles.activeRoleTabText,
                ]}
              >
                Client
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, selectedRole === 'fundi' && styles.activeRoleTab]}
              onPress={() => handleRoleSelect('fundi')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="hammer"
                size={16}
                color={selectedRole === 'fundi' ? COLORS.textWhite : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'fundi' && styles.activeRoleTabText,
                ]}
              >
                Fundi Pro
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {error ? <Text style={styles.errorAlert}>{error}</Text> : null}

            <Input
              label="Email Address"
              placeholder="name@example.com"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="••••••••"
              icon="key-outline"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => Alert.alert('Reset Password', 'Instructions sent to your email.')}
              style={styles.forgotBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title={`Log In as ${selectedRole.toUpperCase()}`}
              onPress={handleLogin}
              variant="primary"
              size="lg"
              loading={loading}
              style={{ marginTop: SPACING.xs }}
            />
          </View>

          {/* Quick Demo Pre-fill Pills */}
          <View style={styles.demoPillsBox}>
            <Text style={styles.demoPillsTitle}>QUICK DEMO ACCOUNTS:</Text>
            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={styles.demoPill}
                onPress={() => handleRoleSelect('client')}
              >
                <Text style={styles.demoPillText}>Client Account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoPill}
                onPress={() => handleRoleSelect('fundi')}
              >
                <Text style={styles.demoPillText}>Fundi Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerBox: {
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
    ...SHADOWS.small,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: SPACING.md,
  },
  roleTabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  activeRoleTab: {
    backgroundColor: COLORS.primary,
  },
  roleTabText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  activeRoleTabText: {
    color: COLORS.textWhite,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  errorAlert: {
    backgroundColor: COLORS.dangerLight,
    color: COLORS.danger,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.sm,
  },
  forgotText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.accent,
    fontWeight: '700',
  },
  demoPillsBox: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  demoPillsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  demoPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  signupLink: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
  },
});
