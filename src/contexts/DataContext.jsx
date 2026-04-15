import { createContext, useContext, useCallback, useState } from 'react';
import { useFirebaseState } from '../hooks/useFirebaseState';
import { FAMILIES, CABINS, INITIAL_TODOS, INITIAL_NEED_TO_KNOW } from '../data/initialData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // ── Shared state — synced across all devices via Firebase ──────────────────
  const [families,      setFamilies]      = useFirebaseState('families',      FAMILIES);
  const [todos,         setTodos]         = useFirebaseState('todos',         INITIAL_TODOS);
  const [needToKnow,    setNeedToKnow]    = useFirebaseState('needToKnow',    INITIAL_NEED_TO_KNOW);
  const [familyPlans,   setFamilyPlans]   = useFirebaseState('familyPlans',   []);
  const [tshirtDesigns, setTshirtDesigns] = useFirebaseState('tshirtDesigns', []);

  // ── Per-device state — stays in localStorage ───────────────────────────────
  const [selectedFamilyId, setSelectedFamilyIdState] = useState(
    () => localStorage.getItem('apd_selected_family') || null
  );

  // ── Mutation helpers ───────────────────────────────────────────────────────

  const updateFamily = useCallback((id, updates) => {
    setFamilies(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, [setFamilies]);

  const toggleTodoComplete = useCallback((todoId, familyId) => {
    setTodos(prev => prev.map(t => {
      if (t.id !== todoId) return t;
      const already = t.completedBy.includes(familyId);
      return {
        ...t,
        completedBy: already
          ? t.completedBy.filter(f => f !== familyId)
          : [...t.completedBy, familyId],
      };
    }));
  }, [setTodos]);

  const updateTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTodos]);

  const addTodo = useCallback((todo) => {
    setTodos(prev => [...prev, { ...todo, id: `todo_${Date.now()}`, completedBy: [] }]);
  }, [setTodos]);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, [setTodos]);

  const updateNeedToKnow = useCallback((id, updates) => {
    setNeedToKnow(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  }, [setNeedToKnow]);

  const setSelectedFamilyId = useCallback((id) => {
    setSelectedFamilyIdState(id);
    if (id) localStorage.setItem('apd_selected_family', id);
    else     localStorage.removeItem('apd_selected_family');
  }, []);

  const addTshirtDesign = useCallback((design) => {
    setTshirtDesigns(prev => [
      ...prev,
      { ...design, id: `design_${Date.now()}`, pinned: false, likes: 0 },
    ]);
  }, [setTshirtDesigns]);

  const updateTshirtDesign = useCallback((id, updates) => {
    setTshirtDesigns(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, [setTshirtDesigns]);

  const addFamilyPlan = useCallback((plan) => {
    setFamilyPlans(prev => [...prev, { ...plan, id: `plan_${Date.now()}` }]);
  }, [setFamilyPlans]);

  const deleteFamilyPlan = useCallback((id) => {
    setFamilyPlans(prev => prev.filter(p => p.id !== id));
  }, [setFamilyPlans]);

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
