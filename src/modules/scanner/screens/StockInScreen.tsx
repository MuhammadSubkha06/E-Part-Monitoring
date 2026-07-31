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
import ShelfLifeCard from '../components/ShelfLifeCard';
import MslLevelPicker from '../components/MslLevelPicker';
import TransactionFooter from '../components/TransactionFooter';
import SuccessDialog from '../components/SuccessDialog';
import { Colors, Spacing, Typography } from '../constants/theme';
import { formatDate } from '../utils/dateUtils';
import { DEMO_QR_CODES } from '../constants/demoQrCodes';

export default function StockInScreen() {
  const { state, handleScan, confirm, reset } = useScannerFlow<string>(
    useCallback((id: string, mslLevel: string) => materialService.confirmStockIn(id, mslLevel), []),
  );
  const [mslLevel, setMslLevel] = useState<string | null>(null);

  const handleReset = () => {
    setMslLevel(null);
    reset();
  };

  const handleConfirm = () => {
    if (!mslLevel) {
      // Validation: Stock In cannot be saved without the operator picking a
      // Rank / MSL Level.
      Alert.alert('Rank / MSL Level Required', 'Please select the Rank / MSL Level before saving.');
      return;
    }
    confirm(mslLevel);
  };

  if (state.step === 'IDLE_SCANNING') {
    return (
      <ScrollView contentContainerStyle={styles.idleScroll} keyboardShouldPersistTaps="handled">
        <Header title="Stock In" subtitle="Scan a material barcode to begin" />
        <HidScanInput onScan={handleScan} hint="Material enters the Display Rack" demoBarcodes={DEMO_QR_CODES} />
      </ScrollView>
    );
  }

  if (state.step === 'LOADING') {
    return (
      <View style={styles.screen}>
        <Header title="Stock In" />
        <LoadingOverlay label="Validating barcode and reading master data…" />
      </View>
    );
  }

  if (state.step === 'ERROR') {
    return (
      <View style={styles.screen}>
        <Header title="Stock In" />
        <ErrorState code={state.errorCode} message={state.errorMessage} onRetry={handleReset} />
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
              <InfoCard label="Lot Number" value={m.lotNumber} />
              <InfoCard label="Unique Number" value={m.uniqueNumber} mono />
              <InfoCard label="Quantity" value={`${m.quantity} ${m.unit}`} />
              <InfoCard label="Category" value={m.category.replace('_', ' ')} />
              <InfoCard label="Packaging" value={m.packageType} />
              <InfoCard label="Manufacturing Date" value={formatDate(m.manufacturingDate)} />
              <InfoCard label="Color Rank" value={m.colorRank} />
              <InfoCard label="Luminous Rank" value={m.luminousRank} />
              <InfoCard label="Baking Count" value={m.bakingAllowed ? `${m.bakingCount} / ${m.bakingLimit}` : 'N/A'} />
              <InfoCard label="Current Status" value={m.currentStatus.replace('_', ' ')} />
            </View>
          </SectionCard>

          <MslLevelPicker value={mslLevel} onChange={setMslLevel} suggested={m.mslRank} />

          <ExposureCard material={m} />
          <ShelfLifeCard material={m} />

          <SectionCard title="Note">
            <Text style={styles.note}>
              Material is still vacuum packed — it goes straight to the Display Rack as AVAILABLE. Exposure Time
              does not start yet, and no Line / Machine / Feeder is requested at this stage.
            </Text>
          </SectionCard>
        </View>
      </ScrollView>

      <TransactionFooter
        confirmLabel="Confirm Stock In"
        onCancel={handleReset}
        onConfirm={handleConfirm}
        loading={state.step === 'SUBMITTING'}
        confirmDisabled={!mslLevel}
      />

      <SuccessDialog
        visible={state.step === 'SUCCESS'}
        title="Stock In Successful"
        message={`${m.partNumber} · Lot ${m.lotNumber} has been recorded as ${mslLevel ?? m.mslRank}.`}
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
  note: { ...Typography.body, color: Colors.textSecondary },
});
