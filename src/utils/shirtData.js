const SHIRT_KEY = 'yosties_shirt_data';

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

export function getShirtData() {
  try {
    const stored = localStorage.getItem(SHIRT_KEY);
    if (!stored) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(stored);
    // Merge with defaults so all 16 people always exist
    const merged = { ...DEFAULT_DATA };
    Object.keys(parsed).forEach(name => {
      merged[name] = { ...(DEFAULT_DATA[name] || {}), ...parsed[name] };
    });
    return merged;
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function updatePersonShirt(name, updates) {
  try {
    const current = getShirtData();
    current[name] = { ...(current[name] || {}), ...updates };
    localStorage.setItem(SHIRT_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('shirtDataUpdated', { detail: current }));
    return current;
  } catch {
    return null;
  }
}

export function getPersonShirt(name) {
  const data = getShirtData();
  return data[name] || { character: null, color: null, size: null };
}
