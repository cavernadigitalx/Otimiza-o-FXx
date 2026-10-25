export interface MotoDevice {
  id: string;
  name: string;
  series: 'Edge' | 'Moto G' | 'Razr' | 'ThinkPhone' | 'Moto E';
  chipset: string;
  defaultRam: number; // GB
  maxRamBoost: number; // GB
  refreshRate: number; // Hz
  chargingWattage: number; // W
  androidVersion: string;
  uiVersion: string; // Hello UI / My UX
}

export type PerformanceMode = 'battery' | 'balanced' | 'gametime' | 'ultra';

export interface StorageCategory {
  id: string;
  name: string;
  description: string;
  sizeMB: number;
  icon: string;
  recommended: boolean;
  selected: boolean;
}

export interface BoostStage {
  id: number;
  title: string;
  description: string;
  progress: number;
}

export interface HardwareTelemetry {
  cores: number;
  deviceMemoryGB: number;
  batteryLevel: number | null;
  isCharging: boolean | null;
  batteryTempC: number;
  ramUsagePercent: number;
  storageUsedGB: number;
  storageTotalGB: number;
  currentFps: number;
  screenHz: number;
  pingMs: number | null;
}
