import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import ScannerOverlay from './ScannerOverlay';
import { CameraPermissionState } from '../types/scanner.types';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface DemoQr {
  label: string;
  qrCode: string;
}

interface Props {
  permission: CameraPermissionState;
  onRequestPermission: () => void;
  onScan: (qrCode: string) => void;
  hint?: string;
  demoQrCodes?: DemoQr[];
}

export default function ScannerCamera({ permission, onRequestPermission, onScan, hint, demoQrCodes = [] }: Props) {
  const [torchOn, setTorchOn] = useState(false);

  if (permission === 'DENIED') {
    return (
      <View style={styles.surface}>
        <View style={styles.permissionWrap}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionBody}>
            Grant camera permission to scan material QR codes.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={onRequestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.surface}>
      <View style={styles.cameraBackground} />

      <ScannerOverlay torchOn={torchOn} onToggleTorch={() => setTorchOn(v => !v)} hint={hint} />

      {demoQrCodes.length > 0 && (
        <View style={styles.demoBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroll}>
            {demoQrCodes.map(demo => (
              <TouchableOpacity key={demo.qrCode} style={styles.demoChip} onPress={() => onScan(demo.qrCode)}>
                <Text style={styles.demoChipText}>{demo.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    height: '65%',
    backgroundColor: '#0B1220',
    overflow: 'hidden',
  },
  cameraBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#111827',
  },
  demoBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.overlayDark,
  },
  demoScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  demoChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
    marginRight: Spacing.sm,
  },
  demoChipText: {
    ...Typography.caption,
    color: Colors.textInverse,
  },
  permissionWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  permissionTitle: {
    ...Typography.h2,
    color: Colors.textInverse,
    textAlign: 'center',
  },
  permissionBody: {
    ...Typography.body,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  permissionButtonText: {
    ...Typography.bodyStrong,
    color: Colors.textInverse,
  },
});
