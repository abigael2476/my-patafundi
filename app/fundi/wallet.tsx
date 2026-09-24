import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { Header } from '../../src/components/common/Header';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { useAuth } from '../../src/context/AuthContext';

interface PayoutTransaction {
  id: string;
  refCode: string;
  amount: number;
  phone: string;
  date: string;
  status: 'completed' | 'processing' | 'failed';
}

export default function FundiWalletScreen() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(12750);
  const [pendingBalance, setPendingBalance] = useState(2550);
  const [lifetimePayouts, setLifetimePayouts] = useState(48200);

  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('12750');
  const [phone, setPhone] = useState(user?.phone || '+254 712 345 678');
  const [loading, setLoading] = useState(false);

  const [transactions, setTransactions] = useState<PayoutTransaction[]>([
    {
      id: 'TX-901',
      refCode: 'QHK90218X',
      amount: 5100,
      phone: '+254 712 345 678',
      date: 'Today, 02:15 PM',
      status: 'completed',
    },
    {
      id: 'TX-892',
      refCode: 'QHK81172A',
      amount: 10200,
      phone: '+254 712 345 678',
      date: '22 Aug 2026',
      status: 'completed',
    },
    {
      id: 'TX-841',
      refCode: 'QHK72901B',
      amount: 7650,
      phone: '+254 712 345 678',
      date: '18 Aug 2026',
      status: 'completed',
    },
  ]);

  const handleWithdrawSubmit = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }
    if (amt > balance) {
      Alert.alert('Insufficient Balance', `Your maximum withdrawable balance is KSh ${balance.toLocaleString()}.`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setWithdrawModalVisible(false);

      const newRef = 'QHK' + Math.floor(100000 + Math.random() * 900000);
      const newTx: PayoutTransaction = {
        id: `TX-${Math.floor(100 + Math.random() * 900)}`,
        refCode: newRef,
        amount: amt,
        phone: phone,
        date: 'Just Now',
        status: 'completed',
      };

      setBalance((prev) => prev - amt);
      setLifetimePayouts((prev) => prev + amt);
      setTransactions((prev) => [newTx, ...prev]);

      Alert.alert(
        'M-Pesa Payout Successful! 📲',
        `KSh ${amt.toLocaleString()} has been sent to ${phone}.\n\nM-Pesa Ref: ${newRef}`,
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showBack title="Fundi Wallet & Payouts" transparent />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Main Wallet Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroSub}>AVAILABLE FOR WITHDRAWAL</Text>
              <Text style={styles.heroBalance}>KSh {balance.toLocaleString()}</Text>
            </View>
            <Badge label="INSTANT M-PESA" variant="accent" size="sm" />
          </View>

          <View style={styles.heroStatsRow}>
            <View>
              <Text style={styles.statLabel}>PENDING JOBS</Text>
              <Text style={styles.statValue}>KSh {pendingBalance.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.statLabel}>LIFETIME WITHDRAWN</Text>
              <Text style={styles.statValue}>KSh {lifetimePayouts.toLocaleString()}</Text>
            </View>
          </View>

          <Button
            title="Withdraw to M-Pesa 📲"
            variant="accent"
            size="lg"
            onPress={() => setWithdrawModalVisible(true)}
            style={{ marginTop: SPACING.md }}
          />
        </View>

        {/* How Payouts Work Info Card */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconBox}>
            <Ionicons name="information-circle" size={24} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>100% Earnings Guarantee (0% Commission 🎉)</Text>
            <Text style={styles.infoDesc}>
              During our launch promotion, 100% of your earnings go directly to your wallet with ZERO PataFundi commission deductions. Click "Withdraw" anytime to receive funds directly into your M-Pesa.
            </Text>
          </View>
        </View>

        {/* Commission Breakdown Breakdown Card */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Platform Fee Structure (Launch Promo)</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Gross Customer Payment</Text>
            <Text style={styles.breakdownVal}>100%</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>PataFundi Platform Fee</Text>
            <Text style={[styles.breakdownVal, { color: COLORS.success }]}>0% (Free Launch Promo)</Text>
          </View>
          <View style={[styles.breakdownRow, { borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: 8 }]}>
            <Text style={[styles.breakdownLabel, { fontWeight: '800', color: COLORS.textPrimary }]}>Your Net Retained Earnings</Text>
            <Text style={[styles.breakdownVal, { fontWeight: '800', color: COLORS.success }]}>100%</Text>
          </View>
        </View>

        {/* M-Pesa Withdrawal History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>M-Pesa Payout Ledger 📜</Text>
          <Text style={styles.subCount}>{transactions.length} transfers</Text>
        </View>

        <View style={styles.txList}>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.txCard}>
              <View style={styles.txIconCircle}>
                <Ionicons name="phone-portrait" size={20} color={COLORS.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txRef}>M-Pesa Ref: {tx.refCode}</Text>
                <Text style={styles.txMeta}>{tx.date} • Sent to {tx.phone}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.txAmount}>+KSh {tx.amount.toLocaleString()}</Text>
                <Text style={styles.txStatus}>COMPLETED</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* M-Pesa Withdrawal Modal */}
      <Modal
        visible={withdrawModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWithdrawModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Withdraw to M-Pesa</Text>
              <TouchableOpacity onPress={() => setWithdrawModalVisible(false)}>
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Funds will be sent instantly to your M-Pesa registered mobile line.
            </Text>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>M-Pesa Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.inputLabel}>Amount (KSh)</Text>
                <TouchableOpacity onPress={() => setWithdrawAmount(balance.toString())}>
                  <Text style={styles.maxLink}>Max: KSh {balance.toLocaleString()}</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textInput}
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Fee summary */}
            <View style={styles.modalFeeBox}>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Transfer Amount:</Text>
                <Text style={styles.feeVal}>KSh {parseFloat(withdrawAmount || '0').toLocaleString()}</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>M-Pesa B2C Fee:</Text>
                <Text style={[styles.feeVal, { color: COLORS.success }]}>FREE (Covered by PataFundi)</Text>
              </View>
            </View>

            <Button
              title={loading ? 'Processing Transfer...' : 'Confirm M-Pesa Payout 💸'}
              variant="accent"
              size="lg"
              loading={loading}
              onPress={handleWithdrawSubmit}
              style={{ marginTop: SPACING.md }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroSub: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  heroBalance: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginTop: 2,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: SPACING.lg,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 122, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  infoDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  breakdownCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  breakdownTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  breakdownLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  breakdownVal: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subCount: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  txList: {
    gap: SPACING.xs,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.sm,
  },
  txIconCircle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txRef: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  txMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  txAmount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '800',
    color: COLORS.success,
  },
  txStatus: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  maxLink: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalFeeBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 4,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feeLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  feeVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
