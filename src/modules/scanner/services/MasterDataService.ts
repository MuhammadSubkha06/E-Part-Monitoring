import { MasterDataRepository, DummyMasterDataRepository } from '../repositories/MasterDataRepository';
import { MasterFeederSlot, MasterLine, MasterMachine, MasterMsl, MasterPart } from '../types/master.types';

export class MasterDataService {
  constructor(private repository: MasterDataRepository) {}

  getLines(): Promise<MasterLine[]> {
    return this.repository.getLines();
  }

  getMachinesByLine(lineId: string): Promise<MasterMachine[]> {
    return this.repository.getMachinesByLine(lineId);
  }

  getFeederSlotsByMachine(machineId: string): Promise<MasterFeederSlot[]> {
    return this.repository.getFeederSlotsByMachine(machineId);
  }

  getAllMsl(): Promise<MasterMsl[]> {
    return this.repository.getAllMsl();
  }

  getMslByLevel(level: string): Promise<MasterMsl | null> {
    return this.repository.getMslByLevel(level);
  }

  getPartByPartNumber(partNumber: string): Promise<MasterPart | null> {
    return this.repository.getPartByPartNumber(partNumber);
  }
}

export const masterDataService = new MasterDataService(new DummyMasterDataRepository());
