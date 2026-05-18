import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';

const LS_PREFIX = 'apd_';

function lsGet(path, defaultValue) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + path);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function lsSet(path, value) {
  try {
    localStorage.setItem(LS_PREFIX + path, JSON.stringify(value));
  } catch { /* quota exceeded — ignore */ }
}

// Firebase RTDB serialises JS arrays as {0:…,1:…} and omits empty arrays as null.
// `template` is the defaultValue (or a sub-value) so we know which null fields should be [].
function deepNormalizeArrays(data, template) {
  // null/undefined where an array is expected → return []
  if ((data === null || data === undefined) && Array.isArray(template)) return [];
  if (data === null || data === undefined || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }
  const keys = Object.keys(data);
  // Firebase-serialised array: all consecutive integer keys 0..n-1
  const isSerializedArray = keys.length > 0 && keys.every((k, i) => k === String(i));
  // Empty plain object that should be an array
  if (isSerializedArray || (keys.length === 0 && Array.isArray(template))) {
    const itemTemplate = Array.isArray(template) ? template[0] : undefined;
    return keys.map(k => deepNormalizeArrays(data[k], itemTemplate));
  }
  // Plain object — recurse with per-field templates
  const out = {};
  for (const k of keys) {
    const fieldTpl = (template && typeof template === 'object' && !Array.isArray(template))
      ? template[k]
      : undefined;
    out[k] = deepNormalizeArrays(data[k], fieldTpl);
  }
  return out;
}

/**
 * Drop-in replacement for useState that syncs with Firebase Realtime Database.
 * Falls back to localStorage when Firebase is not configured (db === null).
 */
export function useFirebaseState(path, defaultValue) {
  const [value, setValue] = useState(() => (db ? defaultValue : lsGet(path, defaultValue)));

  useEffect(() => {
    if (!db) return; // localStorage mode — nothing to subscribe to

    const dbRef = ref(db, path);

    const unsub = onValue(dbRef, (snapshot) => {
      const raw = snapshot.val();

      if (raw === null || raw === undefined) {
        set(dbRef, defaultValue);
        setValue(defaultValue);
      } else {
        setValue(deepNormalizeArrays(raw, defaultValue));
      }
    });

    return unsub;
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  function setAndSync(newValueOrUpdater) {
    setValue((prev) => {
      const next =
        typeof newValueOrUpdater === 'function'
          ? newValueOrUpdater(prev)
          : newValueOrUpdater;
      if (db) {
        set(ref(db, path), next ?? null);
      } else {
        lsSet(path, next ?? null);
      }
      return next;
    });
  }

  return [value, setAndSync];
}
