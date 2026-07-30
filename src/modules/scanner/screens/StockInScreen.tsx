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
import ShelfLifeCard from '../components/ShelfLifeCard';
import TransactionFooter from '../components/TransactionFooter';
import SuccessDialog from '../components/SuccessDialog';
import { Colors, Spacing, Typography } from '../constants/theme';
import { formatDate } from '../utils/dateUtils';
import { DEMO_QR_CODES } from '../constants/demoQrCodes';

export default function StockInScreen() {
  const { state, setCameraPermission, handleScan, confirm, reset } = useScannerFlow(
    useCallback((id: string) => materialService.confirmStockIn(id), []),
  );

  if (state.step === 'IDLE_SCANNING') {
    return (
      <View style={styles.screen}>
        <Header title="Stock In" subtitle="Scan a material QR code to begin" />
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
        <Header title="Stock In" />
        <LoadingOverlay label="Validating QR and reading master data…" />
      </View>
    );
  }

  if (state.step === 'ERROR') {
    return (
      <View style={styles.screen}>
        <Header title="Stock In" />
        <ErrorState code={state.errorCode} message={state.errorMessage} onRetry={reset} />
      </View>
    );
  }

  if (!state.material) return null;
  const m = state.material;

  return (
    <View style={styles.screen}>
      <Header title="Stock In" subtitle="Confirm material to bring into stock" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <MaterialSummary material={m} />

        <View style={styles.body}>
          <SectionCard title="Master Data">
            <View style={styles.grid}>
              <InfoCard label="Maker" value={m.maker} />
              <InfoCard label="Quantity" value={`${m.quantity} ${m.unit}`} />
              <InfoCard label="Category" value={m.category.replace('_', ' ')} />
              <InfoCard label="Packaging" value={m.packageType} />
              <InfoCard label="Manufacturing Date" value={formatDate(m.manufacturingDate)} />
              <InfoCard label="MSL Rank" value={m.mslRank} />
              <InfoCard label="Color Rank" value={m.colorRank} />
              <InfoCard label="Luminous Rank" value={m.luminousRank} />
              <InfoCard label="Baking Count" value={`${m.bakingCount} / ${m.bakingLimit}`} />
              <InfoCard label="Current Status" value={m.currentStatus.replace('_', ' ')} />
            </View>
          </SectionCard>

          <ExposureCard material={m} />
          <ShelfLifeCard material={m} />
        </View>
      </ScrollView>

      <TransactionFooter
        confirmLabel="Confirm Stock In"
        onCancel={reset}
        onConfirm={confirm}
        loading={state.step === 'SUBMITTING'}
      />

      <SuccessDialog
        visible={state.step === 'SUCCESS'}
        title="Stock In Successful"
        message={`${m.partNumber} · Lot ${m.lotNumber} has been recorded.`}
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
