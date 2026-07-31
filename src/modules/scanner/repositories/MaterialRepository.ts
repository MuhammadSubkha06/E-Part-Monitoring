import { Material, MaterialHistoryEvent, MaterialLocation } from '../types/material.types';

export interface BakingInput {
  temperature: number;
  time: number;
}

export interface MaterialRepository {
  findByQrCode(qrCode: string): Promise<Material>;

  getHistory(materialId: string): Promise<MaterialHistoryEvent[]>;

  isFluxType3(partNumber: string): Promise<boolean>;

  /** Returns every material currently tracked, with exposure recomputed live. */
  listAll(): Promise<Material[]>;

  stockIn(materialId: string, mslLevel: string): Promise<Material>;

  /**
   * Stock Out always requires the operator to select a Line -> Machine ->
   * Feeder location. If the material is still vacuum-sealed, this also
   * opens the package and starts the exposure clock; if it came from MC
   * Dry, this resumes the exposure clock from where it was frozen.
   */
  stockOut(materialId: string, location: MaterialLocation): Promise<Material>;

  returnToMcDry(materialId: string): Promise<Material>;

  /**
   * Records a Baking cycle. Increments Baking Count; if the count reaches
   * the Master Part's Maximum Baking Count the material is scrapped,
   * otherwise it is returned to MC Dry with its exposure clock reset.
   */
  bake(materialId: string, input: BakingInput): Promise<Material>;
}

export type RepositoryErrorCode = 'INVALID_QR' | 'MASTER_DATA_NOT_FOUND' | 'UNKNOWN';

export class RepositoryError extends Error {
  code: RepositoryErrorCode;

  constructor(code: RepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'RepositoryError';
  }
}
