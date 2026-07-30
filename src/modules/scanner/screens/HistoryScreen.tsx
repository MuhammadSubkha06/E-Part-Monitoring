import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useScannerFlow } from '../hooks/useScannerFlow';
import { materialService } from '../services/MaterialService';
import { MaterialHistoryEvent } from '../types/material.types';
import ScannerCamera from '../components/ScannerCamera';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorState from '../components/ErrorState';
import MaterialSummary from '../components/MaterialSummary';
import SectionCard from '../components/SectionCard';
import InfoCard from '../components/InfoCard';
import ExposureCard from '../components/ExposureCard';
import ShelfLifeCard from '../components/ShelfLifeCard';
import HistoryTimeline from '../components/HistoryTimeline';
import { Colors, Radius, Spacing, TouchTarget, Typography } from '../constants/theme';
import { formatDate } from '../utils/dateUtils';
import { DEMO_QR_CODES } from '../constants/demoQrCodes';
import { TouchableOpacity } from 'react-native';

export default function HistoryScreen() {
  // No transaction action — this module is strictly read-only.
  const { state, setCameraPermission, handleScan, reset } = useScannerFlow();
  const [history, setHistory] = useState<MaterialHistoryEvent[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (state.step === 'RESULT_READY' && state.material) {
      setHistoryLoading(true);
      materialService
        .getHistory(state.material.id)
        .then(setHistory)
        .finally(() => setHistoryLoading(false));
    }
  }, [state.step, state.material]);

  if (state.step === 'IDLE_SCANNING') {
    return (
      <View style={styles.screen}>
        <Header title="Material History" subtitle="Scan to view full event history" />
        <ScannerCamera
          permission={state.cameraPermission}
          onRequestPermission={() => setCameraPermission(true)}
          onScan={handleScan}
          hint="Align the QR code within the frame"
          demoQrCodes={DEMO_QR_CODES}
        />
      </View>
    );
  }

  if (state.step === 'LOADING') {
    return (
      <View style={styles.screen}>
        <Header title="Material History" />
        <LoadingOverlay label="Reading material history…" />
      </View>
    );
  }

  if (state.step === 'ERROR') {
    return (
      <View style={styles.screen}>
        <Header title="Material History" />
        <ErrorState code={state.errorCode} message={state.errorMessage} onRetry={reset} />
      </View>
    );
  }

  if (!state.material) return null;
  const m = state.material;

  return (
    <View style={styles.screen}>
      <Header title="Material History" subtitle="Read-only event log" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <MaterialSummary material={m} />

        <View style={styles.body}>
          <SectionCard title="Lifecycle Overview">
            <View style={styles.grid}>
              <InfoCard label="Manufacturing Date" value={formatDate(m.manufacturingDate)} />
              <InfoCard label="Package Open Date" value={formatDate(m.openPackageDate)} />
              <InfoCard label="Baking Count" value={`${m.bakingCount} / ${m.bakingLimit}`} />
              <InfoCard label="Current Status" value={m.currentStatus.replace('_', ' ')} />
              <InfoCard label="Current Location" value={m.currentLocation} flexBasis="100%" />
            </View>
          </SectionCard>

          <ExposureCard material={m} />
          <ShelfLifeCard material={m} />

          <SectionCard title="Event Timeline">
            {historyLoading ? (
              <LoadingOverlay label="Loading events…" />
            ) : (
              <HistoryTimeline events={history} />
            )}
          </SectionCard>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={reset}>
          <Text style={styles.backButtonText}>Back to Scanner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
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
  scroll: { paddingBottom: Spacing.xxxl },
  body: { paddingHorizontal: Spacing.lg, marginTop: Spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  backButton: {
    minHeight: TouchTarget.minHeight,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    ...Typography.bodyStrong,
    color: Colors.textInverse,
  },
});
