import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Svg, { Rect, Line, Circle, Path, G, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../../src/constants/theme';
import { MOCK_FUNDIS, INITIAL_BOOKINGS } from '../../../src/data/mockData';
import { TrackingInfo, Fundi, Booking } from '../../../src/types';
import { ApiService } from '../../../src/services/api';
import { useApp } from '../../../src/context/AppContext';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 320;

export default function LiveTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings } = useApp();

  const booking: Booking = bookings.find((b) => b.id === id) || INITIAL_BOOKINGS[0];
  const fundi: Fundi = MOCK_FUNDIS.find((f) => f.id === booking.fundiId) || MOCK_FUNDIS[0];

  const [tracking, setTracking] = useState<TrackingInfo>({
    id: booking.id,
    bookingId: booking.id,
    fundiId: fundi.id,
    fundiName: fundi.name,
    fundiLat: -1.286389,
    fundiLng: 36.817223,
    clientLat: -1.265000,
    clientLng: 36.805000,
    status: 'en_route',
    etaMinutes: 6,
    distanceKm: 1.8,
    updatedAt: new Date().toISOString(),
  });

  // Fundi Movement Animation Progress (0.0 to 1.0 along the route path)
  const [progress, setProgress] = useState(0.25);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse Animation for Bolt-style pickup point
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Poll backend for real-time tracking updates & simulate movement
  useEffect(() => {
    loadTracking();
    const interval = setInterval(async () => {
      const data = await ApiService.getBookingTracking(booking.id);
      if (data) {
        setTracking(data);
      }
      setProgress((prev) => {
        if (prev >= 0.95) {
          setTracking((t) => ({ ...t, status: 'arrived', etaMinutes: 0, distanceKm: 0.1 }));
          return 0.95;
        }
        const next = prev + 0.04;
        const remainingKm = Math.max(0.1, parseFloat((1.8 * (1 - next)).toFixed(1)));
        const remainingMins = Math.max(1, Math.ceil(remainingKm * 3.5));
        setTracking((t) => ({ ...t, distanceKm: remainingKm, etaMinutes: remainingMins }));
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [id, booking.id]);

  const loadTracking = async () => {
    const data = await ApiService.getBookingTracking(booking.id);
    if (data) {
      setTracking(data);
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${booking.fundiPhone || fundi.phone}`).catch(() => {
      Alert.alert('Call', `Dialing ${fundi.phone}`);
    });
  };

  const handleOpenChat = () => {
    router.push({
      pathname: `/chat/${fundi.id}` as any,
      params: { bookingId: booking.id },
    });
  };

  // Interpolate smooth bezier curve coordinates for Fundi vehicle movement
  const pathStartX = 45;
  const pathStartY = 250;
  const pathControlX = width * 0.45;
  const pathControlY = 160;
  const pathEndX = width - 65;
  const pathEndY = 60;

  // Quadratic Bezier interpolation formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const t = progress;
  const currentX = (1 - t) * (1 - t) * pathStartX + 2 * (1 - t) * t * pathControlX + t * t * pathEndX;
  const currentY = (1 - t) * (1 - t) * pathStartY + 2 * (1 - t) * t * pathControlY + t * t * pathEndY;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Bolt-Style Navigation Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Bolt-Style Ride Tracking 🚗</Text>
          <Text style={styles.headerSub}>Booking #{booking.id}</Text>
        </View>

        <View style={styles.livePulsePill}>
          <View style={styles.greenPulseDot} />
          <Text style={styles.livePulseText}>
            {tracking.status === 'arrived' ? 'ARRIVED' : 'LIVE DRIVER'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Interactive Map Visualizer Container */}
        <View style={styles.mapWrap}>
          <Svg width={width - SPACING.md * 2} height={MAP_HEIGHT} style={styles.svgCanvas}>
            <Defs>
              <LinearGradient id="mapBgGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#0B1329" />
                <Stop offset="100%" stopColor="#0F172A" />
              </LinearGradient>
              <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#FF7A00" />
                <Stop offset="100%" stopColor="#10B981" />
              </LinearGradient>
            </Defs>

            {/* Dark Map Canvas Background */}
            <Rect width="100%" height="100%" fill="url(#mapBgGrad)" rx={18} />

            {/* Arterial Road Grid Lines (Bolt Style Vector Roads) */}
            <Line x1="0" y1="120" x2="100%" y2="120" stroke="#1E293B" strokeWidth="24" />
            <Line x1="0" y1="120" x2="100%" y2="120" stroke="#334155" strokeWidth="2" strokeDasharray="8 6" />

            <Line x1="0" y1="230" x2="100%" y2="230" stroke="#1E293B" strokeWidth="18" />
            <Line x1="100" y1="0" x2="100" y2="100%" stroke="#1E293B" strokeWidth="20" />
            <Line x1="280" y1="0" x2="280" y2="100%" stroke="#1E293B" strokeWidth="22" />

            {/* Roundabout Vector Icon */}
            <Circle cx={pathControlX} cy={pathControlY} r="28" fill="#1E293B" stroke="#334155" strokeWidth="2" />
            <Circle cx={pathControlX} cy={pathControlY} r="14" fill="#0B1329" />

            {/* Street Names Labels */}
            <SvgText x="15" y="112" fill="#64748B" fontSize="10" fontWeight="bold">
              Waiyaki Way Express
            </SvgText>
            <SvgText x="15" y="222" fill="#64748B" fontSize="10" fontWeight="bold">
              Westlands Road
            </SvgText>
            <SvgText x="115" y="295" fill="#64748B" fontSize="10" fontWeight="bold">
              Ring Road Parklands
            </SvgText>

            {/* Animated Bezier Route Path Line */}
            <Path
              d={`M ${pathStartX} ${pathStartY} Q ${pathControlX} ${pathControlY} ${pathEndX} ${pathEndY}`}
              stroke="url(#routeGrad)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />

            {/* User House Pickup Marker (Green Pulsing Destination) */}
            <G transform={`translate(${pathEndX - 16}, ${pathEndY - 34})`}>
              <Circle cx="16" cy="16" r="18" fill="#10B981" opacity={0.25} />
              <Circle cx="16" cy="16" r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              {/* Destination Tag */}
              <Rect x="-42" y="-22" width="120" height="20" fill="#10B981" rx="10" />
              <SvgText x="-34" y="-8" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                📍 Your Destination
              </SvgText>
            </G>

            {/* Fundi Moving Marker (Bolt Car / Artisan Icon) */}
            <G transform={`translate(${currentX - 22}, ${currentY - 22})`}>
              {/* Outer Glowing Glow Ring */}
              <Circle cx="22" cy="22" r="24" fill={COLORS.accent} opacity={0.25} />
              {/* Main Badge */}
              <Circle cx="22" cy="22" r="18" fill={COLORS.primary} stroke={COLORS.accent} strokeWidth="3" />
              {/* Icon */}
              <SvgText x="14" y="27" fill="#FFFFFF" fontSize="15">
                🚗
              </SvgText>
              {/* Live Distance Pill Tag */}
              <Rect x="-22" y="-24" width="88" height="20" fill={COLORS.accent} rx="10" />
              <SvgText x="-14" y="-10" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                {tracking.distanceKm} km away
              </SvgText>
            </G>
          </Svg>

          {/* Floating Bolt-Style ETA Overlay Banner */}
          <View style={styles.floatingEtaCard}>
            <View style={styles.etaLeftCol}>
              <Text style={styles.floatingEtaTitle}>
                {tracking.status === 'arrived' ? 'ARRIVED NOW 📍' : `ARRIVING IN ${tracking.etaMinutes} MINS`}
              </Text>
              <Text style={styles.floatingEtaSub}>
                {fundi.name} is on the way ({tracking.distanceKm} km away)
              </Text>
            </View>
            <View style={styles.carTypeBadge}>
              <Ionicons name="car-sport" size={18} color={COLORS.accent} />
              <Text style={styles.carTypeNumber}>KDA 482L</Text>
            </View>
          </View>
        </View>

        {/* Driver / Fundi Card (Bolt Style Bottom Sheet Layout) */}
        <View style={styles.driverCard}>
          <View style={styles.driverHeaderRow}>
            <Image source={{ uri: booking.fundiAvatar || fundi.avatar }} style={styles.driverAvatar} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>{booking.fundiName}</Text>
                <View style={styles.verifiedTag}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.accent} />
                  <Text style={styles.verifiedTagText}>PRO ARTISAN</Text>
                </View>
              </View>
              <Text style={styles.categorySub}>{booking.fundiCategory} Specialist • {fundi.rating.toFixed(1)} ★</Text>
              <Text style={styles.vehicleInfo}>Toyota Probox (Silver) • Plate KDA 482L</Text>
            </View>

            <TouchableOpacity style={styles.callCircleBtn} onPress={handleCall} activeOpacity={0.8}>
              <Ionicons name="call" size={20} color={COLORS.textWhite} />
            </TouchableOpacity>
          </View>

          {/* Bottom Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.chatBtn} onPress={handleOpenChat} activeOpacity={0.8}>
              <Ionicons name="chatbubbles" size={18} color={COLORS.textWhite} style={{ marginRight: 6 }} />
              <Text style={styles.chatBtnText}>Chat with {booking.fundiName.split(' ')[0]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.simulateBtn}
              onPress={() => {
                setProgress(0.1);
                setTracking((t) => ({ ...t, status: 'en_route', etaMinutes: 6, distanceKm: 1.8 }));
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Timeline Status */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineHeader}>Trip Status & Milestones</Text>

          <View style={styles.stepRow}>
            <View style={[styles.stepDot, styles.stepDone]}>
              <Ionicons name="checkmark" size={12} color={COLORS.textWhite} />
            </View>
            <View style={styles.stepTextGroup}>
              <Text style={styles.stepTitle}>Ride & Service Requested</Text>
              <Text style={styles.stepSub}>Client created booking #{booking.id}</Text>
            </View>
          </View>

          <View style={styles.stepLineDone} />

          <View style={styles.stepRow}>
            <View style={[styles.stepDot, styles.stepActive]}>
              <Ionicons name="car" size={12} color={COLORS.textWhite} />
            </View>
            <View style={styles.stepTextGroup}>
              <Text style={styles.stepTitle}>Driver En Route to Location</Text>
              <Text style={styles.stepSub}>
                {tracking.status === 'arrived' ? 'Driver reached destination' : `${tracking.distanceKm} km remaining • ${tracking.etaMinutes} mins ETA`}
              </Text>
            </View>
          </View>

          <View style={tracking.status === 'arrived' ? styles.stepLineDone : styles.stepLine} />

          <View style={styles.stepRow}>
            <View style={[styles.stepDot, tracking.status === 'arrived' ? styles.stepDone : styles.stepPending]}>
              <Ionicons name="location" size={12} color={COLORS.textWhite} />
            </View>
            <View style={styles.stepTextGroup}>
              <Text style={styles.stepTitle}>Arrived at Your Address</Text>
              <Text style={styles.stepSub}>{booking.address}</Text>
            </View>
          </View>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  headerBackBtn: {
    marginRight: SPACING.xs,
    padding: 4,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  livePulsePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  livePulseText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  mapWrap: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    position: 'relative',
    ...SHADOWS.medium,
  },
  svgCanvas: {
    width: '100%',
  },
  floatingEtaCard: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(11, 19, 41, 0.92)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    ...SHADOWS.medium,
  },
  etaLeftCol: {
    flex: 1,
  },
  floatingEtaTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '900',
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  floatingEtaSub: {
    fontSize: 11,
    color: COLORS.textWhite,
    marginTop: 2,
  },
  carTypeBadge: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 122, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  carTypeNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    marginTop: 2,
  },
  driverCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  driverHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginLeft: 6,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accentDark,
    marginLeft: 2,
  },
  categorySub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 2,
  },
  vehicleInfo: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  callCircleBtn: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  chatBtnText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  simulateBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  timelineHeader: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDone: {
    backgroundColor: COLORS.success,
  },
  stepActive: {
    backgroundColor: COLORS.accent,
  },
  stepPending: {
    backgroundColor: COLORS.border,
  },
  stepTextGroup: {
    marginLeft: SPACING.sm,
  },
  stepTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  stepSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  stepLineDone: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.success,
    marginLeft: 11,
    marginVertical: 2,
  },
  stepLine: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.border,
    marginLeft: 11,
    marginVertical: 2,
  },
});
