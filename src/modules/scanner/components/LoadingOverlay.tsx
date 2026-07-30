import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface Props {
  label?: string;
}

export default function LoadingOverlay({ label = 'Reading material data…' }: Props) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.xxxl,
  },
  label: {
    ...Typography.bodyStrong,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
});
