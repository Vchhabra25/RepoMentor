import { useCallback, useEffect, useState } from "react";

export interface Preferences {
  showStreamingPreview: boolean;
  richMarkdown: boolean;
}

const STORAGE_KEY = "repomentor:preferences";

const defaults: Preferences = {
  showStreamingPreview: true,
  richMarkdown: true,
};

function readStored(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

let listeners: Array<(prefs: Preferences) => void> = [];

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(readStored);

  useEffect(() => {
    listeners.push(setPreferences);
    return () => {
      listeners = listeners.filter((l) => l !== setPreferences);
    };
  }, []);

  const update = useCallback((patch: Partial<Preferences>) => {
    const next = { ...readStored(), ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    listeners.forEach((l) => l(next));
  }, []);

  return { preferences, update };
}

export const PREFERENCES_STORAGE_KEY = STORAGE_KEY;
