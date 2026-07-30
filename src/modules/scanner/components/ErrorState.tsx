import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StatusBadge from './StatusBadge';
import { Colors, Radius, Spacing, TouchTarget, Typography } from '../constants/theme';

interface Props {
  code: 'INVALID_QR' | 'MASTER_DATA_NOT_FOUND' | 'UNKNOWN' | null;
  message?: string | null;
  onRetry: () => void;
}

export default function ErrorState({ code, message, onRetry }: Props) {
  const badgeStatus = code === 'INVALID_QR' ? 'INVALID_QR' : 'MASTER_DATA_NOT_FOUND';

  return (
    <View style={styles.wrap}>
      <StatusBadge status={badgeStatus} size="lg" />
      <Text style={styles.message}>{message ?? 'Something went wrong. Please try scanning again.'}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Scan Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    backgroundColor: Colors.surface,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  button: {
    minHeight: TouchTarget.minHeight,
    paddingHorizontal: Spacing.xxl,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...Typography.bodyStrong,
    color: Colors.textInverse,
  },
});
