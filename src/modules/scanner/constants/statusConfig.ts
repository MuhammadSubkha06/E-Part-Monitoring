import { MaterialStatus } from '../types/material.types';
import { Colors } from './theme';

export interface StatusVisual {
  label: string;
  color: string; // text/icon color
  background: string;
}

export const STATUS_CONFIG: Record<MaterialStatus, StatusVisual> = {
  AVAILABLE: { label: 'AVAILABLE', color: Colors.success, background: Colors.successBg },
  STOCK_IN: { label: 'STOCK IN', color: Colors.info, background: Colors.infoBg },
  STOCK_OUT: { label: 'STOCK OUT', color: Colors.slate, background: Colors.slateBg },
  IN_PRODUCTION: { label: 'IN PRODUCTION', color: Colors.primaryDark, background: Colors.primaryLight },
  MC_DRY: { label: 'MC DRY', color: Colors.info, background: Colors.infoBg },
  EXPOSURE_RUNNING: { label: 'EXPOSURE RUNNING', color: Colors.warning, background: Colors.warningBg },
  EXPOSURE_PAUSED: { label: 'EXPOSURE PAUSED', color: Colors.info, background: Colors.infoBg },
  EXPOSURE_WARNING: { label: 'EXPOSURE WARNING', color: Colors.amber, background: Colors.amberBg },
  EXPOSURE_EXPIRED: { label: 'EXPOSURE EXPIRED', color: Colors.danger, background: Colors.dangerBg },
  PCB_EXPIRED: { label: 'PCB EXPIRED', color: Colors.danger, background: Colors.dangerBg },
  NEED_BAKING: { label: 'NEED BAKING', color: Colors.purple, background: Colors.purpleBg },
  BAKING_COMPLETED: { label: 'BAKING COMPLETED', color: Colors.success, background: Colors.successBg },
  BAKING_LIMIT_REACHED: { label: 'BAKING LIMIT REACHED', color: Colors.danger, background: Colors.dangerBg },
  SCRAP: { label: 'SCRAP', color: Colors.textInverse, background: Colors.danger },
  MASTER_DATA_NOT_FOUND: { label: 'MASTER DATA NOT FOUND', color: Colors.danger, background: Colors.dangerBg },
  INVALID_QR: { label: 'INVALID QR', color: Colors.danger, background: Colors.dangerBg },
};
