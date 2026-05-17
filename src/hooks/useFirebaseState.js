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

// Firebase RTDB serialises JS arrays as {0: …, 1: …} — this restores them recursively.
function deepNormalizeArrays(data) {
  if (data === null || data === undefined || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }
  const keys = Object.keys(data);
  const isSerializedArray =
    keys.length > 0 && keys.every((k, i) => k === String(i));
  if (isSerializedArray) {
    return keys.map(k => deepNormalizeArrays(data[k]));
  }
  const out = {};
  for (const k of keys) out[k] = deepNormalizeArrays(data[k]);
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
        setValue(deepNormalizeArrays(raw));
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
