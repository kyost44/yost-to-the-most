import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getNextDeadline(todos, familyId) {
  const now = new Date();
  return todos
    .filter(t => t.families.includes(familyId) && !t.completedBy.includes(familyId))
    .filter(t => new Date(t.deadline) >= now)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0] || null;
}

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

// ── Circular progress ring ─────────────────────────────────────────────────────

function RingProgress({ pct, color, size = 72 }) {
  const radius      = 28;
  const circumference = 2 * Math.PI * radius;
  const offset      = circumference - (pct / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
      <circle cx="32" cy="32" r={radius}
        fill="none" stroke="#e8eaf0" strokeWidth="5" />
      <circle cx="32" cy="32" r={radius}
        fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="32" y="37" textAnchor="middle"
        fontSize="13" fontWeight="bold" fill={color}
        fontFamily="Nunito, sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

// ── Featured (selected) family card ──────────────────────────────────────────

function FeaturedFamilyCard({ family, todos }) {
  const total = todos.filter(t => t.families.includes(family.id)).length;
  const done  = todos.filter(t => t.completedBy.includes(family.id)).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const next  = getNextDeadline(todos, family.id);
  const days  = next ? daysUntil(next.deadline) : null;
  const isOverdue = days !== null && days < 0;

  return (
    <div
      className="family-card"
      style={{
        borderLeftColor: family.light,
        borderLeftWidth: '4px',
        padding:         '28px 32px',
        marginBottom:    '12px',
        minHeight:       '140px',
        boxShadow:       '0 4px 24px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-start gap-6 flex-wrap">
        {/* Ring */}
        <RingProgress pct={pct} color={family.light} size={80} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-playfair font-bold" style={{ fontSize: '24px', color: 'var(--navy)' }}>
              {family.name}
            </span>
            <span className="text-sm font-nunito font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: family.light + '22', color: family.light }}>
              {done}/{total} tasks
            </span>
          </div>

          {/* Next task */}
          {next ? (
            <div>
              <div
                className="font-nunito font-bold leading-snug"
                style={{ fontSize: '15px', color: isOverdue ? '#c0392b' : 'var(--navy)' }}
              >
                {next.title.replace(/^[^\w]+/, '')}
              </div>
              <div className="font-nunito text-sm mt-1" style={{ color: 'var(--coral)' }}>
                {isOverdue
                  ? `${Math.abs(days)} days overdue`
                  : days === 0
                  ? 'Due today!'
                  : `Due in ${days} day${days !== 1 ? 's' : ''}`}
                {' '}· {next.deadlineLabel}
              </div>
            </div>
          ) : done === total && total > 0 ? (
            <div className="font-nunito font-semibold text-sm" style={{ color: '#22863a' }}>
              ✓ All tasks complete!
            </div>
          ) : (
            <div className="font-nunito text-sm" style={{ color: '#aaa' }}>
              No upcoming deadlines
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Compact family row (non-selected) ────────────────────────────────────────

function CompactFamilyRow({ family, todos }) {
  const total = todos.filter(t => t.families.includes(family.id)).length;
  const done  = todos.filter(t => t.completedBy.includes(family.id)).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      className="family-card"
      style={{
        borderLeftColor: family.light,
        padding:         '14px 18px',
        boxShadow:       '0 4px 24px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-nunito font-bold" style={{ fontSize: '14px', color: 'var(--navy)' }}>
              {family.name}
            </span>
            <span className="text-xs font-nunito font-semibold" style={{ color: family.light }}>
              {pct}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e8eaf0' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: family.light, transition: 'width 0.4s ease' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Family selector pills ─────────────────────────────────────────────────────

function FamilyPills({ families, selectedId, onSelect }) {
  return (
    <div className="mb-6">
      <p
        className="font-nunito mb-3"
        style={{ fontSize: '16px', color: 'var(--charcoal)', fontWeight: 500 }}
      >
        Which family are you?
      </p>
      <div className="flex gap-2.5 flex-wrap">
        {families.map(f => {
          const active = selectedId === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelect(active ? null : f.id)}
              className="font-nunito font-semibold transition-all"
              style={{
                fontSize:     '15px',
                padding:      '12px 20px',
                borderRadius: '999px',
                border:       `2px solid ${f.light}`,
                background:   active ? f.light : 'white',
                color:        active ? 'white' : f.light,
                cursor:       'pointer',
                boxShadow:    active ? `0 2px 12px ${f.light}40` : 'none',
                transition:   'all 0.2s ease',
              }}
            >
              {active ? `✓ ${f.shortName || f.name}` : (f.shortName || f.name)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────

export default function TodoSummaryWidget() {
  const { families, todos } = useData();
  // Local state — does NOT persist across page refreshes
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);

  const selectedFamily = families.find(f => f.id === selectedFamilyId) || null;
  const otherFamilies  = selectedFamily
    ? families.filter(f => f.id !== selectedFamilyId)
    : [];

  return (
    <section
      className="px-6"
      style={{ background: 'var(--cream)', paddingTop: '72px', paddingBottom: '72px' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Section header */}
        <div className="mb-8">
          <p
            className="font-nunito font-bold uppercase tracking-widest mb-1"
            style={{ fontSize: '11px', color: 'var(--coral)', letterSpacing: '0.2em' }}
          >
            ⚡ BEFORE WE SET SAIL
          </p>
          <h2
            className="font-playfair font-black section-title"
            style={{ fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.1 }}
          >
            Mission Control
          </h2>
          <p className="font-nunito text-sm mt-1" style={{ color: '#888' }}>
            Track each family's pre-cruise checklist
          </p>
        </div>

        {/* Family selector pills */}
        <FamilyPills
          families={families}
          selectedId={selectedFamilyId}
          onSelect={setSelectedFamilyId}
        />

        {/* Cards — adaptive layout based on selection */}
        {selectedFamily ? (
          <div>
            {/* Featured selected family */}
            <FeaturedFamilyCard family={selectedFamily} todos={todos} />
            {/* Compact row for other families */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-0">
              {otherFamilies.map(f => (
                <CompactFamilyRow key={f.id} family={f} todos={todos} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {families.map(family => (
              <FamilyCard key={family.id} family={family} todos={todos} />
            ))}
          </div>
        )}

        {/* View All Tasks — centered below grid */}
        <div className="mt-8 text-center">
          <Link
            to="/todo"
            className="font-nunito font-semibold inline-block transition-all"
            style={{
              fontSize:       '14px',
              padding:        '10px 28px',
              borderRadius:   '8px',
              border:         '2px solid var(--navy)',
              color:          'var(--navy)',
              textDecoration: 'none',
              background:     'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--navy)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--navy)';
            }}
          >
            View All Tasks →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Standard family card (no selection) ──────────────────────────────────────

function FamilyCard({ family, todos }) {
  const total = todos.filter(t => t.families.includes(family.id)).length;
  const done  = todos.filter(t => t.completedBy.includes(family.id)).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const next  = getNextDeadline(todos, family.id);
  const days  = next ? daysUntil(next.deadline) : null;
  const isOverdue = days !== null && days < 0;
  const isUrgent  = days !== null && days <= 14;

  return (
    <div
      className="family-card"
      style={{
        borderLeftColor: family.light,
        boxShadow:       '0 4px 24px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-nunito font-bold text-base" style={{ color: 'var(--navy)' }}>
          {family.name}
        </span>
        <span className="text-sm font-nunito font-semibold px-2 py-0.5 rounded-full"
              style={{ background: family.light + '20', color: family.light }}>
          {done}/{total}
        </span>
      </div>

      <div className="h-2 rounded-full mb-1 overflow-hidden" style={{ background: '#e8eaf0' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: family.light, transition: 'width 0.4s ease' }}
        />
      </div>
      <div className="text-xs font-nunito mb-3" style={{ color: '#888' }}>
        {pct}% complete
      </div>

      {next ? (
        <div className="text-xs font-nunito">
          <div
            className="font-bold text-sm leading-snug"
            style={{ color: isOverdue ? '#c0392b' : isUrgent ? 'var(--coral)' : 'var(--navy)' }}
          >
            {isUrgent && !isOverdue && (
              <span style={{ color: '#F59E0B', marginRight: '5px', fontSize: '9px' }}>●</span>
            )}
            {next.title.replace(/^[^\w]+/, '')}
          </div>
          <div className="mt-0.5" style={{ color: '#999' }}>
            {isOverdue
              ? `${Math.abs(days)} days ago`
              : days === 0
              ? 'Due today!'
              : `Due in ${days} day${days !== 1 ? 's' : ''}`}
            {' '}· {next.deadlineLabel}
          </div>
        </div>
      ) : done === total && total > 0 ? (
        <div className="text-xs font-semibold font-nunito" style={{ color: '#22863a' }}>
          ✓ All tasks complete!
        </div>
      ) : (
        <div className="text-xs font-nunito" style={{ color: '#aaa' }}>
          No upcoming deadlines
        </div>
      )}
    </div>
  );
}
