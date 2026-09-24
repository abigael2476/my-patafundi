import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

const TRADE_CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing', icon: 'water-outline' },
  { id: 'electrical', name: 'Electrical', icon: 'flash-outline' },
  { id: 'carpentry', name: 'Carpentry', icon: 'hammer-outline' },
  { id: 'painting', name: 'Painting', icon: 'color-palette-outline' },
  { id: 'cleaning', name: 'Cleaning', icon: 'sparkles-outline' },
  { id: 'masonry', name: 'Masonry', icon: 'construct-outline' },
  { id: 'welding', name: 'Welding', icon: 'flame-outline' },
  { id: 'mechanics', name: 'Mechanics', icon: 'car-sport-outline' },
  { id: 'appliance_repair', name: 'Appliance Repair', icon: 'hardware-chip-outline' },
];

export default function SignupScreen() {
  const { signup } = useAuth();
  const [role, setRole] = useState<UserRole>('client');

  // Basic Account Credentials
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Serious Fundi Professional Profile Fields
  const [selectedCategory, setSelectedCategory] = useState(TRADE_CATEGORIES[0]);
  const [experienceYears, setExperienceYears] = useState('5');
  const [hourlyRate, setHourlyRate] = useState('1500');
  const [estimatedPrice, setEstimatedPrice] = useState('2500');
  const [nationalId, setNationalId] = useState('');
  const [locationName, setLocationName] = useState('Westlands, Nairobi');
  const [bio, setBio] = useState('');
  const [skillsText, setSkillsText] = useState('Leak Detection, Pipe Repairs, Solar Heating');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all required account credentials.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'fundi') {
      if (!nationalId.trim()) {
        setError('National ID / Passport Number is required for Fundi verification.');
        return;
      }
      if (!bio.trim()) {
        setError('Please write a brief summary of your professional experience.');
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      const fundiData = role === 'fundi' ? {
        category: selectedCategory.name,
        categoryId: selectedCategory.id,
        experienceYears: parseInt(experienceYears) || 3,
        hourlyRate: parseInt(hourlyRate) || 1500,
        estimatedPrice: parseInt(estimatedPrice) || 2500,
        nationalId: nationalId.trim(),
        locationName: locationName.trim(),
        bio: bio.trim(),
        skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      } : undefined;

      await signup(fullName, email, phone, password, role, fundiData);
      router.replace('/(tabs)' as any);
    } catch (e: any) {
      setError(e.message || 'Failed to create account. Please try again.');
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
              <Ionicons name="person-add" size={26} color={COLORS.accent} />
            </View>
            <Text style={styles.title}>Join PataFundi</Text>
            <Text style={styles.subtitle}>
              Create your account to start hiring artisans or managing jobs.
            </Text>
          </View>

          {/* Account Type Selector */}
          <View style={styles.roleCardGroup}>
            <TouchableOpacity
              style={[styles.roleCard, role === 'client' && styles.activeRoleCard]}
              onPress={() => setRole('client')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={role === 'client' ? COLORS.accent : COLORS.textMuted}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.roleCardTitle, role === 'client' && styles.activeRoleCardTitle]}>
                  I want to Hire (Client)
                </Text>
                <Text style={styles.roleCardSub}>Book verified local fundis & artisans</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, role === 'fundi' && styles.activeRoleCard]}
              onPress={() => setRole('fundi')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="hammer-outline"
                size={22}
                color={role === 'fundi' ? COLORS.accent : COLORS.textMuted}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.roleCardTitle, role === 'fundi' && styles.activeRoleCardTitle]}>
                  I am a Fundi (Artisan)
                </Text>
                <Text style={styles.roleCardSub}>Get client job bookings & earn money</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {error ? <Text style={styles.errorAlert}>{error}</Text> : null}

            <Text style={styles.sectionHeader}>Personal & Login Credentials</Text>

            <Input
              label="Full Name"
              placeholder="Alex Kariuki"
              icon="person-outline"
              value={fullName}
              onChangeText={setFullName}
            />

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
              label="Phone Number"
              placeholder="+254 712 345 678"
              icon="call-outline"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Input
              label="Password"
              placeholder="••••••••"
              icon="key-outline"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            <Input
              label="Confirm Password"
              placeholder="••••••••"
              icon="checkmark-circle-outline"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {/* FUNDI PROFESSIONAL DETAILS SECTION */}
            {role === 'fundi' ? (
              <View style={styles.fundiSection}>
                <View style={styles.divider} />
                <View style={styles.fundiHeaderRow}>
                  <Ionicons name="shield-checkmark" size={20} color={COLORS.accent} />
                  <Text style={styles.fundiSectionTitle}>Fundi Professional Verification & Profile</Text>
                </View>
                <Text style={styles.fundiSectionSub}>
                  Fill in your trade, background, and rate details to receive verified client bookings.
                </Text>

                {/* Trade Category Selector */}
                <Text style={styles.label}>Select Primary Trade Specialty</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPickerRow}>
                  {TRADE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryChip, isSelected && styles.selectedCategoryChip]}
                        onPress={() => setSelectedCategory(cat)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={cat.icon as any}
                          size={16}
                          color={isSelected ? COLORS.textWhite : COLORS.textSecondary}
                        />
                        <Text style={[styles.categoryChipText, isSelected && styles.selectedCategoryChipText]}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={styles.rowTwoCols}>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Years Experience"
                      placeholder="e.g. 5"
                      icon="time-outline"
                      value={experienceYears}
                      onChangeText={setExperienceYears}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                    <Input
                      label="Hourly Rate (KSh)"
                      placeholder="e.g. 1500"
                      icon="cash-outline"
                      value={hourlyRate}
                      onChangeText={setHourlyRate}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Input
                  label="National ID / Passport Number"
                  placeholder="e.g. 34567890 (For Verification)"
                  icon="card-outline"
                  value={nationalId}
                  onChangeText={setNationalId}
                  keyboardType="numeric"
                />

                <Input
                  label="Operational Location / Base Town"
                  placeholder="e.g. Westlands, Nairobi"
                  icon="location-outline"
                  value={locationName}
                  onChangeText={setLocationName}
                />

                <Input
                  label="Professional Bio / Experience Summary"
                  placeholder="e.g. Certified master plumber with 8+ years experience in domestic & commercial repairs..."
                  icon="document-text-outline"
                  value={bio}
                  onChangeText={setBio}
                />

                <Input
                  label="Specialized Skills (Comma-Separated)"
                  placeholder="e.g. Solar Heaters, Leak Fixes, Drainage"
                  icon="build-outline"
                  value={skillsText}
                  onChangeText={setSkillsText}
                />
              </View>
            ) : null}

            <Button
              title={`Register as ${role === 'fundi' ? 'Verified Fundi Professional' : 'Client'}`}
              onPress={handleRegister}
              variant="accent"
              size="lg"
              loading={loading}
              style={{ marginTop: SPACING.md }}
            />
          </View>

          {/* Footer Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={styles.loginLink}>Log In</Text>
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
    paddingBottom: SPACING.xxl,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconCircle: {
    width: 52,
    height: 52,
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
  },
  roleCardGroup: {
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    gap: SPACING.sm,
  },
  activeRoleCard: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(255, 122, 0, 0.05)',
  },
  roleCardTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  activeRoleCardTitle: {
    color: COLORS.accent,
  },
  roleCardSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  sectionHeader: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
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
  fundiSection: {
    marginTop: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  fundiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  fundiSectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  fundiSectionSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  categoryPickerRow: {
    marginBottom: SPACING.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginRight: SPACING.xs,
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  selectedCategoryChipText: {
    color: COLORS.textWhite,
  },
  rowTwoCols: {
    flexDirection: 'row',
    alignItems: 'center',
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
  loginLink: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
  },
});
