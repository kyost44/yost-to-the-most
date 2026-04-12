import { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useAdmin } from '../contexts/AdminContext';
import CharacterPickerModal from '../components/CharacterPickerModal';
import { getShirtData, updatePersonShirt } from '../utils/shirtData';

// ── Constants ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function loadLocal(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function saveLocal(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

const EMBARKATION_DATE = new Date('2026-07-23T00:00:00');

const TRIP_DAYS = [
  { date: 'July 22', label: 'Arrive Fort Lauderdale', type: 'travel'  },
  { date: 'July 23', label: 'Embarkation Day',         type: 'embark'  },
  { date: 'July 24', label: 'Nassau, Bahamas',          type: 'port'    },
  { date: 'July 25', label: 'Castaway Cay',             type: 'port'    },
  { date: 'July 26', label: 'Day at Sea',               type: 'sea'     },
  { date: 'July 27', label: 'Debarkation Day',          type: 'debark'  },
  { date: 'July 28', label: 'Resort Day',               type: 'resort'  },
  { date: 'July 29', label: 'Return Home',              type: 'travel'  },
];

const DAY_COLORS = {
  travel: '#6366f1', embark: '#FF6B6B', port: '#0ea5e9',
  sea: '#F4C430', debark: '#FF6B6B', resort: '#2ecc71',
};


const TIME_OPTIONS = [
  'TBD','All Day','Morning','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM',
  '10:00 AM','10:30 AM','11:00 AM','11:30 AM','Noon','12:30 PM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM',
  '6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','Evening',
];

// ── Tab 1 — Our Cabin ─────────────────────────────────────────────────────────

// (CharacterPickerModal is imported from src/components/CharacterPickerModal.jsx)

function CabinTab({ family, cabins, families }) {
  const cabin          = cabins.find(c => c.familyId === family.id);
  const connectsCabin  = cabins.find(c => c.room === cabin?.connects);
  const connectsFamily = connectsCabin ? families.find(f => f.id === connectsCabin.familyId) : null;

  const [shirtData, setShirtData] = useState(() => getShirtData());
  const [pickerFor, setPickerFor] = useState(null);

  useEffect(() => {
    const handler = e => setShirtData(e.detail);
    window.addEventListener('shirtDataUpdated', handler);
    return () => window.removeEventListener('shirtDataUpdated', handler);
  }, []);

  function handleConfirm(chosenName) {
    updatePersonShirt(pickerFor, { character: chosenName });
    setPickerFor(null);
  }

  if (!cabin) return null;

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {/* Left: Cabin info */}
        <div className="bg-white rounded-2xl p-6" style={{ flex: '0 0 clamp(220px, 38%, 320px)', minWidth: '220px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', alignSelf: 'start' }}>
          <h3 className="font-playfair font-bold mb-5" style={{ fontSize: '28px', color: 'var(--navy)' }}>
            Our Cabin
          </h3>
          {/* Big cabin number */}
          <div className="text-center mb-5">
            <div className="font-nunito uppercase tracking-widest mb-1" style={{ fontSize: '11px', color: '#aaa' }}>Cabin Number</div>
            <div className="font-playfair font-black" style={{ fontSize: '72px', color: 'var(--gold)', lineHeight: 1 }}>
              {cabin.room}
            </div>
          </div>
          {/* Reservation */}
          <div className="rounded-xl px-4 py-3 mb-3" style={{ background: '#f8f9fc' }}>
            <div className="font-nunito uppercase tracking-wide mb-0.5" style={{ fontSize: '11px', color: '#aaa' }}>Reservation #</div>
            <div className="font-nunito font-bold" style={{ fontSize: '18px', color: 'var(--navy)' }}>{cabin.reservation}</div>
          </div>
          {/* Connects with */}
          {connectsFamily && (
            <div className="rounded-xl px-4 py-3" style={{ background: connectsFamily.light + '15' }}>
              <div className="font-nunito uppercase tracking-wide mb-1.5" style={{ fontSize: '11px', color: '#aaa' }}>Connects With</div>
              <span className="inline-flex items-center gap-1.5 font-nunito font-bold text-sm px-3 py-1 rounded-full"
                    style={{ background: connectsFamily.light, color: 'white' }}>
                {connectsFamily.emoji} {connectsFamily.name} — Cabin {cabin.connects}
              </span>
            </div>
          )}
        </div>

        {/* Right: Character picker */}
        <div className="bg-white rounded-2xl p-6" style={{ flex: '1 1 280px', minWidth: '280px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h3 className="font-playfair font-bold mb-5" style={{ fontSize: '22px', color: 'var(--navy)' }}>
            Pick Your Character ✨
          </h3>
          <div className="space-y-3">
            {(cabin.members || []).map(name => {
              const charName = shirtData[name]?.character || null;
              return (
                <div
                  key={name}
                  className="flex items-center gap-4 rounded-xl px-4 transition-all"
                  style={{
                    minHeight: '64px',
                    background: charName ? family.light + '12' : '#f8f9fc',
                    border: `1px solid ${charName ? family.light + '40' : 'transparent'}`,
                  }}
                >
                  <div className="flex-shrink-0 flex items-center justify-center rounded-full font-nunito font-bold"
                       style={{ width: '40px', height: '40px', background: charName ? family.light : '#e8eaf0', fontSize: '14px', color: 'white' }}>
                    {charName ? charName.slice(0, 2) : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-nunito font-bold" style={{ fontSize: '16px', color: 'var(--navy)' }}>{name}</div>
                    {charName
                      ? <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#F4C430', fontStyle: 'italic' }}>{charName}</div>
                      : <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#ccc' }}>No character yet</div>
                    }
                  </div>
                  <button
                    onClick={() => setPickerFor(name)}
                    className="font-nunito font-semibold text-sm px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
                    style={charName
                      ? { background: 'none', color: 'var(--navy)', border: '1px solid rgba(27,42,74,0.2)', cursor: 'pointer' }
                      : { background: 'var(--gold)', color: 'var(--navy)', border: 'none', cursor: 'pointer' }}
                  >
                    {charName ? 'Change' : 'Pick →'}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="font-nunito text-xs mt-4" style={{ color: '#bbb' }}>
            Your character shows on your cruise T-shirt.
          </p>
        </div>
      </div>

      <CharacterPickerModal
        isOpen={!!pickerFor}
        personName={pickerFor || ''}
        onConfirm={handleConfirm}
        onClose={() => setPickerFor(null)}
      />
    </>
  );
}

// ── Tab 2 — To-Do ─────────────────────────────────────────────────────────────

function RingProgress({ pct, color, size = 80 }) {
  const r    = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e8eaf0" strokeWidth={10} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
              strokeDasharray={circ} strokeDashoffset={off}
              style={{ transition: 'stroke-dashoffset 0.6s ease', strokeLinecap: 'round' }} />
    </svg>
  );
}

function TodoTab({ family, todos, toggleTodoComplete }) {
  const myTodos   = todos.filter(t => t.families.includes(family.id));
  const doneCount = myTodos.filter(t => t.completedBy.includes(family.id)).length;
  const pct       = myTodos.length > 0 ? Math.round((doneCount / myTodos.length) * 100) : 0;

  const [animatingOut,  setAnimatingOut]  = useState(new Set());
  const [showCompleted, setShowCompleted] = useState(false);

  // Tasks still in active list: not done OR currently animating out
  const remaining = myTodos
    .filter(t => !t.completedBy.includes(family.id) || animatingOut.has(t.id))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const completed = myTodos.filter(t => t.completedBy.includes(family.id) && !animatingOut.has(t.id));

  function handleCheck(todoId) {
    const isDone = todos.find(t => t.id === todoId)?.completedBy.includes(family.id);
    if (!isDone) {
      toggleTodoComplete(todoId, family.id);
      setAnimatingOut(prev => new Set([...prev, todoId]));
      setTimeout(() => {
        setAnimatingOut(prev => { const n = new Set(prev); n.delete(todoId); return n; });
      }, 550);
    } else {
      toggleTodoComplete(todoId, family.id);
    }
  }

  function getMessage() {
    if (pct === 100) return "🎊 Amazing work! You're all set!";
    if (pct >= 50)   return '⚓ Great progress — almost there!';
    if (pct >= 1)    return "🚢 You've started! Keep the momentum.";
    return '✨ Let\'s get ready for the magic!';
  }

  return (
    <div>
      {/* Progress ring */}
      <div className="bg-white rounded-2xl p-6 mb-5 flex items-center gap-6"
           style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div className="relative flex-shrink-0">
          <RingProgress pct={pct} color={family.light} size={80} />
          <div className="absolute inset-0 flex items-center justify-center font-nunito font-black"
               style={{ fontSize: '18px', color: family.light }}>
            {pct}%
          </div>
        </div>
        <div>
          <div className="font-playfair font-bold" style={{ fontSize: '22px', color: 'var(--navy)', marginBottom: '4px' }}>
            {doneCount} of {myTodos.length} tasks done
          </div>
          <div className="font-nunito text-sm" style={{ color: '#888' }}>{getMessage()}</div>
        </div>
      </div>

      {/* All done celebration */}
      {pct === 100 && completed.length > 0 && remaining.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center mb-5"
             style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎊</div>
          <div className="font-playfair font-bold mb-2" style={{ fontSize: '28px', color: 'var(--navy)' }}>Amazing work!</div>
          <div className="font-nunito" style={{ fontSize: '15px', color: '#888' }}>
            Your family is completely ready for the cruise!
          </div>
        </div>
      )}

      {/* Active tasks */}
      {remaining.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden mb-5"
             style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {remaining.map((todo, idx) => {
            const days    = daysUntil(todo.deadline);
            const overdue = days < 0;
            const isDoneAnimating = animatingOut.has(todo.id);
            return (
              <div key={todo.id}>
                <div
                  className="flex items-center gap-4 px-6"
                  style={{
                    minHeight: '64px',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    background: isDoneAnimating ? '#edfcf2' : overdue ? '#fff5f5' : 'white',
                    opacity: isDoneAnimating ? 0 : 1,
                    transform: isDoneAnimating ? 'translateX(12px)' : 'none',
                    transition: 'opacity 0.45s ease, transform 0.45s ease, background 0.3s ease',
                  }}
                >
                  {/* 32px checkbox */}
                  <button
                    onClick={() => handleCheck(todo.id)}
                    className="flex-shrink-0 flex items-center justify-center rounded-lg border-2 transition-all"
                    style={{
                      width: '32px', height: '32px',
                      borderColor: isDoneAnimating ? family.light : family.light,
                      background: isDoneAnimating ? family.light : 'white',
                      cursor: 'pointer',
                    }}
                    aria-label={`Mark "${todo.title}" complete`}
                  >
                    {isDoneAnimating && <span style={{ color: 'white', fontSize: '16px', lineHeight: 1 }}>✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="font-playfair font-bold" style={{ fontSize: '18px', color: 'var(--charcoal)', marginBottom: '2px' }}>
                      {todo.title}
                    </div>
                    {todo.note && (
                      <div className="font-nunito leading-relaxed" style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        {todo.note}
                      </div>
                    )}
                    <div className="font-nunito font-semibold" style={{ fontSize: '12px', color: overdue ? '#C0392B' : days <= 14 ? '#E67E22' : '#888' }}>
                      {overdue
                        ? `⚠️ Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`
                        : days === 0 ? '📅 Due today!'
                        : `📅 Due ${todo.deadlineLabel}`}
                    </div>
                  </div>
                </div>
                {idx < remaining.length - 1 && (
                  <div style={{ height: '1px', background: '#f0f0f0', margin: '0 24px' }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Completed section */}
      {completed.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden"
             style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <button
            onClick={() => setShowCompleted(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 font-nunito font-bold"
            style={{ background: 'white', border: 'none', cursor: 'pointer', fontSize: '15px', color: 'var(--navy)' }}
          >
            <span>✅ Completed ({completed.length})</span>
            <span style={{ fontSize: '12px', color: '#aaa', display: 'inline-block', transform: showCompleted ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
          </button>
          {showCompleted && (
            <div style={{ borderTop: '1px solid #f0f0f0' }}>
              {completed.map((todo, idx) => (
                <div key={todo.id}>
                  <div className="flex items-center gap-4 px-6" style={{ minHeight: '56px', paddingTop: '12px', paddingBottom: '12px', opacity: 0.6 }}>
                    <button
                      onClick={() => handleCheck(todo.id)}
                      className="flex-shrink-0 flex items-center justify-center rounded-lg"
                      style={{ width: '32px', height: '32px', background: family.light, border: 'none', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <span style={{ color: 'white', fontSize: '16px' }}>✓</span>
                    </button>
                    <div className="font-playfair font-bold" style={{ fontSize: '17px', color: '#999', textDecorationLine: 'line-through' }}>
                      {todo.title}
                    </div>
                  </div>
                  {idx < completed.length - 1 && <div style={{ height: '1px', background: '#f8f8f8', margin: '0 24px' }} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Tab 3 — Schedule ──────────────────────────────────────────────────────────

function ScheduleTab({ family, families, familyPlans, addFamilyPlan, deleteFamilyPlan }) {
  const [expandedDays, setExpandedDays] = useState(new Set([0, 1]));
  const [addingFor, setAddingFor]       = useState(null);
  const [form, setForm] = useState({ activity: '', time: 'TBD', notes: '', shared: false, sharedWith: [] });

  function toggleDay(idx) {
    setExpandedDays(prev => {
      const n = new Set(prev);
      n.has(idx) ? n.delete(idx) : n.add(idx);
      return n;
    });
  }

  function openAdd(idx) {
    setAddingFor(idx);
    setForm({ activity: '', time: 'TBD', notes: '', shared: false, sharedWith: [] });
    setExpandedDays(prev => new Set([...prev, idx]));
  }

  function handleAdd() {
    if (!form.activity.trim()) return;
    addFamilyPlan({
      familyId: family.id,
      dayIdx:   addingFor,
      time:     form.time,
      activity: form.activity.trim(),
      notes:    form.notes.trim(),
      sharedWith: form.shared ? form.sharedWith : [],
    });
    setAddingFor(null);
  }

  function toggleSharedFamily(fid) {
    setForm(prev => ({
      ...prev,
      sharedWith: prev.sharedWith.includes(fid)
        ? prev.sharedWith.filter(id => id !== fid)
        : [...prev.sharedWith, fid],
    }));
  }

  const otherFamilies = families.filter(f => f.id !== family.id);

  return (
    <div className="space-y-3">
      {TRIP_DAYS.map((day, idx) => {
        const color      = DAY_COLORS[day.type] || 'var(--navy)';
        const isExpanded = expandedDays.has(idx);
        const myPlans    = familyPlans.filter(p => p.familyId === family.id && p.dayIdx === idx);
        const sharedPlans = familyPlans.filter(p =>
          p.familyId !== family.id && p.dayIdx === idx && p.sharedWith?.includes(family.id)
        );
        const isAdding = addingFor === idx;

        return (
          <div key={idx} className="bg-white rounded-2xl overflow-hidden"
               style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {/* Day header button */}
            <div className="flex items-center gap-3 px-5 py-4">
              <button
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => toggleDay(idx)}
              >
                {/* Day circle */}
                <div className="flex-shrink-0 flex items-center justify-center rounded-full font-playfair font-black text-white"
                     style={{ width: '40px', height: '40px', background: color, fontSize: '15px' }}>
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="font-playfair font-bold" style={{ fontSize: '18px', color: 'var(--navy)' }}>
                    {day.date} — {day.label}
                  </div>
                  {!isExpanded && (myPlans.length > 0 || sharedPlans.length > 0) && (
                    <div className="font-nunito" style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
                      {myPlans.length > 0 && `${myPlans.length} plan${myPlans.length !== 1 ? 's' : ''}`}
                      {myPlans.length > 0 && sharedPlans.length > 0 && ' · '}
                      {sharedPlans.length > 0 && `${sharedPlans.length} shared event${sharedPlans.length !== 1 ? 's' : ''}`}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: '#ccc', display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: '4px', flexShrink: 0 }}>▾</span>
              </button>

              {/* + Add button — 44px tap target */}
              <button
                onClick={e => { e.stopPropagation(); openAdd(idx); }}
                className="flex-shrink-0 flex items-center justify-center rounded-full font-bold transition-all"
                style={{ width: '44px', height: '44px', background: color + '18', color, border: 'none', cursor: 'pointer', fontSize: '26px' }}
                aria-label="Add activity"
              >
                +
              </button>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div style={{ borderTop: `2px solid ${color}25` }}>
                {myPlans.map(p => (
                  <div key={p.id} className="flex items-start gap-3 px-5 py-3"
                       style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <span className="font-nunito font-bold flex-shrink-0 mt-0.5" style={{ fontSize: '12px', color, minWidth: '60px' }}>
                      {p.time}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-nunito font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{p.activity}</div>
                      {p.notes && <div className="font-nunito" style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{p.notes}</div>}
                      {p.sharedWith?.length > 0 && (
                        <div className="font-nunito" style={{ fontSize: '11px', color: '#bbb', marginTop: '3px' }}>
                          Shared with: {p.sharedWith.map(fid => families.find(f => f.id === fid)?.shortName).filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteFamilyPlan(p.id)}
                      style={{ color: '#ddd', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', lineHeight: 1, flexShrink: 0 }}
                    >×</button>
                  </div>
                ))}

                {sharedPlans.map(p => {
                  const orig = families.find(f => f.id === p.familyId);
                  return (
                    <div key={p.id} className="flex items-start gap-3 px-5 py-3"
                         style={{ background: orig?.light + '08', borderBottom: '1px solid #f5f5f5', borderLeft: `3px solid ${orig?.light}` }}>
                      <span className="font-nunito font-bold flex-shrink-0 mt-0.5" style={{ fontSize: '12px', color: orig?.light, minWidth: '60px' }}>
                        {p.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-nunito font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{p.activity}</div>
                        {p.notes && <div className="font-nunito" style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{p.notes}</div>}
                        <div className="font-nunito" style={{ fontSize: '11px', color: orig?.light, marginTop: '3px' }}>
                          From {orig?.shortName}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {myPlans.length === 0 && sharedPlans.length === 0 && !isAdding && (
                  <div className="px-5 py-4 text-center font-nunito text-sm" style={{ color: '#ddd' }}>
                    No plans yet — tap + to add one
                  </div>
                )}

                {/* Inline add form */}
                {isAdding && (
                  <div className="px-5 py-5" style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
                    <div className="space-y-3">
                      <div>
                        <label className="font-nunito font-semibold uppercase tracking-wide mb-1 block" style={{ fontSize: '11px', color: '#888' }}>Activity *</label>
                        <input
                          type="text"
                          value={form.activity}
                          onChange={e => setForm(p => ({ ...p, activity: e.target.value }))}
                          placeholder="What are you doing?"
                          autoFocus
                          className="w-full border rounded-xl px-4 py-2.5 font-nunito text-sm focus:outline-none"
                          style={{ borderColor: '#ddd', color: 'var(--charcoal)' }}
                          onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="font-nunito font-semibold uppercase tracking-wide mb-1 block" style={{ fontSize: '11px', color: '#888' }}>Time</label>
                          <select
                            value={form.time}
                            onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                            className="w-full border rounded-xl px-3 py-2.5 font-nunito text-sm focus:outline-none"
                            style={{ borderColor: '#ddd', color: 'var(--charcoal)' }}
                          >
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="font-nunito font-semibold uppercase tracking-wide mb-1 block" style={{ fontSize: '11px', color: '#888' }}>Notes</label>
                          <input
                            type="text"
                            value={form.notes}
                            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                            placeholder="Optional details"
                            className="w-full border rounded-xl px-3 py-2.5 font-nunito text-sm focus:outline-none"
                            style={{ borderColor: '#ddd', color: 'var(--charcoal)' }}
                          />
                        </div>
                      </div>

                      {/* Share toggle */}
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer mb-2">
                          <button
                            type="button"
                            onClick={() => setForm(p => ({ ...p, shared: !p.shared, sharedWith: p.shared ? [] : p.sharedWith }))}
                            style={{
                              position: 'relative', width: '40px', height: '22px',
                              background: form.shared ? 'var(--navy)' : '#ddd',
                              borderRadius: '11px', border: 'none', cursor: 'pointer', flexShrink: 0,
                            }}
                          >
                            <span style={{
                              position: 'absolute', top: '3px',
                              left: form.shared ? '21px' : '3px',
                              width: '16px', height: '16px',
                              borderRadius: '50%', background: 'white',
                              transition: 'left 0.2s',
                            }} />
                          </button>
                          <span className="font-nunito font-semibold text-sm" style={{ color: 'var(--navy)' }}>
                            Share with other families
                          </span>
                        </label>
                        {form.shared && (
                          <div className="flex flex-wrap gap-2">
                            {otherFamilies.map(f => (
                              <button
                                key={f.id} type="button"
                                onClick={() => toggleSharedFamily(f.id)}
                                className="px-3 py-1 rounded-lg font-nunito font-semibold transition-all"
                                style={{
                                  fontSize: '12px',
                                  background: form.sharedWith.includes(f.id) ? f.light : f.light + '20',
                                  color: form.sharedWith.includes(f.id) ? 'white' : f.light,
                                  border: 'none', cursor: 'pointer',
                                }}
                              >
                                {f.emoji} {f.shortName}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleAdd}
                          className="font-nunito font-bold px-5 py-2 rounded-xl text-sm text-white flex-1"
                          style={{ background: color, border: 'none', cursor: 'pointer' }}
                        >
                          Add Plan
                        </button>
                        <button
                          onClick={() => setAddingFor(null)}
                          className="font-nunito font-semibold px-4 py-2 rounded-xl text-sm border"
                          style={{ borderColor: '#ddd', color: '#888', background: 'white', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab 4 — T-Shirts ──────────────────────────────────────────────────────────

function isLightHex(hex) {
  if (!hex || hex.length < 7) return true;
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (r*299 + g*587 + b*114)/1000 > 180;
}

function TShirtTab({ family }) {
  const [shirtData, setShirtData] = useState(() => getShirtData());
  const [pickerFor, setPickerFor] = useState(null);

  useEffect(() => {
    const handler = e => setShirtData(e.detail);
    window.addEventListener('shirtDataUpdated', handler);
    return () => window.removeEventListener('shirtDataUpdated', handler);
  }, []);

  function handleConfirm(chosenName) {
    updatePersonShirt(pickerFor, { character: chosenName });
    setPickerFor(null);
  }

  return (
    <div>
      <h2 className="font-playfair font-bold mb-5" style={{ fontSize: '28px', color: 'var(--navy)' }}>
        Our Crew's Shirts
      </h2>

      <div className="space-y-4 mb-6">
        {(family.memberNames || []).map(name => {
          const entry    = shirtData[name] || {};
          const charName = entry.character || null;
          const colorVal = entry.color     || null;
          const size     = entry.size      || '';
          const isReady  = !!(charName && size);
          const previewBg = colorVal || '#e8eaf0';
          const textOnPreview = isLightHex(previewBg) ? '#333' : 'white';

          return (
            <div key={name} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>

              {/* Left: color preview square */}
              <div style={{
                width: '60px', height: '60px', borderRadius: '8px', flexShrink: 0,
                background: previewBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: colorVal ? 'none' : '2px dashed #ddd',
              }}>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontWeight: 700, color: textOnPreview, textAlign: 'center', lineHeight: 1.3, padding: '2px' }}>
                  {charName ? charName.split(' ')[0] : '👕'}
                </span>
              </div>

              {/* Center: name + character + size */}
              <div style={{ flex: 1, minWidth: '140px' }}>
                <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '16px', color: 'var(--navy)', marginBottom: '2px' }}>
                  {name}
                </div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontStyle: 'italic', color: charName ? '#F4C430' : '#bbb', marginBottom: '2px' }}>
                  {charName || 'No character yet'}
                </div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: size ? '#888' : '#ccc' }}>
                  {size || 'No size yet'}
                </div>
              </div>

              {/* Right: status badge + change character link */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                <span style={{
                  fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700,
                  padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap',
                  ...(isReady
                    ? { background: '#edfcf2', color: '#22863a' }
                    : { background: '#fff8e1', color: '#a16207' }),
                }}>
                  {isReady ? '✅ Ready' : '⏳ Needs Info'}
                </span>
                <button
                  onClick={() => setPickerFor(name)}
                  style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#FF6B6B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  {charName ? 'Change Character' : 'Pick Character'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Go to T-Shirt Studio */}
      <a
        href="/tshirt"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          width: '100%', padding: '16px', borderRadius: '14px',
          fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '16px',
          background: '#F4C430', color: '#1B2A4A', textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(244,196,48,0.35)', marginBottom: '12px',
        }}
      >
        👕 Go to T-Shirt Studio →
      </a>

      <CharacterPickerModal
        isOpen={!!pickerFor}
        personName={pickerFor || ''}
        onConfirm={handleConfirm}
        onClose={() => setPickerFor(null)}
      />
    </div>
  );
}

// ── Tab 5 — Photos ────────────────────────────────────────────────────────────

function PhotosTab({ family }) {
  const { isAdmin } = useAdmin();
  const storageKey  = `apd_photos_${family.id}`;
  const fileRef     = useRef(null);
  const [photos,   setPhotos]   = useState(() => loadLocal(storageKey, []));
  const [lightbox, setLightbox] = useState(null);
  const [filter,   setFilter]   = useState('all');

  const isPreTrip = new Date() < EMBARKATION_DATE;
  const daysLeft  = Math.max(0, Math.ceil((EMBARKATION_DATE - new Date()) / (1000 * 60 * 60 * 24)));

  function handleUpload(e) {
    const files = Array.from(e.target?.files || e.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setPhotos(prev => {
          const next = [...prev, {
            id: `photo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            src: ev.target.result,
            day: 'All',
            caption: '',
            uploadedAt: new Date().toISOString(),
          }];
          saveLocal(storageKey, next);
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
    if (e.target) e.target.value = '';
  }

  function deletePhoto(id) {
    setPhotos(prev => {
      const next = prev.filter(p => p.id !== id);
      saveLocal(storageKey, next);
      return next;
    });
    if (lightbox?.id === id) setLightbox(null);
  }

  const filterOptions = ['all', ...TRIP_DAYS.map((d, i) => `Day ${i + 1}`)];
  const filteredPhotos = filter === 'all' ? photos : photos.filter(p => p.day === filter);

  if (isPreTrip && photos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center"
           style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {/* Polaroid */}
        <div className="mx-auto mb-6"
             style={{ width: '130px', background: 'white', padding: '10px 10px 28px', borderRadius: '4px', boxShadow: '0 6px 24px rgba(0,0,0,0.15)', transform: 'rotate(-3deg)' }}>
          <div className="rounded flex items-center justify-center"
               style={{ background: '#f0f0f0', height: '96px', fontSize: '40px' }}>
            📸
          </div>
        </div>
        <h3 className="font-playfair font-bold mb-3" style={{ fontSize: '28px', color: 'var(--navy)' }}>
          Your cruise memories live here
        </h3>
        <p className="font-nunito mb-6" style={{ color: '#888', fontSize: '15px', maxWidth: '340px', margin: '0 auto 24px' }}>
          {daysLeft > 0 ? `${daysLeft} days until the magic begins!` : 'The adventure is just beginning!'}
        </p>
        <button
          onClick={() => fileRef.current?.click()}
          className="font-nunito font-bold px-6 py-3 rounded-xl"
          style={{ background: 'var(--navy)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px' }}
        >
          Upload a Pre-Trip Photo
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>
    );
  }

  return (
    <div>
      {/* Upload zone */}
      <div
        className="rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
        style={{ height: '160px', border: '2px dashed var(--gold)', background: 'rgba(244,196,48,0.04)' }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = 'rgba(244,196,48,0.1)'; }}
        onDragLeave={e => { e.currentTarget.style.background = 'rgba(244,196,48,0.04)'; }}
        onDrop={e => {
          e.preventDefault();
          e.currentTarget.style.background = 'rgba(244,196,48,0.04)';
          handleUpload({ files: e.dataTransfer.files });
        }}
      >
        <span style={{ fontSize: '32px' }}>📸</span>
        <p className="font-nunito font-bold" style={{ color: 'var(--navy)', fontSize: '15px' }}>
          Drop photos here or click to upload
        </p>
        <p className="font-nunito text-xs" style={{ color: '#aaa' }}>JPG, PNG, HEIC supported</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />

      {/* Filter pills */}
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full font-nunito font-semibold text-xs transition-all"
              style={filter === f
                ? { background: 'var(--navy)', color: 'var(--gold)', border: 'none', cursor: 'pointer' }
                : { background: 'white', color: 'var(--navy)', border: '1px solid rgba(27,42,74,0.2)', cursor: 'pointer' }}
            >
              {f === 'all' ? 'All Photos' : f}
            </button>
          ))}
        </div>
      )}

      {/* Gallery grid */}
      {filteredPhotos.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {filteredPhotos.map(photo => (
            <div
              key={photo.id}
              className="relative group cursor-pointer"
              style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '1' }}
              onClick={() => setLightbox(photo)}
            >
              <img
                src={photo.src}
                alt={photo.caption || 'Photo'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {isAdmin && (
                <button
                  onClick={e => { e.stopPropagation(); deletePhoto(photo.id); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.65)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', fontSize: '13px' }}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      ) : photos.length > 0 ? (
        <div className="text-center py-8 font-nunito" style={{ color: '#ccc' }}>
          No photos for this filter.
        </div>
      ) : null}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.src}
            alt={lightbox.caption || 'Photo'}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px' }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '20px', right: '24px', fontSize: '32px', color: 'white', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
          >×</button>
        </div>
      )}
    </div>
  );
}

// ── Tab nav ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'cabin',    label: 'Our Cabin', emoji: '🛏️' },
  { id: 'todo',     label: 'To-Do',     emoji: '✅' },
  { id: 'schedule', label: 'Schedule',  emoji: '🗓️' },
  { id: 'tshirts',  label: 'T-Shirts',  emoji: '👕' },
  { id: 'photos',   label: 'Photos',    emoji: '📸' },
];

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ family, families, cabins, todos, toggleTodoComplete, familyPlans, addFamilyPlan, deleteFamilyPlan, updateFamily, onSwitch }) {
  const [activeTab, setActiveTab] = useState('cabin');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }} className="px-6 py-8">
      {/* Family header bar */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold"
            style={{ width: '56px', height: '56px', background: family.light, fontSize: '24px' }}
          >
            {family.emoji}
          </div>
          <div>
            <h1 className="font-playfair font-black" style={{ fontSize: '36px', color: 'var(--navy)', lineHeight: 1.05 }}>
              {family.name}
            </h1>
            <p className="font-nunito" style={{ fontSize: '16px', color: '#888', marginTop: '2px' }}>
              {family.memberNames?.join(' · ')}
            </p>
          </div>
        </div>
        <button
          onClick={onSwitch}
          className="font-nunito font-bold rounded-xl transition-all hover:opacity-80"
          style={{ fontSize: '14px', padding: '12px 24px', background: 'var(--navy)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Switch Family
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center flex-shrink-0 font-nunito font-semibold rounded-2xl gap-1 transition-all"
              style={{
                minHeight: '56px',
                minWidth: '120px',
                padding: '10px 16px',
                fontSize: '16px',
                background: active ? 'var(--navy)' : 'white',
                color: active ? 'var(--gold)' : 'var(--navy)',
                border: active ? 'none' : '1px solid rgba(27,42,74,0.15)',
                borderBottom: active ? '3px solid var(--gold)' : '1px solid rgba(27,42,74,0.15)',
                cursor: 'pointer',
                boxShadow: active ? '0 4px 16px rgba(27,42,74,0.18)' : 'none',
              }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'cabin'    && <CabinTab    family={family} cabins={cabins} families={families} />}
      {activeTab === 'todo'     && <TodoTab     family={family} todos={todos} toggleTodoComplete={toggleTodoComplete} />}
      {activeTab === 'schedule' && <ScheduleTab family={family} families={families} familyPlans={familyPlans} addFamilyPlan={addFamilyPlan} deleteFamilyPlan={deleteFamilyPlan} />}
      {activeTab === 'tshirts'  && <TShirtTab   family={family} />}
      {activeTab === 'photos'   && <PhotosTab   family={family} />}
    </div>
  );
}

// ── Family Selector ───────────────────────────────────────────────────────────

function FamilySelector({ families, onSelect }) {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }} className="px-6 py-16">
      <div className="text-center mb-10">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✦</div>
        <h1 className="font-playfair font-black" style={{ fontSize: '48px', color: 'var(--navy)', marginBottom: '12px' }}>
          My Yosties
        </h1>
        <p className="font-nunito" style={{ fontSize: '17px', color: '#888' }}>
          Select your family to see your personal dashboard
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', maxWidth: '680px', margin: '0 auto' }}>
        {families.map(family => (
          <button
            key={family.id}
            onClick={() => onSelect(family.id)}
            className="text-left rounded-2xl p-5 transition-all hover:shadow-xl group"
            style={{
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              borderLeft: `4px solid ${family.light}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center rounded-full text-2xl"
                   style={{ width: '52px', height: '52px', background: family.light + '20' }}>
                {family.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-playfair font-bold" style={{ fontSize: '20px', color: 'var(--navy)' }}>
                  {family.name}
                </div>
                <div className="font-nunito text-sm" style={{ color: '#888', marginTop: '2px' }}>
                  {family.memberNames?.join(', ')}
                </div>
              </div>
              <span style={{ fontSize: '18px', color: '#ccc' }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyYosties() {
  const {
    families, cabins,
    todos, toggleTodoComplete,
    familyPlans, addFamilyPlan, deleteFamilyPlan,
    updateFamily,
    selectedFamily, setSelectedFamilyId,
  } = useData();

  if (!selectedFamily) {
    return <FamilySelector families={families} onSelect={setSelectedFamilyId} />;
  }

  return (
    <Dashboard
      family={selectedFamily}
      families={families}
      cabins={cabins}
      todos={todos}
      toggleTodoComplete={toggleTodoComplete}
      familyPlans={familyPlans}
      addFamilyPlan={addFamilyPlan}
      deleteFamilyPlan={deleteFamilyPlan}
      updateFamily={updateFamily}
      onSwitch={() => setSelectedFamilyId(null)}
    />
  );
}
