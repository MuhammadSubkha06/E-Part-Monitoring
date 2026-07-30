import { Material, ExposureStatus } from '../types/material.types';
import { EXPOSURE_WARNING_THRESHOLD_PERCENT } from '../constants/businessRules';

export interface ExposureResult {
  exposureStatus: ExposureStatus;
  currentExposureHours: number;
  remainingExposureHours: number;
  exposurePercentUsed: number;
}

export function calculateExposure(material: Material, _now: Date = new Date()): ExposureResult {
  if (material.category === 'PCB') {
    return {
      exposureStatus: 'NOT_APPLICABLE',
      currentExposureHours: 0,
      remainingExposureHours: 0,
      exposurePercentUsed: 0,
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

  // currentExposureHours is authoritative — it is frozen by the repository
  // the instant the material enters MC Dry / Stock Out, and resumes ticking
  // from that frozen value when it re-enters circulation.
  const currentExposureHours = material.currentExposureHours;
  const remainingExposureHours = Math.max(
    0,
    material.exposureLimitHours - currentExposureHours,
  );
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
