import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAdmin } from '../contexts/AdminContext';
import CharacterPickerModal from '../components/CharacterPickerModal';
import { getShirtData, updatePersonShirt } from '../utils/shirtData';

// ── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('TShirt page crash:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#333' }}>
          <h2 style={{ color: 'red' }}>Character picker crashed</h2>
          <pre style={{ color: 'red', whiteSpace: 'pre-wrap', fontSize: '13px' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadLocal(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function saveLocal(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function isLightColor(hex) {
  if (!hex || hex.length < 7) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SHIRT_COLORS = [
  { label: 'White',                value: '#FFFFFF' },
  { label: 'Black',                value: '#1C1C1C' },
  { label: 'Athletic Heather',     value: '#A8A9AD' },
  { label: 'Columbia Blue Heather',value: '#9BB7D4' },
  { label: 'Light Pink',           value: '#FFB6C1' },
  { label: 'Dark Gray Heather',    value: '#4A4A4A' },
  { label: 'Dark Lavender',        value: '#967BB6' },
  { label: 'Navy',                 value: '#1B2A4A' },
  { label: 'Dusty Blue',           value: '#7BA7BC' },
  { label: 'Heather Mauve',        value: '#C9A0A0' },
  { label: 'Natural',              value: '#F5F0E1' },
  { label: 'Mint',                 value: '#98E4D1' },
  { label: 'Red',                  value: '#CC2936' },
  { label: 'Teal',                 value: '#008080' },
  { label: 'Light Blue',           value: '#ADD8E6' },
  { label: 'Team Purple',          value: '#5B2D8E' },
  { label: 'Heather Olive',        value: '#8B8B5A' },
  { label: 'Orange Classic',       value: '#FF6600' },
  { label: 'Kelly Green',          value: '#4CBB17' },
  { label: 'Yellow',               value: '#FFD700' },
  { label: 'Charity Pink',         value: '#FF69B4' },
];

const SIZES = [
  '2T','3T','4T','Kids XS','Kids S','Kids M','Kids L','Kids XL',
  'Adult XS','Adult S','Adult M','Adult L','Adult XL','Adult 2XL','Adult 3XL',
];

const CHARACTERS = {
  'Princesses': [
    { emoji: '👸', name: 'Cinderella' }, { emoji: '🌹', name: 'Belle' },
    { emoji: '🧜', name: 'Ariel' },      { emoji: '🌙', name: 'Jasmine' },
    { emoji: '❄️', name: 'Elsa' },       { emoji: '☃️', name: 'Anna' },
    { emoji: '🌊', name: 'Moana' },      { emoji: '🌱', name: 'Tiana' },
    { emoji: '🌸', name: 'Mulan' },      { emoji: '🌹', name: 'Aurora' },
    { emoji: '🍎', name: 'Snow White' }, { emoji: '🦁', name: 'Nala' },
  ],
  'Mickey & Friends': [
    { emoji: '🐭', name: 'Mickey' },   { emoji: '🎀', name: 'Minnie' },
    { emoji: '🐶', name: 'Pluto' },    { emoji: '🐾', name: 'Goofy' },
    { emoji: '🦆', name: 'Donald' },   { emoji: '🎀', name: 'Daisy' },
    { emoji: '🐻', name: 'Pooh' },     { emoji: '🐯', name: 'Tigger' },
    { emoji: '🐰', name: 'Thumper' },  { emoji: '🍯', name: 'Piglet' },
  ],
  'Villains': [
    { emoji: '🐙', name: 'Ursula' },     { emoji: '🍎', name: 'Evil Queen' },
    { emoji: '🐍', name: 'Maleficent' }, { emoji: '🃏', name: 'Queen of Hearts' },
    { emoji: '🦁', name: 'Scar' },       { emoji: '🧙', name: 'Jafar' },
    { emoji: '👻', name: 'Hades' },      { emoji: '🧟', name: 'Dr. Facilier' },
    { emoji: '🐊', name: 'Capt. Hook' }, { emoji: '🐕', name: 'Cruella' },
  ],
  'Pixar': [
    { emoji: '🤖', name: 'WALL-E' },         { emoji: '🐟', name: 'Nemo' },
    { emoji: '🧸', name: 'Woody' },          { emoji: '🚀', name: 'Buzz Lightyear' },
    { emoji: '👹', name: 'Sulley' },         { emoji: '🔵', name: 'Mike Wazowski' },
    { emoji: '🏎️', name: 'Lightning McQueen' }, { emoji: '🐀', name: 'Remy' },
    { emoji: '🐻', name: 'Merida' },         { emoji: '🏋️', name: 'Mr. Incredible' },
    { emoji: '💙', name: 'Sadness' },        { emoji: '😁', name: 'Joy' },
  ],
  'Adventure': [
    { emoji: '🧑‍✈️', name: 'Peter Pan' }, { emoji: '🧚', name: 'Tinker Bell' },
    { emoji: '🐘', name: 'Dumbo' },       { emoji: '🐻', name: 'Baloo' },
    { emoji: '🦅', name: 'Simba' },       { emoji: '🍗', name: 'Chip' },
    { emoji: '🌰', name: 'Dale' },        { emoji: '⚓', name: 'Capt. Jack' },
    { emoji: '🗿', name: 'Maui' },        { emoji: '🌺', name: 'Lilo' },
    { emoji: '👽', name: 'Stitch' },      { emoji: '🦎', name: 'Pascal' },
  ],
};

const DEFAULT_TAGLINES = [
  { id: 't1', text: 'Yost to the Most 2026' },
  { id: 't2', text: 'Disney Destiny 2026' },
  { id: 't3', text: 'Yosties Cruise Crew 2026' },
];

// (CharacterPickerModal is imported from src/components/CharacterPickerModal.jsx)

// ── Voter identity constants ──────────────────────────────────────────────────
const VOTER_FAMILIES = [
  { label: 'K-Yosties',        members: ['Kyle','Kristen','Brielle','Casper'] },
  { label: 'Beal Yosties',     members: ['Jenni','Nat','Ridge','Foxton','Walker'] },
  { label: 'Zihlmann Yosties', members: ['Julie','Markus','Cohen','Oskar','Skye'] },
  { label: 'Big Yosties',      members: ['Tim','Laura'] },
];

// ── Group Decisions ───────────────────────────────────────────────────────────

function GroupDecisions({ isAdmin }) {
  const [taglines,      setTaglines]      = useState(() => loadLocal('apd_taglines', DEFAULT_TAGLINES));
  // votes_v2: { [taglineId]: [name, name, ...] }
  const [votes,         setVotes]         = useState(() => loadLocal('apd_tagline_votes_v2', {}));
  const [official,      setOfficial]      = useState(() => loadLocal('apd_tagline_official', null));
  const [customOpen,    setCustomOpen]    = useState(false);
  const [customText,    setCustomText]    = useState('');
  const [resetConfirm,  setResetConfirm]  = useState(false);
  // Voter identity
  const [voterFamily,   setVoterFamily]   = useState(() => loadLocal('apd_voter_family', ''));
  const [voterName,     setVoterName]     = useState(() => loadLocal('apd_voter_name', ''));
  // Year card
  const [editYear,  setEditYear]  = useState(false);
  const [year,      setYear]      = useState(() => loadLocal('apd_cruise_year', '2026'));
  const [yearInput, setYearInput] = useState(year);

  const familyMembers = VOTER_FAMILIES.find(f => f.label === voterFamily)?.members || [];
  const canVote = voterFamily && voterName;

  // Find which tagline the current voter has voted for
  const myVotedId = taglines.find(t => (votes[t.id] || []).includes(voterName))?.id || null;

  function saveVoterIdentity(fam, name) {
    saveLocal('apd_voter_family', fam);
    saveLocal('apd_voter_name', name);
  }

  function handleFamilyChange(fam) {
    setVoterFamily(fam);
    setVoterName('');
    saveVoterIdentity(fam, '');
  }

  function handleNameChange(name) {
    setVoterName(name);
    saveVoterIdentity(voterFamily, name);
  }

  function handleVote(id) {
    if (!canVote || official) return;
    setVotes(prev => {
      const next = { ...prev };
      // Remove from previous vote
      if (myVotedId && myVotedId !== id) {
        next[myVotedId] = (next[myVotedId] || []).filter(n => n !== voterName);
      }
      // Toggle on clicked option
      const current = next[id] || [];
      if (current.includes(voterName)) {
        next[id] = current.filter(n => n !== voterName);
      } else {
        next[id] = [...current, voterName];
      }
      saveLocal('apd_tagline_votes_v2', next);
      return next;
    });
  }

  function handleAddCustom() {
    if (!customText.trim()) return;
    const id   = 'tc_' + Date.now();
    const next = [...taglines, { id, text: customText.trim() }];
    setTaglines(next);
    saveLocal('apd_taglines', next);
    // Auto-vote for suggester
    if (canVote) {
      setVotes(prev => {
        const updated = { ...prev };
        if (myVotedId) updated[myVotedId] = (updated[myVotedId] || []).filter(n => n !== voterName);
        updated[id] = [voterName];
        saveLocal('apd_tagline_votes_v2', updated);
        return updated;
      });
    }
    setCustomText('');
    setCustomOpen(false);
  }

  function handlePin(id) {
    setOfficial(id);
    saveLocal('apd_tagline_official', id);
  }

  function handleUnpin() {
    setOfficial(null);
    saveLocal('apd_tagline_official', null);
  }

  function handleReset() {
    setVotes({});
    saveLocal('apd_tagline_votes_v2', {});
    setResetConfirm(false);
  }

  function handleSaveYear() {
    setYear(yearInput);
    saveLocal('apd_cruise_year', yearInput);
    setEditYear(false);
  }

  const officialTagline = taglines.find(t => t.id === official);

  return (
    <div style={{ background: '#FBF7F0', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '28px', color: '#1B2A4A', margin: '0 0 6px' }}>
            🎨 Group Style Decisions
          </h2>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#888', margin: 0 }}>
            These apply to everyone's shirt — decide together before ordering
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

          {/* Card 1: Tagline voting */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', borderLeft: '4px solid #1B2A4A', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#FF6B6B', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '14px' }}>
              SHIRT TAGLINE
            </div>

            {/* Identity selection */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '18px', color: '#1B2A4A', marginBottom: '10px' }}>
                Who's voting?
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  value={voterFamily}
                  onChange={e => handleFamilyChange(e.target.value)}
                  style={{ flex: 1, minWidth: '130px', fontFamily: 'Nunito, sans-serif', fontSize: '14px', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #1B2A4A', outline: 'none', background: 'white', color: voterFamily ? '#1B2A4A' : '#aaa', cursor: 'pointer' }}
                >
                  <option value="">Select your family</option>
                  {VOTER_FAMILIES.map(f => <option key={f.label} value={f.label}>{f.label}</option>)}
                </select>
                <select
                  value={voterName}
                  onChange={e => handleNameChange(e.target.value)}
                  disabled={!voterFamily}
                  style={{ flex: 1, minWidth: '120px', fontFamily: 'Nunito, sans-serif', fontSize: '14px', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #1B2A4A', outline: 'none', background: voterFamily ? 'white' : '#f8f8f8', color: voterName ? '#1B2A4A' : '#aaa', cursor: voterFamily ? 'pointer' : 'not-allowed', opacity: voterFamily ? 1 : 0.6 }}
                >
                  <option value="">Select your name</option>
                  {familyMembers.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* Official banner */}
            {official && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px', padding: '10px 14px', background: 'rgba(244,196,48,0.12)', borderRadius: '10px', border: '1.5px solid #F4C430' }}>
                <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', color: '#1B2A4A', fontWeight: 700 }}>
                  👑 {officialTagline?.text}
                </span>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, background: '#F4C430', color: '#1B2A4A', padding: '3px 10px', borderRadius: '20px' }}>
                  ✓ Official Choice
                </span>
              </div>
            )}

            {/* Voting rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: !canVote && !official ? 0.6 : 1 }}>
              {taglines.map(t => {
                const voters     = votes[t.id] || [];
                const count      = voters.length;
                const isOfficial = official === t.id;
                const myVote     = voterName && voters.includes(voterName);
                const grayed     = official && !isOfficial;
                return (
                  <div
                    key={t.id}
                    onClick={() => !grayed && handleVote(t.id)}
                    title={!canVote ? 'Select your name above to vote' : undefined}
                    style={{
                      padding: '12px 14px', borderRadius: '10px', gap: '8px',
                      background: myVote ? '#FFFBF0' : grayed ? '#f5f5f5' : '#f8f9fc',
                      borderLeft: myVote ? '4px solid #F4C430' : '4px solid transparent',
                      border: myVote ? '1px solid #F4C430' : '1px solid transparent',
                      opacity: grayed ? 0.45 : 1,
                      cursor: grayed || official ? 'default' : canVote ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: voters.length > 0 ? '6px' : 0 }}>
                      <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '15px', fontWeight: 700, color: '#1B2A4A', flex: 1, lineHeight: 1.3 }}>
                        {isOfficial && '👑 '}{t.text}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        {myVote && (
                          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: '#C9A227' }}>✓ Your Vote</span>
                        )}
                        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, padding: '3px 11px', borderRadius: '20px', background: '#1B2A4A', color: 'white', minWidth: '28px', textAlign: 'center' }}>
                          {count}
                        </span>
                        {isAdmin && !official && (
                          <button
                            onClick={e => { e.stopPropagation(); handlePin(t.id); }}
                            style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: '#F4C430', color: '#1B2A4A' }}
                          >
                            Pin 👑
                          </button>
                        )}
                        {isAdmin && isOfficial && (
                          <button
                            onClick={e => { e.stopPropagation(); handleUnpin(); }}
                            style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Voter name chips */}
                    {voters.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {voters.map(v => (
                          <span key={v} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: '#FF6B6B22', color: '#c0392b' }}>
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Suggest another */}
              {!official && (
                customOpen ? (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <input
                      value={customText}
                      onChange={e => setCustomText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
                      placeholder="Your suggestion..."
                      autoFocus
                      style={{ flex: 1, fontFamily: 'Nunito, sans-serif', fontSize: '13px', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e0e0e0', outline: 'none' }}
                    />
                    <button onClick={handleAddCustom} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, padding: '8px 14px', borderRadius: '8px', background: '#1B2A4A', color: '#F4C430', border: 'none', cursor: 'pointer' }}>
                      Add
                    </button>
                    <button onClick={() => { setCustomOpen(false); setCustomText(''); }} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', padding: '8px 10px', borderRadius: '8px', background: '#f0f0f0', color: '#888', border: 'none', cursor: 'pointer' }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setCustomOpen(true)} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, padding: '9px 14px', borderRadius: '10px', border: '1.5px dashed #ccc', background: 'transparent', color: '#999', cursor: 'pointer', textAlign: 'left' }}>
                    + Suggest Another
                  </button>
                )
              )}
            </div>

            {/* Admin reset */}
            {isAdmin && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f0f0f0' }}>
                {resetConfirm ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#888' }}>Reset all votes? This cannot be undone.</span>
                    <button onClick={handleReset} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', background: '#FF6B6B', color: 'white', border: 'none', cursor: 'pointer' }}>Confirm</button>
                    <button onClick={() => setResetConfirm(false)} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: '#f0f0f0', color: '#888', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setResetConfirm(true)} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '20px', background: 'transparent', color: '#FF6B6B', border: '1.5px solid #FF6B6B', cursor: 'pointer' }}>
                    Reset All Votes
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Cruise Year */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', borderLeft: '4px solid #1B2A4A', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#FF6B6B', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '16px' }}>
              CRUISE YEAR
            </div>
            <div style={{ textAlign: 'center' }}>
              {editYear && isAdmin ? (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
                  <input
                    value={yearInput}
                    onChange={e => setYearInput(e.target.value)}
                    style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '32px', color: '#F4C430', textAlign: 'center', width: '120px', border: '2px solid #F4C430', borderRadius: '8px', padding: '4px 8px', outline: 'none' }}
                  />
                  <button onClick={handleSaveYear} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, padding: '8px 14px', borderRadius: '8px', background: '#F4C430', color: '#1B2A4A', border: 'none', cursor: 'pointer', alignSelf: 'center' }}>
                    Save
                  </button>
                </div>
              ) : (
                <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '48px', color: '#F4C430', lineHeight: 1, marginBottom: '8px' }}>
                  {year}
                </div>
              )}
              <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#bbb', margin: '0 0 16px' }}>
                Pre-set for Disney Destiny 2026
              </p>
              {isAdmin && !editYear && (
                <button onClick={() => { setYearInput(year); setEditYear(true); }} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, padding: '5px 14px', borderRadius: '20px', background: 'transparent', color: '#1B2A4A', border: '1px solid #ddd', cursor: 'pointer' }}>
                  ✏️ Edit Year
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Polaroid Card ─────────────────────────────────────────────────────────────

function PolaroidCard({ name, familyId, familyColor, familyName, index, shirtEntry }) {
  const [pickerOpen,    setPickerOpen]    = useState(false);
  const [hovered,       setHovered]       = useState(false);
  const [hoveredSwatch, setHoveredSwatch] = useState(null);

  const charName    = shirtEntry?.character || null;
  const colorValue  = shirtEntry?.color     || null;
  const size        = shirtEntry?.size      || '';

  const previewBg = colorValue || '#dde3f0';
  const textOnBg  = isLightColor(previewBg) ? '#1C1C1C' : '#FFFFFF';
  const rotation  = index % 2 === 0 ? '-1.5deg' : '1.5deg';

  function handleColorPick(color) {
    updatePersonShirt(name, { color: color.value });
  }

  function handleCharConfirm(chosenName) {
    updatePersonShirt(name, { character: chosenName });
    setPickerOpen(false);
  }

  function handleSizeChange(val) {
    updatePersonShirt(name, { size: val });
  }

  return (
    <>
      <CharacterPickerModal
        isOpen={pickerOpen}
        personName={name}
        onConfirm={handleCharConfirm}
        onClose={() => setPickerOpen(false)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Polaroid frame */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: 'white',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transform: hovered ? 'rotate(0deg) translateY(-4px)' : `rotate(${rotation})`,
            transition: 'transform 0.2s ease',
            width: '160px',
            userSelect: 'none',
          }}
        >
          {/* Photo area */}
          <div style={{
            width: '160px', height: '140px',
            background: previewBg,
            borderRadius: '4px 4px 0 0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '4px', transition: 'background 0.2s ease', padding: '8px',
          }}>
            <span style={{ fontSize: '36px', lineHeight: 1 }}>👕</span>
            {charName ? (
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: textOnBg, textAlign: 'center', lineHeight: 1.2 }}>
                {charName}
              </span>
            ) : null}
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: textOnBg, opacity: charName ? 0.7 : 1 }}>
              {name}
            </span>
          </div>
          {/* Bottom strip */}
          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '13px', color: '#1B2A4A', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '78px' }}>
              {name}
            </span>
            <span style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontWeight: 700,
              padding: '2px 8px', borderRadius: '20px', flexShrink: 0,
              background: familyColor + '22', color: familyColor,
              border: `1px solid ${familyColor}44`,
            }}>
              {familyName.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Below polaroid */}
        <div style={{ width: '160px', marginTop: '14px' }}>

          {/* Size */}
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#aaa', marginBottom: '4px', textAlign: 'center' }}>
            Size
          </div>
          <select
            value={size}
            onChange={e => handleSizeChange(e.target.value)}
            style={{
              width: '100%', fontFamily: 'Nunito, sans-serif', fontSize: '14px',
              padding: '9px 10px', borderRadius: '8px',
              border: `2px solid ${familyColor}`,
              outline: 'none', background: 'white',
              color: size ? '#1B2A4A' : '#aaa',
              cursor: 'pointer',
            }}
          >
            <option value="">Select size…</option>
            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Status badge */}
          <div style={{ textAlign: 'center', marginTop: '6px', marginBottom: '12px' }}>
            <span style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700,
              padding: '4px 12px', borderRadius: '20px', display: 'inline-block',
              ...(size
                ? { background: '#d1fae5', color: '#065f46' }
                : { background: '#fef3c7', color: '#92400e' }),
            }}>
              {size ? '✅ Size Submitted' : '⏳ Awaiting Info'}
            </span>
          </div>

          {/* Color swatches */}
          <div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#aaa', marginBottom: '6px', textAlign: 'center' }}>
              Shirt Color
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', justifyItems: 'center' }}>
              {SHIRT_COLORS.map(color => {
                const isSel = colorValue === color.value;
                return (
                  <button
                    key={color.value}
                    onClick={() => handleColorPick(color)}
                    onMouseEnter={() => setHoveredSwatch(color.value)}
                    onMouseLeave={() => setHoveredSwatch(null)}
                    title={color.label}
                    style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: color.value,
                      border: isSel
                        ? '3px solid #F4C430'
                        : color.value === '#FFFFFF' ? '1.5px solid #ccc' : '1.5px solid transparent',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: hoveredSwatch === color.value ? 'scale(1.25)' : 'scale(1)',
                      transition: 'transform 0.12s ease',
                      outline: 'none', padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    {isSel && (
                      <span style={{ fontSize: '9px', color: isLightColor(color.value) ? '#333' : 'white', fontWeight: 'bold', lineHeight: 1 }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Character action */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            {charName ? (
              <button
                onClick={() => setPickerOpen(true)}
                style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#FF6B6B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Change Character
              </button>
            ) : (
              <div>
                <button
                  onClick={() => setPickerOpen(true)}
                  style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#FF6B6B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', display: 'block', margin: '0 auto 4px' }}
                >
                  Pick Character
                </button>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#bbb', display: 'block', lineHeight: 1.4 }}>
                  or pick one in{' '}
                  <a href="/my-yosties" style={{ color: '#F4C430', textDecoration: 'underline', fontWeight: 700 }}>My Yosties</a>
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// ── Order Progress ────────────────────────────────────────────────────────────

function OrderProgress({ families, shirtData }) {
  const total = families.reduce((s, f) => s + (f.memberNames?.length || 0), 0);
  const submitted = families.reduce((s, f) =>
    s + (f.memberNames || []).filter(n => shirtData[n]?.size).length, 0);
  const pct    = total > 0 ? (submitted / total) * 100 : 0;
  const allDone = submitted === total && total > 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '22px', color: '#1B2A4A', margin: '0 0 6px' }}>
        Order Readiness
      </h2>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#888', margin: '0 0 14px' }}>
        {allDone ? "🎉 Everyone's ready to order!" : `${submitted} of ${total} sizes submitted`}
      </p>
      <div style={{ background: '#1B2A4A', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: allDone ? '#6ee7b7' : '#F4C430',
          borderRadius: '8px', transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TShirtStudio() {
  const { families } = useData();
  const { isAdmin }  = useAdmin();

  const [shirtData, setShirtData] = useState(() => getShirtData());

  useEffect(() => {
    const handler = e => setShirtData(e.detail);
    window.addEventListener('shirtDataUpdated', handler);
    return () => window.removeEventListener('shirtDataUpdated', handler);
  }, []);

  useEffect(() => { document.title = "Suit Up — It's Cruise Time"; }, []);

  return (
    <>
      {/* ── HERO ── */}
      <div style={{
        background: '#1B2A4A', minHeight: '180px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        padding: '20px 24px 24px',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #FFD700 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#F4C430', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginBottom: '8px' }}>
            👕 YOST TO THE MOST · DISNEY DESTINY 2026
          </div>
          <h1 style={{ fontFamily: '"Dancing Script", cursive', fontSize: '44px', color: '#F4C430', fontWeight: 700, lineHeight: 1.1, margin: '0 0 10px' }}>
            Suit Up — It's Cruise Time
          </h1>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            Coordinate your Disney cruise shirts · Pick your character · Choose your color · Order together
          </p>
        </div>
      </div>

      {/* ── GROUP DECISIONS ── */}
      <GroupDecisions isAdmin={isAdmin} />

      {/* ── THE LINEUP ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 0' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '32px', color: '#1B2A4A', margin: '0 0 4px' }}>
          👕 The Lineup
        </h2>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#C9A227', margin: '0 0 40px' }}>
          Every Yostie · Pick your character from the Etsy sheet · Choose your color · Get ready to order
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>
          {families.map(family => {
            const color = family.light || '#1B2A4A';
            return (
              <div key={family.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px', color: '#1B2A4A', margin: 0 }}>
                    {family.name}
                  </h3>
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#aaa' }}>
                    {family.memberNames?.length} members
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '36px 16px',
                }}>
                  {(family.memberNames || []).map((name, i) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'center' }}>
                      <PolaroidCard
                        name={name}
                        familyId={family.id}
                        familyColor={color}
                        familyName={family.name}
                        index={i}
                        shirtEntry={shirtData[name] || {}}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ORDER PROGRESS ── */}
      <OrderProgress families={families} shirtData={shirtData} />

      {/* ── ETSY SECTION ── */}
      <div style={{ padding: '0 24px 56px' }}>
        <div style={{
          background: '#1B2A4A', borderRadius: '20px', padding: '48px 32px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
          maxWidth: '1200px', margin: '0 auto',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05,
            backgroundImage: 'radial-gradient(circle, #FFD700 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👕</div>
            <h2 style={{ fontFamily: '"Dancing Script", cursive', fontSize: '42px', color: '#F4C430', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.1 }}>
              Ready to Order?
            </h2>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.85)', maxWidth: '560px', margin: '0 auto 20px', lineHeight: 1.65 }}>
              Once everyone's sizes and characters are confirmed, head to Etsy to place your order. Order by June 15, 2026 to allow time for shipping!
            </p>
            <div style={{ marginBottom: '28px' }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, padding: '8px 22px', borderRadius: '20px', background: '#FF6B6B', color: 'white', display: 'inline-block' }}>
                📅 Order Deadline: June 15, 2026
              </span>
            </div>
            <a
              href="https://www.etsy.com/listing/4402294930/disney-cruise-shirts-disney-cruise-2026"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                fontFamily: 'Nunito, sans-serif', fontSize: '18px', fontWeight: 700,
                padding: '16px 40px', borderRadius: '12px',
                background: '#F4C430', color: '#1B2A4A',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              🛍️ Order Your Shirts on Etsy →
            </a>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '16px', marginBottom: 0 }}>
              Link may need updating — contact Kyle if the listing appears unavailable
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
