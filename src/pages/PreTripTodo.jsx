import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

// ── Date helpers ───────────────────────────────────────────────────────────────

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function getGroup(deadline) {
  const d = new Date(deadline);
  const now = new Date();
  // end of current calendar month
  const endThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  // end of next calendar month
  const endNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  if (d < now)             return 'overdue';
  if (d <= endThisMonth)   return 'thisMonth';
  if (d <= endNextMonth)   return 'nextMonth';
  return 'later';
}

// Task is "done" in the current filter context
function isTaskDone(todo, filterId) {
  if (filterId === 'all') {
    return todo.families.length > 0 && todo.families.every(fid => todo.completedBy.includes(fid));
  }
  return todo.completedBy.includes(filterId);
}

// ── Accordion group definitions ────────────────────────────────────────────────

const GROUPS = [
  { key: 'overdue',   label: 'Overdue',        icon: '🚨', color: '#C0392B', defaultOpen: true  },
  { key: 'thisMonth', label: 'Due This Month',  icon: '📅', color: '#E67E22', defaultOpen: true  },
  { key: 'nextMonth', label: 'Due Next Month',  icon: '🗓',  color: '#1B2A4A', defaultOpen: false },
  { key: 'later',     label: 'Later',           icon: '✅', color: '#6BAF92', defaultOpen: false },
];

// ── Ring progress SVG ──────────────────────────────────────────────────────────

function RingProgress({ pct, color, size = 56 }) {
  const r    = 22;
  const circ = 2 * Math.PI * r;
  const off  = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" style={{ flexShrink: 0 }}>
      <circle cx="28" cy="28" r={r} fill="none" stroke="#e8eaf0" strokeWidth="4" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
      <text x="28" y="33" textAnchor="middle" fontSize="11" fontWeight="bold"
        fill={color} fontFamily="Nunito, sans-serif">{pct}%</text>
    </svg>
  );
}

// ── Family progress card (header row) ─────────────────────────────────────────

function FamilyProgressCard({ family, todos }) {
  const mine  = todos.filter(t => t.families.includes(family.id));
  const done  = mine.filter(t => t.completedBy.includes(family.id)).length;
  const pct   = mine.length > 0 ? Math.round((done / mine.length) * 100) : 0;
  return (
    <div
      style={{
        background:   'white',
        borderRadius: '12px',
        borderLeft:   `4px solid ${family.light}`,
        boxShadow:    '0 2px 12px rgba(0,0,0,0.07)',
        padding:      '16px 20px',
        flex:         '1 1 0',
        minWidth:     '160px',
        display:      'flex',
        flexDirection:'column',
        alignItems:   'center',
        gap:          '8px',
      }}
    >
      <RingProgress pct={pct} color={family.light} />
      <div className="font-playfair font-bold text-center"
           style={{ fontSize: '15px', color: 'var(--charcoal)', lineHeight: 1.2 }}>
        {family.name}
      </div>
      <div className="font-nunito text-center"
           style={{ fontSize: '12px', color: '#999' }}>
        {done} of {mine.length} done
      </div>
    </div>
  );
}

// ── Family dots with tooltip ───────────────────────────────────────────────────

function FamilyDots({ familyIds, families }) {
  const [show, setShow] = useState(false);
  const assigned = families.filter(f => familyIds.includes(f.id));
  if (!assigned.length) return null;
  return (
    <div
      className="relative flex-shrink-0 flex items-center gap-1.5"
      style={{ marginTop: '3px' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {assigned.map(f => (
        <div key={f.id} style={{ width: '10px', height: '10px', borderRadius: '50%', background: f.light }} />
      ))}
      {show && (
        <div
          className="absolute font-nunito"
          style={{
            right:      0,
            bottom:     'calc(100% + 6px)',
            background: '#1B2A4A',
            color:      'white',
            fontSize:   '12px',
            padding:    '6px 12px',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            boxShadow:  '0 4px 12px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
            zIndex:     20,
          }}
        >
          {assigned.map(f => f.name).join(', ')}
          <div style={{
            position: 'absolute', bottom: '-4px', right: '12px',
            width: '8px', height: '8px',
            background: '#1B2A4A', transform: 'rotate(45deg)',
          }} />
        </div>
      )}
    </div>
  );
}

// ── Task row ───────────────────────────────────────────────────────────────────

function TaskRow({ todo, families, filterId, onToggle }) {
  const done    = isTaskDone(todo, filterId);
  const days    = daysUntil(todo.deadline);
  const overdue = days < 0;

  function handleClick() {
    if (filterId === 'all') {
      // In All-Families view: mark/unmark ALL assigned families at once
      const allDone = todo.families.every(fid => todo.completedBy.includes(fid));
      todo.families.forEach(fid => {
        const familyDone = todo.completedBy.includes(fid);
        // If currently all done → unmark those that are done
        // If not all done → mark those that aren't done yet
        if (allDone ? familyDone : !familyDone) {
          onToggle(todo.id, fid);
        }
      });
    } else {
      onToggle(todo.id, filterId);
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background:   'white',
        borderRadius: '10px',
        padding:      '20px 24px',
        boxShadow:    '0 2px 12px rgba(0,0,0,0.06)',
        borderLeft:   done
          ? '4px solid #6BAF92'
          : overdue
          ? '4px solid #C0392B'
          : '4px solid #E8E0D5',
        opacity:      done ? 0.72 : 1,
        cursor:       'pointer',
        userSelect:   'none',
        transition:   'opacity 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.11)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>

        {/* Large checkbox */}
        <div style={{
          width:        '28px',
          height:       '28px',
          flexShrink:   0,
          borderRadius: '6px',
          border:       `2px solid ${done ? 'var(--navy)' : 'var(--navy)'}`,
          background:   done ? 'var(--navy)' : 'white',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          marginTop:    '2px',
          transition:   'background 0.15s',
        }}>
          {done && (
            <span style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', lineHeight: 1 }}>✓</span>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="font-playfair font-bold" style={{
            fontSize:        '18px',
            color:           done ? '#aaa' : 'var(--charcoal)',
            textDecoration:  done ? 'line-through' : 'none',
            lineHeight:      1.3,
            marginBottom:    '4px',
          }}>
            {todo.title}
          </div>
          <div className="font-nunito" style={{
            fontSize: '13px',
            color:    overdue && !done ? 'var(--coral)' : '#999',
          }}>
            {overdue && !done && '⚠️ '}Due: {todo.deadlineLabel}
            {!done && (
              overdue
                ? ` · ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`
                : days === 0
                ? ' · Due today!'
                : ` · ${days} day${days !== 1 ? 's' : ''} left`
            )}
          </div>
          {todo.note && (
            <div className="font-nunito" style={{
              fontSize:    '14px',
              color:       '#999',
              marginTop:   '8px',
              lineHeight:  1.55,
            }}>
              {todo.note}
            </div>
          )}
        </div>

        {/* Family dots */}
        <FamilyDots familyIds={todo.families} families={families} />
      </div>
    </div>
  );
}

// ── Accordion group ────────────────────────────────────────────────────────────

function AccordionGroup({ group, tasks, families, filterId, onToggle }) {
  const [open, setOpen] = useState(group.defaultOpen);

  // Hide empty overdue group — it means everything is on track
  if (group.key === 'overdue' && tasks.length === 0) return null;

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Header bar */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width:        '100%',
          height:       '56px',
          padding:      '0 24px',
          borderRadius: '12px',
          background:   group.color,
          color:        'white',
          border:       'none',
          cursor:       'pointer',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
        }}
      >
        <span className="font-playfair font-bold" style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{group.icon}</span>
          <span>{group.label}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="font-nunito font-bold" style={{
            fontSize:     '13px',
            padding:      '3px 12px',
            borderRadius: '999px',
            background:   'rgba(255,255,255,0.22)',
          }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
          <span style={{
            fontSize:   '14px',
            display:    'inline-block',
            transform:  open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.3s ease',
          }}>▼</span>
        </span>
      </button>

      {/* Collapsible content */}
      <div style={{
        overflow:   'hidden',
        maxHeight:  open ? '4000px' : '0',
        opacity:    open ? 1 : 0,
        transition: 'max-height 0.35s ease, opacity 0.25s ease',
        marginTop:  open ? '12px' : '0',
      }}>
        {tasks.length === 0 ? (
          <div className="font-nunito text-center" style={{
            padding: '24px', color: '#aaa', fontSize: '14px',
          }}>
            No tasks in this group — you're ahead of schedule 🎉
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...tasks]
              .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
              .map(t => (
                <TaskRow
                  key={t.id}
                  todo={t}
                  families={families}
                  filterId={filterId}
                  onToggle={onToggle}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Completed section ──────────────────────────────────────────────────────────

function CompletedSection({ tasks, families, filterId, onToggle }) {
  const [open, setOpen] = useState(false);
  if (!tasks.length) return null;

  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width:        '100%',
          height:       '56px',
          padding:      '0 24px',
          borderRadius: '12px',
          background:   '#6BAF92',
          color:        'white',
          border:       'none',
          cursor:       'pointer',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
        }}
      >
        <span className="font-playfair font-bold" style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>✅</span>
          <span>Completed Tasks ({tasks.length})</span>
        </span>
        <span style={{
          fontSize:   '14px',
          display:    'inline-block',
          transform:  open ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.3s ease',
        }}>▼</span>
      </button>

      <div style={{
        overflow:   'hidden',
        maxHeight:  open ? '4000px' : '0',
        opacity:    open ? 1 : 0,
        transition: 'max-height 0.35s ease, opacity 0.25s ease',
        marginTop:  open ? '12px' : '0',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map(t => (
            <TaskRow
              key={t.id}
              todo={t}
              families={families}
              filterId={filterId}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function PreTripTodo() {
  const { todos, families, toggleTodoComplete } = useData();
  const [filterId, setFilterId] = useState('all');

  // Apply family filter
  const visible = filterId === 'all'
    ? todos
    : todos.filter(t => t.families.includes(filterId));

  // Split into active and done
  const doneTasks   = visible.filter(t =>  isTaskDone(t, filterId));
  const activeTasks = visible.filter(t => !isTaskDone(t, filterId));

  // Bucket active tasks into deadline groups
  const grouped = Object.fromEntries(GROUPS.map(g => [g.key, []]));
  activeTasks.forEach(t => {
    const key = getGroup(t.deadline);
    (grouped[key] ?? grouped.later).push(t);
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* ── Page hero ── */}
      <div style={{ background: '#1B2A4A', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="font-dancing font-bold"
              style={{ fontSize: '48px', color: 'var(--gold)', lineHeight: 1.1, marginBottom: '12px' }}>
            ⚡ Before We Set Sail
          </h1>
          <p className="font-nunito"
             style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', margin: '0 auto', maxWidth: '480px' }}>
            Every task your crew needs to complete before July 23
          </p>
          <div style={{ marginTop: '16px', color: 'var(--gold)', fontSize: '14px', letterSpacing: '10px' }}>
            ✦ ✦ ✦
          </div>
        </div>
      </div>

      {/* ── Family progress summary ── */}
      <div style={{ background: '#F0EBE3', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {families.map(f => (
              <FamilyProgressCard key={f.id} family={f} todos={todos} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background: 'white', padding: '20px 24px', borderBottom: '1px solid #E8E0D5' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span className="font-nunito font-bold"
                style={{ fontSize: '15px', color: 'var(--charcoal)', flexShrink: 0 }}>
            Show tasks for:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* All Families */}
            <button
              onClick={() => setFilterId('all')}
              className="font-nunito font-semibold transition-all"
              style={{
                fontSize:     '15px',
                padding:      '12px 24px',
                borderRadius: '24px',
                border:       '2px solid var(--navy)',
                background:   filterId === 'all' ? 'var(--navy)' : 'white',
                color:        filterId === 'all' ? 'white' : 'var(--navy)',
                cursor:       'pointer',
              }}
            >
              All Families
            </button>
            {/* Per-family */}
            {families.map(f => {
              const active = filterId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilterId(active ? 'all' : f.id)}
                  className="font-nunito font-semibold transition-all"
                  style={{
                    fontSize:     '15px',
                    padding:      '12px 24px',
                    borderRadius: '24px',
                    border:       `2px solid ${f.light}`,
                    background:   active ? f.light : 'white',
                    color:        active ? 'white' : f.light,
                    cursor:       'pointer',
                  }}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Task accordion groups ── */}
      <div style={{ padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Castle watermark */}
        <div aria-hidden="true" style={{
          position:       'fixed',
          top:            '50%',
          left:           '50%',
          transform:      'translate(-50%, -50%)',
          fontSize:       '120px',
          opacity:        0.04,
          pointerEvents:  'none',
          userSelect:     'none',
          zIndex:         0,
          lineHeight:     1,
        }}>🏰</div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {GROUPS.map(g => (
            <AccordionGroup
              key={g.key}
              group={g}
              tasks={grouped[g.key] || []}
              families={families}
              filterId={filterId}
              onToggle={toggleTodoComplete}
            />
          ))}

          <CompletedSection
            tasks={doneTasks}
            families={families}
            filterId={filterId}
            onToggle={toggleTodoComplete}
          />

          {/* My Yosties gold button */}
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Link
              to="/my-yosties"
              className="font-nunito font-bold inline-block"
              style={{
                fontSize:       '16px',
                padding:        '14px 36px',
                borderRadius:   '12px',
                background:     'var(--gold)',
                color:          '#1B2A4A',
                textDecoration: 'none',
                boxShadow:      '0 4px 16px rgba(244,196,48,0.35)',
              }}
            >
              View your family's dashboard in My Yosties →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
