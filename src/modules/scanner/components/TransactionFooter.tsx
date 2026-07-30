import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Elevation, Radius, Spacing, Typography, TouchTarget } from '../constants/theme';

interface Props {
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  confirmDisabled?: boolean;
  confirmTone?: 'primary' | 'danger';
}

export default function TransactionFooter({
  confirmLabel,
  onCancel,
  onConfirm,
  loading,
  confirmDisabled,
  confirmTone = 'primary',
}: Props) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} disabled={loading}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.confirmBtn,
          confirmTone === 'danger' ? styles.confirmDanger : styles.confirmPrimary,
          (loading || confirmDisabled) && styles.disabled,
        ]}
        onPress={onConfirm}
        disabled={loading || confirmDisabled}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textInverse} />
        ) : (
          <Text style={styles.confirmText}>{confirmLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Elevation.sticky,
  },
  cancelBtn: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  cancelText: {
    ...Typography.bodyStrong,
    color: Colors.textSecondary,
  },
  confirmBtn: {
    flex: 2,
    minHeight: TouchTarget.minHeight,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPrimary: {
    backgroundColor: Colors.primary,
  },
  confirmDanger: {
    backgroundColor: Colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  confirmText: {
    ...Typography.bodyStrong,
    color: Colors.textInverse,
    fontSize: 15,
  },
});
