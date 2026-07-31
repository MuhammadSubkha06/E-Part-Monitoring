import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, TouchTarget, Typography } from '../constants/theme';
import { parseHidBarcode, ParsedBarcode } from '../utils/barcodeParser';

interface DemoBarcode {
  label: string;
  qrCode: string;
}

interface Props {
  onScan: (barcode: string) => void;
  hint?: string;
  demoBarcodes?: DemoBarcode[];
}

/**
 * The DENSO BHT-M80 runs in Keyboard Wedge / HID mode: pulling the hardware
 * trigger "types" the barcode into whichever TextInput currently has focus,
 * followed by an Enter keystroke. This component is just that focused
 * TextInput — no camera, no image processing.
 *
 * Barcode format: PARTNUMBER;LOTNUMBER;UNIQUENUMBER
 * e.g. JK457672-1130;6525Y;112606130144
 *
 * As soon as the scanner finishes typing (Enter), the code is parsed and
 * shown to the operator as Part Number / Lot Number / Unique Number, then
 * auto-submitted — no manual "submit" button needed.
 */
export default function HidScanInput({ onScan, hint, demoBarcodes = [] }: Props) {
  const [value, setValue] = useState('');
  const [parsed, setParsed] = useState<ParsedBarcode | null>(null);
  const inputRef = useRef<TextInput>(null);

  const submit = (raw: string) => {
    const barcode = raw.trim();
    if (!barcode) return;

    // Auto-fill the parsed fields for the operator to see, then submit
    // immediately — the scanner's Enter keystroke is the "submit" action.
    setParsed(parseHidBarcode(barcode));
    setValue('');
    onScan(barcode);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>📟</Text>
        <Text style={styles.iconLabel}>SCAN</Text>
      </View>

      <Text style={styles.title}>Ready to Scan</Text>
      <Text style={styles.hint}>{hint ?? 'Point the DENSO BHT-M80 and pull the trigger'}</Text>

      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={e => submit(e.nativeEvent.text)}
        autoFocus
        blurOnSubmit={false}
        onBlur={() => setTimeout(() => inputRef.current?.focus(), 150)}
        returnKeyType="done"
        autoCapitalize="characters"
        autoCorrect={false}
        placeholder="Waiting for scanner input…"
        placeholderTextColor={Colors.textMuted}
      />

      {parsed && (
        <View style={styles.parsedCard}>
          <Text style={styles.parsedTitle}>Auto-filled from Barcode</Text>
          <ParsedRow label="Part Number" value={parsed.partNumber} />
          <ParsedRow label="Lot Number" value={parsed.lotNumber} />
          <ParsedRow label="Unique Number" value={parsed.uniqueNumber} />
        </View>
      )}

      {demoBarcodes.length > 0 && (
        <View style={styles.demoWrap}>
          <Text style={styles.demoTitle}>No scanner handy? Try a demo barcode:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
            keyboardShouldPersistTaps="always"
          >
            {demoBarcodes.map(demo => (
              <TouchableOpacity
                key={demo.qrCode}
                style={styles.demoChip}
                activeOpacity={0.6}
                onPress={() => submit(demo.qrCode)}
              >
                <Text style={styles.demoChipText}>{demo.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function ParsedRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.parsedRow}>
      <Text style={styles.parsedLabel}>{label}</Text>
      <Text style={styles.parsedValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surface,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  icon: { fontSize: 32 },
  iconLabel: {
    ...Typography.caption,
    color: Colors.primary,
    marginTop: 2,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  hint: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  hiddenInput: {
    width: '100%',
    minHeight: TouchTarget.minHeight,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
    ...Typography.mono,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  parsedCard: {
    width: '100%',
    marginTop: Spacing.lg,
    backgroundColor: Colors.successBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  parsedTitle: {
    ...Typography.label,
    color: Colors.success,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  parsedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  parsedLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  parsedValue: {
    ...Typography.bodyStrong,
    color: Colors.textPrimary,
  },
  demoWrap: {
    marginTop: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  demoTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  demoScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  demoChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.slateBg,
    marginRight: Spacing.sm,
  },
  demoChipText: {
    ...Typography.caption,
    color: Colors.slate,
  },
  manualToggle: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  manualToggleText: {
    ...Typography.caption,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
