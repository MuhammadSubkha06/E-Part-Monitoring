import { MATERIAL_SEED } from '../repositories/seedData';

export const DEMO_QR_CODES = [
  ...MATERIAL_SEED.map(m => ({ label: `${m.partNumber} (${m.category})`, qrCode: m.qrCode })),
  { label: 'Invalid Barcode', qrCode: 'not-a-barcode' },
  { label: 'Unknown Material', qrCode: 'UNKNOWN-PART-0000;L0000;000000000000' },
];
