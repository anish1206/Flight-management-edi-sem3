/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/** Predictive maintenance domain types */
export type EngineComponent = "Fan" | "LPC" | "HPC" | "HPT" | "LPT";

export interface RulPoint {
  cycle: number;
  predicted: number;
  qLow: number; // lower quantile
  qHigh: number; // upper quantile
  actual?: number;
}

export interface ExplainContributor {
  sensor: string;
  weight: number; // positive increases failure risk / lowers RUL
}

export interface EngineRecord {
  id: string;
  currentRUL: number;
  predictedFailureComponent: EngineComponent;
  confidenceLow: number;
  confidenceHigh: number;
  lastUpdated: string; // ISO date
  history: RulPoint[];
  contributors: ExplainContributor[];
}

export type Severity = "Low" | "Medium" | "High";

export interface DefectLog {
  id: string;
  category: "Seat" | "Lights" | "Air Conditioning" | "Lavatory" | "In-flight Entertainment";
  description: string;
  severity: Severity;
  flight?: string;
  createdAt: string; // ISO date
}

export type AlertLevel = "Healthy" | "Caution" | "Critical";

export interface MaintenanceAlert {
  id: string;
  engineId: string;
  level: AlertLevel;
  message: string;
  cyclesLeft: number;
  createdAt: string; // ISO date
}
