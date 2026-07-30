import { Material, MaterialHistoryEvent } from '../types/material.types';
import { MaterialRepository, RepositoryError } from './MaterialRepository';
import { MATERIAL_SEED, FLUX_TYPE_3_PART_NUMBERS, MASTER_DATA_NOT_FOUND_QR } from './seedData';

const SIMULATED_LATENCY_MS = 550;

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

function isWellFormedQr(qrCode: string): boolean {
  return /^QR-[A-Z0-9-]+$/.test(qrCode) && qrCode.length >= 8;
}

export class DummyMaterialRepository implements MaterialRepository {
  private store: Map<string, Material>;

  constructor() {
    this.store = new Map(MATERIAL_SEED.map(m => [m.id, structuredCloneSafe(m)]));
  }

  async findByQrCode(qrCode: string): Promise<Material> {
    if (!isWellFormedQr(qrCode)) {
      await delay(null, 300);
      throw new RepositoryError('INVALID_QR', 'The scanned QR code is not a recognized material label.');
    }

    if (MASTER_DATA_NOT_FOUND_QR.has(qrCode)) {
      await delay(null);
      throw new RepositoryError('MASTER_DATA_NOT_FOUND', 'No Master Data found for this material.');
    }

    const found = Array.from(this.store.values()).find(m => m.qrCode === qrCode);

    if (!found) {
      await delay(null);
      throw new RepositoryError('MASTER_DATA_NOT_FOUND', 'No Master Data found for this material.');
    }

    return delay(structuredCloneSafe(found));
  }

  async getHistory(materialId: string): Promise<MaterialHistoryEvent[]> {
    const material = this.store.get(materialId);
    return delay(material ? [...material.history] : [], 350);
  }

  async isFluxType3(partNumber: string): Promise<boolean> {
    return delay(FLUX_TYPE_3_PART_NUMBERS.has(partNumber), 150);
  }

  async stockIn(materialId: string): Promise<Material> {
    const material = this.getOrThrow(materialId);
    material.currentStatus = 'AVAILABLE';
    material.isInMcDry = false;
    material.history.unshift(historyEvent('STOCK_IN', material.currentLocation));
    return delay(structuredCloneSafe(material));
  }

  async stockOut(materialId: string): Promise<Material> {
    const material = this.getOrThrow(materialId);
    // Exposure timer stops immediately (simulation): we freeze
    // currentExposureHours by simply not advancing it further, and the
    // repository stops being the source of "live" ticking once status is
    // STOCK_OUT — the service layer treats this the same as MC Dry pause.
    material.currentStatus = 'STOCK_OUT';
    material.isInMcDry = false;
    material.line = material.line ?? 'Line 1';
    material.history.unshift(historyEvent('STOCK_OUT', material.line ?? material.currentLocation));
    return delay(structuredCloneSafe(material));
  }

  async returnToMcDry(materialId: string): Promise<Material> {
    const material = this.getOrThrow(materialId);
    material.currentStatus = 'MC_DRY';
    material.isInMcDry = true;
    material.currentLocation = 'MC Dry Cabinet 01';
    material.history.unshift(historyEvent('MC_DRY_IN', material.currentLocation));
    return delay(structuredCloneSafe(material));
  }

  private getOrThrow(materialId: string): Material {
    const material = this.store.get(materialId);
    if (!material) {
      throw new RepositoryError('MASTER_DATA_NOT_FOUND', `Material ${materialId} does not exist in-session.`);
    }
    return material;
  }
}

function historyEvent(type: MaterialHistoryEvent['type'], location: string): MaterialHistoryEvent {
  return {
    id: `H-${Date.now()}`,
    type,
    timestamp: new Date().toISOString(),
    location,
    operator: 'Current Operator',
  };
}

// RN's JS engine (Hermes) may not have structuredClone; guard with JSON fallback.
function structuredCloneSafe<T>(value: T): T {
  const globalClone = (globalThis as { structuredClone?: (v: T) => T }).structuredClone;
  if (typeof globalClone === 'function') {
    return globalClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}
