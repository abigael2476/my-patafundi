import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../src/constants/theme';
import { MOCK_CATEGORIES, MOCK_FUNDIS } from '../../src/data/mockData';
import { SearchBar } from '../../src/components/home/SearchBar';
import { FundiCard } from '../../src/components/home/FundiCard';
import { FilterModal } from '../../src/components/home/FilterModal';
import { FilterOptions } from '../../src/types';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.q || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    params.category || 'all'
  );
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'recommended',
    minRating: 0,
    maxDistance: 50,
  });

  const filteredFundis = useMemo(() => {
    return MOCK_FUNDIS.filter((fundi) => {
      // Text Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = fundi.name.toLowerCase().includes(q);
        const matchesCategory = fundi.category.toLowerCase().includes(q);
        const matchesSkill = fundi.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesSkill) return false;
      }

      // Category chip filter match
      if (selectedCategoryId !== 'all' && fundi.categoryId !== selectedCategoryId) {
        return false;
      }

      // Rating filter
      if (filters.minRating && fundi.rating < filters.minRating) {
        return false;
      }

      // Distance filter
      if (filters.maxDistance && fundi.distanceKm > filters.maxDistance) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (filters.sortBy === 'price_low') return a.estimatedPrice - b.estimatedPrice;
      if (filters.sortBy === 'price_high') return b.estimatedPrice - a.estimatedPrice;
      return 0;
    });
  }, [searchQuery, selectedCategoryId, filters]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Search Input */}
      <View style={styles.topHeader}>
        <Text style={styles.pageTitle}>Find a Fundi 🔍</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setFilterModalVisible(true)}
          placeholder="Search by name, skill, category..."
        />
      </View>

      {/* Category Chips Bar */}
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          <TouchableOpacity
            style={[
              styles.chip,
              selectedCategoryId === 'all' && styles.activeChip,
            ]}
            onPress={() => setSelectedCategoryId('all')}
          >
            <Text
              style={[
                styles.chipText,
                selectedCategoryId === 'all' && styles.activeChipText,
              ]}
            >
              All Services
            </Text>
          </TouchableOpacity>

          {MOCK_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isSelected && styles.activeChip]}
                onPress={() => setSelectedCategoryId(cat.id)}
              >
                <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search Results Summary */}
      <View style={styles.resultSummaryRow}>
        <Text style={styles.resultCountText}>
          {filteredFundis.length} {filteredFundis.length === 1 ? 'Fundi' : 'Fundis'} Available
        </Text>
        {filters.sortBy !== 'recommended' && (
          <Text style={styles.sortIndicatorText}>
            Sorted by: {filters.sortBy?.replace('_', ' ')}
          </Text>
        )}
      </View>

      {/* Results List */}
      {filteredFundis.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={60} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No Fundis Found</Text>
          <Text style={styles.emptySubtitle}>
            We couldn't find any artisan matching your exact search criteria. Try resetting filters.
          </Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategoryId('all');
              setFilters({ sortBy: 'recommended', minRating: 0, maxDistance: 50 });
            }}
          >
            <Text style={styles.resetBtnText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredFundis}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <FundiCard
              fundi={item}
              variant="horizontal"
              onPress={() => router.push(`/fundi/${item.id}` as any)}
            />
          )}
        />
      )}

      {/* Filter Sheet Modal */}
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
  topHeader: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  pageTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  chipsWrapper: {
    marginVertical: SPACING.xs,
  },
  chipsScroll: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    marginRight: SPACING.xs,
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
  resultSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },
  resultCountText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  sortIndicatorText: {
    fontSize: 10,
    color: COLORS.accent,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  resetBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  resetBtnText: {
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});
