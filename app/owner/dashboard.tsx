import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { Header } from '../../src/components/common/Header';
import { ApiService } from '../../src/services/api';
import { OwnerSummary, EarningsLog } from '../../src/types';
import { Badge } from '../../src/components/common/Badge';

export default function OwnerDashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<OwnerSummary | null>(null);
  const [logs, setLogs] = useState<EarningsLog[]>([]);
  const [commissionInput, setCommissionInput] = useState<number>(0);
  const [updatingComm, setUpdatingComm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const sumData = await ApiService.getOwnerSummary();
      const logData = await ApiService.getEarningsLog();
      setSummary(sumData);
      setLogs(logData);
      setCommissionInput(sumData ? sumData.commissionRatePercent : 0);
    } catch (e) {
      console.error('Error loading owner summary:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateCommission = async (newRate: number) => {
    setUpdatingComm(true);
    const success = await ApiService.updateCommissionRate(newRate);
    setUpdatingComm(false);

    if (success) {
      setCommissionInput(newRate);
      Alert.alert('Commission Updated', `Platform commission rate updated to ${newRate}% successfully!`);
      loadData();
    } else {
      Alert.alert('Update Failed', 'Failed to update commission rate.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Owner Revenue Dashboard" showBack />
      
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Calculating platform earnings...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Top Banner */}
          <View style={styles.bannerCard}>
            <View style={styles.bannerIcon}>
              <Ionicons name="wallet" size={32} color={COLORS.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Platform Traffic Launch Strategy</Text>
              <Text style={styles.bannerSub}>
                100% Free App Promo Active (0% Commission / 0 Fees to drive early growth)
              </Text>
            </View>
          </View>

          {/* Key Metrics Grid */}
          <View style={styles.metricsGrid}>
            {/* Owner Total Commission */}
            <View style={[styles.metricCard, styles.highlightCard]}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabelLight}>OWNER COMMISSION EARNED</Text>
                <Ionicons name="cash" size={20} color={COLORS.accent} />
              </View>
              <Text style={styles.metricValueLight}>
                KSh {(summary?.totalOwnerCommission || 0).toLocaleString()}
              </Text>
              <Text style={styles.metricSubLight}>
                Net platform income ({summary?.commissionRatePercent ?? 0}% rate)
              </Text>
            </View>

            {/* Total Gross Volume */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>TOTAL GROSS VOLUME</Text>
              <Text style={styles.metricValue}>
                KSh {(summary?.totalGrossVolume || 0).toLocaleString()}
              </Text>
              <Text style={styles.metricSub}>Gross customer booking value</Text>
            </View>

            {/* Total Fundi Payouts */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>FUNDI NET PAYOUTS</Text>
              <Text style={styles.metricValue}>
                KSh {(summary?.totalFundiPayouts || 0).toLocaleString()}
              </Text>
              <Text style={styles.metricSub}>Disbursed to service providers</Text>
            </View>

            {/* Completed Bookings */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>COMPLETED JOBS</Text>
              <Text style={styles.metricValue}>
                {summary?.completedBookingsCount || 0}
              </Text>
              <Text style={styles.metricSub}>Fulfilled artisan services</Text>
            </View>
          </View>

          {/* Commission Rate Settings Control */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="options-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Platform Commission Rate Settings</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Set the percentage fee charged by PataFundi on completed customer bookings (Currently set to 0% for early traffic acquisition).
            </Text>

            <View style={styles.currentRateBox}>
              <Text style={styles.currentRateLabel}>Active Rate:</Text>
              <Text style={styles.currentRateValue}>{commissionInput}% (Free Promo)</Text>
            </View>

            <View style={styles.ratePresetsRow}>
              {[0, 5, 10, 15, 20].map((rate) => (
                <TouchableOpacity
                  key={rate}
                  style={[
                    styles.presetBtn,
                    commissionInput === rate && styles.activePresetBtn,
                  ]}
                  onPress={() => handleUpdateCommission(rate)}
                  disabled={updatingComm}
                >
                  <Text
                    style={[
                      styles.presetText,
                      commissionInput === rate && styles.activePresetText,
                    ]}
                  >
                    {rate}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {updatingComm && (
              <ActivityIndicator size="small" color={COLORS.accent} style={{ marginTop: 8 }} />
            )}
          </View>

          {/* Transaction Ledger */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="receipt-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Transaction Commission Ledger</Text>
            </View>

            {logs.length === 0 ? (
              <Text style={styles.emptyText}>No transaction records available yet.</Text>
            ) : (
              logs.map((log, index) => (
                <View key={log.bookingId || index} style={styles.logRow}>
                  <View style={styles.logHeader}>
                    <View>
                      <Text style={styles.logBookingId}>#{log.bookingId}</Text>
                      <Text style={styles.logFundi}>{log.fundiName} ({log.category})</Text>
                    </View>
                    <Badge
                      label={log.status.toUpperCase()}
                      variant={log.status === 'completed' ? 'success' : 'verified'}
                      size="sm"
                    />
                  </View>

                  <View style={styles.logBreakdown}>
                    <View style={styles.breakdownCol}>
                      <Text style={styles.bdLabel}>Gross Paid</Text>
                      <Text style={styles.bdValue}>KSh {log.amount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.breakdownCol}>
                      <Text style={styles.bdLabel}>Owner Fee ({log.commissionRate}%)</Text>
                      <Text style={styles.bdCommission}>+KSh {log.commissionAmount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.breakdownCol}>
                      <Text style={styles.bdLabel}>Fundi Net</Text>
                      <Text style={styles.bdValue}>KSh {log.fundiEarnings.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255, 122, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  bannerTitle: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
  },
  bannerSub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: 2,
  },
  metricsGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  metricCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  highlightCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.accent,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricLabelLight: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  metricValueLight: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  metricSubLight: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  metricSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  sectionDesc: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  currentRateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  currentRateLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  currentRateValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.accent,
  },
  ratePresetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 3,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  activePresetBtn: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  presetText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  activePresetText: {
    color: COLORS.textWhite,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
    marginVertical: SPACING.md,
  },
  logRow: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  logBookingId: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.primary,
  },
  logFundi: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  logBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 6,
    marginTop: 4,
  },
  breakdownCol: {
    alignItems: 'flex-start',
  },
  bdLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  bdValue: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  bdCommission: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
  },
});
