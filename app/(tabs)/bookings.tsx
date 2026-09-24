import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Booking, BookingStatus } from '../../src/types';
import { Badge } from '../../src/components/common/Badge';

export default function BookingsScreen() {
  const { bookings, cancelBooking } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending' || b.status === 'in_progress';
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleCancelPress = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? Fundi will be notified immediately.',
      [
        { text: 'No, Keep It', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => cancelBooking(bookingId),
        },
      ]
    );
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.bookingId}>REF #{item.id}</Text>
        <Badge
          label={item.status.replace('_', ' ').toUpperCase()}
          variant={
            item.status === 'completed'
              ? 'success'
              : item.status === 'cancelled'
              ? 'danger'
              : 'verified'
          }
          size="sm"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.fundiRow}>
        <Image source={{ uri: item.fundiAvatar }} style={styles.fundiAvatar} />
        <View style={{ flex: 1, marginLeft: SPACING.md }}>
          <Text style={styles.fundiName}>{item.fundiName}</Text>
          <Text style={styles.categoryText}>{item.fundiCategory} Service</Text>
          <Text style={styles.dateSlotText}>
            📅 {item.date} • {item.timeSlot}
          </Text>
        </View>
      </View>

      <View style={styles.addressBox}>
        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.addressText} numberOfLines={1}>
          {item.address}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <Text style={styles.amountText}>
          Pre-Inspection Fee: <Text style={styles.amountBold}>KSh {(item.amount || 500).toLocaleString()}</Text>
        </Text>

        {item.status === 'confirmed' || item.status === 'pending' || item.status === 'in_progress' ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.chatSmallBtn}
              onPress={() => router.push({ pathname: `/chat/${item.fundiId}` as any, params: { bookingId: item.id } })}
            >
              <Ionicons name="chatbubbles" size={14} color={COLORS.textWhite} style={{ marginRight: 4 }} />
              <Text style={styles.chatSmallBtnText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.trackBtn}
              onPress={() => router.push(`/booking/track/${item.id}` as any)}
            >
              <Ionicons name="location-sharp" size={14} color={COLORS.textWhite} style={{ marginRight: 4 }} />
              <Text style={styles.trackBtnText}>Track</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancelPress(item.id)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.rebookBtn}
            onPress={() => router.push(`/booking/${item.fundiId}` as any)}
          >
            <Text style={styles.rebookBtnText}>Book Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>My Bookings 📅</Text>
      </View>

      {/* Segmented Tab Bar */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'upcoming' && styles.activeTabBtn]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'completed' && styles.activeTabBtn]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'cancelled' && styles.activeTabBtn]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {filteredBookings.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="calendar-outline" size={60} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
          <Text style={styles.emptySub}>
            When you schedule an artisan, your booking record will appear here.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push('/(tabs)/search' as any)}
          >
            <Text style={styles.exploreBtnText}>Book a Fundi Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderBookingItem}
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
  pageTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  activeTabBtn: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.textWhite,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingId: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  fundiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fundiAvatar: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
  },
  fundiName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 2,
  },
  dateSlotText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  addressText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  amountBold: {
    fontWeight: '800',
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xs + 4,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    marginRight: 6,
  },
  chatSmallBtnText: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xs + 4,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    marginRight: 6,
  },
  trackBtnText: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  cancelBtnText: {
    color: COLORS.danger,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
  },
  rebookBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  rebookBtnText: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
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
    marginBottom: SPACING.lg,
  },
  exploreBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  exploreBtnText: {
    color: COLORS.textWhite,
    fontWeight: '800',
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});
