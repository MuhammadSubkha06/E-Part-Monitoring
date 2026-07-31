import { MasterFeederSlot, MasterLine, MasterMachine, MasterMsl, MasterPart } from '../types/master.types';
import { MASTER_FEEDER_SLOTS, MASTER_LINES, MASTER_MACHINES, MASTER_MSL, MASTER_PARTS } from './masterData.seed';

export interface MasterDataRepository {
  getLines(): Promise<MasterLine[]>;
  getMachinesByLine(lineId: string): Promise<MasterMachine[]>;
  getFeederSlotsByMachine(machineId: string): Promise<MasterFeederSlot[]>;
  getAllMsl(): Promise<MasterMsl[]>;
  getMslByLevel(level: string): Promise<MasterMsl | null>;
  getPartByPartNumber(partNumber: string): Promise<MasterPart | null>;
}

const SIMULATED_LATENCY_MS = 200;

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

/**
 * Reads Master Data from the in-memory dummy dataset. In production this
 * would be replaced by an implementation backed by REST calls to the Admin
 * Website API — the Android app only ever performs read operations here.
 */
export class DummyMasterDataRepository implements MasterDataRepository {
  async getLines(): Promise<MasterLine[]> {
    return delay([...MASTER_LINES]);
  }

  async getMachinesByLine(lineId: string): Promise<MasterMachine[]> {
    return delay(MASTER_MACHINES.filter(m => m.lineId === lineId));
  }

  async getFeederSlotsByMachine(machineId: string): Promise<MasterFeederSlot[]> {
    return delay(
      MASTER_FEEDER_SLOTS.filter(f => f.machineId === machineId).sort((a, b) => a.slotNumber - b.slotNumber),
    );
  }

  async getAllMsl(): Promise<MasterMsl[]> {
    return delay([...MASTER_MSL]);
  }

  async getMslByLevel(level: string): Promise<MasterMsl | null> {
    return delay(MASTER_MSL.find(m => m.level === level) ?? null);
  }

  async getPartByPartNumber(partNumber: string): Promise<MasterPart | null> {
    return delay(MASTER_PARTS.find(p => p.partNumber === partNumber) ?? null);
  }
}
