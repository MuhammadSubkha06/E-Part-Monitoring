import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { notificationService } from '../services/NotificationService';
import { MaterialNotification } from '../types/material.types';
import LoadingOverlay from '../components/LoadingOverlay';
import { formatHours } from '../utils/exposureCalculator';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

const TYPE_LABEL: Record<MaterialNotification['type'], string> = {
  HUMIDITY_ALERT: 'Humidity Alert',
  NEED_BAKING: 'Need Baking',
  EXPOSURE_EXPIRED: 'Exposure Expired',
};

const TYPE_COLOR: Record<MaterialNotification['type'], string> = {
  HUMIDITY_ALERT: Colors.amber,
  NEED_BAKING: Colors.warning,
  EXPOSURE_EXPIRED: Colors.danger,
};

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState<MaterialNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const list = await notificationService.listActiveNotifications();
    setNotifications(list);
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <Header />
        <LoadingOverlay label="Scanning materials for Humidity Alerts…" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header count={notifications.length} />
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>All Clear</Text>
            <Text style={styles.emptyBody}>No Humidity Alerts, Need Baking, or Expired materials right now.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Information', { materialId: item.materialId })}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: TYPE_COLOR[item.type] }]}>
                <Text style={styles.badgeText}>{TYPE_LABEL[item.type]}</Text>
              </View>
              <Text style={styles.remaining}>{formatHours(item.remainingExposureHours)} left</Text>
            </View>

            <Text style={styles.partNumber}>{item.partNumber}</Text>
            <Text style={styles.lotNumber}>Lot {item.lotNumber}</Text>

            {item.location && (
              <Text style={styles.location}>
                📍 {item.location.lineName} · {item.location.machineName} · {item.location.feederLabel}
              </Text>
            )}

            <Text style={styles.action}>{item.actionRequired}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function Header({ count }: { count?: number }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Notification</Text>
      <Text style={styles.headerSubtitle}>
        {typeof count === 'number' ? `${count} active alert${count === 1 ? '' : 's'}` : 'Humidity Alert monitoring'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...Typography.h1, color: Colors.textPrimary },
  headerSubtitle: { ...Typography.body, color: Colors.textMuted, marginTop: 2 },
  list: { padding: Spacing.lg, flexGrow: 1 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.textInverse,
    textTransform: 'uppercase',
  },
  remaining: {
    ...Typography.bodyStrong,
    color: Colors.textSecondary,
  },
  partNumber: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  lotNumber: {
    ...Typography.body,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  location: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  action: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  emptyBody: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
