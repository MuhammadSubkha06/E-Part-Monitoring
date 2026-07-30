import { MATERIAL_SEED } from '../repositories/seedData';

export const DEMO_QR_CODES = [
  ...MATERIAL_SEED.map(m => ({ label: `${m.partNumber} (${m.category})`, qrCode: m.qrCode })),
  { label: 'Invalid QR', qrCode: 'not-a-qr' },
  { label: 'Unknown Material', qrCode: 'QR-UNKNOWN-0000-L0000' },
];
