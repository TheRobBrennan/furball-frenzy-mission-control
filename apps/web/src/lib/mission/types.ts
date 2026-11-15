// The mission design game, slice 1: one mission, the Polish elephants' rover to the lunar south pole.
// All numbers are simplified teaching values, not flight data, see the debrief slice for real missions.

export type PartKind = "instrument" | "power" | "comms" | "launch";

/** Something the player picks from a card. Power draw is positive, generation is negative. */
export type Part = {
  id: string;
  kind: Exclude<PartKind, "launch">;
  name: string;
  blurb: string;
  massKg: number;
  powerW: number; // draw while operating, a power part's generation is `generationW`
  costM: number; // million dollars
  generationW?: number; // power parts only
  dataMbPerDay?: number; // instruments only, what they produce
  downlinkMbPerDay?: number; // comms parts only, what they can send home
  science?: number; // instruments only, points when all of their data reaches Earth
};

export type LaunchVehicle = {
  id: string;
  name: string;
  blurb: string;
  capacityKg: number; // what it can throw to the Moon
  costM: number;
};

/** What the player has chosen. Ids point into the catalog. */
export type Design = {
  instrumentIds: string[];
  powerId: string | null;
  commsId: string | null;
  vehicleId: string | null;
};

export type Scenario = {
  id: string;
  name: string;
  budgetM: number;
  daysNeeded: number;
  baseMassKg: number; // the rover itself, wheels and structure
  basePowerW: number; // the rover's own computer and heaters
  baseCostM: number;
};

export type GaugeId = "mass" | "power" | "budget" | "data" | "comms" | "time";
export type GaugeStatus = "ok" | "tight" | "over";

/** One of the six gauges, how much is used of how much there is. */
export type Gauge = { id: GaugeId; label: string; unit: string; used: number; limit: number; status: GaugeStatus };

export type IssueCode =
  | "no-vehicle"
  | "no-power"
  | "no-comms"
  | "no-instrument"
  | "too-heavy"
  | "over-budget";

export type Issue = { code: IssueCode; message: string };

export type Evaluation = {
  gauges: Gauge[];
  issues: Issue[];
  /** True when nothing blocks the launch button. Power and data shortfalls do not block it, they cost science. */
  canLaunch: boolean;
};

export type PhaseId = "launch" | "transit" | "landing" | "surface";
export type Phase = { id: PhaseId; label: string; ok: boolean; note: string };

export type MissionResult = {
  launched: boolean;
  success: boolean;
  phases: Phase[];
  /** 0 to 100, how much of the possible science reached Earth. */
  science: number;
  /** Days the rover worked before it shut down, up to the days needed. */
  daysOperating: number;
  /** Plain words about the decision that cost the most, for the debrief. */
  biggestLoss: string | null;
};
