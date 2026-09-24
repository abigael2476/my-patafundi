import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../src/constants/theme';
import { Header } from '../src/components/common/Header';

export default function AboutScreen() {
  const highlights = [
    {
      icon: 'shield-checkmark-outline' as const,
      title: '100% Vetted Fundis',
      desc: 'All artisans undergo identity verification, skill testing, and police background clearance.',
    },
    {
      icon: 'flash-outline' as const,
      title: 'Rapid Dispatch',
      desc: 'Connect with available fundis in your immediate neighborhood within 20 minutes.',
    },
    {
      icon: 'wallet-outline' as const,
      title: 'Transparent Pricing',
      desc: 'Clear upfront pricing estimates with secure M-Pesa and card payment options.',
    },
    {
      icon: 'ribbon-outline' as const,
      title: 'Satisfaction Guarantee',
      desc: 'Our customer support team guarantees re-service if job standards are not met.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="About PataFundi" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Brand Banner */}
        <View style={styles.brandCard}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="wrench-outline" size={32} color={COLORS.accent} />
          </View>
          <Text style={styles.brandName}>Pata<Text style={{ color: COLORS.accent }}>Fundi</Text></Text>
          <Text style={styles.tagline}>Empowering local artisans & connecting homes across Kenya.</Text>
        </View>

        {/* Story */}
        <Text style={styles.sectionHeaderTitle}>Our Mission</Text>
        <View style={styles.cardGroup}>
          <Text style={styles.bodyText}>
            PataFundi is a mobile-first platform built to revolutionize how households and businesses hire trusted, skilled local artisans (Fundis). From emergency pipe bursts and electrical rewiring to custom carpentry and home cleaning, PataFundi guarantees safety, quality, and speed.
          </Text>
        </View>

        {/* Highlights */}
        <Text style={styles.sectionHeaderTitle}>Why Choose PataFundi</Text>
        {highlights.map((h, i) => (
          <View key={i} style={styles.highlightCard}>
            <View style={styles.highlightIconBox}>
              <Ionicons name={h.icon} size={22} color={COLORS.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.highlightTitle}>{h.title}</Text>
              <Text style={styles.highlightDesc}>{h.desc}</Text>
            </View>
          </View>
        ))}

        {/* Tech Stack Info */}
        <Text style={styles.sectionHeaderTitle}>App Specs</Text>
        <View style={styles.cardGroup}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Framework</Text>
            <Text style={styles.specVal}>React Native 0.81 & Expo SDK 54</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Router</Text>
            <Text style={styles.specVal}>Expo Router 6.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Type Safety</Text>
            <Text style={styles.specVal}>TypeScript Strict</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  brandCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 122, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textWhite,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  cardGroup: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  bodyText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  highlightIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  highlightDesc: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  specLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  specVal: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
  },
});
