import { useState, useEffect, useRef, useCallback } from 'react';
import { useAdmin } from '../contexts/AdminContext';

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadLocal(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function saveLocal(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ── Data ──────────────────────────────────────────────────────────────────────
const CATS = [
  { id: 'kids',    label: 'Kids Clubs',    emoji: '🧒', color: '#00B4D8', defaultOpen: true  },
  { id: 'entmt',   label: 'Entertainment', emoji: '🎭', color: '#7B2FBE', defaultOpen: true  },
  { id: 'pools',   label: 'Pools & Water', emoji: '🌊', color: '#0077B6', defaultOpen: false },
  { id: 'dining',  label: 'Dining',        emoji: '🍽️', color: '#E76F51', defaultOpen: false },
  { id: 'adult',   label: 'Adult Spaces',  emoji: '🦸', color: '#1B2A4A', defaultOpen: false },
  { id: 'spa',     label: 'Spa & Fitness', emoji: '💆', color: '#6BAF92', defaultOpen: false },
];

const CAT_FILTER = [
  { id: 'all',   label: '🎡 All' },
  { id: 'kids',  label: '🧒 Kids Clubs' },
  { id: 'entmt', label: '🎭 Entertainment' },
  { id: 'pools', label: '🌊 Pools & Water' },
  { id: 'dining',label: '🍽️ Dining' },
  { id: 'adult', label: '🦸 Adult Spaces' },
  { id: 'spa',   label: '💆 Spa & Fitness' },
];

const FAMILIES_META = [
  { id: 'all',     label: 'All Families', color: '#1B2A4A' },
  { id: 'family1', label: 'K-Yosties',    color: '#4a7bc8' },
  { id: 'family2', label: 'Beal Yosties', color: '#b8860b' },
  { id: 'family3', label: 'Zihlmann',     color: '#c0392b' },
  { id: 'family4', label: 'Big Yosties',  color: '#1a7a4a' },
];

// badge config: id → { label, bg, color }
const BADGE_STYLES = {
  exclusive:  { label: 'Destiny Exclusive', bg: 'transparent', color: '#C9A227', border: '1px solid #C9A227' },
  dontmiss:   { label: "Don't Miss",        bg: '#FF6B6B22',   color: '#c0392b', border: '1px solid #FF6B6B' },
  family:     { label: 'Family Favorite',   bg: '#00B4D822',   color: '#007a99', border: '1px solid #00B4D8' },
  adults:     { label: 'Adults Only',       bg: '#1B2A4A22',   color: '#1B2A4A', border: '1px solid #1B2A4A' },
  bookjune:   { label: 'Book June 23',      bg: '#fef3c7',     color: '#92400e', border: '1px solid #fbbf24' },
  bookmay:    { label: 'Book May 9',        bg: '#fef3c7',     color: '#92400e', border: '1px solid #fbbf24' },
};

const CARDS = [
  // KIDS
  { id: 'kc1', cat: 'kids',  emoji: '🏰', title: "Disney's Oceaneer Club",        unsplash: 'disney+kids+club+adventure',     badges: ['family'],    desc: "Ages 3–10. Immersive themed rooms: Marvel Super Hero Academy, Star Wars Cargo Bay, Disney Princess spaces, and Mickey & Minnie's Captain's Deck. No reservation needed — come and go! Must be potty trained." },
  { id: 'kc2', cat: 'kids',  emoji: '🍼', title: "It's a Small World Nursery",    unsplash: 'baby+nursery+colorful',          badges: ['bookmay'],   desc: "Ages 6 months–3 years. Magical babysitting in a whimsical space. Paid service — book as early as May 9!" },
  { id: 'kc3', cat: 'kids',  emoji: '🎮', title: 'Edge',                          unsplash: 'tween+hangout+games+lounge',     badges: [],            desc: "Ages 11–13. NYC loft-inspired hangout with games, movies, trivia and scheduled activities." },
  { id: 'kc4', cat: 'kids',  emoji: '☕', title: 'Vibe',                          unsplash: 'teen+lounge+modern+cool',        badges: [],            desc: "Ages 14–17. Stylish teen lounge with coffee bar (non-alcoholic), karaoke, dance parties and group activities." },
  // ENTERTAINMENT
  { id: 'en1', cat: 'entmt', emoji: '🏛️', title: 'Disney Hercules',              unsplash: 'hercules+theater+musical+stage', badges: ['exclusive','dontmiss'], desc: "Broadway-style musical exclusive to Disney Destiny. Zero to hero on the high seas — don't miss it!" },
  { id: 'en2', cat: 'entmt', emoji: '❄️', title: 'Frozen: A Musical Spectacular', unsplash: 'frozen+musical+stage+performance',badges: ['family'],   desc: "Broadway-style fan favorite featuring Elsa, Anna, and all the songs you love." },
  { id: 'en3', cat: 'entmt', emoji: '⚓', title: 'Disney Seas the Adventure',     unsplash: 'disney+stage+show+adventure',    badges: ['family'],    desc: "Fun Broadway-style show celebrating the magic of Disney at sea." },
  { id: 'en4', cat: 'entmt', emoji: '🏴‍☠️',title: 'Pirate Night + Fireworks',    unsplash: 'fireworks+ship+sea+night',       badges: ['dontmiss','family'], desc: "Deck party on FunnelVision Deck 11. Costume encouraged! Fireworks from the ship ~10 PM. Earlier pirate events for little ones." },
  { id: 'en5', cat: 'entmt', emoji: '🌊', title: 'AquaMouse Water Coaster',       unsplash: 'water+coaster+slide+ride',       badges: ['exclusive','dontmiss'], desc: "760-foot water attraction with Mickey and Minnie vs. villains theming. The signature ride of Disney Destiny!" },
  { id: 'en6', cat: 'entmt', emoji: '✨', title: 'Kiss Goodnight',                unsplash: 'grand+hall+chandelier+magical',  badges: ['family'],    desc: "Nightly light and music show in the Grand Hall at midnight. A magical way to end each evening." },
  { id: 'en7', cat: 'entmt', emoji: '🃏', title: 'Dr. Facilier Meet & Play',      unsplash: 'shadow+man+villain+magic+cards', badges: ['exclusive'], desc: "Exclusive pop-up card tricks and villain mischief with Dr. Facilier. Watch the Navigator app for times!" },
  // POOLS
  { id: 'pw1', cat: 'pools', emoji: '🏊', title: 'Main Family Pool Area',         unsplash: 'disney+cruise+ship+pool+deck',   badges: ['family'],    desc: "Multiple pools and water play areas on Decks 11–12 with FunnelVision screen. Perfect for families." },
  { id: 'pw2', cat: 'pools', emoji: '🤠', title: 'Toy Story Splash Zone',         unsplash: 'toy+story+splash+pad+water',     badges: [],            desc: "Themed splash pad area for little ones. Fun water play featuring Woody and friends." },
  { id: 'pw3', cat: 'pools', emoji: '🦕', title: 'Slide-a-saurus Rex',            unsplash: 'water+slide+kids+pool+ship',     badges: [],            desc: "Family water slide for kids and adventurous adults." },
  { id: 'pw4', cat: 'pools', emoji: '♾️', title: 'Quiet Cove',                    unsplash: 'infinity+pool+adults+ocean+view',badges: ['adults'],    desc: "Adults-only infinity pool and hot tub on Deck 13 aft. Best kept secret on the ship — stunning ocean views." },
  { id: 'pw5', cat: 'pools', emoji: '🎬', title: 'FunnelVision Deck',             unsplash: 'outdoor+movie+screen+pool+deck', badges: ['family'],    desc: "Giant screen by the main pool showing movies, shows, and Pirate Night entertainment." },
  // DINING
  { id: 'di1', cat: 'dining',emoji: '🎨', title: '1923',                          unsplash: 'elegant+california+restaurant',  badges: [],            desc: "Elegant California-inspired dining celebrating Walt Disney's founding year. Best for adults and older kids who enjoy a sophisticated atmosphere." },
  { id: 'di2', cat: 'dining',emoji: '⚡', title: 'Worlds of Marvel',              unsplash: 'marvel+themed+restaurant',       badges: [],            desc: "Marvel-themed immersive dining with interactive storytelling. A hit for Marvel fans and older kids/teens." },
  { id: 'di3', cat: 'dining',emoji: '🦁', title: 'Pride Lands: Feast of the Lion King', unsplash: 'lion+king+african+dining', badges: ['family','dontmiss'], desc: "Show dining with live African-inspired music. Circle of Life, Hakuna Matata and more performed live. Loud, exciting, and a crowd-pleaser." },
  { id: 'di4', cat: 'dining',emoji: '🥩', title: 'Palo Steakhouse',               unsplash: 'upscale+steakhouse+restaurant',  badges: ['adults','bookjune'], desc: "Adults-only Italian-meets-steakhouse. Reserve immediately on June 23 — fills up same day." },
  { id: 'di5', cat: 'dining',emoji: '🥐', title: 'Enchanté by Chef Arnaud Lallement', unsplash: 'french+fine+dining+elegant', badges: ['adults','bookjune'], desc: "Gourmet French cuisine, adults only. Also offers champagne brunch and Just Desserts 5-course event." },
  // ADULT SPACES
  { id: 'as1', cat: 'adult', emoji: '🌀', title: 'The Sanctum',                   unsplash: 'doctor+strange+mystical+bar',    badges: ['exclusive'], desc: "Doctor Strange-themed bar with mystical cocktails and special shows. One of the best themed venues on the ship." },
  { id: 'as2', cat: 'adult', emoji: '🐾', title: "De Vil's",                      unsplash: 'cruella+piano+lounge+elegant',   badges: [],            desc: "Cruella de Vil-themed piano lounge with live music and themed cocktails." },
  { id: 'as3', cat: 'adult', emoji: '🏴‍☠️',title: 'Cask & Cannon',              unsplash: 'pirates+caribbean+bar+nautical', badges: [],            desc: "Pirates of the Caribbean themed bar. Nautical, cozy, great drinks and small plates." },
  { id: 'as4', cat: 'adult', emoji: '🌹', title: 'Rose Lounge',                   unsplash: 'beauty+beast+champagne+bar',     badges: [],            desc: "Beauty and the Beast champagne bar — perfect for a pre-dinner drink." },
  { id: 'as5', cat: 'adult', emoji: '👻', title: 'Haunted Mansion Parlor Bar',    unsplash: 'haunted+mansion+gothic+bar',     badges: [],            desc: "Spooky and atmospheric bar for fans of the Haunted Mansion." },
  { id: 'as6', cat: 'adult', emoji: '🐾', title: 'Saga Lounge',                   unsplash: 'wakanda+black+panther+lounge',   badges: [],            desc: "Wakanda-inspired 2-story space. Family activities by day, adults-only bar and entertainment by night." },
  // SPA
  { id: 'sp1', cat: 'spa',   emoji: '🧖', title: 'Senses Spa',                    unsplash: 'luxury+spa+treatment+serene',    badges: ['adults'],    desc: "Full spa with treatments, private rooms, Rainforest Room with saunas, hot tubs and heated loungers. Book ahead — fills up fast." },
  { id: 'sp2', cat: 'spa',   emoji: '🏋️', title: 'Senses Fitness',               unsplash: 'modern+gym+fitness+ship',        badges: ['adults'],    desc: "Full gym with modern equipment. Adults only." },
];

// ── UnsplashImage ─────────────────────────────────────────────────────────────
function UnsplashImage({ query, fallbackColor, fallbackEmoji, title }) {
  const [state, setState] = useState('loading'); // loading | loaded | error
  const src = `https://source.unsplash.com/400x300/?${query}`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
      {/* Gradient fallback (always rendered behind) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${fallbackColor}55 0%, ${fallbackColor}cc 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '56px', lineHeight: 1, zIndex: 1, position: 'relative' }}>{fallbackEmoji}</span>
        <span style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '22px',
          color: 'white', opacity: 0.1, textAlign: 'center', padding: '0 12px', lineHeight: 1.2,
          pointerEvents: 'none',
        }}>{title}</span>
      </div>
      {/* Unsplash image */}
      <img
        src={src}
        alt={title}
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', display: state === 'error' ? 'none' : 'block',
          opacity: state === 'loaded' ? 1 : 0, transition: 'opacity 0.3s ease',
        }}
      />
      {state === 'loaded' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
      )}
    </div>
  );
}

// ── ExperienceCard ────────────────────────────────────────────────────────────
function ExperienceCard({ card, catColor, isAdmin, interestCount, isInterested, isBucketListed, onInterest, onBucketList }) {
  const [hovered, setHovered] = useState(false);
  const fileRef = useRef(null);
  const [customPhoto, setCustomPhoto] = useState(() => loadLocal(`apd_cardphoto_${card.id}`, null));

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomPhoto(reader.result);
      saveLocal(`apd_cardphoto_${card.id}`, reader.result);
    };
    reader.readAsDataURL(f);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white', borderRadius: '16px', overflow: 'hidden',
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.14)` : '0 4px 20px rgba(0,0,0,0.08)',
        border: hovered ? `2px solid ${catColor}` : '2px solid transparent',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Photo area */}
      <div style={{ position: 'relative' }}>
        {customPhoto ? (
          <div style={{ position: 'relative', height: '180px', overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
            <img src={customPhoto} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)' }} />
          </div>
        ) : (
          <UnsplashImage
            query={card.unsplash}
            fallbackColor={catColor}
            fallbackEmoji={card.emoji}
            title={card.title}
          />
        )}
        {isAdmin && (
          <>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', top: '10px', right: '10px',
                background: 'rgba(0,0,0,0.55)', color: 'white',
                border: 'none', borderRadius: '20px', padding: '4px 10px',
                fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700,
                cursor: 'pointer', zIndex: 2,
              }}
            >
              📷
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '18px', color: '#1B2A4A', margin: '0 0 8px', lineHeight: 1.25 }}>
          {card.title}
        </h3>

        {/* Badges */}
        {card.badges.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
            {card.badges.map(b => {
              const s = BADGE_STYLES[b];
              return s ? (
                <span key={b} style={{
                  fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontWeight: 700,
                  padding: '3px 9px', borderRadius: '20px',
                  background: s.bg, color: s.color, border: s.border,
                }}>{s.label}</span>
              ) : null;
            })}
          </div>
        )}

        <p style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#2C2C2C',
          lineHeight: 1.6, margin: '0 0 12px', flex: 1,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {card.desc}
        </p>

        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#aaa', margin: '0 0 12px' }}>
          {interestCount} {interestCount === 1 ? 'family' : 'families'} interested
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onInterest}
            style={{
              flex: 1, fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700,
              padding: '9px 8px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s',
              ...(isInterested
                ? { background: '#F4C430', color: '#1B2A4A', border: '2px solid #F4C430' }
                : { background: 'transparent', color: '#1B2A4A', border: '2px solid #1B2A4A' }),
            }}
          >
            {isInterested ? '✓ Interested!' : '⭐ We\'re Interested!'}
          </button>
          <button
            onClick={onBucketList}
            style={{
              flex: 1, fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700,
              padding: '9px 8px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s',
              ...(isBucketListed
                ? { background: '#E76F51', color: 'white', border: '2px solid #E76F51' }
                : { background: 'transparent', color: '#E76F51', border: '2px solid #E76F51' }),
            }}
          >
            {isBucketListed ? '✓ On List!' : '🪣 Bucket List'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CategorySection ───────────────────────────────────────────────────────────
function CategorySection({ cat, cards, isAdmin, interests, bucketList, onInterest, onBucketList, searchQ }) {
  const [open, setOpen] = useState(cat.defaultOpen);

  const filtered = cards.filter(c => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
  });

  if (filtered.length === 0 && searchQ) return null;

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: cat.color + '14', borderRadius: '12px', padding: '16px 24px',
          border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>{cat.emoji}</span>
          <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '22px', color: '#1B2A4A' }}>
            {cat.label}
          </span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#aaa' }}>
            {filtered.length} experience{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#1B2A4A', fontWeight: 600 }}>
          {open ? 'Hide ▲' : 'Show All ▼'}
        </span>
      </button>

      {/* Cards */}
      {open && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '16px',
        }}>
          {filtered.map(card => (
            <ExperienceCard
              key={card.id}
              card={card}
              catColor={cat.color}
              isAdmin={isAdmin}
              interestCount={interests[card.id] || 0}
              isInterested={!!(interests[`${card.id}_me`])}
              isBucketListed={bucketList.includes(card.id)}
              onInterest={() => onInterest(card.id)}
              onBucketList={() => onBucketList(card.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── BucketList ────────────────────────────────────────────────────────────────
function BucketListSection({ bucketList, onRemove }) {
  const [familyFilter, setFamilyFilter] = useState('all');
  const items = bucketList.map(id => CARDS.find(c => c.id === id)).filter(Boolean);
  const catOf = id => CATS.find(c => c.id === CARDS.find(card => card.id === id)?.cat);

  return (
    <div id="bucket-list" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 64px' }}>
      <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '32px', color: '#1B2A4A', margin: '0 0 6px' }}>
        🪣 Our Bucket List
      </h2>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#888', margin: '0 0 20px' }}>
        Tap "Add to Bucket List" on any experience above — your must-dos will appear here
      </p>

      {/* Family selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#888', marginRight: '4px' }}>Viewing list for:</span>
        {FAMILIES_META.map(f => (
          <button
            key={f.id}
            onClick={() => setFamilyFilter(f.id)}
            style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700,
              padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', border: 'none',
              background: familyFilter === f.id ? f.color : f.color + '18',
              color: familyFilter === f.id ? 'white' : f.color,
              transition: 'all 0.15s',
            }}
          >{f.label}</button>
        ))}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🪣</div>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', color: '#bbb', margin: '0 0 8px' }}>
            Nothing on the list yet!
          </h3>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#ccc' }}>
            Tap "Add to Bucket List" on experiences above to start planning your adventure
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {items.map(card => {
            const cat = catOf(card.id);
            return (
              <div key={card.id} style={{
                background: 'white', borderRadius: '12px', padding: '16px 20px',
                borderLeft: `4px solid ${cat?.color || '#1B2A4A'}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
              }}>
                <div>
                  <h4 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '16px', color: '#1B2A4A', margin: '0 0 4px' }}>
                    {card.title}
                  </h4>
                  <span style={{
                    fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700,
                    padding: '2px 8px', borderRadius: '20px',
                    background: (cat?.color || '#1B2A4A') + '18', color: cat?.color || '#1B2A4A',
                  }}>{cat?.label}</span>
                </div>
                <button
                  onClick={() => onRemove(card.id)}
                  style={{ fontFamily: 'Nunito, sans-serif', fontSize: '18px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CruiseHighlights() {
  const { isAdmin } = useAdmin();

  const [catFilter,  setCatFilter]  = useState('all');
  const [searchQ,    setSearchQ]    = useState('');
  const [interests,  setInterests]  = useState(() => loadLocal('apd_highlights_interests', {}));
  const [bucketList, setBucketList] = useState(() => loadLocal('apd_highlights_bucket', []));

  useEffect(() => { document.title = 'The Magic Aboard'; }, []);

  const handleInterest = useCallback((cardId) => {
    setInterests(prev => {
      const meKey  = `${cardId}_me`;
      const count  = prev[cardId] || 0;
      const wasOn  = !!prev[meKey];
      const next   = {
        ...prev,
        [cardId]: wasOn ? Math.max(0, count - 1) : count + 1,
        [meKey]: wasOn ? false : true,
      };
      saveLocal('apd_highlights_interests', next);
      return next;
    });
  }, []);

  const handleBucketList = useCallback((cardId) => {
    setBucketList(prev => {
      const next = prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId];
      saveLocal('apd_highlights_bucket', next);
      return next;
    });
  }, []);

  const bucketCount = bucketList.length;

  // Visible categories after filter
  const visibleCats = catFilter === 'all' ? CATS : CATS.filter(c => c.id === catFilter);

  return (
    <>
      {/* ── HERO ── */}
      <div style={{
        background: '#1B2A4A', height: '160px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Star field */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #FFD700 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        {/* Mickey silhouettes scattered */}
        {[{top:'12%',left:'6%'},{top:'60%',left:'14%'},{top:'20%',left:'78%'},{top:'70%',left:'88%'},{top:'40%',left:'45%'}].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', top: pos.top, left: pos.left,
            fontSize: '28px', opacity: 0.04, pointerEvents: 'none', userSelect: 'none',
          }}>🐭</div>
        ))}
        <div style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#F4C430', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginBottom: '8px' }}>
            ✨ DISNEY DESTINY · YOUR GUIDE TO THE SHIP
          </div>
          <h1 style={{ fontFamily: '"Dancing Script", cursive', fontSize: '52px', color: '#F4C430', fontWeight: 700, lineHeight: 1, margin: '0 0 8px' }}>
            The Magic Aboard
          </h1>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            Everything to do, see, eat, and explore on the Disney Destiny
          </p>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #f0f0f0', padding: '16px 0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 }}>
            {CAT_FILTER.map(f => (
              <button
                key={f.id}
                onClick={() => setCatFilter(f.id)}
                style={{
                  fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700,
                  padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.15s',
                  ...(catFilter === f.id
                    ? { background: '#1B2A4A', color: 'white', border: '1.5px solid #1B2A4A' }
                    : { background: 'white', color: '#1B2A4A', border: '1.5px solid #1B2A4A' }),
                }}
              >{f.label}</button>
            ))}
          </div>
          {/* Search */}
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search experiences..."
            style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '14px',
              padding: '9px 14px', borderRadius: '8px', border: '1.5px solid #1B2A4A',
              outline: 'none', width: '200px',
            }}
          />
          {/* Bucket list link */}
          <a
            href="#bucket-list"
            style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#C9A227', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            🪣 My Bucket List ({bucketCount})
          </a>
        </div>
      </div>

      {/* ── CATEGORY SECTIONS ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 0' }}>
        {visibleCats.map(cat => (
          <CategorySection
            key={cat.id}
            cat={cat}
            cards={CARDS.filter(c => c.cat === cat.id)}
            isAdmin={isAdmin}
            interests={interests}
            bucketList={bucketList}
            onInterest={handleInterest}
            onBucketList={handleBucketList}
            searchQ={searchQ}
          />
        ))}
      </div>

      {/* ── BUCKET LIST ── */}
      <BucketListSection bucketList={bucketList} onRemove={handleBucketList} />
    </>
  );
}
