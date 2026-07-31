
export type MaterialCategory = 'PCB' | 'IC_REEL' | 'IC_TRAY';

export type MslRank =
  | 'MSL-1'
  | 'MSL-2'
  | 'MSL-2A'
  | 'MSL-3'
  | 'MSL-4'
  | 'MSL-5'
  | 'MSL-6';

export type ColorRank = 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'WHITE' | 'N/A';

export type LuminousRank = 'A' | 'B' | 'C' | 'D' | 'N/A';

export type PackageType = 'REEL' | 'TRAY' | 'TUBE' | 'BAG' | 'BOX';

export type MaterialStatus =
  | 'AVAILABLE'
  | 'STOCK_IN'
  | 'STOCK_OUT'
  | 'IN_PRODUCTION'
  | 'MC_DRY'
  | 'EXPOSURE_RUNNING'
  | 'EXPOSURE_PAUSED'
  | 'EXPOSURE_WARNING'
  | 'EXPOSURE_EXPIRED'
  | 'PCB_EXPIRED'
  | 'NEED_BAKING'
  | 'BAKING_COMPLETED'
  | 'BAKING_LIMIT_REACHED'
  | 'SCRAP'
  | 'MASTER_DATA_NOT_FOUND'
  | 'INVALID_QR';

/**
 * Material location on the shop floor: Line -> Machine -> Feeder Slot.
 * Mandatory whenever a material is IN_PRODUCTION so that Material Tracking
 * and Humidity Alert always know exactly where a material physically is.
 */
export interface MaterialLocation {
  lineId: string;
  lineName: string;
  machineId: string;
  machineName: string;
  feederId: string;
  feederLabel: string;
}

export type ExposureStatus = 'RUNNING' | 'PAUSED' | 'WARNING' | 'EXPIRED' | 'NOT_APPLICABLE';

export type ShelfLifeStatus = 'VALID' | 'NEAR_EXPIRED' | 'EXPIRED' | 'NOT_APPLICABLE';

export type HistoryEventType =
  | 'STOCK_IN'
  | 'STOCK_OUT'
  | 'MC_DRY_IN'
  | 'MC_DRY_OUT'
  | 'BAKING_START'
  | 'BAKING_COMPLETE'
  | 'SCRAP';

export interface MaterialHistoryEvent {
  id: string;
  type: HistoryEventType;
  timestamp: string; 
  location: string;
  operator: string;
  note?: string;
}

export interface Material {
  id: string;
  qrCode: string;
  uniqueNumber: string;
  partNumber: string;
  partName: string;
  lotNumber: string;
  maker: string;
  supplier: string;
  manufacturingDate: string; 
  category: MaterialCategory;
  packageType: PackageType;
  quantity: number;
  unit: string;

  mslRank: MslRank;
  colorRank: ColorRank;
  luminousRank: LuminousRank;
  shelfLifeDays: number;

  exposureLimitHours: number;

  openPackageDate: string | null;

  // Exposure is tracked as a frozen "accumulated" value plus a running
  // timestamp. When exposureResumedAt is set, exposure is actively ticking
  // (IN PRODUCTION); when it is null, exposure is paused (e.g. MC Dry).
  // `currentExposureHours` is always kept in sync (recomputed) by the
  // repository every time a material is read or mutated, so consumers can
  // keep treating it as a simple authoritative number.
  accumulatedExposureHours: number;
  exposureResumedAt: string | null;
  currentExposureHours: number;

  bakingCount: number;
  bakingLimit: number;
  bakingAllowed: boolean;

  currentStatus: MaterialStatus;
  currentLocation: string;
  storage: string;
  warehouse: string;
  location: MaterialLocation | null;
  isInMcDry: boolean;

  history: MaterialHistoryEvent[];
}

/** A Humidity Alert / Need-Baking / Exposure-Expired notification. */
export interface MaterialNotification {
  id: string;
  materialId: string;
  partNumber: string;
  lotNumber: string;
  type: 'HUMIDITY_ALERT' | 'NEED_BAKING' | 'EXPOSURE_EXPIRED';
  remainingExposureHours: number;
  location: MaterialLocation | null;
  actionRequired: string;
  createdAt: string;
}

export interface MaterialDerivedState {
  exposureStatus: ExposureStatus;
  remainingExposureHours: number;
  exposurePercentUsed: number;

  shelfLifeStatus: ShelfLifeStatus;
  expireDate: string | null;
  remainingShelfLifeDays: number | null;

  needsBaking: boolean;
  badges: MaterialStatus[];
}

export type MaterialWithDerived = Material & { derived: MaterialDerivedState };
