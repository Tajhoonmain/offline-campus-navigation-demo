// Canonical list of key GIKI buildings used as first‑class destinations.
// IMPORTANT:
// - Coordinates are in map space (0–1000) and are APPROXIMATE.
// - These are TEMPORARY and should be refined once the campus map is
//   fully calibrated. Keeping them here avoids scattering magic numbers.

export interface GikiBuilding {
  id: string; // kebab-case identifier, e.g. "fmce"
  name: string; // Human readable label, e.g. "FMCE"
  x: number; // Map-space X coordinate (0–1000)
  y: number; // Map-space Y coordinate (0–1000)
}

export const GIKI_BUILDINGS: GikiBuilding[] = [
  {
    id: "fmce",
    name: "FMCE",
    // TEMPORARY: roughly near the engineering block cluster
    x: 430,
    y: 520
  },
  {
    id: "acb",
    name: "ACB (Academic Block)",
    // TEMPORARY: central academic block approximation
    x: 460,
    y: 490
  },
  {
    id: "fme",
    name: "FME",
    // TEMPORARY: placed slightly north-east of ACB
    x: 510,
    y: 450
  },
  {
    id: "library",
    name: "Library",
    // TEMPORARY: near the academic core
    x: 440,
    y: 460
  },
  {
    id: "fcse",
    name: "FCSE",
    // TEMPORARY: close to existing "CS Lab" style nodes
    x: 520,
    y: 440
  },
  {
    id: "fbs",
    name: "FBS",
    // TEMPORARY: slightly south-west of the main cluster
    x: 410,
    y: 550
  },
  {
    id: "brabers",
    name: "Brabers",
    // TEMPORARY: near residential / support area
    x: 360,
    y: 600
  }
];

