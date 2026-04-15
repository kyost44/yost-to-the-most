import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';

/**
 * Drop-in replacement for useState that syncs with Firebase Realtime Database.
 * All clients subscribed to the same path see updates in real time.
 *
 * Usage:
 *   const [todos, setTodos] = useFirebaseState('todos', INITIAL_TODOS);
 *
 * setTodos works exactly like React setState — accepts a value OR a function:
 *   setTodos(newArray)
 *   setTodos(prev => [...prev, newItem])
 *
 * Both forms immediately update local state AND write to Firebase.
 */
export function useFirebaseState(path, defaultValue) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const dbRef = ref(db, path);

    const unsub = onValue(dbRef, (snapshot) => {
      const raw = snapshot.val();

      if (raw === null || raw === undefined) {
        // Path is empty — seed Firebase with defaults so every client gets them
        set(dbRef, defaultValue);
        setValue(defaultValue);
      } else if (
        Array.isArray(defaultValue) &&
        typeof raw === 'object' &&
        !Array.isArray(raw)
      ) {
        // Firebase serialises JS arrays as {0: …, 1: …, 2: …} — convert back
        setValue(Object.values(raw));
      } else {
        setValue(raw);
      }
    });

    return unsub; // Firebase onValue returns its own unsubscribe fn
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Setter — mirrors React's setState API but also persists to Firebase.
   */
  function setAndSync(newValueOrUpdater) {
    setValue((prev) => {
      const next =
        typeof newValueOrUpdater === 'function'
          ? newValueOrUpdater(prev)
          : newValueOrUpdater;
      set(ref(db, path), next ?? null);
      return next;
    });
  }

  return [value, setAndSync];
}
