import React from "react";

interface UserMarkerProps {
  x: number;
  y: number;
  heading: number; // degrees, 0 = facing up in map coordinates
}

// Renders the user as a blue dot with a heading cone.
// This component is SVG-only and must be rendered inside an <svg>.
export const UserMarker: React.FC<UserMarkerProps> = ({
  x,
  y,
  heading
}) => {
  return (
    <g transform={`translate(${x} ${y}) rotate(${heading})`}>
      {/* Heading cone (points "up" by default, then rotated by heading) */}
      <path
        className="user-heading-cone"
        d="M0 -10 L-22 -70 L22 -70 Z"
        fill="rgba(80, 170, 255, 0.3)"
      />

      {/* Outer halo */}
      <circle
        className="user-dot"
        cx={0}
        cy={0}
        r={10}
        fill="#1d7ff2"
        opacity={0.85}
      />

      {/* Inner core */}
      <circle
        className="user-dot-inner"
        cx={0}
        cy={0}
        r={4.5}
        fill="#ffffff"
      />
    </g>
  );
};

