import React, { useState } from 'react';
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
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { MOCK_FUNDIS } from '../../src/data/mockData';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addBooking } = useApp();
  const { user } = useAuth();

  const fundi = MOCK_FUNDIS.find((f) => f.id === id) || MOCK_FUNDIS[0];

  // Booking Form States
  const [selectedDate, setSelectedDate] = useState('2026-08-10');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState(user?.address || 'Apartment 4B, Westwood Heights, Westlands');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cash'>('mpesa');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dates = [
    { label: 'Today', sub: 'Aug 8', val: '2026-08-08' },
    { label: 'Tomorrow', sub: 'Aug 9', val: '2026-08-09' },
    { label: 'Mon', sub: 'Aug 10', val: '2026-08-10' },
    { label: 'Tue', sub: 'Aug 11', val: '2026-08-11' },
    { label: 'Wed', sub: 'Aug 12', val: '2026-08-12' },
  ];

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
  ];

  const preInspectionFee = 500;

  const handleConfirmBooking = () => {
    if (!address) {
      Alert.alert('Address Required', 'Please enter your service location address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = addBooking({
        fundiId: fundi.id,
        fundiName: fundi.name,
        fundiAvatar: fundi.avatar,
        fundiCategory: fundi.category,
        fundiPhone: fundi.phone,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        address: address,
        description: description || `Standard ${fundi.category} service request`,
        paymentMethod: 'mpesa',
        amount: preInspectionFee,
      });

      setIsSubmitting(false);
      router.replace({
        pathname: '/booking/success' as any,
        params: { bookingId: created.id },
      });
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Book Fundi Service" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Fundi Summary Header Card */}
        <View style={styles.fundiSummaryCard}>
          <Image source={{ uri: fundi.avatar }} style={styles.fundiAvatar} />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.fundiName}>{fundi.name}</Text>
            <Text style={styles.categoryBadgeText}>{fundi.category} Expert</Text>
            <Text style={styles.locationSmall}>📍 {fundi.locationName}</Text>
          </View>
        </View>

        {/* Date Selection Chips */}
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChipsScroll}>
          {dates.map((d) => {
            const isSelected = selectedDate === d.val;
            return (
              <TouchableOpacity
                key={d.val}
                style={[styles.dateChip, isSelected && styles.activeChip]}
                onPress={() => setSelectedDate(d.val)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateChipLabel, isSelected && styles.activeChipText]}>{d.label}</Text>
                <Text style={[styles.dateChipSub, isSelected && styles.activeChipSub]}>{d.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Slot Selection */}
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <View style={styles.slotsGrid}>
          {timeSlots.map((slot) => {
            const isSelected = selectedTimeSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slotChip, isSelected && styles.activeChip]}
                onPress={() => setSelectedTimeSlot(slot)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={isSelected ? COLORS.textWhite : COLORS.primary}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.slotText, isSelected && styles.activeChipText]}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Location / Address Input */}
        <Text style={styles.sectionTitle}>Service Address</Text>
        <Input
          placeholder="e.g. Westlands, Mpaka Rd, House 4B"
          value={address}
          onChangeText={setAddress}
          icon="location-outline"
        />

        {/* Job Description Optional Input */}
        <Text style={styles.sectionTitle}>Job Description (Optional)</Text>
        <Input
          placeholder="Describe what needs fixing..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ height: 80, paddingTop: 10 }}
        />

        {/* Pre-Inspection Fee Summary Card */}
        <View style={styles.freeServiceCard}>
          <View style={styles.freeHeaderRow}>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>PRE-INSPECTION FEE</Text>
            </View>
            <Text style={styles.freeZeroText}>KSh 500</Text>
          </View>
          <Text style={styles.freeTitle}>Standard Pre-Inspection & Diagnosis</Text>
          <Text style={styles.freeSub}>
            Standard KSh 500 pre-inspection fee covers artisan callout, site inspection, and expert diagnosis with {fundi.name}.
          </Text>
          <View style={styles.freeCheckList}>
            <Text style={styles.freeCheckItem}>✅ Professional Site Pre-Inspection</Text>
            <Text style={styles.freeCheckItem}>✅ Expert Work Estimation & Diagnosis</Text>
            <Text style={styles.freeCheckItem}>✅ Live Map Location Tracking ("See how far")</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA Bar */}
      <View style={styles.bottomBar}>
        <Button
          title="Confirm Booking (KSh 500 Pre-Inspection)"
          onPress={handleConfirmBooking}
          variant="accent"
          size="lg"
          loading={isSubmitting}
        />
      </View>
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
    paddingBottom: 100,
  },
  fundiSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  fundiAvatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
  },
  fundiName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  categoryBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 2,
  },
  locationSmall: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  horizontalChipsScroll: {
    marginBottom: SPACING.md,
  },
  dateChip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    marginRight: SPACING.xs,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minWidth: 80,
  },
  dateChipLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  dateChipSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  activeChipText: {
    color: COLORS.textWhite,
  },
  activeChipSub: {
    color: COLORS.accent,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  slotText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  paymentCard: {
    width: '31%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  activePaymentCard: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
  },
  mpesaBadge: {
    backgroundColor: '#00A651',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  mpesaText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  paymentLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  freeServiceCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.accent,
    ...SHADOWS.medium,
  },
  freeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  freeBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  freeBadgeText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '900',
  },
  freeZeroText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '900',
    color: COLORS.success,
  },
  freeTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  freeSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  freeCheckList: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  freeCheckItem: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.primary,
    marginVertical: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    ...SHADOWS.large,
  },
});
