import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { masterDataService } from '../services/MasterDataService';
import { MasterMsl } from '../types/master.types';
import SectionCard from './SectionCard';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface Props {
  value: string | null;
  onChange: (level: string) => void;
  suggested?: string;
}

/**
 * Stock In requires the operator to actively select the material's Rank /
 * MSL Level (rather than only auto-displaying whatever Master Part says).
 * `suggested` — the MSL Level read from Master Part — is highlighted so the
 * operator can quickly confirm it, but any level can still be picked.
 */
export default function MslLevelPicker({ value, onChange, suggested }: Props) {
  const [levels, setLevels] = useState<MasterMsl[]>([]);

  useEffect(() => {
    masterDataService.getAllMsl().then(setLevels);
  }, []);

  return (
    <SectionCard title="Rank / MSL Level (Required)">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {levels.map(msl => (
          <TouchableOpacity
            key={msl.level}
            style={[styles.chip, value === msl.level && styles.chipSelected]}
            onPress={() => onChange(msl.level)}
          >
            <Text style={[styles.chipText, value === msl.level && styles.chipTextSelected]}>{msl.level}</Text>
            {msl.level === suggested && <Text style={styles.suggestedTag}>Master Part</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {value ? (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Selected: {value}</Text>
        </View>
      ) : (
        <View style={styles.warning}>
          <Text style={styles.warningText}>Operator must select a Rank / MSL Level to continue.</Text>
        </View>
      )}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.sm, paddingRight: Spacing.md },
  chip: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.bodyStrong,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.textInverse,
  },
  suggestedTag: {
    ...Typography.caption,
    color: Colors.textInverse,
    opacity: 0.85,
    marginTop: 1,
  },
  summary: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.successBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  summaryText: {
    ...Typography.bodyStrong,
    color: Colors.success,
  },
  warning: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.warningBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  warningText: {
    ...Typography.bodyStrong,
    color: Colors.warning,
  },
});
