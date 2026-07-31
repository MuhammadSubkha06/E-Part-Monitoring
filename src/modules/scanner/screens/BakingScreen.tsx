import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { useScannerFlow } from '../hooks/useScannerFlow';
import { materialService } from '../services/MaterialService';
import { masterDataService } from '../services/MasterDataService';
import { BakingInput } from '../repositories/MaterialRepository';
import { MasterPart } from '../types/master.types';
import HidScanInput from '../components/HidScanInput';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorState from '../components/ErrorState';
import MaterialSummary from '../components/MaterialSummary';
import SectionCard from '../components/SectionCard';
import InfoCard from '../components/InfoCard';
import TransactionFooter from '../components/TransactionFooter';
import SuccessDialog from '../components/SuccessDialog';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { DEMO_QR_CODES } from '../constants/demoQrCodes';

export default function BakingScreen() {
  const { state, handleScan, confirm, reset } = useScannerFlow<BakingInput>(
    useCallback((id: string, input: BakingInput) => materialService.confirmBaking(id, input), []),
  );
  const [masterPart, setMasterPart] = useState<MasterPart | null>(null);
  const [temperature, setTemperature] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (state.step === 'RESULT_READY' && state.material) {
      masterDataService.getPartByPartNumber(state.material.partNumber).then(part => {
        setMasterPart(part);
        if (part) {
          setTemperature(String(part.bakingTemperature));
          setTime(String(part.bakingTime));
        }
      });
    }
  }, [state.step, state.material]);

  const handleReset = () => {
    setMasterPart(null);
    setTemperature('');
    setTime('');
    reset();
  };

  const handleConfirm = () => {
    const temp = Number(temperature);
    const t = Number(time);
    if (!temp || !t) {
      Alert.alert('Incomplete', 'Please enter both Baking Temperature and Baking Time.');
      return;
    }
    confirm({ temperature: temp, time: t });
  };

  if (state.step === 'IDLE_SCANNING') {
    return (
      <ScrollView contentContainerStyle={styles.idleScroll} keyboardShouldPersistTaps="handled">
        <Header title="Baking Management" subtitle="Scan a NEED BAKING material" />
        <HidScanInput onScan={handleScan} hint="Only parts with Baking allowed can be processed" demoBarcodes={DEMO_QR_CODES} />
      </ScrollView>
    );
  }

  if (state.step === 'LOADING') {
    return (
      <View style={styles.screen}>
        <Header title="Baking Management" />
        <LoadingOverlay label="Reading material and Master Part rules…" />
      </View>
    );
  }

  if (state.step === 'ERROR') {
    return (
      <View style={styles.screen}>
        <Header title="Baking Management" />
        <ErrorState code={state.errorCode} message={state.errorMessage} onRetry={handleReset} />
      </View>
    );
  }

  if (!state.material) return null;
  const m = state.material;
  const isSuccess = state.step === 'SUCCESS';

  if (!m.bakingAllowed) {
    return (
      <View style={styles.screen}>
        <Header title="Baking Management" />
        <View style={styles.blocked}>
          <MaterialSummary material={m} />
          <View style={styles.blockedCard}>
            <Text style={styles.blockedTitle}>Baking Not Allowed</Text>
            <Text style={styles.blockedBody}>
              Master Part {m.partNumber} does not permit Baking. This material cannot be reused once Exposure Time
              expires.
            </Text>
          </View>
        </View>
        <TransactionFooter confirmLabel="Scan Another" onCancel={handleReset} onConfirm={handleReset} />
      </View>
    );
  }

  if (m.bakingCount >= m.bakingLimit) {
    return (
      <View style={styles.screen}>
        <Header title="Baking Management" />
        <View style={styles.blocked}>
          <MaterialSummary material={m} />
          <View style={styles.blockedCard}>
            <Text style={styles.blockedTitle}>Maximum Baking Count Reached</Text>
            <Text style={styles.blockedBody}>
              This material has already been baked {m.bakingCount} / {m.bakingLimit} times and must be scrapped.
            </Text>
          </View>
        </View>
        <TransactionFooter confirmLabel="Scan Another" onCancel={handleReset} onConfirm={handleReset} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Baking Management" subtitle="Confirm baking cycle" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <MaterialSummary material={m} />

        <View style={styles.body}>
          <SectionCard title="Master Baking Rule">
            <View style={styles.grid}>
              <InfoCard label="Baking Count" value={`${m.bakingCount} / ${m.bakingLimit}`} />
              <InfoCard label="Recommended Frequency" value={masterPart ? `${masterPart.bakingFrequency}x / cycle` : '—'} />
            </View>
          </SectionCard>

          <SectionCard title="Baking Input">
            <Field label="Temperature (°C)">
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={temperature}
                onChangeText={setTemperature}
                placeholder="e.g. 125"
              />
            </Field>
            <Field label="Time (hours)">
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={time}
                onChangeText={setTime}
                placeholder="e.g. 4"
              />
            </Field>
            <Text style={styles.hint}>
              {m.bakingCount + 1 >= m.bakingLimit
                ? 'This will be the final allowed bake — the material will be scrapped if it expires again.'
                : 'After baking, the material returns to MC Dry with its Exposure Time reset.'}
            </Text>
          </SectionCard>
        </View>
      </ScrollView>

      <TransactionFooter
        confirmLabel="Confirm Baking"
        onCancel={handleReset}
        onConfirm={handleConfirm}
        loading={state.step === 'SUBMITTING'}
      />

      <SuccessDialog
        visible={isSuccess}
        title={m.currentStatus === 'SCRAP' ? 'Material Scrapped' : 'Baking Recorded'}
        message={
          m.currentStatus === 'SCRAP'
            ? `${m.partNumber} reached Maximum Baking Count and has been marked SCRAP.`
            : `${m.partNumber} · Lot ${m.lotNumber} is back in MC Dry, ready for reuse.`
        }
        onDismiss={handleReset}
      />
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
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
  fieldLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.bodyStrong,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  blocked: { flex: 1, paddingHorizontal: Spacing.lg },
  blockedCard: {
    backgroundColor: Colors.dangerBg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  blockedTitle: {
    ...Typography.h3,
    color: Colors.danger,
    marginBottom: Spacing.xs,
  },
  blockedBody: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
