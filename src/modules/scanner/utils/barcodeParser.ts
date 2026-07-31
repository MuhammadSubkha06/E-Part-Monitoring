export interface ParsedBarcode {
  partNumber: string;
  lotNumber: string;
  uniqueNumber: string;
}

/**
 * Format barcode dari DENSO BHT-M80 (Keyboard Wedge / HID Mode):
 *
 *   JK457672-1130;6525Y;112606130144
 *   └── Part Number ┘ └Lot┘ └── Unique Number ──┘
 *
 * Dipisahkan tanda titik koma (;). Jika format tidak sesuai (bukan 3
 * segmen), dianggap barcode lama / tidak valid dan dikembalikan null.
 */
export function parseHidBarcode(raw: string): ParsedBarcode | null {
  const trimmed = raw.trim();
  const parts = trimmed.split(';').map(p => p.trim());

  if (parts.length !== 3 || parts.some(p => p.length === 0)) {
    return null;
  }

  const [partNumber, lotNumber, uniqueNumber] = parts;
  return { partNumber, lotNumber, uniqueNumber };
}
