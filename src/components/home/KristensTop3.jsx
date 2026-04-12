import { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_ITEMS = [
  {
    id: 'k3_1',
    title:  'Finalize travel dates & post-cruise hotel',
    detail: 'Confirm whether your family is staying July 27–29 at Pelican Grand',
    status: 'Action Needed',
  },
  {
    id: 'k3_2',
    title:  'Decide on ground transportation',
    detail: 'Airport → hotel, hotel → port, and return logistics for each family',
    status: 'Action Needed',
  },
  {
    id: 'k3_3',
    title:  'Prepare documents for online check-in',
    detail: 'Passport photos, headshots, flight info, credit card, emergency contact',
    status: 'Action Needed',
    hasCheckInLink: true,
  },
];

const STATUS_STYLES = {
  'Done':          { bg: '#edfcf2',  color: '#22863a', border: '#c3e6cb',  solid: false },
  'In Progress':   { bg: '#fffbea',  color: '#a16207', border: '#fde68a',  solid: false },
  'Action Needed': { bg: '#F59E0B',  color: 'white',   border: '#F59E0B',  solid: true  },
};

const STORAGE_KEY = 'apd_kristen_top3';

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ITEMS;
  } catch {
    return DEFAULT_ITEMS;
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ── Check-In Modal ────────────────────────────────────────────────────────────

function CheckInModal({ onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const CHECKLIST = [
    'Clear passport photo (plain background)',
    'Headshot of each traveler — shoulders up, plain background',
    'Pre and post-cruise hotel confirmation numbers',
    'Flight information for all travelers',
    'Credit card for onboard account',
    'Emergency contact not traveling with you',
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl w-full shadow-2xl"
        style={{
          background:   'white',
          maxWidth:     '580px',
          padding:      '40px',
          borderRadius: '20px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute font-bold transition-colors"
          style={{
            top:      '20px',
            right:    '22px',
            fontSize: '20px',
            color:    'var(--gold)',
            background: 'none',
            border:   'none',
            cursor:   'pointer',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <h2
          className="font-playfair font-bold"
          style={{ fontSize: '26px', color: 'var(--navy)', marginBottom: '6px' }}
        >
          Online Check-In
        </h2>
        <p
          className="font-nunito font-bold"
          style={{ fontSize: '14px', color: 'var(--coral)', marginBottom: '28px' }}
        >
          Opens midnight EST — June 23, 2026
        </p>

        {/* Numbered checklist */}
        <ol className="space-y-4 mb-7" style={{ listStyle: 'none', padding: 0 }}>
          {CHECKLIST.map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span
                className="font-nunito font-bold flex-shrink-0"
                style={{ fontSize: '16px', color: 'var(--gold)', minWidth: '24px', lineHeight: 1.5 }}
              >
                {i + 1}.
              </span>
              <span
                className="font-nunito"
                style={{ fontSize: '14px', color: 'var(--charcoal)', lineHeight: 1.7 }}
              >
                {item}
              </span>
            </li>
          ))}
        </ol>

        {/* Note */}
        <p
          className="font-nunito"
          style={{
            fontSize:    '13px',
            color:       '#999',
            lineHeight:  1.6,
            marginBottom:'24px',
            borderTop:   '1px solid #f0f0f0',
            paddingTop:  '16px',
          }}
        >
          Earlier check-in = earlier Port Arrival Time = earlier boarding. Also book{' '}
          <strong style={{ color: 'var(--charcoal)' }}>Royal Gathering</strong> and specialty dining
          (<strong style={{ color: 'var(--charcoal)' }}>Palo / Enchanté</strong>) on June 23.
        </p>

        {/* CTA */}
        <a
          href="https://disneycruise.disney.go.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-nunito font-bold text-center w-full py-3.5 rounded-xl transition-opacity hover:opacity-90"
          style={{
            background:     'var(--gold)',
            color:          'var(--navy)',
            fontSize:       '15px',
            textDecoration: 'none',
          }}
        >
          Go to Disney Cruise Check-In →
        </a>
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function KristensTop3() {
  const { isAdmin } = useAdmin();
  const [items, setItems]         = useState(loadItems);
  const [editing, setEditing]     = useState(false);
  const [draft, setDraft]         = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  function startEdit() {
    setDraft(items.map(i => ({ ...i })));
    setEditing(true);
  }

  function updateDraft(id, field, value) {
    setDraft(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  }

  function saveEdit() {
    setItems(draft);
    saveItems(draft);
    setEditing(false);
    setDraft(null);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(null);
  }

  const displayItems = editing ? draft : items;

  return (
    <>
      <section className="px-6" style={{ background: '#F0EBE3', paddingTop: '72px', paddingBottom: '72px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Section header */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p
                className="font-nunito font-bold uppercase tracking-widest mb-1"
                style={{ fontSize: '11px', color: 'var(--coral)', letterSpacing: '0.2em' }}
              >
                ✨ RIGHT NOW
              </p>
              <h2
                className="font-playfair font-black section-title"
                style={{ fontSize: '40px', lineHeight: 1.1 }}
              >
                Kristen's Top 3
              </h2>
              <p className="font-nunito text-sm mt-1" style={{ color: '#888' }}>
                Kristen's picks for what needs attention this week
              </p>
            </div>
            {/* "K" avatar — signals personally curated */}
            <div
              className="flex-shrink-0 flex items-center justify-center font-playfair font-bold"
              style={{
                width:        '44px',
                height:       '44px',
                borderRadius: '50%',
                background:   'var(--navy)',
                color:        'var(--gold)',
                fontSize:     '20px',
                marginTop:    '4px',
              }}
            >
              K
            </div>
          </div>

          {/* Item rows */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            {displayItems.map((item, idx) => {
              const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES['Action Needed'];
              const isLast = idx === displayItems.length - 1;

              return (
                <div key={item.id}>
                  <div
                    className="flex items-center gap-5 px-7"
                    style={{ minHeight: '80px', paddingTop: '24px', paddingBottom: '24px' }}
                  >
                    {/* Decorative number */}
                    <span
                      className="font-playfair font-bold flex-shrink-0 select-none"
                      style={{
                        fontSize: '64px',
                        color:    'var(--gold)',
                        opacity:  0.2,
                        lineHeight: 1,
                        minWidth: '52px',
                      }}
                    >
                      {idx + 1}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {editing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={e => updateDraft(item.id, 'title', e.target.value)}
                            className="w-full border rounded-lg px-3 py-1.5 font-nunito font-bold text-sm focus:outline-none"
                            style={{ borderColor: '#e0e0e0', color: 'var(--navy)' }}
                          />
                          <input
                            type="text"
                            value={item.detail}
                            onChange={e => updateDraft(item.id, 'detail', e.target.value)}
                            className="w-full border rounded-lg px-3 py-1.5 font-nunito text-xs focus:outline-none"
                            style={{ borderColor: '#e0e0e0', color: '#666' }}
                          />
                          <select
                            value={item.status}
                            onChange={e => updateDraft(item.id, 'status', e.target.value)}
                            className="border rounded-lg px-3 py-1.5 text-xs font-nunito focus:outline-none"
                            style={{ borderColor: '#e0e0e0', color: '#555' }}
                          >
                            <option>Action Needed</option>
                            <option>In Progress</option>
                            <option>Done</option>
                          </select>
                        </div>
                      ) : (
                        <>
                          <div
                            className="font-playfair font-bold leading-snug"
                            style={{ fontSize: '20px', color: 'var(--charcoal)', marginBottom: '4px' }}
                          >
                            {item.hasCheckInLink ? (
                              <>
                                Prepare documents for{' '}
                                <button
                                  onClick={() => setModalOpen(true)}
                                  className="font-playfair font-bold"
                                  style={{
                                    color:              '#F4C430',
                                    textDecorationLine:  'underline',
                                    textDecorationColor: '#F4C430',
                                    background:     'none',
                                    border:         'none',
                                    cursor:         'pointer',
                                    fontSize:       'inherit',
                                    fontFamily:     'inherit',
                                    padding:        0,
                                  }}
                                >
                                  online check-in
                                </button>
                              </>
                            ) : (
                              item.title
                            )}
                          </div>
                          <div
                            className="font-nunito"
                            style={{ fontSize: '14px', color: '#999', lineHeight: 1.5 }}
                          >
                            {item.detail}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Status pill */}
                    {!editing && (
                      <span
                        className="flex-shrink-0 font-nunito font-bold text-xs px-3 py-1 rounded-full"
                        style={{
                          background: statusStyle.bg,
                          color:      statusStyle.color,
                          border:     statusStyle.solid ? 'none' : `1px solid ${statusStyle.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.status === 'Done' ? 'Done ✓' : item.status}
                      </span>
                    )}
                  </div>

                  {/* Hairline divider */}
                  {!isLast && (
                    <div style={{ height: '1.5px', background: '#E8E0D5', margin: '0 24px' }} />
                  )}
                </div>
              );
            })}

            {/* Admin edit controls */}
            {isAdmin && (
              <div
                className="px-7 py-4 border-t"
                style={{ borderColor: '#f0f0f0', background: '#fafafa' }}
              >
                {editing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={saveEdit}
                      className="font-nunito font-bold px-5 py-2 rounded-xl text-sm text-white"
                      style={{ background: 'var(--navy)' }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="font-nunito font-semibold px-5 py-2 rounded-xl text-sm border"
                      style={{ borderColor: '#ddd', color: '#888' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startEdit}
                    className="font-nunito font-bold px-5 py-2 rounded-xl text-sm border-2 transition-all hover:shadow-md"
                    style={{ borderColor: 'var(--gold)', color: 'var(--navy)', background: 'var(--gold)' + '15' }}
                  >
                    ✏️ Edit Kristen's Top 3
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Check-In Modal */}
      {modalOpen && <CheckInModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
