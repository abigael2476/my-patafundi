import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  isPassword = false,
  error,
  helperText,
  secureTextEntry,
  style,
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedContainer,
          !!error && styles.errorContainer,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? COLORS.primary : COLORS.textMuted}
            style={styles.iconLeft}
          />
        )}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={isPassword ? hidePassword : secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  focusedContainer: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  errorContainer: {
    borderColor: COLORS.danger,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  eyeButton: {
    padding: SPACING.xs,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
  helperText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
