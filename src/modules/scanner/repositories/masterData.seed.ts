import { MasterFeederSlot, MasterLine, MasterMachine, MasterMsl, MasterPart } from '../types/master.types';

// --- Master Line ---------------------------------------------------------
export const MASTER_LINES: MasterLine[] = [
  { id: 'LINE-1', name: 'SMT Line 1' },
  { id: 'LINE-2', name: 'SMT Line 2' },
  { id: 'LINE-3', name: 'SMT Line 3' },
  { id: 'LINE-4', name: 'SMT Line 4' },
];

// --- Master Machine (each machine belongs to exactly one line) ----------
export const MASTER_MACHINES: MasterMachine[] = [
  { id: 'LINE-1-MC-A', lineId: 'LINE-1', name: 'Machine A' },
  { id: 'LINE-1-MC-B', lineId: 'LINE-1', name: 'Machine B' },
  { id: 'LINE-2-MC-A', lineId: 'LINE-2', name: 'Machine A' },
  { id: 'LINE-2-MC-B', lineId: 'LINE-2', name: 'Machine B' },
  { id: 'LINE-2-MC-C', lineId: 'LINE-2', name: 'Machine C' },
  { id: 'LINE-3-MC-A', lineId: 'LINE-3', name: 'Machine A' },
  { id: 'LINE-3-MC-B', lineId: 'LINE-3', name: 'Machine B' },
  { id: 'LINE-4-MC-A', lineId: 'LINE-4', name: 'Machine A' },
];

// --- Master Feeder (Admin only sets a slot COUNT per machine; the system
// auto-generates Slot 1..N) ------------------------------------------------
const FEEDER_SLOT_COUNT: Record<string, number> = {
  'LINE-1-MC-A': 19,
  'LINE-1-MC-B': 12,
  'LINE-2-MC-A': 19,
  'LINE-2-MC-B': 19,
  'LINE-2-MC-C': 8,
  'LINE-3-MC-A': 19,
  'LINE-3-MC-B': 19,
  'LINE-4-MC-A': 16,
};

export const MASTER_FEEDER_SLOTS: MasterFeederSlot[] = Object.entries(FEEDER_SLOT_COUNT).flatMap(
  ([machineId, count]) =>
    Array.from({ length: count }, (_, i) => {
      const slotNumber = i + 1;
      return {
        id: `${machineId}-SLOT-${slotNumber}`,
        machineId,
        slotNumber,
        label: `Slot ${slotNumber}`,
      };
    }),
);

// --- Master MSL (Exposure Time per MSL Level) ----------------------------
export const MASTER_MSL: MasterMsl[] = [
  { level: 'MSL-1', exposureTimeHours: 0 }, // unlimited floor life
  { level: 'MSL-2', exposureTimeHours: 8760 }, // 1 year
  { level: 'MSL-2A', exposureTimeHours: 672 }, // 4 weeks
  { level: 'MSL-3', exposureTimeHours: 168 }, // 1 week
  { level: 'MSL-4', exposureTimeHours: 72 }, // 72 hours
  { level: 'MSL-5', exposureTimeHours: 48 }, // 48 hours
  { level: 'MSL-6', exposureTimeHours: 0 }, // must be used same day package opened
];

// --- Master Part -----------------------------------------------------------
export const MASTER_PARTS: MasterPart[] = [
  {
    partNumber: 'PCB-4471-A',
    partName: 'Main Control PCB Rev.C',
    packageType: 'BOX',
    mslLevel: 'MSL-3',
    bakingAllowed: false,
    bakingTemperature: 0,
    bakingTime: 0,
    bakingFrequency: 0,
    maxBakingCount: 0,
  },
  {
    partNumber: 'IC-8820-REEL',
    partName: 'ADC 12-bit SOIC-16',
    packageType: 'REEL',
    mslLevel: 'MSL-2A',
    bakingAllowed: true,
    bakingTemperature: 125,
    bakingTime: 4,
    bakingFrequency: 2,
    maxBakingCount: 3,
  },
  {
    partNumber: 'IC-3315-TRAY',
    partName: 'Power MOSFET QFN-32',
    packageType: 'TRAY',
    mslLevel: 'MSL-4',
    bakingAllowed: true,
    bakingTemperature: 90,
    bakingTime: 6,
    bakingFrequency: 1,
    maxBakingCount: 3,
  },
  {
    partNumber: 'IC-9012-REEL',
    partName: 'Gate Driver SO-8',
    packageType: 'REEL',
    mslLevel: 'MSL-2',
    bakingAllowed: true,
    bakingTemperature: 125,
    bakingTime: 4,
    bakingFrequency: 2,
    maxBakingCount: 3,
  },
  {
    partNumber: 'PCB-9902-C',
    partName: 'Sensor Interface PCB Rev.B',
    packageType: 'BOX',
    mslLevel: 'MSL-3',
    bakingAllowed: false,
    bakingTemperature: 0,
    bakingTime: 0,
    bakingFrequency: 0,
    maxBakingCount: 0,
  },
  {
    partNumber: 'IC-5541-TRAY',
    partName: 'RF Switch QFN-20',
    packageType: 'TRAY',
    mslLevel: 'MSL-5',
    bakingAllowed: true,
    bakingTemperature: 90,
    bakingTime: 8,
    bakingFrequency: 1,
    maxBakingCount: 2,
  },
  {
    partNumber: 'JK949628-3630',
    partName: 'Connector Housing IC REEL',
    packageType: 'REEL',
    mslLevel: 'MSL-3',
    bakingAllowed: true,
    bakingTemperature: 125,
    bakingTime: 4,
    bakingFrequency: 2,
    maxBakingCount: 3,
  },
];
