import { Material, MaterialDerivedState, MaterialStatus, MaterialWithDerived } from '../types/material.types';
import { calculateExposure } from './exposureCalculator';
import { calculateShelfLife } from './shelfLifeCalculator';
import { DEFAULT_BAKING_LIMIT } from '../constants/businessRules';

export function deriveMaterialState(
  material: Material,
  fluxType3: boolean,
  now: Date = new Date(),
): MaterialDerivedState {
  const exposure = calculateExposure(material, now);
  const shelfLife = calculateShelfLife(material, fluxType3, now);

  const bakingLimit = material.bakingLimit || DEFAULT_BAKING_LIMIT;
  const isExpired = exposure.exposureStatus === 'EXPIRED';
  const isScrapped = material.currentStatus === 'SCRAP';

  // Baking is only offered when the Master Part allows it AND the baking
  // count hasn't already hit the Master Part's Maximum Baking Count. If
  // baking isn't allowed at all, an expired material goes straight to SCRAP
  // instead of NEED_BAKING (handled by the repository on transaction).
  const needsBaking = !isScrapped && isExpired && material.bakingAllowed && material.bakingCount < bakingLimit;

  const badges: MaterialStatus[] = [];

  badges.push(material.currentStatus);

  if (material.category === 'PCB') {
    if (shelfLife.shelfLifeStatus === 'EXPIRED') badges.push('PCB_EXPIRED');
  } else if (!isScrapped) {
    if (exposure.exposureStatus === 'RUNNING') badges.push('EXPOSURE_RUNNING');
    if (exposure.exposureStatus === 'PAUSED') badges.push('EXPOSURE_PAUSED');
    if (exposure.exposureStatus === 'WARNING') badges.push('EXPOSURE_WARNING');
    if (exposure.exposureStatus === 'EXPIRED') badges.push('EXPOSURE_EXPIRED');
  }

  if (needsBaking) badges.push('NEED_BAKING');
  if (!isScrapped && material.bakingCount >= bakingLimit && material.bakingAllowed) {
    badges.push('BAKING_LIMIT_REACHED');
  }

  return {
    exposureStatus: exposure.exposureStatus,
    remainingExposureHours: exposure.remainingExposureHours,
    exposurePercentUsed: exposure.exposurePercentUsed,
    shelfLifeStatus: shelfLife.shelfLifeStatus,
    expireDate: shelfLife.expireDate,
    remainingShelfLifeDays: shelfLife.remainingShelfLifeDays,
    needsBaking,
    badges: Array.from(new Set(badges)),
  };
}

export function withDerivedState(material: Material, fluxType3: boolean): MaterialWithDerived {
  return { ...material, derived: deriveMaterialState(material, fluxType3) };
}
