import { db } from '../firebase';
import { ref, onValue, update, set } from 'firebase/database';

const SHIRT_PATH = 'shirts';

const DEFAULT_DATA = {
  Kyle:    { character: 'Mufasa', color: '#1B2A4A', size: 'Adult L'  },
  Kristen: { character: null,     color: null,       size: 'Adult S'  },
  Brielle: { character: null,     color: null,       size: 'Kids XS'  },
  Casper:  { character: null,     color: null,       size: '2T'       },
  Jenni:   { character: null,     color: null,       size: null       },
  Nat:     { character: null,     color: null,       size: null       },
  Ridge:   { character: null,     color: null,       size: null       },
  Foxton:  { character: null,     color: null,       size: null       },
  Walker:  { character: null,     color: null,       size: null       },
  Julie:   { character: null,     color: null,       size: null       },
  Markus:  { character: null,     color: null,       size: null       },
  Cohen:   { character: null,     color: null,       size: null       },
  Oskar:   { character: null,     color: null,       size: null       },
  Skye:    { character: null,     color: null,       size: null       },
  Tim:     { character: null,     color: null,       size: null       },
  Laura:   { character: null,     color: null,       size: null       },
};

// Module-level cache — kept in sync by a single Firebase listener.
// Synchronous reads (getShirtData) draw from this cache.
let _cache = { ...DEFAULT_DATA };

// Subscribe once when the module first loads.
onValue(ref(db, SHIRT_PATH), (snapshot) => {
  const stored = snapshot.val();

  if (!stored) {
    // Nothing in Firebase yet — seed with defaults
    set(ref(db, SHIRT_PATH), DEFAULT_DATA);
    _cache = { ...DEFAULT_DATA };
  } else {
    // Merge Firebase data on top of defaults so all 16 names always exist
    const merged = { ...DEFAULT_DATA };
    Object.keys(DEFAULT_DATA).forEach((name) => {
      if (stored[name]) {
        merged[name] = { ...DEFAULT_DATA[name], ...stored[name] };
      }
    });
    _cache = merged;
  }

  // Notify every component that's listening for shirt changes
  window.dispatchEvent(
    new CustomEvent('shirtDataUpdated', { detail: { ..._cache } })
  );
});

/** Returns a snapshot of the current shirt data (synchronous, from cache). */
export function getShirtData() {
  return { ..._cache };
}

/**
 * Update one person's shirt entry.
 * Optimistically updates the local cache & dispatches the event immediately,
 * then persists the change to Firebase in the background.
 */
export async function updatePersonShirt(name, updates) {
  _cache[name] = { ...(_cache[name] || {}), ...updates };
  window.dispatchEvent(
    new CustomEvent('shirtDataUpdated', { detail: { ..._cache } })
  );
  await update(ref(db, `${SHIRT_PATH}/${name}`), updates);
}

/** Convenience accessor for a single person. */
export function getPersonShirt(name) {
  return _cache[name] || { character: null, color: null, size: null };
}
