import React from "react";

interface PathPoint {
  x: number;
  y: number;
}

interface PathOverlayProps {
  path: PathPoint[];
}

// Draws the navigation path as a glowing polyline.
// Rendered in SVG coordinates that should match the campus map image.
export const PathOverlay: React.FC<PathOverlayProps> = ({ path }) => {
  if (!path || path.length < 2) {
    return null;
  }

  const pointsAttr = path.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <>
      {/* Outer glow */}
      <polyline
        className="nav-path nav-path-glow"
        points={pointsAttr}
        fill="none"
      />
      {/* Core path */}
      <polyline className="nav-path" points={pointsAttr} fill="none" />
    </>
  );
};

