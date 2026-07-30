import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Elevation, Radius, Spacing, Typography } from '../constants/theme';

interface Props {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({ title, right, children }: Props) {
  return (
    <View style={styles.card}>
      {(title || right) && (
        <View style={styles.header}>
          {title ? <Text style={styles.title}>{title}</Text> : <View />}
          {right}
        </View>
      )}
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Elevation.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.label,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
});
