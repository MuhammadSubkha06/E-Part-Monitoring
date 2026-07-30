import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialWithDerived } from '../types/material.types';
import { Colors, Spacing, Typography } from '../constants/theme';
import StatusBadge from './StatusBadge';

interface Props {
  material: MaterialWithDerived;
}

const CATEGORY_LABEL: Record<string, string> = {
  PCB: 'PCB Part',
  IC_REEL: 'IC Reel',
  IC_TRAY: 'IC Tray',
};

export default function MaterialSummary({ material }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Text style={styles.category}>{CATEGORY_LABEL[material.category]}</Text>
        <Text style={styles.lot}>LOT {material.lotNumber}</Text>
      </View>
      <Text style={styles.partNumber}>{material.partNumber}</Text>
      <Text style={styles.partName} numberOfLines={2}>
        {material.partName}
      </Text>
      <View style={styles.badgeRow}>
        {material.derived.badges.map(b => (
          <View key={b} style={styles.badgeSpacing}>
            <StatusBadge status={b} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  category: {
    ...Typography.label,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  lot: {
    ...Typography.label,
    color: Colors.textMuted,
  },
  partNumber: {
    ...Typography.mono,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  partName: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  badgeSpacing: {
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
});
