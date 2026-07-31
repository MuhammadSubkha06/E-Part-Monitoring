import { materialService } from './MaterialService';
import { MaterialNotification, MaterialWithDerived } from '../types/material.types';
import { HUMIDITY_ALERT_THRESHOLD_PERCENT } from '../constants/businessRules';

function buildNotification(material: MaterialWithDerived): MaterialNotification | null {
  if (material.category === 'PCB') return null; // Humidity Alert applies to Reel/Tray parts only
  if (material.currentStatus === 'SCRAP' || material.isInMcDry) return null;

  const d = material.derived;

  let type: MaterialNotification['type'] | null = null;
  let actionRequired = '';

  if (d.exposureStatus === 'EXPIRED') {
    type = d.needsBaking ? 'NEED_BAKING' : 'EXPOSURE_EXPIRED';
    actionRequired = d.needsBaking
      ? 'Send material for Baking before further use.'
      : 'Material must be pulled from the line — Exposure Time has expired.';
  } else if (d.exposurePercentUsed >= HUMIDITY_ALERT_THRESHOLD_PERCENT) {
    type = 'HUMIDITY_ALERT';
    actionRequired = 'Prepare to return material to MC Dry before Exposure Time runs out.';
  }

  if (!type) return null;

  return {
    id: `NOTIF-${material.id}`,
    materialId: material.id,
    partNumber: material.partNumber,
    lotNumber: material.lotNumber,
    type,
    remainingExposureHours: d.remainingExposureHours,
    location: material.location,
    actionRequired,
    createdAt: new Date().toISOString(),
  };
}

export class NotificationService {
  /** Scans every in-production material and raises Humidity Alert / Need
   * Baking / Exposure Expired notifications for anything that needs
   * operator attention right now. */
  async listActiveNotifications(): Promise<MaterialNotification[]> {
    const materials = await materialService.listAllWithDerived();
    return materials
      .map(buildNotification)
      .filter((n): n is MaterialNotification => n !== null)
      .sort((a, b) => a.remainingExposureHours - b.remainingExposureHours);
  }
}

export const notificationService = new NotificationService();
