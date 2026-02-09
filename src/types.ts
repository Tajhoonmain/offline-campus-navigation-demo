// Shared types for navigation data used across the app.
// IMPORTANT: This interface matches the required data contract
// from the prompt and MUST NOT be changed.

export interface NavigationData {
  user: { x: number; y: number; heading: number };
  destination: { id: string; name: string };
  path: { x: number; y: number }[];
  nodes: { id: string; x: number; y: number; name: string }[];
}

