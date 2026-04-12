import React, { useState, useEffect, useRef } from 'react';
import { getPersonShirt } from '../utils/shirtData';

// ── Character Sheets (Etsy) ───────────────────────────────────────────────────

const CHAR_LISTS = [
  {
    label: 'Character Options — List 1',
    img: '/assets/characters/chars-list1.webp.webp',
    names: [
      'Mickey','Minnie','Mickey Beard','Leopard Minnie','Mickey Sorcerer','Daisy','Donald','Goofy','Pluto',
      'Carabelle','Max','Roxanne','Oswald','Scrooge','Powerline','Mighty Duck','Stitch','Angel','Lilo',
      'Pumba','Timon','Zazu','Nala','Simba','Mufasa','Scar','Sarabi','Rafiki','Hyena','Gizmoduck',
      'Launchpad','Chip','Dale','Gadget','Monterey Jack','Fat Cat','Zipper','Kermit','Miss Piggy','Animal',
      'Tinkerbelle','Peter Pan','Captain Hook','Wendy Darling','Mr. Smee','Sonny Eclipse','Tigger','Eeyore',
      'Piglet','Roo','Kanga','Christopher Robin','Elsa','Anna','Olaf','Sven','Pabbie','Marshmallow','Bruni',
      'Jack Skellington','Sally Bride','Beauty','Beast','Gaston','Cogsworth','Lumiere','Chip Potts',
      'Mrs. Potts','Cruella','Pongo','Perdita','Lucky','Jasmine','Aladdin','Genie','Abu','Jafar','Sultan',
      'Rajah','Bambi','Thumper','Mr. Toad','Wall-E','Eve','Ariel','Eric','Ursula','King Triton','Flounder',
      'Sebastian','Scuttle','Live Action Ariel','Lady','Tramp','Rusty','Bullseye','Duke','Moana','Moana Kid',
      'Pua','Hei Hei','Maui','Coconut Man','Buzz','Woody','Forky','Jesse','Ham','Rex','Bo Peep','Gabby',
      'Slinky','Alien','Mr. Potatoe','Mrs. Potatoe','Rapunzel','Flynn Rider','Maximus','Pascal','Pinoccio',
      'Marie','Aurora','Maleficent','Prince Phillip','Cinderella','Gus','Jaq','Prince Charming',
      'Lady Tremaine','Fairy Godmother','Perry','Roger Rabbit','Waldo',
    ],
  },
  {
    label: 'Character Options — List 2',
    img: '/assets/characters/chars-list2.webp.webp',
    names: [
      'Snow White','Evil Queen','Prince Florian','Bashful','Doc','Dopey','Sleepy','Happy','Grumpy','Sneezy',
      'Venelope','Ralph','Pochahontas','Jon Smith','Meeko','Percy','Oggie','Miguel','Wade','Amber','Merida',
      'Tiana','Alice','Mad Hatter','Cheshire Cat','Groot','Spiderman','Hulk','Star Lord','Black Panther',
      'Flash','Deadpool','Captain America','Iron Man','Thor','Duke','Spidey','Gamora','Shrek','Fiona',
      'Donkey','Isabella','Mirabel','Lisa','Bruno','Dumbo','Tarzan','Jane','Baymax','Jack Sparrow','Dory',
      'Baby Dory','Nemo','Bruce','Squirt','Wednesday','D','Yoda','Grogu','Stormtrooper','Chewy','Phasma',
      'Han Solo','Leia','Bobba Fett','Kylo Ren','Mandalorian','Jabba','Palpatine','Darh Maul','Ahshoka',
      'Luke Skywalker','Rey','BBB','C3PO','R2D2','Padme','Obi-Wan','Mulan','Mushu','Li Shang','Shan Yu',
      'Robbin Hood','Maid Marian','Excalibur','Tom','Jerry','Figment','Jiminy Cricket','Pinoccio','Herbie',
      'Mr. Incredible','Mrs. Incredible','Violet','Dash','Jack Jack','Edna Mode','Sulilvan','Mike','Boo',
      'Raya','Sisu','Baloo','Mowgli','Bagheera','King Loui','Kronk','Kuzco','Yzma','Hercules','Hades',
      'Megara','Lightning McQueen','Mater','Sally Car','Doc Hudson','Chick Hicks','Cruz Ramirez','Guido',
      'Luigi','Red Firetruck','Carl Young','Ellie Kid','Carl Old','Russel','Mario','Luigi','Peach','Yoshi',
      'Toad','Bowser','Joy','Anger','Anxiety','Disgust','Fear','Sadness','Ennui','Envy','Embarrassment',
      'Nostalgia','Pouchy','Bloofy','Bing Bong',
    ],
  },
  {
    label: 'Character Options — List 3',
    img: '/assets/characters/chars-list3.webp.webp',
    names: [
      'Sofia the First','Remy','Bugs Bunny','Lola','Duffy Duck','Wile E. Coyote','Elmer Fudd','Porky Pig',
      'Road Runner','Yosemite Sam','Speedy Gonzales','Tweety','Sylvester','Taz',
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CharacterPickerModal({ isOpen, personName, onConfirm, onClose }) {
  const [selectedName, setSelectedName] = useState(() =>
    getPersonShirt(personName).character || ''
  );
  const [searchQ,    setSearchQ]    = useState('');
  const [openGroups, setOpenGroups] = useState([0, 1, 2]);
  const [lightbox,   setLightbox]   = useState(null);
  const [imgStates,  setImgStates]  = useState({});
  const searchRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    // Re-sync initial selection when modal opens for a new person
    setSelectedName(getPersonShirt(personName).character || '');
    setSearchQ('');
  }, [isOpen, personName]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = e => {
      if (e.key === 'Escape') { if (lightbox) setLightbox(null); else onClose(); }
    };
    document.addEventListener('keydown', onKey);
    searchRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, lightbox]);

  if (!isOpen) return null;

  const toggleGroup = idx =>
    setOpenGroups(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);

  const q = searchQ.trim().toLowerCase();

  const filteredLists = (CHAR_LISTS || []).map(list => ({
    ...list,
    filtered: q
      ? (list.names || []).filter(n => n && typeof n === 'string' && n.toLowerCase().includes(q))
      : (list.names || []),
  }));

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Character sheet" onError={e => e.target.style.display='none'} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', objectFit: 'contain' }} />
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '20px', right: '24px', fontSize: '28px', color: 'white', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
      )}

      <div
        style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', background: 'rgba(0,0,0,0.65)' }}
        onClick={onClose}
      >
        <div
          style={{ position: 'relative', background: 'white', borderRadius: '20px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', width: '100%', maxWidth: '900px', height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '20px', fontSize: '22px', color: '#F4C430', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', lineHeight: 1 }}>×</button>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '26px', color: '#1B2A4A', margin: '0 0 4px' }}>
              Choose {personName}'s Character
            </h2>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#888', margin: 0 }}>
              Browse all available characters below — these are the exact options from the Etsy shop
            </p>
          </div>

          {/* Search */}
          <div style={{ padding: '12px 24px', borderBottom: '1px solid #f5f5f5', flexShrink: 0, position: 'relative' }}>
            <input
              ref={searchRef}
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search characters... (e.g. Elsa, Grogu, Iron Man)"
              style={{
                width: '100%', fontFamily: 'Nunito, sans-serif', fontSize: '15px',
                padding: '10px 40px 10px 14px', borderRadius: '10px',
                border: '1.5px solid #1B2A4A', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {searchQ && (
              <button
                onClick={() => setSearchQ('')}
                style={{ position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '16px', color: '#aaa', cursor: 'pointer' }}
              >×</button>
            )}
          </div>

          {/* Two-panel body */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* Left: Name list (40%) */}
            <div style={{ width: '40%', minWidth: '200px', borderRight: '1px solid #f0f0f0', overflowY: 'auto', padding: '8px 0' }}>
              {filteredLists.map((list, idx) => {
                const isOpen = openGroups.includes(idx) || !!q;
                return (
                  <div key={idx}>
                    <button
                      onClick={() => !q && toggleGroup(idx)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '10px 16px',
                        fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700,
                        color: '#1B2A4A', background: '#f8f9fc', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <span>📋 {list.label.replace('Character Options — ', '')}</span>
                      {!q && <span style={{ color: '#aaa' }}>{isOpen ? '▲' : '▼'}</span>}
                    </button>
                    {isOpen && list.filtered.map((name, ni) => {
                      const isSel = selectedName === name;
                      return (
                        <button
                          key={`${idx}-${ni}-${name}`}
                          onClick={() => setSelectedName(name)}
                          style={{
                            width: '100%', textAlign: 'left', padding: '9px 20px',
                            fontFamily: 'Nunito, sans-serif', fontSize: '14px',
                            border: 'none', cursor: 'pointer',
                            background: isSel ? '#1B2A4A' : 'white',
                            color: isSel ? 'white' : '#2C2C2C',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          }}
                        >
                          <span>{name}</span>
                          {isSel && <span style={{ color: '#F4C430', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                        </button>
                      );
                    })}
                    {isOpen && list.filtered.length === 0 && (
                      <div style={{ padding: '10px 20px', fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#ccc' }}>
                        No matches
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: Reference images (60%) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {CHAR_LISTS.map((list, idx) => (
                <div key={idx}>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    {list.label}
                  </div>
                  {imgStates[idx] === 'err' ? (
                    <div style={{ background: '#f8f9fc', borderRadius: '10px', padding: '24px 20px', textAlign: 'center', border: '2px dashed #e0e0e0' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>🖼️</div>
                      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#aaa', margin: 0 }}>
                        Image not yet uploaded.
                      </p>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => imgStates[idx] !== 'err' && setLightbox(list.img)}>
                      <img
                        src={list.img}
                        alt={list.label}
                        onLoad={() => setImgStates(p => ({ ...p, [idx]: 'ok' }))}
                        onError={e => { e.target.style.display = 'none'; setImgStates(p => ({ ...p, [idx]: 'err' })); }}
                        style={{ width: '100%', borderRadius: '10px', display: 'block', border: '1px solid #e8e8e8' }}
                      />
                      {imgStates[idx] === 'ok' && (
                        <div style={{
                          position: 'absolute', bottom: '8px', right: '8px',
                          background: 'rgba(0,0,0,0.55)', color: 'white', borderRadius: '6px',
                          padding: '4px 10px', fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700,
                        }}>
                          🔍 Click to zoom
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            padding: '14px 24px', borderTop: '1px solid #f0f0f0', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          }}>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '16px', color: selectedName ? '#1B2A4A' : '#bbb', fontWeight: 600 }}>
              {selectedName ? `Selected: ${selectedName}` : 'No character selected'}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={onClose} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Cancel
              </button>
              <button
                onClick={() => selectedName && onConfirm(selectedName)}
                disabled={!selectedName}
                style={{
                  fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700,
                  padding: '10px 28px', borderRadius: '10px', border: 'none',
                  cursor: selectedName ? 'pointer' : 'not-allowed',
                  background: selectedName ? '#F4C430' : '#e0e0e0',
                  color: selectedName ? '#1B2A4A' : '#aaa',
                }}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
