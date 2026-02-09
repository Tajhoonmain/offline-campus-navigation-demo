import { useEffect, useState } from "react";
import { geoToMap } from "../utils/geoToMap";
import { CENTRAL_ACB_CALIBRATION } from "../utils/geoToMap";

type GpsStatus =
  | "idle"
  | "watching"
  | "unsupported"
  | "permission-denied"
  | "error";

interface GpsUserPosition {
  x: number;
  y: number;
  heading: number;
}

interface UseGpsPositionResult {
  user: GpsUserPosition | null;
  status: GpsStatus;
  error: string | null;
}

// TEMPORARY GPS hook.
// - Uses navigator.geolocation.watchPosition when enabled.
// - Maps lat/lng into map coordinates via geoToMap().
// - Falls back to a static position near the central academic block if
//   permissions are denied or GPS is unavailable.
// - Designed to be removable without refactoring other modules.
export function useGpsPosition(enabled: boolean): UseGpsPositionResult {
  const [user, setUser] = useState<GpsUserPosition | null>(null);
  const [status, setStatus] = useState<GpsStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      setError(null);
      return;
    }

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      setError("GPS is not supported on this device.");
      // Static fallback near the academic core
      const fallback = CENTRAL_ACB_CALIBRATION.map;
      setUser({ x: fallback.x, y: fallback.y, heading: 0 });
      return;
    }

    let lastUpdate = 0;

    setStatus("watching");
    setError(null);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        // Throttle updates to avoid aggressive updates on mobile.
        if (now - lastUpdate < 2000) {
          return;
        }
        lastUpdate = now;

        const { latitude, longitude } = pos.coords;
        const mapPoint = geoToMap(latitude, longitude);

        setUser({
          x: mapPoint.x,
          y: mapPoint.y,
          // Heading is not reliably available from GPS alone; default to 0.
          heading: 0
        });
        setError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("permission-denied");
          setError("GPS permission denied. Using demo position instead.");
        } else {
          setStatus("error");
          setError("Unable to read GPS position. Using demo position instead.");
        }

        // On error, fall back to a static, central mock position.
        const fallback = CENTRAL_ACB_CALIBRATION.map;
        setUser({ x: fallback.x, y: fallback.y, heading: 0 });
      },
      {
        enableHighAccuracy: false,
        maximumAge: 5000,
        timeout: 10000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled]);

  return { user, status, error };
}

