import type { Design } from "./types";

// Small designs the tests and the stories share.
export const balanced: Design = { instrumentIds: ["nav-cam", "spectrometer"], powerId: "solar-medium", commsId: "x-band", vehicleId: "medium" };
export const tooHeavy: Design = { instrumentIds: ["nav-cam", "seismometer", "spectrometer", "radar", "drill"], powerId: "solar-large", commsId: "ka-band", vehicleId: "small" };
export const overBudget: Design = { instrumentIds: ["nav-cam"], powerId: "solar-small", commsId: "uhf", vehicleId: "heavy" };
export const dataStarved: Design = { instrumentIds: ["spectrometer", "radar", "drill"], powerId: "solar-large", commsId: "uhf", vehicleId: "small" };
export const powerStarved: Design = { instrumentIds: ["spectrometer", "radar", "drill"], powerId: "solar-small", commsId: "x-band", vehicleId: "small" };
export const empty: Design = { instrumentIds: [], powerId: null, commsId: null, vehicleId: null };
