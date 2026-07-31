import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { masterDataService } from '../services/MasterDataService';
import { MasterFeederSlot, MasterLine, MasterMachine } from '../types/master.types';
import { MaterialLocation } from '../types/material.types';
import SectionCard from './SectionCard';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface Props {
  value: MaterialLocation | null;
  onChange: (location: MaterialLocation | null) => void;
}

/**
 * Enforces the mandatory Stock Out selection order: Line -> Machine ->
 * Feeder. Machine options only appear once a Line is picked, and Feeder
 * options only appear once a Machine is picked — matching "Machine hanya
 * muncul sesuai Line. Feeder hanya muncul sesuai Machine."
 */
export default function LocationPicker({ value, onChange }: Props) {
  const [lines, setLines] = useState<MasterLine[]>([]);
  const [machines, setMachines] = useState<MasterMachine[]>([]);
  const [feeders, setFeeders] = useState<MasterFeederSlot[]>([]);

  const [selectedLine, setSelectedLine] = useState<MasterLine | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<MasterMachine | null>(null);

  useEffect(() => {
    masterDataService.getLines().then(setLines);
  }, []);

  useEffect(() => {
    if (!selectedLine) {
      setMachines([]);
      return;
    }
    masterDataService.getMachinesByLine(selectedLine.id).then(setMachines);
  }, [selectedLine]);

  useEffect(() => {
    if (!selectedMachine) {
      setFeeders([]);
      return;
    }
    masterDataService.getFeederSlotsByMachine(selectedMachine.id).then(setFeeders);
  }, [selectedMachine]);

  const pickLine = (line: MasterLine) => {
    setSelectedLine(line);
    setSelectedMachine(null);
    onChange(null);
  };

  const pickMachine = (machine: MasterMachine) => {
    setSelectedMachine(machine);
    onChange(null);
  };

  const pickFeeder = (feeder: MasterFeederSlot) => {
    if (!selectedLine || !selectedMachine) return;
    onChange({
      lineId: selectedLine.id,
      lineName: selectedLine.name,
      machineId: selectedMachine.id,
      machineName: selectedMachine.name,
      feederId: feeder.id,
      feederLabel: feeder.label,
    });
  };

  return (
    <SectionCard title="Location (Required)">
      <Field label="1. Line">
        <ChipRow>
          {lines.map(line => (
            <Chip
              key={line.id}
              label={line.name}
              selected={selectedLine?.id === line.id}
              onPress={() => pickLine(line)}
            />
          ))}
        </ChipRow>
      </Field>

      <Field label="2. Machine">
        {selectedLine ? (
          <ChipRow>
            {machines.map(machine => (
              <Chip
                key={machine.id}
                label={machine.name}
                selected={selectedMachine?.id === machine.id}
                onPress={() => pickMachine(machine)}
              />
            ))}
          </ChipRow>
        ) : (
          <Text style={styles.disabledHint}>Select a Line first</Text>
        )}
      </Field>

      <Field label="3. Feeder Slot">
        {selectedMachine ? (
          <ChipRow>
            {feeders.map(feeder => (
              <Chip
                key={feeder.id}
                label={feeder.label}
                selected={value?.feederId === feeder.id}
                onPress={() => pickFeeder(feeder)}
              />
            ))}
          </ChipRow>
        ) : (
          <Text style={styles.disabledHint}>Select a Machine first</Text>
        )}
      </Field>

      {value ? (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {value.lineName} · {value.machineName} · {value.feederLabel}
          </Text>
        </View>
      ) : (
        <View style={styles.warning}>
          <Text style={styles.warningText}>Line, Machine and Feeder are all required to Save.</Text>
        </View>
      )}
    </SectionCard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
      {children}
    </ScrollView>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: Spacing.md },
  fieldLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  chipRow: { gap: Spacing.sm, paddingRight: Spacing.md },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.bodyStrong,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.textInverse,
  },
  disabledHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  summary: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.successBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  summaryText: {
    ...Typography.bodyStrong,
    color: Colors.success,
  },
  warning: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.warningBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  warningText: {
    ...Typography.bodyStrong,
    color: Colors.warning,
  },
});
