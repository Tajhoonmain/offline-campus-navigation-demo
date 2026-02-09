import React, { useEffect, useMemo, useState } from "react";
import { useNavigationData, FALLBACK_DATA } from "./hooks/useNavigationData";
import type { NavigationData } from "./types";
import { CampusMap } from "./components/CampusMap";
import { DestinationPicker } from "./components/DestinationPicker";
import { GIKI_BUILDINGS } from "./data/gikiBuildings";
import { useGpsPosition } from "./hooks/useGpsPosition";

export const App: React.FC = () => {
  const { data, loading, error, source } = useNavigationData();
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(null);

  // Keep local selection in sync with whatever the JSON says when
  // new navigation data comes in.
  useEffect(() => {
    if (data) {
      setSelectedDestinationId(data.destination.id);
    }
  }, [data]);

  // Canonical building nodes derived from the GIKI_BUILDINGS table.
  const canonicalNodes: NavigationData["nodes"] = useMemo(
    () =>
      GIKI_BUILDINGS.map((b) => ({
        id: b.id,
        name: b.name,
        x: b.x,
        y: b.y
      })),
    []
  );

  // Merge JSON-provided nodes with canonical building nodes so that
  // official GIKI buildings always appear in the destination list.
  const nodes: NavigationData["nodes"] = useMemo(() => {
    const base = data?.nodes ?? [];
    const byId = new Map<string, NavigationData["nodes"][number]>();

    for (const n of base) {
      byId.set(n.id, n);
    }

    for (const b of canonicalNodes) {
      if (!byId.has(b.id)) {
        byId.set(b.id, b);
      }
    }

    return Array.from(byId.values());
  }, [data, canonicalNodes]);

  // Determine whether GPS should be used:
  // 1) Only when backend JSON data is missing (hook fell back),
  //    or
  // 2) When explicitly forced via VITE_FORCE_GPS for testing.
  const shouldUseGps =
    source === "fallback" || import.meta.env.VITE_FORCE_GPS === "true";

  const {
    user: gpsUser,
    status: gpsStatus,
    error: gpsError
  } = useGpsPosition(shouldUseGps);

  // Priority order for effective user position:
  // 1. Backend JSON user position (when source === "json")
  // 2. GPS-based user position
  // 3. Fallback mock position (from FALLBACK_DATA)
  const effectiveUser =
    (data && source === "json" && data.user) ||
    gpsUser ||
    FALLBACK_DATA.user;

  const effectiveData: NavigationData | null = data
    ? { ...data, user: effectiveUser }
    : { ...FALLBACK_DATA, user: effectiveUser };

  const activeDestinationId =
    selectedDestinationId ?? data?.destination.id ?? null;

  const activeDestinationName =
    nodes.find((n) => n.id === activeDestinationId)?.name ??
    data?.destination.name ??
    "Unknown destination";

  return (
    <div className="app-root">
      <div className="app-shell">
        <header className="top-bar">
          <div className="brand">
            <span className="brand-primary">Campus</span>
            <span className="brand-secondary">Go</span>
          </div>
          <div className="status-pill">
            {loading && !data && <span>Loading map...</span>}
            {!loading && effectiveData && gpsUser && shouldUseGps && (
              <span>Using GPS</span>
            )}
            {!loading && effectiveData && !gpsUser && source === "json" && (
              <span>Using JSON data</span>
            )}
            {!loading && effectiveData && !gpsUser && source === "fallback" && (
              <span>Using Demo Data</span>
            )}
          </div>
        </header>

        {error && (
          <div className="warning-banner">
            <strong>Data warning:</strong> {error}
            <span className="warning-hint">
              Place navigation data at{" "}
              <code>/public/data/navigation.json</code> to drive this
              screen.
            </span>
          </div>
        )}

        {gpsError && shouldUseGps && (
          <div className="warning-banner gps-banner">
            <strong>GPS notice:</strong> {gpsError}
            <span className="warning-hint">
              GPS positioning is approximate indoors and may drift from
              the map.
            </span>
          </div>
        )}

        <main className="content">
          <section className="controls-panel">
            <DestinationPicker
              nodes={nodes}
              selectedId={activeDestinationId}
              onChange={setSelectedDestinationId}
              disabled={!effectiveData}
            />
            <p className="helper-text">
              The glowing line and blue dot are controlled entirely by{" "}
              <code>/public/data/navigation.json</code>. This UI is
              offline-only and does not call any backend APIs&mdash;the
              backend just needs to keep that JSON file up to date.
            </p>
            <p className="helper-text helper-text-secondary">
              GPS positioning (when enabled) is approximate indoors and
              only affects the blue dot, not routing.
            </p>
          </section>

          <section className="map-section">
            {effectiveData ? (
              <CampusMap
                data={effectiveData}
                activeDestinationId={activeDestinationId}
              />
            ) : (
              <div className="map-placeholder">
                <div className="map-skeleton" />
                <p>Waiting for navigation data...</p>
              </div>
            )}
          </section>
        </main>

        <footer className="legend">
          <div className="legend-item">
            <span className="legend-swatch legend-user" />
            <span>Blue dot: your current position</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch legend-path" />
            <span>Glowing line: current route</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch legend-destination" />
            <span>Pulsing ring: selected destination</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

