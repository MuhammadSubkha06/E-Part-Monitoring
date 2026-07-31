import { Material, ExposureStatus } from '../types/material.types';
import { EXPOSURE_WARNING_THRESHOLD_PERCENT } from '../constants/businessRules';
import { hoursBetween } from './dateUtils';

export interface ExposureResult {
  exposureStatus: ExposureStatus;
  currentExposureHours: number;
  remainingExposureHours: number;
  exposurePercentUsed: number;
}

/**
 * Live exposure hours = the frozen "accumulated" value (recorded the last
 * time exposure was paused, e.g. entering MC Dry) plus however long it has
 * been running since it was last resumed (Stock Out / resumed from MC Dry).
 * When `exposureResumedAt` is null, exposure is paused and this simply
 * returns the accumulated value.
 */
export function computeLiveExposureHours(material: Material, now: Date = new Date()): number {
  if (!material.exposureResumedAt) {
    return material.accumulatedExposureHours;
  }
  return material.accumulatedExposureHours + hoursBetween(new Date(material.exposureResumedAt), now);
}

export function calculateExposure(material: Material, now: Date = new Date()): ExposureResult {
  if (material.category === 'PCB') {
    return {
      exposureStatus: 'NOT_APPLICABLE',
      currentExposureHours: 0,
      remainingExposureHours: 0,
      exposurePercentUsed: 0,
    };
  }

  if (material.currentStatus === 'SCRAP') {
    return {
      exposureStatus: 'EXPIRED',
      currentExposureHours: material.accumulatedExposureHours,
      remainingExposureHours: 0,
      exposurePercentUsed: 100,
    };
  }

  if (!material.openPackageDate) {
    return {
      exposureStatus: 'NOT_APPLICABLE',
      currentExposureHours: 0,
      remainingExposureHours: material.exposureLimitHours,
      exposurePercentUsed: 0,
    };
  }

  const currentExposureHours = computeLiveExposureHours(material, now);
  const remainingExposureHours = Math.max(0, material.exposureLimitHours - currentExposureHours);
  const exposurePercentUsed = Math.min(
    100,
    Math.round((currentExposureHours / material.exposureLimitHours) * 100),
  );

  let exposureStatus: ExposureStatus;

  if (material.isInMcDry) {
    exposureStatus = 'PAUSED';
  } else if (remainingExposureHours <= 0) {
    exposureStatus = 'EXPIRED';
  } else if (exposurePercentUsed >= EXPOSURE_WARNING_THRESHOLD_PERCENT) {
    exposureStatus = 'WARNING';
  } else {
    exposureStatus = 'RUNNING';
  }

  return {
    exposureStatus,
    currentExposureHours,
    remainingExposureHours,
    exposurePercentUsed,
  };
}

export function formatHours(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return minutes > 0 ? `${whole}h ${minutes}m` : `${whole}h`;
}
