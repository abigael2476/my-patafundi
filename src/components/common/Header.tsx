import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  lightText?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightAction,
  transparent = false,
  lightText = false,
}) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  return (
    <View
      style={[
        styles.container,
        transparent ? styles.transparentContainer : styles.solidContainer,
      ]}
    >
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            style={[
              styles.backButton,
              lightText ? styles.lightBackButton : styles.darkBackButton,
            ]}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={lightText ? COLORS.textWhite : COLORS.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {title && (
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: lightText ? COLORS.textWhite : COLORS.textPrimary },
          ]}
        >
          {title}
        </Text>
      )}

      <View style={styles.rightContainer}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  solidContainer: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  transparentContainer: {
    backgroundColor: 'transparent',
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBackButton: {
    backgroundColor: COLORS.surface,
  },
  lightBackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
