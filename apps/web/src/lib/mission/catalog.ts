import type { LaunchVehicle, Part, Scenario } from "./types";

export const scenario: Scenario = {
  id: "lunar-south-pole",
  name: "The elephants' rover to the lunar south pole",
  budgetM: 250,
  daysNeeded: 14,
  baseMassKg: 150,
  basePowerW: 30,
  baseCostM: 60,
};

export const instruments: Part[] = [
  { id: "nav-cam", kind: "instrument", name: "Navigation camera", blurb: "Sees the road, and the elephants' favorite crater.", massKg: 2, powerW: 5, costM: 8, dataMbPerDay: 300, science: 10 },
  { id: "seismometer", kind: "instrument", name: "Seismometer", blurb: "Listens for moonquakes.", massKg: 6, powerW: 8, costM: 18, dataMbPerDay: 200, science: 20 },
  { id: "spectrometer", kind: "instrument", name: "Spectrometer", blurb: "Reads what the rocks are made of.", massKg: 8, powerW: 20, costM: 25, dataMbPerDay: 900, science: 30 },
  { id: "radar", kind: "instrument", name: "Ground-penetrating radar", blurb: "Looks for ice under the dust.", massKg: 12, powerW: 25, costM: 30, dataMbPerDay: 600, science: 35 },
  { id: "drill", kind: "instrument", name: "Sample drill", blurb: "Digs for the good stuff.", massKg: 35, powerW: 60, costM: 40, dataMbPerDay: 120, science: 45 },
];

export const powerParts: Part[] = [
  { id: "solar-small", kind: "power", name: "Small solar array", blurb: "Light and cheap.", massKg: 12, powerW: 0, costM: 8, generationW: 80 },
  { id: "solar-medium", kind: "power", name: "Medium solar array", blurb: "A good all-rounder.", massKg: 20, powerW: 0, costM: 12, generationW: 140 },
  { id: "solar-large", kind: "power", name: "Large solar array", blurb: "Plenty of sun, plenty of mass.", massKg: 30, powerW: 0, costM: 18, generationW: 200 },
];

export const commsParts: Part[] = [
  { id: "uhf", kind: "comms", name: "UHF antenna", blurb: "Small and simple, slow.", massKg: 2, powerW: 3, costM: 5, downlinkMbPerDay: 400 },
  { id: "x-band", kind: "comms", name: "X-band dish", blurb: "The workhorse.", massKg: 9, powerW: 25, costM: 20, downlinkMbPerDay: 2000 },
  { id: "ka-band", kind: "comms", name: "Ka-band dish", blurb: "Fast, heavy, thirsty.", massKg: 18, powerW: 40, costM: 35, downlinkMbPerDay: 6000 },
];

export const vehicles: LaunchVehicle[] = [
  { id: "small", name: "Small launcher", blurb: "Cheap, and it throws light.", capacityKg: 250, costM: 55 },
  { id: "medium", name: "Medium launcher", blurb: "The sensible choice.", capacityKg: 900, costM: 110 },
  { id: "heavy", name: "Heavy launcher", blurb: "Throws anything, costs everything.", capacityKg: 2500, costM: 210 },
];

const parts = [...instruments, ...powerParts, ...commsParts];

export function findPart(id: string | null): Part | undefined {
  return id === null ? undefined : parts.find((p) => p.id === id);
}

export function findVehicle(id: string | null): LaunchVehicle | undefined {
  return id === null ? undefined : vehicles.find((v) => v.id === id);
}
