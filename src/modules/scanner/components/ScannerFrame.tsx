import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

const CORNER = 28;
const THICKNESS = 4;

export default function ScannerFrame() {
  return (
    <View style={styles.frame} pointerEvents="none">
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '78%',
    aspectRatio: 1,
    maxWidth: 300,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: Colors.scanLine,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: THICKNESS,
    borderLeftWidth: THICKNESS,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: THICKNESS,
    borderRightWidth: THICKNESS,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: THICKNESS,
    borderLeftWidth: THICKNESS,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: THICKNESS,
    borderRightWidth: THICKNESS,
    borderBottomRightRadius: 6,
  },
});
