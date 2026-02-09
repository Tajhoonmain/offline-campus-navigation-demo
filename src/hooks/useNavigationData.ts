import { useEffect, useState } from "react";
import type { NavigationData } from "../types";

type NavigationSource = "json" | "fallback";

interface UseNavigationDataResult {
  data: NavigationData | null;
  loading: boolean;
  error: string | null;
  // Indicates whether the current data came from the backend JSON
  // file or from the built-in demo fallback.
  source: NavigationSource;
}

const NAVIGATION_JSON_PATH = "/data/navigation.json";

// Simple, local fallback data used when navigation.json
// is missing or malformed. This keeps the demo usable offline
// while backend / data exports are being wired up.
export const FALLBACK_DATA: NavigationData = {
  user: { x: 200, y: 700, heading: -45 },
  destination: { id: "hall-a", name: "Main Hall A" },
  path: [
    { x: 200, y: 700 },
    { x: 250, y: 650 },
    { x: 320, y: 600 },
    { x: 380, y: 540 },
    { x: 450, y: 500 }
  ],
  nodes: [
    { id: "hall-a", x: 450, y: 500, name: "Main Hall A" },
    { id: "gate", x: 150, y: 780, name: "Main Gate" },
    { id: "lab-1", x: 520, y: 460, name: "CS Lab 1" }
  ]
};

export function useNavigationData(
  pollIntervalMs: number = 2000
): UseNavigationDataResult {
  const [data, setData] = useState<NavigationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<NavigationSource>("fallback");

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | undefined;

    const fetchData = async () => {
      try {
        const cacheBuster = `cb=${Date.now()}`;
        const baseUrl =
          import.meta.env.VITE_DATA_URL ?? NAVIGATION_JSON_PATH;
        const url =
          baseUrl + (baseUrl.includes("?") ? "&" : "?") + cacheBuster;

        const res = await fetch(url, {
          cache: "no-store"
        });

        if (!res.ok) {
          // If file is missing (404) or unavailable, fall back
          // to local mock data and show a soft warning.
          if (isMounted) {
            setError(
              `navigation.json not found at ${NAVIGATION_JSON_PATH}. Showing demo data instead.`
            );
            setData(FALLBACK_DATA);
            setSource("fallback");
            setLoading(false);
          }
          return;
        }

        const text = await res.text();

        if (!text.trim()) {
          if (isMounted) {
            setError(
              `navigation.json is empty. Showing demo data instead.`
            );
            setData(FALLBACK_DATA);
            setSource("fallback");
            setLoading(false);
          }
          return;
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch (e) {
          if (isMounted) {
            setError(
              `navigation.json is not valid JSON. Showing demo data instead.`
            );
            setData(FALLBACK_DATA);
            setSource("fallback");
            setLoading(false);
          }
          return;
        }

        // Perform a minimal shape check while preserving the strict interface.
        const candidate = parsed as NavigationData;
        if (
          !candidate ||
          typeof candidate !== "object" ||
          !candidate.user ||
          !candidate.destination ||
          !Array.isArray(candidate.path) ||
          !Array.isArray(candidate.nodes)
        ) {
          if (isMounted) {
            setError(
              `navigation.json does not match NavigationData shape. Showing demo data instead.`
            );
            setData(FALLBACK_DATA);
            setSource("fallback");
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setData(candidate);
          setSource("json");
          setError(null);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          setError(
            `Unable to load navigation.json. Showing demo data instead.`
          );
          setData(FALLBACK_DATA);
          setSource("fallback");
          setLoading(false);
        }
      }
    };

    // Initial load
    fetchData();

    // Poll for changes so visuals auto-update when the JSON
    // file changes on disk (e.g. during the open house demo).
    if (pollIntervalMs > 0) {
      intervalId = window.setInterval(fetchData, pollIntervalMs);
    }

    return () => {
      isMounted = false;
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [pollIntervalMs]);

  return { data, loading, error, source };
}

