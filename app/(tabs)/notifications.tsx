import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Notification } from '../../src/types';

export default function NotificationsScreen() {
  const { notifications, markNotificationRead, unreadCount } = useApp();
  const [filter, setFilter] = useState<'all' | 'booking' | 'promo'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'booking') return n.type === 'booking';
    if (filter === 'promo') return n.type === 'promo' || n.type === 'system';
    return true;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return { icon: 'calendar-outline' as const, bg: COLORS.accentLight, color: COLORS.accent };
      case 'promo':
        return { icon: 'gift-outline' as const, bg: COLORS.infoLight, color: COLORS.info };
      default:
        return { icon: 'notifications-outline' as const, bg: COLORS.surface, color: COLORS.primary };
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const iconInfo = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead && styles.unreadCard]}
        onPress={() => {
          markNotificationRead(item.id);
          if (item.bookingId) {
            router.push('/(tabs)/bookings' as any);
          }
        }}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: iconInfo.bg }]}>
          <Ionicons name={iconInfo.icon} size={20} color={iconInfo.color} />
        </View>

        <View style={{ flex: 1, marginLeft: SPACING.md }}>
          <View style={styles.rowBetween}>
            <Text style={[styles.notifTitle, !item.isRead && styles.boldText]}>
              {item.title}
            </Text>
            <Text style={styles.timeText}>{item.timestamp}</Text>
          </View>

          <Text style={styles.messageText}>{item.message}</Text>
        </View>

        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rowBetween}>
          <Text style={styles.pageTitle}>Notifications 🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount} UNREAD</Text>
            </View>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.chip, filter === 'all' && styles.activeChip]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.chipText, filter === 'all' && styles.activeChipText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, filter === 'booking' && styles.activeChip]}
          onPress={() => setFilter('booking')}
        >
          <Text style={[styles.chipText, filter === 'booking' && styles.activeChipText]}>
            Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, filter === 'promo' && styles.activeChip]}
          onPress={() => setFilter('promo')}
        >
          <Text style={[styles.chipText, filter === 'promo' && styles.activeChipText]}>
            Promos & Offers
          </Text>
        </TouchableOpacity>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="notifications-off-outline" size={60} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptySub}>
            You're all caught up! Updates regarding your fundi bookings will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  unreadBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  unreadBadgeText: {
    color: COLORS.textWhite,
    fontSize: 9,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  activeChipText: {
    color: COLORS.textWhite,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    position: 'relative',
    ...SHADOWS.small,
  },
  unreadCard: {
    backgroundColor: '#FFFBF5',
    borderColor: COLORS.accentLight,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  boldText: {
    fontWeight: '800',
  },
  timeText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  messageText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  unreadDot: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptySub: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});
