import { useCallback, useState } from 'react';
import { MaterialWithDerived } from '../types/material.types';
import { ScannerFlowState } from '../types/scanner.types';
import { materialService } from '../services/MaterialService';
import { RepositoryError } from '../repositories/MaterialRepository';

const INITIAL_STATE: ScannerFlowState = {
  step: 'IDLE_SCANNING',
  material: null,
  errorMessage: null,
  errorCode: null,
};

export type TransactionAction<P = void> = (materialId: string, payload: P) => Promise<MaterialWithDerived>;

/**
 * Drives the scan -> validate -> confirm flow shared by every module screen.
 * Input comes from the DENSO BHT-M80 in keyboard-wedge (HID) mode: the
 * scanner "types" the barcode into whichever TextInput currently has focus
 * and finishes with an Enter keystroke, which is what triggers `handleScan`.
 */
export function useScannerFlow<P = void>(action?: TransactionAction<P>) {
  const [state, setState] = useState<ScannerFlowState>(INITIAL_STATE);

  const handleScan = useCallback(async (barcode: string) => {
    const trimmed = barcode.trim();
    if (!trimmed) return;

    setState(s => ({ ...s, step: 'LOADING', errorMessage: null, errorCode: null }));
    try {
      const material = await materialService.resolveFromQr(trimmed);
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

  const confirm = useCallback(async (payload?: P) => {
    if (!state.material) return;
    if (!action) {
      setState(s => ({ ...s, step: 'SUCCESS' }));
      return;
    }
    setState(s => ({ ...s, step: 'SUBMITTING' }));
    try {
      const updated = await action(state.material.id, payload as P);
      setState(s => ({ ...s, step: 'SUCCESS', material: updated }));
    } catch (err) {
      setState(s => ({
        ...s,
        step: 'ERROR',
        errorCode: 'UNKNOWN',
        errorMessage: err instanceof Error ? err.message : 'Failed to save transaction. Please retry.',
      }));
    }
  }, [action, state.material]);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const setResult = useCallback((material: MaterialWithDerived) => {
    setState(s => ({ ...s, step: 'RESULT_READY', material, errorMessage: null, errorCode: null }));
  }, []);

  return { state, handleScan, confirm, reset, setResult };
}
