
export const Colors = {
  // Brand / primary
  primaryDark: '#0B4EBB',
  primary: '#1068EC',
  primaryLight: '#E6F0FE',

  // Neutrals
  background: '#F5F7FA',
  surface: '#FFFFFF',
  border: '#E2E5EA',
  borderStrong: '#C7CDD6',

  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#8A94A6',
  textInverse: '#FFFFFF',

  // Semantic
  success: '#15803D',
  successBg: '#DCFCE7',
  warning: '#B45309',
  warningBg: '#FEF3C7',
  danger: '#B91C1C',
  dangerBg: '#FEE2E2',
  info: '#0369A1',
  infoBg: '#E0F2FE',

  // Industrial status accents
  amber: '#D97706',
  amberBg: '#FEF3C7',
  slate: '#334155',
  slateBg: '#E2E8F0',
  purple: '#6D28D9',
  purpleBg: '#EDE9FE',

  overlayDark: 'rgba(15, 23, 42, 0.72)',
  scanLine: '#22D3EE',
  torchOn: '#F59E0B',
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 10,
  pill: 999,
} as const;

export const Typography = {
  h1: { fontSize: 22, fontWeight: '700' as const, letterSpacing: 0.1 },
  h2: { fontSize: 18, fontWeight: '700' as const },
  h3: { fontSize: 15, fontWeight: '700' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  bodyStrong: { fontSize: 14, fontWeight: '600' as const },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.3 },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.2 },
  mono: { fontSize: 14, fontWeight: '600' as const, fontFamily: 'monospace' },
} as const;

export const TouchTarget = {
  minHeight: 52,
  minWidth: 52,
};

export const Elevation = {
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sticky: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
};
