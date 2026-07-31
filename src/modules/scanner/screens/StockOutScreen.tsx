import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useScannerFlow } from '../hooks/useScannerFlow';
import { materialService } from '../services/MaterialService';
import HidScanInput from '../components/HidScanInput';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorState from '../components/ErrorState';
import MaterialSummary from '../components/MaterialSummary';
import SectionCard from '../components/SectionCard';
import InfoCard from '../components/InfoCard';
import ExposureCard from '../components/ExposureCard';
import LocationPicker from '../components/LocationPicker';
import TransactionFooter from '../components/TransactionFooter';
import SuccessDialog from '../components/SuccessDialog';
import { Colors, Spacing, Typography } from '../constants/theme';
import { DEMO_QR_CODES } from '../constants/demoQrCodes';
import { MaterialLocation } from '../types/material.types';

export default function StockOutScreen() {
  const { state, handleScan, confirm, reset } = useScannerFlow<MaterialLocation>(
    useCallback((id: string, location: MaterialLocation) => materialService.confirmStockOut(id, location), []),
  );
  const [location, setLocation] = useState<MaterialLocation | null>(null);

  const handleReset = () => {
    setLocation(null);
    reset();
  };

  const handleConfirm = () => {
    if (!location) {
      // Validation: Stock Out cannot be saved without Line, Machine and
      // Feeder all selected.
      Alert.alert('Location Required', 'Please select Line, Machine and Feeder Slot before saving.');
      return;
    }
    confirm(location);
  };

  if (state.step === 'IDLE_SCANNING') {
    return (
      <ScrollView contentContainerStyle={styles.idleScroll} keyboardShouldPersistTaps="handled">
        <Header title="Stock Out" subtitle="Scan a material barcode to release" />
        <HidScanInput onScan={handleScan} hint="Material leaves stock for production" demoBarcodes={DEMO_QR_CODES} />
      </ScrollView>
    );
  }

  if (state.step === 'LOADING') {
    return (
      <View style={styles.screen}>
        <Header title="Stock Out" />
        <LoadingOverlay label="Validating barcode and reading material state…" />
      </View>
    );
  }

  if (state.step === 'ERROR') {
    return (
      <View style={styles.screen}>
        <Header title="Stock Out" />
        <ErrorState code={state.errorCode} message={state.errorMessage} onRetry={handleReset} />
      </View>
    );
  }

  if (!state.material) return null;
  const m = state.material;
  const isSuccess = state.step === 'SUCCESS';
  const isResumingFromMcDry = m.isInMcDry;
  const isFirstOpen = !m.openPackageDate;

  return (
    <View style={styles.screen}>
      <Header title="Stock Out" subtitle="Confirm release from stock" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <MaterialSummary material={m} />

        <View style={styles.body}>
          <SectionCard title="Material">
            <View style={styles.grid}>
              <InfoCard label="Lot Number" value={m.lotNumber} />
              <InfoCard label="Quantity" value={`${m.quantity} ${m.unit}`} />
              <InfoCard label="Current Location" value={m.currentLocation} />
              <InfoCard label="Warehouse" value={m.warehouse} />
            </View>
          </SectionCard>

          {m.category !== 'PCB' && (
            <View style={styles.exposureNotice}>
              <Text style={styles.exposureNoticeText}>
                {isFirstOpen
                  ? 'Package will be opened now — Exposure Time starts on Save.'
                  : isResumingFromMcDry
                  ? 'Material is returning from MC Dry — Exposure Time resumes from where it was paused.'
                  : 'Exposure Time keeps running from its current value.'}
              </Text>
            </View>
          )}

          <ExposureCard material={m} />

          <LocationPicker value={location} onChange={setLocation} />
        </View>
      </ScrollView>

      <TransactionFooter
        confirmLabel="Confirm Stock Out"
        onCancel={handleReset}
        onConfirm={handleConfirm}
        loading={state.step === 'SUBMITTING'}
        confirmDisabled={!location}
        confirmTone="danger"
      />

      <SuccessDialog
        visible={isSuccess}
        title="Stock Out Successful"
        message={`${m.partNumber} · Lot ${m.lotNumber} is now IN PRODUCTION at ${m.currentLocation}.`}
        onDismiss={handleReset}
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
  idleScroll: { flexGrow: 1, backgroundColor: Colors.background },
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
  exposureNotice: {
    backgroundColor: Colors.infoBg,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  exposureNoticeText: {
    ...Typography.bodyStrong,
    color: Colors.info,
  },
});
