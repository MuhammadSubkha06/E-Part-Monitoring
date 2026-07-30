import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useScannerFlow } from '../hooks/useScannerFlow';
import { materialService } from '../services/MaterialService';
import ScannerCamera from '../components/ScannerCamera';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorState from '../components/ErrorState';
import MaterialSummary from '../components/MaterialSummary';
import SectionCard from '../components/SectionCard';
import InfoCard from '../components/InfoCard';
import ExposureCard from '../components/ExposureCard';
import TransactionFooter from '../components/TransactionFooter';
import SuccessDialog from '../components/SuccessDialog';
import { Colors, Spacing, Typography } from '../constants/theme';
import { DEMO_QR_CODES } from '../constants/demoQrCodes';

export default function ReturnMcDryScreen() {
  const { state, setCameraPermission, handleScan, confirm, reset } = useScannerFlow(
    useCallback((id: string) => materialService.confirmReturnToMcDry(id), []),
  );

  if (state.step === 'IDLE_SCANNING') {
    return (
      <View style={styles.screen}>
        <Header title="Return MC Dry" subtitle="Scan a material QR code to return to storage" />
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
        <Header title="Return MC Dry" />
        <LoadingOverlay label="Validating QR and reading material state…" />
      </View>
    );
  }

  if (state.step === 'ERROR') {
    return (
      <View style={styles.screen}>
        <Header title="Return MC Dry" />
        <ErrorState code={state.errorCode} message={state.errorMessage} onRetry={reset} />
      </View>
    );
  }

  if (!state.material) return null;
  const m = state.material;
  const isSuccess = state.step === 'SUCCESS';

  return (
    <View style={styles.screen}>
      <Header title="Return MC Dry" subtitle="Confirm return to MC Dry storage" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <MaterialSummary material={m} />

        <View style={styles.body}>
          <SectionCard title="Material">
            <View style={styles.grid}>
              <InfoCard label="Lot Number" value={m.lotNumber} />
              <InfoCard label="Quantity" value={`${m.quantity} ${m.unit}`} />
              <InfoCard label="Current Location" value={m.currentLocation} />
              <InfoCard label="Baking Count" value={`${m.bakingCount} / ${m.bakingLimit}`} />
            </View>
          </SectionCard>

          <ExposureCard material={m} pausedNotice={isSuccess} />
        </View>
      </ScrollView>

      <TransactionFooter
        confirmLabel="Confirm Return"
        onCancel={reset}
        onConfirm={confirm}
        loading={state.step === 'SUBMITTING'}
      />

      <SuccessDialog
        visible={isSuccess}
        title="Returned to MC Dry"
        message={`${m.partNumber} · Lot ${m.lotNumber} — exposure timer paused.`}
        onDismiss={reset}
      />
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
});
