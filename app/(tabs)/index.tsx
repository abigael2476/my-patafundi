import React, { useState, useEffect } from 'react';
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
import { MOCK_CATEGORIES, MOCK_FUNDIS } from '../../src/data/mockData';
import { useAuth } from '../../src/context/AuthContext';
import { useApp } from '../../src/context/AppContext';
import { SearchBar } from '../../src/components/home/SearchBar';
import { CategoryCard } from '../../src/components/home/CategoryCard';
import { FundiCard } from '../../src/components/home/FundiCard';
import { FilterModal } from '../../src/components/home/FilterModal';
import { FilterOptions, Booking } from '../../src/types';
import { Badge } from '../../src/components/common/Badge';
import { Button } from '../../src/components/common/Button';
import { ApiService } from '../../src/services/api';

export default function HomeScreen() {
  const { user, switchRole } = useAuth();
  const { bookings, updateBookingStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'recommended',
    minRating: 0,
    maxDistance: 50,
  });

  const popularFundis = MOCK_FUNDIS.filter((f) => f.isPopular);
  const nearbyFundis = MOCK_FUNDIS.filter(
    (f) => selectedCategory === 'all' || f.categoryId === selectedCategory
  );

  const handleCategoryPress = (catId: string) => {
    if (selectedCategory === catId) {
      setSelectedCategory('all');
    } else {
      setSelectedCategory(catId);
    }
  };

  const handleSearchSubmit = (text: string) => {
    setSearchQuery(text);
    if (text.length > 1) {
      router.push({
        pathname: '/(tabs)/search' as any,
        params: { q: text },
      });
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    updateBookingStatus(bookingId, newStatus as any);
    await ApiService.updateBookingStatus(bookingId, newStatus);
    Alert.alert('Status Updated', `Booking status changed to ${newStatus.toUpperCase()}`);
  };

  // ----------------------------------------------------
  // ROLE 1: FUNDI WORKSPACE VIEW
  // ----------------------------------------------------
  if (user?.role === 'fundi') {
    const fundiBookings = bookings;
    const pendingCount = fundiBookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length;
    const completedCount = fundiBookings.filter((b) => b.status === 'completed').length;
    const totalEarnings = fundiBookings
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + (b.fundiEarnings || Math.round(b.amount * 0.85)), 0);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.userGreetingBox}>
              <Badge label="FUNDI PRO WORKSPACE" variant="accent" size="sm" />
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.locationPin}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={[styles.locationText, { color: '#10B981', fontWeight: '700' }]}>
                  Verified Master Artisan • Online
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => router.push('/(tabs)/profile' as any)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            </TouchableOpacity>
          </View>



          {/* Fundi Metrics Grid */}
          <View style={styles.fundiGrid}>
            <View style={[styles.fundiCard, styles.fundiCardPrimary]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={styles.fundiMetricLabelLight}>TOTAL EARNINGS (NET)</Text>
                  <Text style={styles.fundiMetricValueLight}>KSh {totalEarnings.toLocaleString()}</Text>
                  <Text style={styles.fundiMetricSubLight}>After 15% PataFundi commission</Text>
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: COLORS.accent, paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.lg }}
                  onPress={() => router.push('/fundi/wallet' as any)}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: COLORS.textWhite, fontSize: 11, fontWeight: '800' }}>Manage Wallet 💼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: SPACING.md }}>
              <View style={[styles.fundiCard, { flex: 1 }]}>
                <Text style={styles.fundiMetricLabel}>ACTIVE JOBS</Text>
                <Text style={styles.fundiMetricValue}>{pendingCount}</Text>
                <Text style={styles.fundiMetricSub}>Requires attention</Text>
              </View>

              <View style={[styles.fundiCard, { flex: 1 }]}>
                <Text style={styles.fundiMetricLabel}>JOBS DONE</Text>
                <Text style={styles.fundiMetricValue}>{completedCount + 340}</Text>
                <Text style={styles.fundiMetricSub}>4.9 ★ Customer Rating</Text>
              </View>
            </View>
          </View>

          {/* Incoming Job Requests */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Client Job Requests 🛠️</Text>
            <Text style={styles.subCount}>{fundiBookings.length} total</Text>
          </View>

          <View style={styles.jobRequestsContainer}>
            {fundiBookings.map((b) => (
              <View key={b.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View>
                    <Text style={styles.jobId}>Booking #{b.id}</Text>
                    <Text style={styles.jobDate}>{b.date} • {b.timeSlot}</Text>
                  </View>
                  <Badge
                    label={b.status.toUpperCase()}
                    variant={b.status === 'completed' ? 'success' : b.status === 'confirmed' ? 'verified' : 'warning'}
                  />
                </View>

                <View style={styles.jobBody}>
                  <Text style={styles.jobAddress}>📍 {b.address}</Text>
                  <Text style={styles.jobDesc}>"{b.description}"</Text>

                  <View style={styles.paymentInfoRow}>
                    <Text style={styles.paymentLabel}>Customer Payment:</Text>
                    <Text style={styles.paymentGross}>KSh {b.amount.toLocaleString()}</Text>
                    <Text style={styles.paymentNet}>
                      (Net: KSh {(b.fundiEarnings || Math.round(b.amount * 0.85)).toLocaleString()})
                    </Text>
                  </View>
                </View>

                {/* Status Action Buttons */}
                <View style={styles.actionRow}>
                  {b.status === 'pending' && (
                    <Button
                      title="Accept Booking"
                      variant="primary"
                      size="sm"
                      onPress={() => handleStatusChange(b.id, 'confirmed')}
                    />
                  )}
                  {b.status === 'confirmed' && (
                    <Button
                      title="Mark In Progress"
                      variant="outline"
                      size="sm"
                      onPress={() => handleStatusChange(b.id, 'in_progress')}
                    />
                  )}
                  {(b.status === 'confirmed' || b.status === 'in_progress') && (
                    <Button
                      title="Mark Completed"
                      variant="accent"
                      size="sm"
                      onPress={() => handleStatusChange(b.id, 'completed')}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // ROLE 2: OWNER ADMIN VIEW
  // ----------------------------------------------------
  if (user?.role === 'owner') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.userGreetingBox}>
              <Badge label="PLATFORM OWNER ADMIN" variant="accent" size="sm" />
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.locationText}>Control Center • Revenue & System Admin</Text>
            </View>

            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => router.push('/(tabs)/profile' as any)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            </TouchableOpacity>
          </View>

          {/* Owner Dashboard Launch Card */}
          <View style={styles.ownerLaunchCard}>
            <View style={styles.ownerLaunchIcon}>
              <Ionicons name="bar-chart" size={32} color={COLORS.accent} />
            </View>
            <Text style={styles.ownerLaunchTitle}>Owner Revenue & Commission Control</Text>
            <Text style={styles.ownerLaunchSub}>
              View total platform gross volume, net commission earnings, active fundis, and update global commission rates.
            </Text>

            <Button
              title="Open Revenue Dashboard 💰"
              variant="accent"
              size="lg"
              onPress={() => router.push('/owner/dashboard' as any)}
              style={{ marginTop: SPACING.md }}
            />
          </View>


        </ScrollView>
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // ROLE 3: CLIENT / CUSTOMER DISCOVERY VIEW (DEFAULT)
  // ----------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Greeting Header */}
        <View style={styles.headerRow}>
          <View style={styles.userGreetingBox}>
            <Text style={styles.greetingSub}>GOOD MORNING 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Alex Kariuki'}</Text>
            <View style={styles.locationPin}>
              <Ionicons name="location" size={13} color={COLORS.accent} />
              <Text style={styles.locationText}>{user?.address || 'Westlands, Nairobi'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => router.push('/(tabs)/profile' as any)}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri: user?.avatar || 'https://ui-avatars.com/api/?name=Alex+Kariuki&background=081E45&color=FF7A00&bold=true',
              }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar Section */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearchSubmit}
            onFilterPress={() => setFilterModalVisible(true)}
          />
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoCard}>
          <View style={styles.promoTextContainer}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>EMERGENCY SERVICE</Text>
            </View>
            <Text style={styles.promoTitle}>Need a Fundi Right Now?</Text>
            <Text style={styles.promoSubtitle}>Fastest arrival in 20 minutes across Nairobi</Text>
            <TouchableOpacity
              style={styles.promoBtn}
              onPress={() => router.push('/(tabs)/search' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.promoBtnText}>Find Urgent Fundi</Text>
              <Ionicons name="flash" size={14} color={COLORS.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
            }}
            style={styles.promoImage}
          />
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search' as any)}>
            <Text style={styles.seeAllText}>See All ({MOCK_CATEGORIES.length})</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {MOCK_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isSelected={selectedCategory === cat.id}
              onPress={() => handleCategoryPress(cat.id)}
              variant="horizontal"
            />
          ))}
        </ScrollView>

        {/* Popular Fundis Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Fundis ⭐</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search' as any)}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularScroll}
        >
          {popularFundis.map((fundi) => (
            <FundiCard
              key={fundi.id}
              fundi={fundi}
              variant="vertical"
              onPress={() => router.push(`/fundi/${fundi.id}` as any)}
              onBookPress={() => router.push(`/booking/${fundi.id}` as any)}
            />
          ))}
        </ScrollView>

        {/* Nearby Services List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Services 📍</Text>
          <Text style={styles.subCount}>{nearbyFundis.length} available</Text>
        </View>

        <View style={styles.nearbyContainer}>
          {nearbyFundis.map((fundi) => (
            <FundiCard
              key={fundi.id}
              fundi={fundi}
              variant="horizontal"
              onPress={() => router.push(`/fundi/${fundi.id}` as any)}
            />
          ))}
        </View>
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApplyFilters={(newF) => setFilters(newF)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  userGreetingBox: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  locationPin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: 2,
    fontWeight: '500',
  },
  avatarButton: {
    padding: 2,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
  },
  roleNoticeBanner: {
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  roleNoticeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  switchLink: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 2,
  },
  fundiGrid: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    marginVertical: SPACING.sm,
  },
  fundiCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  fundiCardPrimary: {
    backgroundColor: COLORS.primary,
  },
  fundiMetricLabelLight: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  fundiMetricValueLight: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  fundiMetricSubLight: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  fundiMetricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  fundiMetricValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  fundiMetricSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  jobRequestsContainer: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  jobCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  jobId: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  jobDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  jobBody: {
    marginVertical: SPACING.xs,
  },
  jobAddress: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  jobDesc: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  paymentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },
  paymentLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  paymentGross: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  paymentNet: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  ownerLaunchCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  ownerLaunchIcon: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 122, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  ownerLaunchTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  ownerLaunchSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  searchSection: {
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  promoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xxl,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  promoTextContainer: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  promoBadge: {
    backgroundColor: 'rgba(255, 122, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  promoBadgeText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '800',
  },
  promoSubtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  promoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
  },
  promoImage: {
    width: 100,
    height: 110,
    borderRadius: RADIUS.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  seeAllText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.accent,
    fontWeight: '700',
  },
  subCount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  categoriesScroll: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
  },
  popularScroll: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
  },
  nearbyContainer: {
    paddingHorizontal: SPACING.md,
  },
});
