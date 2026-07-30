import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import ScannerFrame from './ScannerFrame';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface Props {
  torchOn: boolean;
  onToggleTorch: () => void;
  connected?: boolean;
  hint?: string;
}

export default function ScannerOverlay({ torchOn, onToggleTorch, connected = true, hint }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-100, 100] });

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.topBar}>
        <View style={[styles.connectionDot, { backgroundColor: connected ? Colors.success : Colors.danger }]} />
        <Text style={styles.connectionLabel}>{connected ? 'Scanner Ready' : 'Scanner Offline'}</Text>
      </View>

      <View style={styles.center} pointerEvents="none">
        <ScannerFrame />
        <View style={styles.scanLineClip}>
          <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
        </View>
      </View>

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}

      <TouchableOpacity style={styles.torchButton} onPress={onToggleTorch}>
        <View style={[styles.torchDot, torchOn && styles.torchDotOn]} />
        <Text style={[styles.torchLabel, torchOn && styles.torchLabelOn]}>
          {torchOn ? 'Torch On' : 'Torch'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.overlayDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  connectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  connectionLabel: {
    ...Typography.caption,
    color: Colors.textInverse,
  },
  center: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLineClip: {
    position: 'absolute',
    width: '78%',
    maxWidth: 300,
    aspectRatio: 1,
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.scanLine,
  },
  hint: {
    position: 'absolute',
    bottom: 96,
    ...Typography.bodyStrong,
    color: Colors.textInverse,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  torchButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.overlayDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  torchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
    marginRight: Spacing.xs,
  },
  torchDotOn: {
    backgroundColor: Colors.torchOn,
  },
  torchLabel: {
    ...Typography.caption,
    color: Colors.textInverse,
  },
  torchLabelOn: {
    color: Colors.torchOn,
  },
});
