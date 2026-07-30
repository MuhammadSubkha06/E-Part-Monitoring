import { Material, ShelfLifeStatus } from '../types/material.types';
import {
  PCB_FLUX_TYPE_3_OPEN_SHELF_LIFE_DAYS,
  SHELF_LIFE_NEAR_EXPIRY_THRESHOLD_DAYS,
} from '../constants/businessRules';
import { addDays, daysBetween } from './dateUtils';

export interface ShelfLifeResult {
  shelfLifeStatus: ShelfLifeStatus;
  expireDate: string | null;
  remainingShelfLifeDays: number | null;
}

export function calculateShelfLife(
  material: Material,
  fluxType3: boolean,
  now: Date = new Date(),
): ShelfLifeResult {
  if (material.category !== 'PCB') {
    return { shelfLifeStatus: 'NOT_APPLICABLE', expireDate: null, remainingShelfLifeDays: null };
  }

  let expireDate: Date;

  if (material.openPackageDate && fluxType3) {
    expireDate = addDays(new Date(material.openPackageDate), PCB_FLUX_TYPE_3_OPEN_SHELF_LIFE_DAYS);
  } else {
    expireDate = addDays(new Date(material.manufacturingDate), material.shelfLifeDays);
  }

  const remainingShelfLifeDays = daysBetween(now, expireDate);

  let shelfLifeStatus: ShelfLifeStatus;
  if (remainingShelfLifeDays <= 0) {
    shelfLifeStatus = 'EXPIRED';
  } else if (remainingShelfLifeDays <= SHELF_LIFE_NEAR_EXPIRY_THRESHOLD_DAYS) {
    shelfLifeStatus = 'NEAR_EXPIRED';
  } else {
    shelfLifeStatus = 'VALID';
  }

  return {
    shelfLifeStatus,
    expireDate: expireDate.toISOString(),
    remainingShelfLifeDays,
  };
}
