// TEMPORARY GPS → map coordinate calibration.
//
// This file intentionally lives in its own small module so that it can be
// deleted later without touching the rest of the codebase. It implements a
// simple linear mapping between lat/lng and map-space (x, y) using two
// approximate calibration points on campus.
//
// Once a more accurate positioning pipeline is available, this entire file
// can be removed and any callers can switch to backend-provided map-space
// coordinates instead.

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface MapPoint {
  x: number;
  y: number;
}

export interface CalibrationPoint {
  geo: GeoPoint;
  map: MapPoint;
  label: string;
}

// APPROXIMATE coordinates for GIKI.
// These values are intentionally rough and should be refined with real
// survey data if GPS support is kept long-term.
export const MAIN_GATE_CALIBRATION: CalibrationPoint = {
  label: "GIKI Main Gate (approx)",
  geo: {
    lat: 33.7555,
    lng: 72.8145
  },
  map: {
    // Near the lower-left of the campus on the map
    x: 150,
    y: 780
  }
};

export const CENTRAL_ACB_CALIBRATION: CalibrationPoint = {
  label: "Central Academic Block (approx)",
  geo: {
    lat: 33.7685,
    lng: 72.8245
  },
  map: {
    // Roughly central academic area on the map
    x: 460,
    y: 490
  }
};

// Simple linear mapping:
// - X is interpolated along the longitude axis
// - Y is interpolated along the latitude axis
//
// This assumes the campus is small enough that lat/lng distortions are
// negligible over its footprint, which is good enough for an open‑house
// demo and clearly marked here as a TEMPORARY hack.
export function geoToMap(lat: number, lng: number): MapPoint {
  const gate = MAIN_GATE_CALIBRATION;
  const acb = CENTRAL_ACB_CALIBRATION;

  const lngSpan = acb.geo.lng - gate.geo.lng || 1e-6;
  const latSpan = acb.geo.lat - gate.geo.lat || 1e-6;

  const x =
    gate.map.x + ((lng - gate.geo.lng) / lngSpan) * (acb.map.x - gate.map.x);
  const y =
    gate.map.y + ((lat - gate.geo.lat) / latSpan) * (acb.map.y - gate.map.y);

  return { x, y };
}

