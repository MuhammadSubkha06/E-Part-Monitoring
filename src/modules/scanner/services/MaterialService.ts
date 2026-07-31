import { MaterialRepository, BakingInput } from '../repositories/MaterialRepository';
import { DummyMaterialRepository } from '../repositories/DummyMaterialRepository';
import { MaterialHistoryEvent, MaterialLocation, MaterialWithDerived } from '../types/material.types';
import { withDerivedState } from '../utils/materialDerivedState';

export class MaterialService {
  constructor(private repository: MaterialRepository) {}

  async resolveById(materialId: string): Promise<MaterialWithDerived | null> {
    const materials = await this.repository.listAll();
    const found = materials.find(m => m.id === materialId);
    if (!found) return null;
    const fluxType3 = await this.repository.isFluxType3(found.partNumber);
    return withDerivedState(found, fluxType3);
  }

  async resolveFromQr(qrCode: string): Promise<MaterialWithDerived> {
    const material = await this.repository.findByQrCode(qrCode);
    const fluxType3 = await this.repository.isFluxType3(material.partNumber);
    return withDerivedState(material, fluxType3);
  }

  async getHistory(materialId: string): Promise<MaterialHistoryEvent[]> {
    return this.repository.getHistory(materialId);
  }

  async listAllWithDerived(): Promise<MaterialWithDerived[]> {
    const materials = await this.repository.listAll();
    const withFlux = await Promise.all(
      materials.map(async m => withDerivedState(m, await this.repository.isFluxType3(m.partNumber))),
    );
    return withFlux;
  }

  async confirmStockIn(materialId: string, mslLevel: string): Promise<MaterialWithDerived> {
    const material = await this.repository.stockIn(materialId, mslLevel);
    const fluxType3 = await this.repository.isFluxType3(material.partNumber);
    return withDerivedState(material, fluxType3);
  }

  async confirmStockOut(materialId: string, location: MaterialLocation): Promise<MaterialWithDerived> {
    const material = await this.repository.stockOut(materialId, location);
    const fluxType3 = await this.repository.isFluxType3(material.partNumber);
    return withDerivedState(material, fluxType3);
  }

  async confirmReturnToMcDry(materialId: string): Promise<MaterialWithDerived> {
    const material = await this.repository.returnToMcDry(materialId);
    const fluxType3 = await this.repository.isFluxType3(material.partNumber);
    return withDerivedState(material, fluxType3);
  }

  async confirmBaking(materialId: string, input: BakingInput): Promise<MaterialWithDerived> {
    const material = await this.repository.bake(materialId, input);
    const fluxType3 = await this.repository.isFluxType3(material.partNumber);
    return withDerivedState(material, fluxType3);
  }
}

export const materialService = new MaterialService(new DummyMaterialRepository());
