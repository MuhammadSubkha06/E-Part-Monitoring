import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialStatus } from '../types/material.types';
import { STATUS_CONFIG } from '../constants/statusConfig';
import { Radius, Spacing, Typography } from '../constants/theme';

interface Props {
  status: MaterialStatus;
  size?: 'sm' | 'lg';
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const visual = STATUS_CONFIG[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: visual.background },
        size === 'lg' && styles.badgeLg,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: visual.color }]} />
      <Text
        style={[styles.text, { color: visual.color }, size === 'lg' && styles.textLg]}
        numberOfLines={1}
      >
        {visual.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
  },
  badgeLg: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  text: {
    ...Typography.label,
  },
  textLg: {
    fontSize: 14,
  },
});
