import React from "react";
import type { NavigationData } from "../types";
import { UserMarker } from "./UserMarker";
import { PathOverlay } from "./PathOverlay";

interface CampusMapProps {
  data: NavigationData;
  activeDestinationId: string | null;
}

// Main visual canvas for the campus.
// Uses SVG so we can cleanly layer the map, path, and markers while
// keeping a Pokémon Go–style tilt and shadow applied to the container.
export const CampusMap: React.FC<CampusMapProps> = ({
  data,
  activeDestinationId
}) => {
  const { user, path, nodes, destination } = data;

  const resolvedDestinationId =
    activeDestinationId && nodes.some((n) => n.id === activeDestinationId)
      ? activeDestinationId
      : destination.id;

  const destinationNode =
    nodes.find((n) => n.id === resolvedDestinationId) ?? null;

  // The SVG viewBox assumes the navigation coordinates are in the range
  // [0, 1000] for x and y. The backend / JSON exporter should ensure
  // the coordinates in navigation.json are aligned to the campus image
  // used at /public/map/giki_map.png.
  const VIEWBOX_SIZE = 1000;

  return (
    <div className="map-shell">
      <div className="map-card">
        <div className="map-inner">
          <svg
            className="map-svg"
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.2  0 0 0 0 0.6  0 0 0 0 1  0 0 0 0.9 0"
                />
              </filter>
              <radialGradient id="destPulseGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffeb3b" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff9800" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Static campus map image. This file should be placed at:
               /public/map/giki_map.png
               No network calls are made; it is served as a static asset
               so the whole app can work fully offline. */}
            <image
              href="/map/giki_map.png"
              x={0}
              y={0}
              width={VIEWBOX_SIZE}
              height={VIEWBOX_SIZE}
              preserveAspectRatio="xMidYMid slice"
              opacity={0.98}
            />

            {/* Navigation path */}
            <PathOverlay path={path} />

            {/* Destination marker */}
            {destinationNode && (
              <g
                className="destination-marker"
                transform={`translate(${destinationNode.x} ${destinationNode.y})`}
              >
                <circle
                  className="destination-pulse"
                  cx={0}
                  cy={0}
                  r={20}
                  fill="url(#destPulseGradient)"
                />
                <circle
                  className="destination-core"
                  cx={0}
                  cy={0}
                  r={8}
                  fill="#ffeb3b"
                  stroke="#ff9800"
                  strokeWidth={2.5}
                />
              </g>
            )}

            {/* User marker */}
            <UserMarker x={user.x} y={user.y} heading={user.heading} />
          </svg>
        </div>
      </div>
    </div>
  );
};

