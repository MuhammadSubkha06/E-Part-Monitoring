/**
 * Master Data types.
 *
 * These mirror the data that is authored on the Admin Website and pulled
 * down (read-only) into the Android app. The Android app never creates or
 * edits Master Data — it only reads it to validate transactions and to
 * resolve Line -> Machine -> Feeder location pickers.
 */

export interface MasterLine {
  id: string;
  name: string; // e.g. "SMT Line 1"
}

export interface MasterMachine {
  id: string;
  lineId: string;
  name: string; // e.g. "Machine A"
}

export interface MasterFeederSlot {
  id: string;
  machineId: string;
  slotNumber: number; // 1..N
  label: string; // e.g. "Slot 12"
}

export interface MasterMsl {
  level: string; // "MSL 1".."MSL 5" (matches MslRank in material.types, kept as
  // a free string here since Master MSL is authored independently on the
  // admin website)
  exposureTimeHours: number; // Exposure Time allowed after Open Package
}

export interface MasterPart {
  partNumber: string;
  partName: string;
  packageType: string;
  mslLevel: string; // references MasterMsl.level
  bakingAllowed: boolean;
  bakingTemperature: number; // Celsius
  bakingTime: number; // hours
  bakingFrequency: number; // how many times baking may run per cycle (informational)
  maxBakingCount: number; // hard limit -> SCRAP once reached
}
