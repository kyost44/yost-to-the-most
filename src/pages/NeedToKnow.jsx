import { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

// ── Static Data ───────────────────────────────────────────────────────────────

const STORAGE_KEY_NTK   = 'apd_ntk_custom';
const STORAGE_KEY_TIPS  = 'apd_packing_tips_custom';

const DEFAULT_NTK = [
  {
    id: 'ntk_checkin',
    icon: '🔑',
    iconBg: '#FFE8E8',
    iconColor: '#FF6B6B',
    title: 'Online Check-In opens midnight EST — June 23, 2026',
    body: 'This is your most time-sensitive task. Log in to disneycruise.com at midnight EST on June 23. Have ready: passport photo, headshot (plain background), pre/post hotel info, flight info, credit card, and emergency contact. Earlier check-in = earlier Port Arrival Time = earlier boarding. Also book Royal Gathering and specialty dining (Palo / Enchanté) the same day.',
    priority: 'urgent',
    due: 'June 23, 2026',
  },
  {
    id: 'ntk_nursery',
    icon: '👶',
    iconBg: '#E8F4FF',
    iconColor: '#2E86C1',
    title: "Book Casper's Nursery by May 9, 2026",
    body: "It's a Small World Nursery (ages 6 months–3 years) has limited spots. Book as soon as the window opens — May 9. This is a paid babysitting service; without a reservation there may be no childcare available.",
    priority: 'urgent',
    due: 'May 9, 2026',
  },
  {
    id: 'ntk_passports',
    icon: '📘',
    iconBg: '#E8EEF8',
    iconColor: '#1B2A4A',
    title: 'Passports required — valid through Jan 27, 2027',
    body: 'Every traveler including children needs a valid passport for Nassau & Castaway Cay. Must be valid at least 6 months past the return date. Allow 8–12 weeks for standard processing if renewing.',
    priority: 'urgent',
    due: 'Apr 23, 2026',
  },
  {
    id: 'ntk_castaway',
    icon: '🏝️',
    iconBg: '#E0F5F5',
    iconColor: '#0E7C7B',
    title: 'Castaway Cay excursions sell out fast',
    body: 'Bike rentals, snorkeling gear, and the Castaway Cay 5K run sell out months in advance. Book through the DCL Navigator app or disneycruise.com as soon as excursions open.',
    priority: 'important',
    due: 'July 1, 2026',
  },
  {
    id: 'ntk_app',
    icon: '📱',
    iconBg: '#F0E8FF',
    iconColor: '#7B2FBE',
    title: 'Download the Navigator App before you leave home',
    body: "The Disney Cruise Line Navigator app is your onboard lifeline — daily schedule, menus, reservations, and group messaging. Add your reservation number now so you're ready on embarkation day.",
    priority: 'important',
    due: 'July 22, 2026',
  },
];

const DEFAULT_PACKING_TIPS = [
  { id: 'pt_1',  icon: '🍷',    tip: 'Alcohol must be in carry-on: 2 bottles of wine or a 6-pack of 12oz beers per adult. No spirits.' },
  { id: 'pt_2',  icon: '👙',    tip: 'Pack a bathing suit AND a dinner outfit in your carry-on — checked bags may not arrive before dinner on embarkation day.' },
  { id: 'pt_3',  icon: '🧲',    tip: 'Magnetic hooks for stateroom organization — cabin walls are metal. Bring 4–6.' },
  { id: 'pt_4',  icon: '🛒',    tip: 'Only sealed/packaged snacks are allowed onboard. Stock up at the Publix near Embassy Suites (12-min walk).' },
  { id: 'pt_5',  icon: '💊',    tip: 'Bring extra medications, diapers, and baby supplies — onboard prices are steep.' },
  { id: 'pt_6',  icon: '🥤',    tip: 'Pack reusable cups with lids and straws. Only paper straws available on the ship.' },
  { id: 'pt_7',  icon: '💵',    tip: 'Bring small bills for tipping port staff and shopping at local markets.' },
  { id: 'pt_8',  icon: '🪪',    tip: "Use a lanyard or magnetic wallet sleeve for your room keycard — it's your ID, room key, and charge card." },
  { id: 'pt_9',  icon: '🏨',    tip: "Keep your Embassy Suites hotel keycard — slide it in the room's card slot to activate lights." },
  { id: 'pt_10', icon: '🧼',    tip: 'Bring laundry detergent pods and small dish soap for the stateroom sink.' },
  { id: 'pt_11', icon: '🤿',    tip: 'Bring snorkel masks, swim goggles, and water shoes for Nassau and Castaway Cay.' },
  { id: 'pt_12', icon: '🧻',    tip: 'Use sanitizing wipes AND soap — hand sanitizer does NOT kill norovirus. Wash hands frequently.' },
  { id: 'pt_13', icon: '🏴‍☠️',  tip: 'Pirate Night is a great excuse to bring costumes or themed outfits for the whole family.' },
  { id: 'pt_14', icon: '🏖️',   tip: 'Pack a beach bag for pool and island days.' },
  { id: 'pt_15', icon: '🔌',    tip: 'No surge protectors or extension cords allowed. Octopus/multi-outlet adapters are OK.' },
  { id: 'pt_16', icon: '👟',    tip: "Over-the-door shoe organizers work great for kids' items, hung via magnetic hooks." },
  { id: 'pt_17', icon: '😴',    tip: 'Bring a white noise machine — cabin hallways can be noisy.' },
  { id: 'pt_18', icon: '🤐',    tip: 'Zip-lock bags are great for bringing snacks back to your room from the buffet.' },
  { id: 'pt_19', icon: '💰',    tip: 'Zip-lock bags also protect electronics and valuables on water excursion days.' },
];

const SPARKLES = [
  { top: '12%', left: '8%',  size: '22px', opacity: 0.28 },
  { top: '25%', left: '72%', size: '18px', opacity: 0.22 },
  { top: '55%', left: '15%', size: '16px', opacity: 0.20 },
  { top: '70%', left: '85%', size: '24px', opacity: 0.30 },
  { top: '40%', left: '55%', size: '14px', opacity: 0.18 },
  { top: '80%', left: '42%', size: '20px', opacity: 0.25 },
  { top: '10%', left: '90%', size: '16px', opacity: 0.20 },
  { top: '60%', left: '62%', size: '12px', opacity: 0.15 },
];

const ACCORDION_BG = {
  packing:    '#FFF0EE',
  app:        '#F3F0FF',
  dining:     '#FFFBF0',
  gratuities: '#F0FFF4',
};

const TIPPING_ROWS = [
  { role: 'Stateroom Host',  amount: '~$4.50 per night / per guest' },
  { role: 'Dining Server',   amount: '~$4.50 per night / per guest' },
  { role: 'Assistant Server',amount: '~$3.25 per night / per guest' },
  { role: 'Head Server',     amount: '~$1.00 per night / per guest' },
];

// ── localStorage helpers ──────────────────────────────────────────────────────

function loadLocal(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function saveLocal(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ── Accordion Content ─────────────────────────────────────────────────────────

function PackingContent({ isAdmin }) {
  const [tips, setTips]         = useState(() => loadLocal(STORAGE_KEY_TIPS, DEFAULT_PACKING_TIPS));
  const [showAddForm, setShowAdd] = useState(false);
  const [newIcon, setNewIcon]   = useState('');
  const [newTip, setNewTip]     = useState('');

  function deleteTip(id) {
    const next = tips.filter(t => t.id !== id);
    setTips(next); saveLocal(STORAGE_KEY_TIPS, next);
  }
  function addTip() {
    if (!newTip.trim()) return;
    const next = [...tips, { id: `pt_${Date.now()}`, icon: newIcon || '✦', tip: newTip.trim() }];
    setTips(next); saveLocal(STORAGE_KEY_TIPS, next);
    setNewIcon(''); setNewTip(''); setShowAdd(false);
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {tips.map(t => (
          <div key={t.id} style={{
            background: 'white', borderRadius: '14px', padding: '20px 24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'relative',
          }}>
            {isAdmin && (
              <button
                onClick={() => deleteTip(t.id)}
                style={{
                  position: 'absolute', top: '10px', right: '12px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '14px', color: '#ccc', lineHeight: 1,
                }}
              >🗑️</button>
            )}
            <div style={{ fontSize: '28px', marginBottom: '10px', lineHeight: 1 }}>{t.icon}</div>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#2C2C2C', lineHeight: 1.6, margin: 0 }}>
              {t.tip}
            </p>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div style={{ marginTop: '16px' }}>
          {!showAddForm ? (
            <button
              onClick={() => setShowAdd(true)}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                border: '2px dashed var(--gold)', background: 'transparent',
                color: 'var(--navy)', fontFamily: 'Nunito, sans-serif',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              }}
            >
              + Add Tip
            </button>
          ) : (
            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text" value={newIcon} onChange={e => setNewIcon(e.target.value)}
                  placeholder="Emoji"
                  style={{ width: '72px', border: '1px solid #ddd', borderRadius: '8px', padding: '8px 10px', fontFamily: 'Nunito, sans-serif', fontSize: '14px' }}
                />
                <textarea
                  value={newTip} onChange={e => setNewTip(e.target.value)}
                  placeholder="Tip text..."
                  rows={2}
                  style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '8px 10px', fontFamily: 'Nunito, sans-serif', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={addTip} style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', borderRadius: '8px', padding: '8px 18px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#888', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const PILLS = ['Daily Schedule', 'Restaurant Menus', 'Onboard Group Chat', 'Show Times', 'Ship Map & Deck Plans', 'Port Excursion Details'];
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>
        Disney Cruise Line Navigator
      </div>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#444', lineHeight: 1.7, marginBottom: '20px' }}>
        Download before you leave home and add your reservation number. Works without ship Wi-Fi for group messaging, daily schedules, menus, and reservations.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {PILLS.map(p => (
          <span key={p} style={{
            fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600,
            background: 'var(--navy)', color: 'white',
            padding: '8px 16px', borderRadius: '20px',
          }}>{p}</span>
        ))}
      </div>
      <div style={{
        borderLeft: '4px solid var(--gold)', background: '#FFFBF0',
        borderRadius: '0 10px 10px 0', padding: '14px 18px',
        fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#2C2C2C',
      }}>
        📲 <strong>Action:</strong> Download now and add your reservation # before July 22
      </div>
    </div>
  );
}

function DiningContent() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Rotational */}
      <div style={{ borderLeft: '4px solid var(--navy)', background: 'white', borderRadius: '0 14px 14px 0', padding: '20px 24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '10px' }}>
          Rotational Dining (Included)
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#444', lineHeight: 1.6, marginBottom: '14px' }}>
          Each night you dine at a different themed restaurant and your servers rotate with you. Make sure all family reservations are linked so your group sits together.
        </p>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
          Your 3 restaurants on Destiny:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['1923', 'Worlds of Marvel', 'Pride Lands: Feast of the Lion King'].map(r => (
            <span key={r} style={{ background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', padding: '4px 14px', borderRadius: '99px' }}>
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Specialty */}
      <div style={{ borderLeft: '4px solid var(--coral)', background: 'white', borderRadius: '0 14px 14px 0', padding: '20px 24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 700, color: 'var(--coral)', marginBottom: '10px' }}>
          Specialty Dining (Extra Cost)
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#444', lineHeight: 1.6, marginBottom: '8px' }}>
          <strong>Palo Steakhouse</strong> — adults-only Italian-meets-steakhouse. Elegant, intimate dining experience at sea.
        </p>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#444', lineHeight: 1.6, marginBottom: '16px' }}>
          <strong>Enchanté</strong> — gourmet French fine dining, adults only. Also offers a champagne brunch option.
        </p>
        <div style={{ borderLeft: '4px solid var(--gold)', background: '#FFFBF0', borderRadius: '0 10px 10px 0', padding: '12px 16px', fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#2C2C2C' }}>
          Book both immediately on June 23 when Online Check-In opens — they fill the same day
        </div>
      </div>
    </div>
  );
}

function TippingContent() {
  return (
    <div style={{ padding: '24px' }}>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#888', lineHeight: 1.6, marginBottom: '20px' }}>
        DCL typically pre-charges gratuities to your onboard account. You can adjust amounts at Guest Services.
      </p>
      <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        {TIPPING_ROWS.map((r, i) => (
          <div key={r.role} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            background: i % 2 === 0 ? 'white' : '#FAFAF8',
            borderBottom: i < TIPPING_ROWS.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>
              {r.role}
            </span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 700, color: 'var(--gold)' }}>
              {r.amount}
            </span>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#bbb', fontStyle: 'italic', marginTop: '12px' }}>
        Amounts may vary. Check your onboard account via the Navigator app or at Guest Services.
      </p>
    </div>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────

const ACCORDION_SECTIONS = [
  { id: 'packing',    icon: '🎒', title: 'Packing Tips',               teaser: '19 must-know tips for packing smart' },
  { id: 'app',        icon: '📱', title: 'Must-Download: Navigator App', teaser: 'Your onboard lifeline — download before you leave' },
  { id: 'dining',     icon: '🍽️', title: 'Dining Tips',                 teaser: 'Rotational dining, specialty restaurants & what to book' },
  { id: 'gratuities', icon: '💰', title: 'Tipping Guide',               teaser: "What's pre-charged and suggested amounts per role" },
];

function AccordionSection({ section, open, onToggle, isAdmin }) {
  const bg = ACCORDION_BG[section.id] || '#f8f8f8';
  return (
    <div style={{ borderRadius: open ? '12px 12px 0 0' : '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', minHeight: '72px', display: 'flex', alignItems: 'center',
          gap: '16px', padding: '0 24px',
          background: bg, border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '32px', flexShrink: 0, lineHeight: 1 }}>{section.icon}</span>
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: 'var(--navy)', flex: 1 }}>
          {section.title}
        </span>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontStyle: 'italic', color: '#999', marginRight: '12px', flexShrink: 0, display: 'none' }}
              className="sm-show">
          {section.teaser}
        </span>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#aaa', flexShrink: 0, transition: 'transform 0.3s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </button>

      <div style={{
        maxHeight: open ? '2000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
        background: 'white',
        borderRadius: '0 0 12px 12px',
        boxShadow: open ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
      }}>
        {section.id === 'packing'    && <PackingContent isAdmin={isAdmin} />}
        {section.id === 'app'        && <AppContent />}
        {section.id === 'dining'     && <DiningContent />}
        {section.id === 'gratuities' && <TippingContent />}
      </div>
    </div>
  );
}

// ── Urgent Reminder Card ──────────────────────────────────────────────────────

function ReminderCard({ item, isAdmin, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState({ title: item.title, body: item.body, due: item.due, priority: item.priority });

  function handleSave() {
    onSave(item.id, draft);
    setEditing(false);
  }

  return (
    <div style={{
      background: 'white', borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '24px 28px',
      display: 'flex', alignItems: 'flex-start', gap: '20px',
      position: 'relative',
    }}>
      {/* Emoji circle */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: item.iconBg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px',
      }}>
        {item.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
              style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px 12px', fontFamily: 'Nunito, sans-serif', fontSize: '15px', width: '100%' }}
            />
            <textarea
              value={draft.body} onChange={e => setDraft(p => ({ ...p, body: e.target.value }))}
              rows={3}
              style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px 12px', fontFamily: 'Nunito, sans-serif', fontSize: '14px', resize: 'vertical', width: '100%' }}
            />
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={draft.due} onChange={e => setDraft(p => ({ ...p, due: e.target.value }))}
                placeholder="Due date"
                style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px 12px', fontFamily: 'Nunito, sans-serif', fontSize: '14px', width: '150px' }}
              />
              <select
                value={draft.priority} onChange={e => setDraft(p => ({ ...p, priority: e.target.value }))}
                style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px 12px', fontFamily: 'Nunito, sans-serif', fontSize: '14px' }}
              >
                <option value="urgent">URGENT</option>
                <option value="important">IMPORTANT</option>
                <option value="">None</option>
              </select>
              <button onClick={handleSave} style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', borderRadius: '8px', padding: '8px 18px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Save</button>
              <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#888', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {/* Title row + badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.3, flex: 1 }}>
                {item.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {item.priority === 'urgent' && (
                  <span style={{ background: 'var(--coral)', color: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px' }}>
                    URGENT
                  </span>
                )}
                {item.priority === 'important' && (
                  <span style={{ background: '#F59E0B', color: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px' }}>
                    IMPORTANT
                  </span>
                )}
                {isAdmin && (
                  <button onClick={() => setEditing(true)} style={{ background: 'none', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '4px 10px', fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#888', cursor: 'pointer' }}>✏️ Edit</button>
                )}
              </div>
            </div>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#444', lineHeight: 1.6, margin: '0 0 10px' }}>
              {item.body}
            </p>
            {item.due && (
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--coral)' }}>
                📅 Due: {item.due}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NeedToKnow() {
  const { isAdmin } = useAdmin();
  const [openSection, setOpenSection] = useState(null);
  const [reminders, setReminders] = useState(() => loadLocal(STORAGE_KEY_NTK, DEFAULT_NTK));

  function toggle(id) { setOpenSection(prev => prev === id ? null : id); }

  function saveReminder(id, updates) {
    const next = reminders.map(r => r.id === id ? { ...r, ...updates } : r);
    setReminders(next);
    saveLocal(STORAGE_KEY_NTK, next);
  }

  return (
    <div style={{ background: '#F8F6F2', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #F5EFD8 0%, #FFF8F0 100%)',
        padding: '56px 0',
        overflow: 'hidden',
      }}>
        {/* Sparkles */}
        {SPARKLES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: s.top, left: s.left,
            fontSize: s.size, opacity: s.opacity,
            userSelect: 'none', pointerEvents: 'none',
          }}>✦</div>
        ))}

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {/* Left content */}
          <div style={{ flex: '0 0 60%', minWidth: '280px' }}>
            <div style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700,
              color: 'var(--coral)', letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              ✨ FROM TINKERBELL'S NOTEBOOK
            </div>
            <h1 style={{
              fontFamily: '"Dancing Script", cursive',
              fontSize: '52px', fontWeight: 700,
              color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.1,
            }}>
              Captain's Orders
            </h1>
            <div style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '20px', fontStyle: 'italic',
              color: '#B8960C', marginBottom: '20px', lineHeight: 1.3,
            }}>
              Everything you need to know before you set sail
            </div>
            <p style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '15px',
              color: '#2C2C2C', lineHeight: 1.7,
              maxWidth: '480px', margin: 0,
            }}>
              Consider this your insider guide to the Disney Destiny — the tips, the tricks, and the must-knows that will make your cruise smoother, smarter, and more magical. Read everything. Thank us later.
            </p>
          </div>

          {/* Right content */}
          <div style={{ flex: '0 0 35%', minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ fontSize: '80px', lineHeight: 1, color: 'var(--gold)' }}>🪄</div>
            <div style={{
              fontFamily: '"Dancing Script", cursive',
              fontSize: '18px', fontStyle: 'italic',
              color: '#B8960C',
            }}>
              — Tinkerbell's Tips
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <div style={{ width: '60%', height: '1px', background: '#F4C430' }} />
        </div>
      </div>

      {/* ── Critical Reminders ── */}
      <div style={{ background: '#FBF7F0', padding: '48px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: 'var(--coral)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
              ⚠️ BEFORE YOU LEAVE HOME
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px' }}>
              Critical Reminders
            </h2>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#999', margin: 0 }}>
              These are time-sensitive — don't wait on any of them
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {reminders.map(item => (
              <ReminderCard key={item.id} item={item} isAdmin={isAdmin} onSave={saveReminder} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Trip Intelligence Accordions ── */}
      <div style={{ background: '#F8F6F2', padding: '48px 0 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
              🧚 TINKERBELL'S INSIDER GUIDE
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px' }}>
              Trip Intelligence
            </h2>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#999', margin: 0 }}>
              Tap any section to reveal what you need to know
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ACCORDION_SECTIONS.map(section => (
              <AccordionSection
                key={section.id}
                section={section}
                open={openSection === section.id}
                onToggle={() => toggle(section.id)}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
