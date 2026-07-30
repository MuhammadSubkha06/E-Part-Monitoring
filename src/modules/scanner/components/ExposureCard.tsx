import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialWithDerived } from '../types/material.types';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import SectionCard from './SectionCard';
import { formatHours } from '../utils/exposureCalculator';

interface Props {
  material: MaterialWithDerived;
  stoppedNotice?: boolean;
  pausedNotice?: boolean;
}

const BAR_COLOR: Record<string, string> = {
  RUNNING: Colors.warning,
  PAUSED: Colors.info,
  WARNING: Colors.amber,
  EXPIRED: Colors.danger,
  NOT_APPLICABLE: Colors.border,
};

export default function ExposureCard({ material, stoppedNotice, pausedNotice }: Props) {
  if (material.category === 'PCB') return null;
  const d = material.derived;
  const barColor = BAR_COLOR[d.exposureStatus];

  return (
    <SectionCard title="Exposure">
      <View style={styles.row}>
        <Metric label="Current Exposure" value={formatHours(d.remainingExposureHours >= 0 ? material.currentExposureHours : 0)} />
        <Metric label="Exposure Limit" value={formatHours(material.exposureLimitHours)} />
        <Metric label="Remaining" value={formatHours(d.remainingExposureHours)} emphasis={barColor} />
      </View>

      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${d.exposurePercentUsed}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.percentLabel}>{d.exposurePercentUsed}% used</Text>

      {pausedNotice && (
        <View style={styles.pausedBanner}>
          <Text style={styles.pausedBannerText}>
            Exposure Time Paused while inside MC Dry Storage
          </Text>
        </View>
      )}

      {stoppedNotice && (
        <View style={styles.stoppedBanner}>
          <Text style={styles.stoppedBannerText}>
            Exposure timer has stopped for this material.
          </Text>
        </View>
      )}
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
    marginBottom: Spacing.md,
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
  barTrack: {
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.slateBg,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  percentLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  pausedBanner: {
    marginTop: Spacing.md,
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.info,
    padding: Spacing.md,
  },
  pausedBannerText: {
    ...Typography.bodyStrong,
    color: Colors.info,
  },
  stoppedBanner: {
    marginTop: Spacing.md,
    backgroundColor: Colors.slateBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    padding: Spacing.md,
  },
  stoppedBannerText: {
    ...Typography.bodyStrong,
    color: Colors.slate,
  },
});
