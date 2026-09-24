import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'accent' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight = false,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const getContainerStyle = () => {
    let base: ViewStyle = { ...styles.button };

    if (fullWidth) base.width = '100%';

    // Size
    if (size === 'sm') base.height = 40;
    else if (size === 'lg') base.height = 56;
    else base.height = 48;

    // Variant
    switch (variant) {
      case 'primary':
        base.backgroundColor = COLORS.primary;
        base = { ...base, ...SHADOWS.small };
        break;
      case 'accent':
        base.backgroundColor = COLORS.accent;
        base = { ...base, ...SHADOWS.accent };
        break;
      case 'secondary':
        base.backgroundColor = COLORS.surface;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = COLORS.primary;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
    }

    if (disabled || loading) {
      base.opacity = 0.6;
    }

    return base;
  };

  const getTextColor = () => {
    if (variant === 'primary' || variant === 'accent') return COLORS.textWhite;
    if (variant === 'outline' || variant === 'ghost') return COLORS.primary;
    return COLORS.textPrimary;
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && !iconRight && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 20}
              color={getTextColor()}
              style={{ marginRight: SPACING.xs }}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              size === 'sm' && styles.textSm,
              size === 'lg' && styles.textLg,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconRight && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 20}
              color={getTextColor()}
              style={{ marginLeft: SPACING.xs }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  text: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '700',
  },
  textSm: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  textLg: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
});
