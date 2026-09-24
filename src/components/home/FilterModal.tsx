import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterOptions } from '../../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { Button } from '../common/Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (newFilters: FilterOptions) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const reset = {
      sortBy: 'recommended' as const,
      minRating: 0,
      maxDistance: 50,
    };
    setTempFilters(reset);
    onApplyFilters(reset);
    onClose();
  };

  const sortOptions = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Nearest First', value: 'distance' },
    { label: 'Price: Low to High', value: 'price_low' },
    { label: 'Price: High to Low', value: 'price_high' },
  ];

  const ratingOptions = [0, 4.0, 4.5, 4.8];
  const distanceOptions = [2, 5, 10, 25, 50];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter Fundis</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Sort By Section */}
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.chipRow}>
              {sortOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.chip,
                    tempFilters.sortBy === opt.value && styles.activeChip,
                  ]}
                  onPress={() => setTempFilters({ ...tempFilters, sortBy: opt.value as any })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      tempFilters.sortBy === opt.value && styles.activeChipText,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Minimum Rating */}
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            <View style={styles.chipRow}>
              {ratingOptions.map((r) => (
                <TouchableOpacity
                  key={r.toString()}
                  style={[
                    styles.chip,
                    tempFilters.minRating === r && styles.activeChip,
                  ]}
                  onPress={() => setTempFilters({ ...tempFilters, minRating: r })}
                >
                  <Ionicons
                    name="star"
                    size={14}
                    color={tempFilters.minRating === r ? COLORS.textWhite : COLORS.accent}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      tempFilters.minRating === r && styles.activeChipText,
                    ]}
                  >
                    {r === 0 ? 'Any Rating' : `${r}+ Stars`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Max Distance */}
            <Text style={styles.sectionTitle}>Max Distance (km)</Text>
            <View style={styles.chipRow}>
              {distanceOptions.map((d) => (
                <TouchableOpacity
                  key={d.toString()}
                  style={[
                    styles.chip,
                    tempFilters.maxDistance === d && styles.activeChip,
                  ]}
                  onPress={() => setTempFilters({ ...tempFilters, maxDistance: d })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      tempFilters.maxDistance === d && styles.activeChipText,
                    ]}
                  >
                    Within {d} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Footer CTA */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <Text style={styles.resetText}>Reset All</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Button title="Apply Filters" onPress={handleApply} variant="primary" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '80%',
    paddingBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  scrollBody: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  resetBtn: {
    paddingVertical: SPACING.sm,
  },
  resetText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
