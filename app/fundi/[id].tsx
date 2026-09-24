import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { MOCK_FUNDIS } from '../../src/data/mockData';
import { Header } from '../../src/components/common/Header';
import { Badge } from '../../src/components/common/Badge';
import { RatingStars } from '../../src/components/common/RatingStars';
import { Button } from '../../src/components/common/Button';
import { useApp } from '../../src/context/AppContext';

export default function FundiDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSaved, toggleSaveFundi } = useApp();

  const fundi = MOCK_FUNDIS.find((f) => f.id === id) || MOCK_FUNDIS[0];
  const saved = isSaved(fundi.id);

  const handleCall = () => {
    Linking.openURL(`tel:${fundi.phone}`).catch(() => {
      Alert.alert('Phone Call', `Dialing ${fundi.phone}`);
    });
  };

  const handleChat = () => {
    router.push(`/chat/${fundi.id}` as any);
  };

  const handleBookNow = () => {
    router.push(`/booking/${fundi.id}` as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover Image & Hero Avatar Header */}
        <View style={styles.heroBanner}>
          <Image
            source={{
              uri: fundi.coverImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fundi.name) + '&background=081E45&color=FF7A00&bold=true',
            }}
            style={styles.coverImage}
          />
          <View style={styles.headerOverlay}>
            <SafeAreaView style={styles.navBar}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => toggleSaveFundi(fundi.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={saved ? COLORS.accent : COLORS.primary}
                />
              </TouchableOpacity>
            </SafeAreaView>
          </View>

          <View style={styles.avatarWrap}>
            <Image source={{ uri: fundi.avatar }} style={styles.avatarImage} />
            {fundi.isAvailable && <View style={styles.onlineBadge} />}
          </View>
        </View>

        {/* Profile Details Container */}
        <View style={styles.detailsBody}>
          <View style={styles.nameRow}>
            <Text style={styles.fundiName}>{fundi.name}</Text>
            {fundi.isVerified && <Badge label="Verified" variant="verified" size="sm" />}
          </View>

          <Text style={styles.categorySub}>{fundi.category} Master Specialist</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={COLORS.accent} />
            <Text style={styles.locationText}>{fundi.locationName} ({fundi.distanceKm} km away)</Text>
          </View>

          {/* Stats Bar Grid */}
          <View style={styles.statsBar}>
            <View style={styles.statBox}>
              <RatingStars rating={fundi.rating} size={16} showText={false} />
              <Text style={styles.statValue}>{fundi.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>{fundi.reviewCount} Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="briefcase" size={18} color={COLORS.primary} />
              <Text style={styles.statValue}>{fundi.experienceYears}+ Yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="checkmark-done-circle" size={18} color={COLORS.success} />
              <Text style={styles.statValue}>{fundi.completedJobs}+</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          {/* Bio Section */}
          <Text style={styles.sectionHeaderTitle}>About {fundi.name}</Text>
          <Text style={styles.bioText}>{fundi.bio}</Text>

          {/* Skills Section */}
          <Text style={styles.sectionHeaderTitle}>Specialized Skills</Text>
          <View style={styles.skillsWrapper}>
            {fundi.skills.map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.accent} style={{ marginRight: 4 }} />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          {/* Portfolio Showcase */}
          {fundi.portfolio && fundi.portfolio.length > 0 && (
            <>
              <Text style={styles.sectionHeaderTitle}>Past Projects & Work</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portfolioScroll}>
                {fundi.portfolio.map((item) => (
                  <View key={item.id} style={styles.portfolioCard}>
                    <Image source={{ uri: item.imageUrl }} style={styles.portfolioImage} />
                    <Text style={styles.portfolioTitle} numberOfLines={1}>{item.title}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* Customer Reviews */}
          <Text style={styles.sectionHeaderTitle}>Customer Reviews ({fundi.reviews.length})</Text>
          {fundi.reviews.map((rev) => (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: rev.userAvatar }} style={styles.reviewAvatar} />
                <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                  <Text style={styles.reviewerName}>{rev.userName}</Text>
                  <Text style={styles.reviewDate}>{rev.date}</Text>
                </View>
                <RatingStars rating={rev.rating} size={12} />
              </View>
              <Text style={styles.reviewComment}>{rev.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Action CTA Bar */}
      <View style={styles.bottomCtaBar}>
        <View style={styles.rateBox}>
          <Text style={styles.rateLabel}>Pre-Inspection Fee</Text>
          <Text style={styles.rateValue}>KSh 500</Text>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.callIconBtn} onPress={handleCall} activeOpacity={0.8}>
            <Ionicons name="call" size={20} color={COLORS.textWhite} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatIconBtn} onPress={handleChat} activeOpacity={0.8}>
            <Ionicons name="chatbubbles" size={20} color={COLORS.textWhite} />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: SPACING.xs }}>
            <Button
              title="Book Now"
              onPress={handleBookNow}
              variant="accent"
              size="md"
              icon="calendar"
            />
          </View>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroBanner: {
    height: 220,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  avatarWrap: {
    position: 'absolute',
    bottom: -36,
    left: SPACING.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    borderWidth: 4,
    borderColor: COLORS.card,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  detailsBody: {
    paddingTop: 45,
    paddingHorizontal: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fundiName: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  categorySub: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginVertical: SPACING.md,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  sectionHeaderTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  bioText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  skillText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.accentDark,
  },
  portfolioScroll: {
    marginVertical: SPACING.xs,
  },
  portfolioCard: {
    width: 160,
    marginRight: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  portfolioImage: {
    width: '100%',
    height: 110,
  },
  portfolioTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    color: COLORS.textPrimary,
    padding: SPACING.xs,
  },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
  },
  reviewerName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewDate: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  reviewComment: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  bottomCtaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    ...SHADOWS.large,
  },
  rateBox: {
    marginBottom: SPACING.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  rateValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '900',
    color: COLORS.primary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIconBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  chatIconBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  waIconBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
});

