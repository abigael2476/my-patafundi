import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants/theme';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onPress: () => void;
  variant?: 'horizontal' | 'grid';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onPress,
  variant = 'horizontal',
}) => {
  if (variant === 'grid') {
    return (
      <TouchableOpacity
        style={[
          styles.gridCard,
          isSelected && styles.selectedGridCard,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.iconCircle,
            isSelected ? styles.selectedIconCircle : styles.defaultIconCircle,
          ]}
        >
          <Ionicons
            name={category.icon as any}
            size={24}
            color={isSelected ? COLORS.textWhite : COLORS.accent}
          />
        </View>
        <Text style={[styles.gridName, isSelected && styles.selectedText]} numberOfLines={1}>
          {category.name}
        </Text>
        <Text style={styles.gridCount}>{category.activeCount} fundis</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.horizontalCard,
        isSelected && styles.selectedHorizontalCard,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconContainer,
          isSelected ? styles.selectedIconContainer : styles.defaultIconContainer,
        ]}
      >
        <Ionicons
          name={category.icon as any}
          size={20}
          color={isSelected ? COLORS.textWhite : COLORS.primary}
        />
      </View>
      <Text style={[styles.horizontalName, isSelected && styles.selectedHorizontalText]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  selectedHorizontalCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  defaultIconContainer: {
    backgroundColor: COLORS.accentLight,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  horizontalName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  selectedHorizontalText: {
    color: COLORS.textWhite,
  },

  // Grid Variant
  gridCard: {
    width: '31%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  selectedGridCard: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  defaultIconCircle: {
    backgroundColor: COLORS.surface,
  },
  selectedIconCircle: {
    backgroundColor: COLORS.accent,
  },
  gridName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  selectedText: {
    color: COLORS.accentDark,
  },
  gridCount: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
