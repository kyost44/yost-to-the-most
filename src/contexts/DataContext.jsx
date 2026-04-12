import { createContext, useContext, useState, useCallback } from 'react';
import { FAMILIES, CABINS, INITIAL_TODOS, INITIAL_NEED_TO_KNOW } from '../data/initialData';

const DataContext = createContext(null);

// Bump this version string any time initialData.js changes significantly.
// It will wipe stale localStorage and reload fresh defaults.
const DATA_VERSION = '2026-v4';

function initStorage() {
  if (localStorage.getItem('apd_data_version') !== DATA_VERSION) {
    ['apd_families', 'apd_todos', 'apd_ntk', 'apd_tshirt_designs', 'apd_family_plans'].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('apd_data_version', DATA_VERSION);
  }
}
initStorage();

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function DataProvider({ children }) {
  const [families, setFamilies] = useState(() =>
    loadFromStorage('apd_families', FAMILIES)
  );
  const [todos, setTodos] = useState(() =>
    loadFromStorage('apd_todos', INITIAL_TODOS)
  );
  const [needToKnow, setNeedToKnow] = useState(() =>
    loadFromStorage('apd_ntk', INITIAL_NEED_TO_KNOW)
  );
  // Selected family stored in localStorage (persists across visits)
  const [selectedFamilyId, setSelectedFamilyIdState] = useState(() =>
    localStorage.getItem('apd_selected_family') || null
  );
  // T-shirt design submissions
  const [tshirtDesigns, setTshirtDesigns] = useState(() =>
    loadFromStorage('apd_tshirt_designs', [])
  );
  // Family calendar plan entries
  const [familyPlans, setFamilyPlans] = useState(() =>
    loadFromStorage('apd_family_plans', [])
  );

  const updateFamily = useCallback((id, updates) => {
    setFamilies(prev => {
      const next = prev.map(f => f.id === id ? { ...f, ...updates } : f);
      saveToStorage('apd_families', next);
      return next;
    });
  }, []);

  const toggleTodoComplete = useCallback((todoId, familyId) => {
    setTodos(prev => {
      const next = prev.map(t => {
        if (t.id !== todoId) return t;
        const already = t.completedBy.includes(familyId);
        return {
          ...t,
          completedBy: already
            ? t.completedBy.filter(f => f !== familyId)
            : [...t.completedBy, familyId],
        };
      });
      saveToStorage('apd_todos', next);
      return next;
    });
  }, []);

  const updateTodo = useCallback((id, updates) => {
    setTodos(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      saveToStorage('apd_todos', next);
      return next;
    });
  }, []);

  const addTodo = useCallback((todo) => {
    setTodos(prev => {
      const next = [...prev, { ...todo, id: `todo_${Date.now()}`, completedBy: [] }];
      saveToStorage('apd_todos', next);
      return next;
    });
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => {
      const next = prev.filter(t => t.id !== id);
      saveToStorage('apd_todos', next);
      return next;
    });
  }, []);

  const updateNeedToKnow = useCallback((id, updates) => {
    setNeedToKnow(prev => {
      const next = prev.map(n => n.id === id ? { ...n, ...updates } : n);
      saveToStorage('apd_ntk', next);
      return next;
    });
  }, []);

  const setSelectedFamilyId = useCallback((id) => {
    setSelectedFamilyIdState(id);
    if (id) localStorage.setItem('apd_selected_family', id);
    else localStorage.removeItem('apd_selected_family');
  }, []);

  const addTshirtDesign = useCallback((design) => {
    setTshirtDesigns(prev => {
      const next = [...prev, { ...design, id: `design_${Date.now()}`, pinned: false, likes: 0 }];
      saveToStorage('apd_tshirt_designs', next);
      return next;
    });
  }, []);

  const updateTshirtDesign = useCallback((id, updates) => {
    setTshirtDesigns(prev => {
      const next = prev.map(d => d.id === id ? { ...d, ...updates } : d);
      saveToStorage('apd_tshirt_designs', next);
      return next;
    });
  }, []);

  const addFamilyPlan = useCallback((plan) => {
    setFamilyPlans(prev => {
      const next = [...prev, { ...plan, id: `plan_${Date.now()}` }];
      saveToStorage('apd_family_plans', next);
      return next;
    });
  }, []);

  const deleteFamilyPlan = useCallback((id) => {
    setFamilyPlans(prev => {
      const next = prev.filter(p => p.id !== id);
      saveToStorage('apd_family_plans', next);
      return next;
    });
  }, []);

  const selectedFamily = families.find(f => f.id === selectedFamilyId) || null;

  return (
    <DataContext.Provider value={{
      families, updateFamily,
      cabins: CABINS,
      todos, toggleTodoComplete, updateTodo, addTodo, deleteTodo,
      needToKnow, updateNeedToKnow,
      selectedFamilyId, selectedFamily, setSelectedFamilyId,
      tshirtDesigns, addTshirtDesign, updateTshirtDesign,
      familyPlans, addFamilyPlan, deleteFamilyPlan,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
