import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { Button } from '../../src/components/common/Button';
import { useApp } from '../../src/context/AppContext';

export default function BookingSuccessScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { bookings } = useApp();

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Check Icon */}
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark-circle" size={80} color={COLORS.accent} />
        </View>

        <Text style={styles.successTitle}>Booking Confirmed! 🎉</Text>
        <Text style={styles.successSub}>
          Your service request has been assigned and dispatch confirmation sent to the fundi.
        </Text>

        {/* Booking Summary Ticket */}
        {booking && (
          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketId}>BOOKING REF: #{booking.id}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.fundiRow}>
              <Image source={{ uri: booking.fundiAvatar }} style={styles.fundiAvatar} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.fundiName}>{booking.fundiName}</Text>
                <Text style={styles.categoryText}>{booking.fundiCategory} Specialist</Text>
                <Text style={styles.phoneText}>📞 {booking.fundiPhone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>{booking.date} at {booking.timeSlot}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={COLORS.primary} />
              <Text style={styles.infoText} numberOfLines={1}>{booking.address}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="wallet-outline" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>
                {booking.paymentMethod.toUpperCase()} • KSh {booking.amount.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsBox}>
          <Button
            title="View My Bookings"
            onPress={() => router.replace('/(tabs)/bookings' as any)}
            variant="primary"
            size="lg"
            icon="calendar"
          />

          <View style={{ height: SPACING.sm }} />

          <Button
            title="Back to Home"
            onPress={() => router.replace('/(tabs)' as any)}
            variant="outline"
            size="lg"
            icon="home-outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 122, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  successSub: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketId: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statusBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '800',
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
    width: 50,
    height: 50,
    borderRadius: RADIUS.full,
  },
  fundiName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.accent,
    fontWeight: '700',
  },
  phoneText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  actionsBox: {
    width: '100%',
  },
});
