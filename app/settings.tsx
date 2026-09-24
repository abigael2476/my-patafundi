import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../src/constants/theme';
import { Header } from '../src/components/common/Header';

export default function SettingsScreen() {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="App Settings" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.cardGroup}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Push Notifications</Text>
              <Text style={styles.rowSub}>Receive instant alerts about booking status</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>SMS Reminders</Text>
              <Text style={styles.rowSub}>Get arrival SMS when fundi is nearby</Text>
            </View>
            <Switch
              value={smsNotifs}
              onValueChange={setSmsNotifs}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
            />
          </View>
        </View>

        {/* Section 2: Privacy & Location */}
        <Text style={styles.sectionTitle}>Privacy & Location</Text>
        <View style={styles.cardGroup}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Location Services</Text>
              <Text style={styles.rowSub}>Allow app to find nearest fundis automatically</Text>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Dark Mode</Text>
              <Text style={styles.rowSub}>Switch interface theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>
        </View>

        {/* Section 3: Legal */}
        <Text style={styles.sectionTitle}>Legal & Security</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.rowClick}
            onPress={() => Alert.alert('Privacy Policy', 'PataFundi protects user data in accordance with Kenyan Data Protection Act 2019.')}
          >
            <Text style={styles.rowTitle}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.rowClick}
            onPress={() => Alert.alert('Terms of Service', 'PataFundi platform usage terms and fundi guarantee policy.')}
          >
            <Text style={styles.rowTitle}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
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
  sectionTitle: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  rowClick: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  rowTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  rowSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
  },
});
