import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialHistoryEvent, HistoryEventType } from '../types/material.types';
import { Colors, Spacing, Typography } from '../constants/theme';
import { formatDateTime } from '../utils/dateUtils';

interface Props {
  events: MaterialHistoryEvent[];
}

const EVENT_LABEL: Record<HistoryEventType, string> = {
  STOCK_IN: 'Stock In',
  STOCK_OUT: 'Stock Out',
  MC_DRY_IN: 'Entered MC Dry',
  MC_DRY_OUT: 'Left MC Dry',
  BAKING_START: 'Baking Started',
  BAKING_COMPLETE: 'Baking Completed',
};

const EVENT_COLOR: Record<HistoryEventType, string> = {
  STOCK_IN: Colors.info,
  STOCK_OUT: Colors.slate,
  MC_DRY_IN: Colors.info,
  MC_DRY_OUT: Colors.warning,
  BAKING_START: Colors.purple,
  BAKING_COMPLETE: Colors.success,
};

export default function HistoryTimeline({ events }: Props) {
  if (events.length === 0) {
    return <Text style={styles.empty}>No events recorded yet.</Text>;
  }

  return (
    <View>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <View key={event.id} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.dot, { borderColor: EVENT_COLOR[event.type] }]} />
              {!isLast && <View style={styles.line} />}
            </View>
            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text style={[styles.eventLabel, { color: EVENT_COLOR[event.type] }]}>
                  {EVENT_LABEL[event.type]}
                </Text>
                <Text style={styles.timestamp}>{formatDateTime(event.timestamp)}</Text>
              </View>
              <Text style={styles.location}>{event.location}</Text>
              <Text style={styles.operator}>Operator: {event.operator}</Text>
              {event.note ? <Text style={styles.note}>{event.note}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rail: { width: 20, alignItems: 'center' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: Colors.surface,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingBottom: Spacing.lg,
    paddingLeft: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventLabel: {
    ...Typography.bodyStrong,
  },
  timestamp: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  location: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  operator: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  note: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  empty: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
