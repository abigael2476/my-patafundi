import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../../constants/theme';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 14,
  showText = true,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <View style={styles.container}>
      <Ionicons name="star" size={size} color={COLORS.accent} />
      {showText && (
        <Text style={[styles.ratingText, { fontSize: size }]}>
          {rating.toFixed(1)}
        </Text>
      )}
      {reviewCount !== undefined && (
        <Text style={[styles.countText, { fontSize: size - 2 }]}>
          ({reviewCount})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  countText: {
    color: COLORS.textMuted,
    marginLeft: 4,
  },
});
