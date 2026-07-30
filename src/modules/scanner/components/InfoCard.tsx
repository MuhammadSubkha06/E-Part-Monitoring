import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface Props {
  label: string;
  value: string;
  mono?: boolean;
  flexBasis?: '100%' | '50%';
}

export default function InfoCard({ label, value, mono, flexBasis = '50%' }: Props) {
  return (
    <View style={[styles.field, { flexBasis }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, mono && styles.mono]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    ...Typography.bodyStrong,
    color: Colors.textPrimary,
  },
  mono: {
    ...Typography.mono,
  },
});
