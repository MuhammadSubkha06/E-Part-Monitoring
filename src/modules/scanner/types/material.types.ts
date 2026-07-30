
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
  | 'MC_DRY'
  | 'EXPOSURE_RUNNING'
  | 'EXPOSURE_PAUSED'
  | 'EXPOSURE_WARNING'
  | 'EXPOSURE_EXPIRED'
  | 'PCB_EXPIRED'
  | 'NEED_BAKING'
  | 'BAKING_COMPLETED'
  | 'BAKING_LIMIT_REACHED'
  | 'MASTER_DATA_NOT_FOUND'
  | 'INVALID_QR';

export type ExposureStatus = 'RUNNING' | 'PAUSED' | 'WARNING' | 'EXPIRED' | 'NOT_APPLICABLE';

export type ShelfLifeStatus = 'VALID' | 'NEAR_EXPIRED' | 'EXPIRED' | 'NOT_APPLICABLE';

export type HistoryEventType =
  | 'STOCK_IN'
  | 'STOCK_OUT'
  | 'MC_DRY_IN'
  | 'MC_DRY_OUT'
  | 'BAKING_START'
  | 'BAKING_COMPLETE';

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
  currentExposureHours: number;
  bakingCount: number;
  bakingLimit: number;

  currentStatus: MaterialStatus;
  currentLocation: string;
  storage: string;
  warehouse: string;
  line: string | null;
  isInMcDry: boolean;

  history: MaterialHistoryEvent[];
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
