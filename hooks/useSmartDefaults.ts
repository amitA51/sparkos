import { useCallback, useMemo } from 'react';

interface SmartDefaultsOptions {
  /** Unique key for this form (used as localStorage prefix) */
  formKey: string;
  /** Maximum number of entries to remember per field */
  maxHistory?: number;
}

interface SmartDefaults {
  /** Get the last used value for a field */
  getDefault: (fieldName: string, fallback?: string) => string;
  /** Save a value as the last used for a field */
  saveDefault: (fieldName: string, value: string) => void;
  /** Get all previously used values for a field (for suggestions) */
  getHistory: (fieldName: string) => string[];
  /** Save multiple field values at once (e.g., on form submit) */
  saveAll: (values: Record<string, string>) => void;
  /** Clear all saved defaults for this form */
  clearAll: () => void;
}

/**
 * useSmartDefaults - Remember user's last form choices
 *
 * Stores the last used values for form fields in localStorage.
 * Great for pre-filling forms with previously used values.
 *
 * Usage:
 *   const { getDefault, saveAll } = useSmartDefaults({ formKey: 'add-task' });
 *
 *   // Pre-fill priority from last time
 *   const [priority, setPriority] = useState(getDefault('priority', 'medium'));
 *
 *   // On submit, remember the choices
 *   const handleSubmit = () => {
 *     saveAll({ priority, category });
 *     // ... submit logic
 *   };
 */
export const useSmartDefaults = (options: SmartDefaultsOptions): SmartDefaults => {
  const { formKey, maxHistory = 5 } = options;
  const storagePrefix = `sparkos_defaults_${formKey}`;

  const getDefault = useCallback(
    (fieldName: string, fallback: string = ''): string => {
      try {
        const stored = localStorage.getItem(`${storagePrefix}_${fieldName}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Return the most recent value
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
          }
          return String(parsed);
        }
      } catch {
        // Ignore parse errors
      }
      return fallback;
    },
    [storagePrefix]
  );

  const saveDefault = useCallback(
    (fieldName: string, value: string) => {
      if (!value || value.trim() === '') return;
      try {
        const key = `${storagePrefix}_${fieldName}`;
        const stored = localStorage.getItem(key);
        let history: string[] = [];
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            history = Array.isArray(parsed) ? parsed : [String(parsed)];
          } catch {
            history = [];
          }
        }

        // Add to front, deduplicate, trim to max
        history = [value, ...history.filter((v) => v !== value)].slice(
          0,
          maxHistory
        );
        localStorage.setItem(key, JSON.stringify(history));
      } catch {
        // Storage full or unavailable
      }
    },
    [storagePrefix, maxHistory]
  );

  const getHistory = useCallback(
    (fieldName: string): string[] => {
      try {
        const stored = localStorage.getItem(
          `${storagePrefix}_${fieldName}`
        );
        if (stored) {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed : [String(parsed)];
        }
      } catch {
        // Ignore
      }
      return [];
    },
    [storagePrefix]
  );

  const saveAll = useCallback(
    (values: Record<string, string>) => {
      Object.entries(values).forEach(([fieldName, value]) => {
        saveDefault(fieldName, value);
      });
    },
    [saveDefault]
  );

  const clearAll = useCallback(() => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch {
      // Ignore
    }
  }, [storagePrefix]);

  return useMemo(
    () => ({
      getDefault,
      saveDefault,
      getHistory,
      saveAll,
      clearAll,
    }),
    [getDefault, saveDefault, getHistory, saveAll, clearAll]
  );
};

export default useSmartDefaults;
