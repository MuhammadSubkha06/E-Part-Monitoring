import { Material, MaterialHistoryEvent } from '../types/material.types';

export interface MaterialRepository {
  findByQrCode(qrCode: string): Promise<Material>;

  getHistory(materialId: string): Promise<MaterialHistoryEvent[]>;

  isFluxType3(partNumber: string): Promise<boolean>;

  stockIn(materialId: string): Promise<Material>;
  stockOut(materialId: string): Promise<Material>;
  returnToMcDry(materialId: string): Promise<Material>;
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
