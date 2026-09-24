import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../src/constants/theme';
import { Header } from '../src/components/common/Header';
import { Input } from '../src/components/common/Input';
import { Button } from '../src/components/common/Button';

export default function SupportScreen() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const faqs = [
    {
      question: 'How do I book a Fundi on PataFundi?',
      answer: 'Browse categories or search for specific skills (e.g. plumber, electrician). Select a fundi profile, pick a date and time slot, enter your location, and click Confirm Booking.',
    },
    {
      question: 'How does payment work?',
      answer: 'Payment can be made seamlessly via M-Pesa STK Push, Credit/Debit Card, or Cash upon job completion. All prices include transparent upfront estimates.',
    },
    {
      question: 'What if a Fundi does not arrive on time?',
      answer: 'You can track fundi status in your Bookings tab or call them directly. If a fundi is more than 30 minutes late, contact support to dispatch a replacement immediately.',
    },
    {
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Yes! Free cancellations are supported up to 1 hour before scheduled arrival time directly from your My Bookings tab.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmitTicket = () => {
    if (!subject || !message) {
      Alert.alert('Required Fields', 'Please fill in both subject and message.');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubject('');
      setMessage('');
      Alert.alert('Ticket Submitted', 'Thank you! Our support team will get back to you within 15 minutes.');
    }, 800);
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+254700000000').catch(() => {
      Alert.alert('Call Support', 'Dialing PataFundi Support Hotline: +254 700 000 000');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Contact Support" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Urgent Contact Options */}
        <View style={styles.contactOptionsRow}>
          <TouchableOpacity style={styles.contactCard} onPress={handleCallSupport} activeOpacity={0.8}>
            <View style={styles.iconCircle}>
              <Ionicons name="call" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.contactCardTitle}>Call Support</Text>
            <Text style={styles.contactCardSub}>24/7 Toll Free</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Linking.openURL('https://wa.me/254700000000')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(37, 211, 102, 0.15)' }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            </View>
            <Text style={styles.contactCardTitle}>WhatsApp Us</Text>
            <Text style={styles.contactCardSub}>Instant Chat</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs Accordion */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <View key={index} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              {isOpen && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
            </View>
          );
        })}

        {/* Send Support Message Form */}
        <Text style={styles.sectionTitle}>Send Us a Message</Text>
        <View style={styles.formCard}>
          <Input
            label="Subject"
            placeholder="e.g. Booking issue, billing query..."
            icon="help-circle-outline"
            value={subject}
            onChangeText={setSubject}
          />

          <Input
            label="Your Message"
            placeholder="Explain how we can assist you..."
            icon="create-outline"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={{ height: 100, paddingTop: 10 }}
          />

          <Button
            title="Submit Support Ticket"
            onPress={handleSubmitTicket}
            variant="primary"
            size="lg"
            loading={sending}
            icon="paper-plane-outline"
          />
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
    paddingBottom: SPACING.xl,
  },
  contactOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  contactCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  contactCardTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  contactCardSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
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
  faqCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  faqAnswer: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.xs,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.md,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
});
