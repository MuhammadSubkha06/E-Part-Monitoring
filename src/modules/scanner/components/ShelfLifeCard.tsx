import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialWithDerived } from '../types/material.types';
import { Colors, Spacing, Typography } from '../constants/theme';
import SectionCard from './SectionCard';
import { formatDate } from '../utils/dateUtils';

interface Props {
  material: MaterialWithDerived;
}

const STATUS_COLOR: Record<string, string> = {
  VALID: Colors.success,
  NEAR_EXPIRED: Colors.amber,
  EXPIRED: Colors.danger,
  NOT_APPLICABLE: Colors.textMuted,
};

const STATUS_LABEL: Record<string, string> = {
  VALID: 'Valid',
  NEAR_EXPIRED: 'Near Expired',
  EXPIRED: 'Expired',
  NOT_APPLICABLE: '—',
};

export default function ShelfLifeCard({ material }: Props) {
  if (material.category !== 'PCB') return null;
  const d = material.derived;
  const color = STATUS_COLOR[d.shelfLifeStatus];

  return (
    <SectionCard title="Shelf Life">
      <View style={styles.row}>
        <Metric label="Manufacturing Date" value={formatDate(material.manufacturingDate)} />
        <Metric label="Expire Date" value={formatDate(d.expireDate)} />
      </View>
      <View style={styles.row}>
        <Metric
          label="Remaining Days"
          value={d.remainingShelfLifeDays !== null ? `${d.remainingShelfLifeDays} days` : '—'}
          emphasis={color}
        />
        <Metric label="Status" value={STATUS_LABEL[d.shelfLifeStatus]} emphasis={color} />
      </View>
    </SectionCard>
  );
}

function Metric({ label, value, emphasis }: { label: string; value: string; emphasis?: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, emphasis ? { color: emphasis } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  metric: { flex: 1 },
  metricLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metricValue: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
});
