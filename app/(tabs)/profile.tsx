import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import { useApp } from '../../src/context/AppContext';
import { Badge } from '../../src/components/common/Badge';
import { UserRole } from '../../src/types';

export default function ProfileScreen() {
  const { user, logout, switchRole } = useAuth();
  const { savedFundiIds } = useApp();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of PataFundi?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/' as any);
        },
      },
    ]);
  };

  interface MenuItem {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    badge?: string;
    onPress: () => void;
  }

  interface MenuSection {
    title: string;
    items: MenuItem[];
  }

  // 1. Role-based menu item customization
  const getMenuSections = (): MenuSection[] => {
    const currentRole = user?.role || 'client';

    if (currentRole === 'fundi') {
      return [
        {
          title: 'Fundi Pro Business',
          items: [
            {
              id: 'fundi_wallet',
              icon: 'wallet-outline' as const,
              label: 'Fundi Wallet & M-Pesa Payouts 📲',
              badge: 'KSh 12,750',
              onPress: () => router.push('/fundi/wallet' as any),
            },
            {
              id: 'bookings',
              icon: 'hammer-outline' as const,
              label: 'Client Job Requests & Status',
              onPress: () => router.push('/(tabs)/bookings' as any),
            },
          ],
        },
        {
          title: 'Preferences & Support',
          items: [
            {
              id: 'settings',
              icon: 'settings-outline' as const,
              label: 'Settings',
              onPress: () => router.push('/settings' as any),
            },
            {
              id: 'support',
              icon: 'help-circle-outline' as const,
              label: 'Help & Contact Support',
              onPress: () => router.push('/support' as any),
            },
            {
              id: 'about',
              icon: 'information-circle-outline' as const,
              label: 'About PataFundi',
              onPress: () => router.push('/about' as any),
            },
          ],
        },
      ];
    }

    if (currentRole === 'owner') {
      return [
        {
          title: 'Platform Owner Administration',
          items: [
            {
              id: 'owner_dashboard',
              icon: 'stats-chart-outline' as const,
              label: 'Owner Revenue Dashboard 💰',
              onPress: () => router.push('/owner/dashboard' as any),
            },
            {
              id: 'bookings',
              icon: 'list-outline' as const,
              label: 'All Platform Transactions',
              onPress: () => router.push('/(tabs)/bookings' as any),
            },
          ],
        },
        {
          title: 'Preferences & Support',
          items: [
            {
              id: 'settings',
              icon: 'settings-outline' as const,
              label: 'System Settings',
              onPress: () => router.push('/settings' as any),
            },
            {
              id: 'support',
              icon: 'help-circle-outline' as const,
              label: 'Help & Contact Support',
              onPress: () => router.push('/support' as any),
            },
          ],
        },
      ];
    }

    // Default: CLIENT
    return [
      {
        title: 'Customer Account',
        items: [
          {
            id: 'bookings',
            icon: 'calendar-outline' as const,
            label: 'My Bookings',
            onPress: () => router.push('/(tabs)/bookings' as any),
          },
          {
            id: 'saved',
            icon: 'bookmark-outline' as const,
            label: 'Saved Fundis',
            badge: `${savedFundiIds.length}`,
            onPress: () => router.push('/(tabs)/search' as any),
          },
          {
            id: 'payment',
            icon: 'card-outline' as const,
            label: 'Payment Methods & M-Pesa',
            onPress: () => Alert.alert('Payment Methods', 'M-Pesa default account linked.'),
          },
        ],
      },
      {
        title: 'Preferences & Support',
        items: [
          {
            id: 'owner_dashboard_client',
            icon: 'stats-chart-outline' as const,
            label: 'Owner / Admin Revenue Dashboard 📊',
            onPress: () => router.push('/owner/dashboard' as any),
          },
          {
            id: 'settings',
            icon: 'settings-outline' as const,
            label: 'Settings',
            onPress: () => router.push('/settings' as any),
          },
          {
            id: 'support',
            icon: 'help-circle-outline' as const,
            label: 'Help & Contact Support',
            onPress: () => router.push('/support' as any),
          },
          {
            id: 'about',
            icon: 'information-circle-outline' as const,
            label: 'About PataFundi',
            onPress: () => router.push('/about' as any),
          },
        ],
      },
    ];
  };

  const menuSections = getMenuSections();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.profileHeaderCard}>
          <Image
            source={{
              uri: user?.avatar || 'https://ui-avatars.com/api/?name=Alex+Kariuki&background=081E45&color=FF7A00&bold=true',
            }}
            style={styles.userAvatar}
          />
          <View style={{ marginBottom: SPACING.xs }}>
            <Badge
              label={(user?.role || 'client').toUpperCase() + ' ACCOUNT'}
              variant="accent"
              size="sm"
            />
          </View>
          <Text style={styles.userName}>{user?.name || 'Alex Kariuki'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'alex.kariuki@example.com'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '+254 711 223 344'}</Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => Alert.alert('Edit Profile', 'Profile edit dialog opened.')}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={14} color={COLORS.textWhite} style={{ marginRight: 4 }} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>



        {/* Menu Sections */}
        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.sectionBox}>
            <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
            <View style={styles.menuGroup}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuRow,
                    i < section.items.length - 1 && styles.borderBottom,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.8}
                >
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon} size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.badge && (
                    <View style={styles.badgeBox}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>PataFundi App v1.0.0 (Expo SDK 54)</Text>
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
    paddingBottom: SPACING.xxl,
  },
  profileHeaderCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    borderWidth: 3,
    borderColor: COLORS.accent,
    marginBottom: SPACING.xs,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  userPhone: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  editBtnText: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
  },
  roleSwitcherCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  roleSwitcherTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  roleBtnRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  roleSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  activeRoleSwitchBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  activeRoleSwitchText: {
    color: COLORS.accent,
  },
  sectionBox: {
    marginBottom: SPACING.md,
  },
  sectionHeaderTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  menuGroup: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  menuLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  badgeBox: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
  },
  badgeText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: SPACING.lg,
  },
});
