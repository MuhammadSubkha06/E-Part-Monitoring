import { useCallback, useState } from 'react';
import { MaterialWithDerived } from '../types/material.types';
import { ScannerFlowState } from '../types/scanner.types';
import { materialService } from '../services/MaterialService';
import { RepositoryError } from '../repositories/MaterialRepository';

const INITIAL_STATE: ScannerFlowState = {
  step: 'IDLE_SCANNING',
  cameraPermission: 'UNKNOWN',
  material: null,
  errorMessage: null,
  errorCode: null,
};

export type TransactionAction = (materialId: string) => Promise<MaterialWithDerived>;

export function useScannerFlow(action?: TransactionAction) {
  const [state, setState] = useState<ScannerFlowState>(INITIAL_STATE);

  const setCameraPermission = useCallback((granted: boolean) => {
    setState(s => ({ ...s, cameraPermission: granted ? 'GRANTED' : 'DENIED' }));
  }, []);

  const handleScan = useCallback(async (qrCode: string) => {
    setState(s => ({ ...s, step: 'LOADING', errorMessage: null, errorCode: null }));
    try {
      const material = await materialService.resolveFromQr(qrCode);
      setState(s => ({ ...s, step: 'RESULT_READY', material }));
    } catch (err) {
      if (err instanceof RepositoryError) {
        setState(s => ({
          ...s,
          step: 'ERROR',
          errorCode: err.code,
          errorMessage: err.message,
        }));
      } else {
        setState(s => ({
          ...s,
          step: 'ERROR',
          errorCode: 'UNKNOWN',
          errorMessage: 'Unexpected error while reading material state.',
        }));
      }
    }
  }, []);

  const confirm = useCallback(async () => {
    if (!state.material) return;
    if (!action) {
      setState(s => ({ ...s, step: 'SUCCESS' }));
      return;
    }
    setState(s => ({ ...s, step: 'SUBMITTING' }));
    try {
      const updated = await action(state.material.id);
      setState(s => ({ ...s, step: 'SUCCESS', material: updated }));
    } catch {
      setState(s => ({
        ...s,
        step: 'ERROR',
        errorCode: 'UNKNOWN',
        errorMessage: 'Failed to save transaction. Please retry.',
      }));
    }
  }, [action, state.material]);

  const reset = useCallback(() => {
    setState(s => ({ ...INITIAL_STATE, cameraPermission: s.cameraPermission }));
  }, []);

  return { state, setCameraPermission, handleScan, confirm, reset };
}
