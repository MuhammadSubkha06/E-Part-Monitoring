import { MaterialRepository } from '../repositories/MaterialRepository';
import { DummyMaterialRepository } from '../repositories/DummyMaterialRepository';
import { MaterialHistoryEvent, MaterialWithDerived } from '../types/material.types';
import { withDerivedState } from '../utils/materialDerivedState';

export class MaterialService {
  constructor(private repository: MaterialRepository) {}

  async resolveFromQr(qrCode: string): Promise<MaterialWithDerived> {
    const material = await this.repository.findByQrCode(qrCode);
    const fluxType3 = await this.repository.isFluxType3(material.partNumber);
    return withDerivedState(material, fluxType3);
  }

  async getHistory(materialId: string): Promise<MaterialHistoryEvent[]> {
    return this.repository.getHistory(materialId);
  }

  async confirmStockIn(materialId: string): Promise<MaterialWithDerived> {
    const material = await this.repository.stockIn(materialId);
    const fluxType3 = await this.repository.isFluxType3(material.partNumber);
    return withDerivedState(material, fluxType3);
  }

  async confirmStockOut(materialId: string): Promise<MaterialWithDerived> {
    const material = await this.repository.stockOut(materialId);
    const fluxType3 = await this.repository.isFluxType3(material.partNumber);
    return withDerivedState(material, fluxType3);
  }

  async confirmReturnToMcDry(materialId: string): Promise<MaterialWithDerived> {
    const material = await this.repository.returnToMcDry(materialId);
    const fluxType3 = await this.repository.isFluxType3(material.partNumber);
    return withDerivedState(material, fluxType3);
  }
}

export const materialService = new MaterialService(new DummyMaterialRepository());
