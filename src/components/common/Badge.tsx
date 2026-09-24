import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'verified' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral';
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  size = 'md',
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'verified':
        return { bg: COLORS.primaryLight, text: COLORS.textWhite, defaultIcon: 'checkmark-circle' as const };
      case 'success':
        return { bg: COLORS.successLight, text: COLORS.success, defaultIcon: 'checkmark-circle-outline' as const };
      case 'warning':
        return { bg: COLORS.warningLight, text: COLORS.warning, defaultIcon: 'alert-circle-outline' as const };
      case 'danger':
        return { bg: COLORS.dangerLight, text: COLORS.danger, defaultIcon: 'close-circle-outline' as const };
      case 'info':
        return { bg: COLORS.infoLight, text: COLORS.info, defaultIcon: 'information-circle-outline' as const };
      case 'accent':
        return { bg: COLORS.accentLight, text: COLORS.accent, defaultIcon: 'star' as const };
      default:
        return { bg: COLORS.surface, text: COLORS.textSecondary, defaultIcon: undefined };
    }
  };

  const styleInfo = getBadgeStyle();
  const activeIcon = icon || styleInfo.defaultIcon;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: styleInfo.bg },
        size === 'sm' && styles.badgeSm,
      ]}
    >
      {activeIcon && (
        <Ionicons
          name={activeIcon}
          size={size === 'sm' ? 12 : 14}
          color={styleInfo.text}
          style={{ marginRight: 4 }}
        />
      )}
      <Text
        style={[
          styles.text,
          { color: styleInfo.text },
          size === 'sm' && styles.textSm,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
  },
  textSm: {
    fontSize: 10,
  },
});
