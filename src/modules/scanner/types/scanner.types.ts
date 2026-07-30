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

export type CameraPermissionState = 'UNKNOWN' | 'GRANTED' | 'DENIED';

export interface ScannerFlowState {
  step: ScannerStepStatus;
  cameraPermission: CameraPermissionState;
  material: MaterialWithDerived | null;
  errorMessage: string | null;
  errorCode: 'INVALID_QR' | 'MASTER_DATA_NOT_FOUND' | 'UNKNOWN' | null;
}

export interface TorchState {
  enabled: boolean;
}
