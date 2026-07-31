import { MaterialWithDerived } from './material.types';

export type ScannerTransactionType =
  | 'STOCK_IN'
  | 'STOCK_OUT'
  | 'RETURN_MC_DRY'
  | 'HISTORY'
  | 'INFORMATION';

export type ScannerStepStatus =
  | 'IDLE_SCANNING'
  | 'LOADING'
  | 'RESULT_READY'
  | 'SUBMITTING'
  | 'SUCCESS'
  | 'ERROR';

export interface ScannerFlowState {
  step: ScannerStepStatus;
  material: MaterialWithDerived | null;
  errorMessage: string | null;
  errorCode: 'INVALID_QR' | 'MASTER_DATA_NOT_FOUND' | 'UNKNOWN' | null;
}
