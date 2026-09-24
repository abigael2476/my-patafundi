import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fundi } from '../../types';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { RatingStars } from '../common/RatingStars';
import { useApp } from '../../context/AppContext';

interface FundiCardProps {
  fundi: Fundi;
  onPress: () => void;
  onBookPress?: () => void;
  variant?: 'vertical' | 'horizontal';
}

export const FundiCard: React.FC<FundiCardProps> = ({
  fundi,
  onPress,
  onBookPress,
  variant = 'vertical',
}) => {
  const { isSaved, toggleSaveFundi } = useApp();
  const saved = isSaved(fundi.id);

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: fundi.avatar }} style={styles.horizontalAvatar} />
          {fundi.isAvailable && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.horizontalDetails}>
          <View style={styles.rowBetween}>
            <Text style={styles.fundiName} numberOfLines={1}>
              {fundi.name}
            </Text>
            <TouchableOpacity
              onPress={() => toggleSaveFundi(fundi.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={saved ? COLORS.accent : COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.categoryText}>{fundi.category}</Text>

          <View style={styles.metaRow}>
            <RatingStars rating={fundi.rating} reviewCount={fundi.reviewCount} size={12} />
            <Text style={styles.dotSeparator}>•</Text>
            <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{fundi.distanceKm} km</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>
              Pre-Inspection: KSh 500
            </Text>
            {fundi.isVerified && (
              <Badge label="Verified" variant="verified" size="sm" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.verticalCard}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Top Banner or Cover image with Avatar overlay */}
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: fundi.coverImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fundi.name) + '&background=081E45&color=FF7A00&bold=true',
          }}
          style={styles.coverImage}
        />
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => toggleSaveFundi(fundi.id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={saved ? COLORS.accent : COLORS.textWhite}
          />
        </TouchableOpacity>

        <View style={styles.avatarOverlay}>
          <Image source={{ uri: fundi.avatar }} style={styles.verticalAvatar} />
          {fundi.isAvailable && <View style={styles.onlineDotBordered} />}
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.fundiName} numberOfLines={1}>
            {fundi.name}
          </Text>
          {fundi.isVerified && (
            <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} style={{ marginLeft: 4 }} />
          )}
        </View>

        <Text style={styles.categoryText}>{fundi.category} Expert</Text>

        <View style={styles.ratingLocationRow}>
          <RatingStars rating={fundi.rating} reviewCount={fundi.reviewCount} size={13} />
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.metaText}>{fundi.distanceKm} km away</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.estLabel}>Pre-Inspection</Text>
            <Text style={styles.priceHighlight}>
              KSh 500
            </Text>
          </View>

          <TouchableOpacity
            style={styles.quickBookButton}
            onPress={onBookPress || onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.quickBookText}>Book</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Vertical Card
  verticalCard: {
    width: 250,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    marginRight: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  cardHeader: {
    height: 100,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  bookmarkButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(8, 30, 69, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: -24,
    left: SPACING.md,
  },
  verticalAvatar: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    borderWidth: 3,
    borderColor: COLORS.card,
  },
  onlineDotBordered: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  cardBody: {
    paddingTop: 30,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fundiName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  ratingLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  dotSeparator: {
    color: COLORS.textMuted,
    marginHorizontal: 6,
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  priceHighlight: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.primary,
  },
  quickBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
  },
  quickBookText: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    marginRight: 4,
  },

  // Horizontal Card
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  horizontalAvatar: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  horizontalDetails: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  priceText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
