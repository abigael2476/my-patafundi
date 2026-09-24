import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search plumber, electrician, carpenter...',
  onFilterPress,
  autoFocus = false,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        autoFocus={autoFocus}
      />

      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      ) : null}

      {onFilterPress && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress} activeOpacity={0.8}>
          <Ionicons name="options-outline" size={20} color={COLORS.textWhite} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  clearButton: {
    padding: SPACING.xs,
    marginRight: SPACING.xs,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
