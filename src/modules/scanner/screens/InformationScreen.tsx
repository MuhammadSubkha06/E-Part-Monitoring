import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
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
import { Colors, Radius, Spacing, TouchTarget, Typography } from '../constants/theme';
import { DEMO_QR_CODES } from '../constants/demoQrCodes';

export default function InformationScreen() {
  // No transaction action — scanning here only ever displays information.
  const { state, handleScan, reset, setResult } = useScannerFlow();
  const route = useRoute<any>();
  const deepLinkMaterialId: string | undefined = route.params?.materialId;

  useEffect(() => {
    if (!deepLinkMaterialId) return;
    materialService.resolveById(deepLinkMaterialId).then(material => {
      if (material) setResult(material);
    });
    // Only run once per deep-link navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkMaterialId]);

  if (state.step === 'IDLE_SCANNING') {
    return (
      <ScrollView contentContainerStyle={styles.idleScroll} keyboardShouldPersistTaps="handled">
        <Header title="Material Information" subtitle="Scan to view material details" />
        <HidScanInput onScan={handleScan} hint="Read-only lookup — no transaction is recorded" demoBarcodes={DEMO_QR_CODES} />
      </ScrollView>
    );
  }

  if (state.step === 'LOADING') {
    return (
      <View style={styles.screen}>
        <Header title="Material Information" />
        <LoadingOverlay label="Reading material information…" />
      </View>
    );
  }

  if (state.step === 'ERROR') {
    return (
      <View style={styles.screen}>
        <Header title="Material Information" />
        <ErrorState code={state.errorCode} message={state.errorMessage} onRetry={reset} />
      </View>
    );
  }

  if (!state.material) return null;
  const m = state.material;

  return (
    <View style={styles.screen}>
      <Header title="Material Information" subtitle="Information only — no transaction" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <MaterialSummary material={m} />

        <View style={styles.body}>
          <SectionCard title="Master Data">
            <View style={styles.grid}>
              <InfoCard label="Maker" value={m.maker} />
              <InfoCard label="Lot Number" value={m.lotNumber} />
              <InfoCard label="Unique Number" value={m.uniqueNumber} mono />
              <InfoCard label="Quantity" value={`${m.quantity} ${m.unit}`} />
              <InfoCard label="Packaging" value={m.packageType} />
              <InfoCard label="Category" value={m.category.replace('_', ' ')} />
              <InfoCard label="MSL Rank" value={m.mslRank} />
              <InfoCard label="Color Rank" value={m.colorRank} />
              <InfoCard label="Luminous Rank" value={m.luminousRank} />
              <InfoCard label="Baking Rule" value={m.bakingAllowed ? 'Allowed' : 'Not Allowed'} />
              <InfoCard label="Baking Count" value={m.bakingAllowed ? `${m.bakingCount} / ${m.bakingLimit}` : 'N/A'} />
              <InfoCard label="Current Status" value={m.currentStatus.replace('_', ' ')} />
              <InfoCard label="Humidity Status" value={m.derived.exposureStatus.replace('_', ' ')} />
            </View>
          </SectionCard>

          <SectionCard title="Current Location">
            {m.location ? (
              <View style={styles.grid}>
                <InfoCard label="Line" value={m.location.lineName} />
                <InfoCard label="Machine" value={m.location.machineName} />
                <InfoCard label="Feeder" value={m.location.feederLabel} flexBasis="100%" />
              </View>
            ) : (
              <Text style={styles.noLocation}>Not currently on a production line.</Text>
            )}
          </SectionCard>

          <ExposureCard material={m} />
          <ShelfLifeCard material={m} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={reset}>
          <Text style={styles.backButtonText}>Scan Another</Text>
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
  noLocation: { ...Typography.body, color: Colors.textMuted },
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
