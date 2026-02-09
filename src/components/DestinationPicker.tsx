import React from "react";
import type { NavigationData } from "../types";

interface DestinationPickerProps {
  nodes: NavigationData["nodes"];
  selectedId: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
}

// Simple dropdown that lets the user pick a destination node.
// For the open house demo this only changes which marker is highlighted;
// the backend (or JSON generator) is expected to update the path data
// in /public/data/navigation.json accordingly later on.
export const DestinationPicker: React.FC<DestinationPickerProps> = ({
  nodes,
  selectedId,
  onChange,
  disabled
}) => {
  return (
    <label className="destination-picker">
      <span className="destination-label">Destination</span>
      <select
        className="destination-select"
        value={selectedId ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || nodes.length === 0}
      >
        <option value="" disabled>
          Select a place...
        </option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>
            {node.name}
          </option>
        ))}
      </select>
    </label>
  );
};

