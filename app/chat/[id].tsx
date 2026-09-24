import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../src/constants/theme';
import { MOCK_FUNDIS } from '../../src/data/mockData';
import { ChatMessage, Fundi } from '../../src/types';
import { ApiService } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';

export default function ChatScreen() {
  const { id, bookingId } = useLocalSearchParams<{ id: string; bookingId?: string }>();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  const [fundi, setFundi] = useState<Fundi | undefined>(
    MOCK_FUNDIS.find((f) => f.id === id) || MOCK_FUNDIS[0]
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const quickPrompts = [
    'Where are you currently?',
    'Are you on your way?',
    'I am at home waiting.',
    'How long will it take?',
  ];

  useEffect(() => {
    loadChat();
    // Live chat polling every 2.5s for real P2P messaging
    const interval = setInterval(async () => {
      const history = await ApiService.getChatMessages(id, bookingId);
      setMessages(history);
    }, 2500);

    return () => clearInterval(interval);
  }, [id, bookingId]);

  const loadChat = async () => {
    setLoading(true);
    const targetFundi = await ApiService.getFundiById(id);
    if (targetFundi) {
      setFundi(targetFundi);
    }
    const history = await ApiService.getChatMessages(id, bookingId);
    setMessages(history);
    setLoading(false);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || sending) return;

    setInputText('');
    setSending(true);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `USER-MSG-${Date.now()}`,
      bookingId,
      fundiId: fundi?.id || id,
      senderId: user?.id || 'client_1',
      senderRole: (user?.role as 'client' | 'fundi') || 'client',
      senderName: user?.name || 'Customer',
      receiverId: fundi?.id || id,
      text: text.trim(),
      timestamp: nowStr,
      isRead: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      await ApiService.sendChatMessage(userMsg);
    } catch (e) {
      console.warn('Failed to send message:', e);
    } finally {
      setSending(false);
    }
  };

  const handleCall = () => {
    if (!fundi?.phone) return;
    Linking.openURL(`tel:${fundi.phone}`).catch(() => {
      Alert.alert('Call', `Dialing ${fundi.phone}`);
    });
  };

  const handleWhatsApp = () => {
    if (!fundi?.whatsapp) return;
    const msg = encodeURIComponent(`Hi ${fundi.name}, messaging from PataFundi chat.`);
    Linking.openURL(`https://wa.me/${fundi.whatsapp}?text=${msg}`).catch(() => {
      Alert.alert('WhatsApp', `Opening WhatsApp for ${fundi.phone}`);
    });
  };

  const handleOpenTracking = () => {
    if (bookingId) {
      router.push(`/booking/track/${bookingId}` as any);
    } else {
      router.push(`/booking/track/BK-9021` as any);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.senderRole === 'client';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.fundiRow]}>
        {!isUser && (
          <Image source={{ uri: fundi?.avatar }} style={styles.chatAvatar} />
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.fundiBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.fundiText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.fundiTimestamp]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Image source={{ uri: fundi?.avatar }} style={styles.headerAvatar} />

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.headerName} numberOfLines={1}>
              {fundi?.name}
            </Text>
            {fundi?.isVerified && (
              <Ionicons name="checkmark-circle" size={16} color={COLORS.accent} style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.headerSub}>
            🟢 Online • {fundi?.category} Specialist
          </Text>
        </View>

        {/* Quick Action Icons */}
        <TouchableOpacity style={styles.headerActionBtn} onPress={handleOpenTracking}>
          <Ionicons name="map-outline" size={20} color={COLORS.accent} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerActionBtn} onPress={handleCall}>
          <Ionicons name="call" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerActionBtn} onPress={handleWhatsApp}>
          <FontAwesome name="whatsapp" size={20} color="#25D366" />
        </TouchableOpacity>
      </View>

      {/* Live Map Banner Shortcut */}
      <TouchableOpacity style={styles.mapBannerBar} onPress={handleOpenTracking} activeOpacity={0.8}>
        <View style={styles.mapBannerContent}>
          <Ionicons name="navigate-circle" size={20} color={COLORS.accent} />
          <Text style={styles.mapBannerText}>
            Track {fundi?.name}'s live location on map ("See how far")
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.accent} />
      </TouchableOpacity>

      {/* Messages Feed */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.feedContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Quick Suggestion Chips */}
      <View style={styles.promptsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={quickPrompts}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.promptChip}
              onPress={() => handleSend(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.promptText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn} onPress={() => Alert.alert('Attachment', 'Share photo or location')}>
            <Ionicons name="add-circle-outline" size={26} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder={`Message ${fundi?.name || 'Fundi'}...`}
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || sending}
          >
            <Ionicons name="send" size={18} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  backBtn: {
    marginRight: SPACING.xs,
    padding: 4,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  mapBannerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  mapBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapBannerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.accentDark,
    marginLeft: SPACING.xs,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.xs,
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  feedContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  fundiRow: {
    justifyContent: 'flex-start',
  },
  chatAvatar: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 4,
    ...SHADOWS.small,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  fundiBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  messageText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.textWhite,
  },
  fundiText: {
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  fundiTimestamp: {
    color: COLORS.textMuted,
  },
  promptsContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.background,
  },
  promptChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  promptText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  attachBtn: {
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.border,
  },
});
