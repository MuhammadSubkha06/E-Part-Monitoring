import { Material, MaterialHistoryEvent, MaterialLocation } from '../types/material.types';
import { BakingInput, MaterialRepository, RepositoryError } from './MaterialRepository';
import { MATERIAL_SEED, FLUX_TYPE_3_PART_NUMBERS, MASTER_DATA_NOT_FOUND_QR } from './seedData';
import { MASTER_PARTS, MASTER_MSL } from './masterData.seed';
import { computeLiveExposureHours } from '../utils/exposureCalculator';
import { DEFAULT_BAKING_LIMIT } from '../constants/businessRules';
import { parseHidBarcode } from '../utils/barcodeParser';

const SIMULATED_LATENCY_MS = 550;

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

function locationLabel(location: MaterialLocation): string {
  return `${location.lineName} / ${location.machineName} / ${location.feederLabel}`;
}

export class DummyMaterialRepository implements MaterialRepository {
  private store: Map<string, Material>;

  constructor() {
    this.store = new Map(MATERIAL_SEED.map(m => [m.id, structuredCloneSafe(m)]));
  }

  async findByQrCode(qrCode: string): Promise<Material> {
    const parsed = parseHidBarcode(qrCode);

    if (!parsed) {
      await delay(null, 300);
      throw new RepositoryError(
        'INVALID_QR',
        'The scanned barcode is not a recognized material label. Expected format: PARTNUMBER;LOTNUMBER;UNIQUENUMBER.',
      );
    }

    if (MASTER_DATA_NOT_FOUND_QR.has(qrCode)) {
      await delay(null);
      throw new RepositoryError('MASTER_DATA_NOT_FOUND', 'No Master Data found for this material.');
    }

    const found = Array.from(this.store.values()).find(
      m => m.partNumber === parsed.partNumber && m.lotNumber === parsed.lotNumber,
    );

    if (!found) {
      await delay(null);
      throw new RepositoryError('MASTER_DATA_NOT_FOUND', 'No Master Data found for this material.');
    }

    return delay(this.withLiveExposure(found));
  }

  async getHistory(materialId: string): Promise<MaterialHistoryEvent[]> {
    const material = this.store.get(materialId);
    return delay(material ? [...material.history] : [], 350);
  }

  async isFluxType3(partNumber: string): Promise<boolean> {
    return delay(FLUX_TYPE_3_PART_NUMBERS.has(partNumber), 150);
  }

  async listAll(): Promise<Material[]> {
    return delay(Array.from(this.store.values()).map(m => this.withLiveExposure(m)), 150);
  }

  async stockIn(materialId: string, mslLevel: string): Promise<Material> {
    if (!mslLevel) {
      throw new RepositoryError('UNKNOWN', 'Operator must select a Rank / MSL Level before Stock In.');
    }

    const material = this.getOrThrow(materialId);
    const masterMsl = MASTER_MSL.find(m => m.level === mslLevel);

    // Stock In brings material into the Display Rack. It is still vacuum
    // packed, so the exposure clock does not start and no location is
    // requested — only Warehouse / Rack matters at this stage.
    material.mslRank = mslLevel as Material['mslRank'];
    if (masterMsl && material.category !== 'PCB') {
      material.exposureLimitHours = masterMsl.exposureTimeHours;
    }
    material.currentStatus = 'AVAILABLE';
    material.isInMcDry = false;
    material.location = null;
    material.history.unshift(historyEvent('STOCK_IN', material.currentLocation, `Rank/MSL Level: ${mslLevel}`));
    return delay(this.withLiveExposure(material));
  }

  async stockOut(materialId: string, location: MaterialLocation): Promise<Material> {
    if (!location.lineId || !location.machineId || !location.feederId) {
      throw new RepositoryError('UNKNOWN', 'Line, Machine and Feeder must all be selected before Stock Out.');
    }

    const material = this.getOrThrow(materialId);
    const wasInMcDry = material.isInMcDry;

    if (material.category !== 'PCB') {
      if (!material.openPackageDate) {
        // First time out of vacuum packaging: exposure clock starts now.
        material.openPackageDate = new Date().toISOString();
        material.accumulatedExposureHours = 0;
        material.exposureResumedAt = new Date().toISOString();
      } else if (wasInMcDry) {
        // Coming back from MC Dry: resume exactly where it was frozen.
        material.exposureResumedAt = new Date().toISOString();
      }
      // If it was already running (e.g. re-confirming location) we leave
      // exposureResumedAt untouched so the clock keeps ticking continuously.
    }

    material.location = location;
    material.currentLocation = locationLabel(location);
    material.currentStatus = 'IN_PRODUCTION';
    material.isInMcDry = false;

    material.history.unshift(
      historyEvent(
        'STOCK_OUT',
        material.currentLocation,
        wasInMcDry ? 'Exposure resumed from MC Dry' : undefined,
      ),
    );

    return delay(this.withLiveExposure(material));
  }

  async returnToMcDry(materialId: string): Promise<Material> {
    const material = this.getOrThrow(materialId);

    if (material.category !== 'PCB' && material.exposureResumedAt) {
      // Freeze the exposure clock at its current live value.
      material.accumulatedExposureHours = computeLiveExposureHours(material);
      material.exposureResumedAt = null;
    }

    material.currentStatus = 'MC_DRY';
    material.isInMcDry = true;
    material.currentLocation = 'MC Dry Cabinet 01';
    material.history.unshift(historyEvent('MC_DRY_IN', material.currentLocation));
    return delay(this.withLiveExposure(material));
  }

  async bake(materialId: string, input: BakingInput): Promise<Material> {
    const material = this.getOrThrow(materialId);
    const masterPart = MASTER_PARTS.find(p => p.partNumber === material.partNumber);

    if (!material.bakingAllowed || !masterPart?.bakingAllowed) {
      throw new RepositoryError('UNKNOWN', 'This Part does not allow Baking.');
    }

    material.bakingCount += 1;
    material.history.unshift(
      historyEvent(
        'BAKING_START',
        'Baking Oven',
        `Temperature ${input.temperature}°C, Time ${input.time}h`,
      ),
    );

    const bakingLimit = material.bakingLimit || DEFAULT_BAKING_LIMIT;

    if (material.bakingCount >= bakingLimit) {
      // Maximum Baking Count reached: material can no longer be reused.
      material.currentStatus = 'SCRAP';
      material.isInMcDry = false;
      material.exposureResumedAt = null;
      material.history.unshift(historyEvent('SCRAP', 'Baking Oven', 'Maximum Baking Count reached'));
    } else {
      // Baking removes moisture: exposure clock resets and material is
      // ready to be used again straight from MC Dry.
      material.accumulatedExposureHours = 0;
      material.exposureResumedAt = null;
      material.currentStatus = 'MC_DRY';
      material.isInMcDry = true;
      material.currentLocation = 'MC Dry Cabinet 01';
      material.history.unshift(historyEvent('BAKING_COMPLETE', 'MC Dry Cabinet 01'));
    }

    return delay(this.withLiveExposure(material));
  }

  private getOrThrow(materialId: string): Material {
    const material = this.store.get(materialId);
    if (!material) {
      throw new RepositoryError('MASTER_DATA_NOT_FOUND', `Material ${materialId} does not exist in-session.`);
    }
    return material;
  }

  /** Returns a clone with `currentExposureHours` recomputed against "now". */
  private withLiveExposure(material: Material): Material {
    const clone = structuredCloneSafe(material);
    if (clone.category !== 'PCB') {
      clone.currentExposureHours = computeLiveExposureHours(clone);
    }
    return clone;
  }
}

function historyEvent(type: MaterialHistoryEvent['type'], location: string, note?: string): MaterialHistoryEvent {
  return {
    id: `H-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    type,
    timestamp: new Date().toISOString(),
    location,
    operator: 'Current Operator',
    note,
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
