import { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

// ── Static Data ───────────────────────────────────────────────────────────────

const FLIGHTS_STORAGE_KEY = 'apd_flight_details';
const GROUND_STORAGE_KEY  = 'apd_ground_details';

const INITIAL_FLIGHTS = {
  family1: {
    status: 'booked',
    outbound:  { airline: 'Breeze Airlines', flight: 'MX1016', from: 'CMH', to: 'FLL', departs: 'July 22 · 9:54 AM',  arrives: '1:54 PM FLL' },
    inbound:   { airline: 'Breeze Airlines', flight: 'MX1017', from: 'FLL', to: 'CMH', departs: 'July 29 · 2:16 PM', arrives: '6:20 PM CMH' },
    groundNote: 'Uber from FLL with kids + car seats',
  },
  family2: { status: 'pending', outbound: null, inbound: null, groundNote: '' },
  family3: { status: 'pending', outbound: null, inbound: null, groundNote: '' },
  family4: { status: 'pending', outbound: null, inbound: null, groundNote: '' },
};

const FAMILIES_META = [
  { id: 'family1', name: 'K-Yosties',       color: '#4a7bc8', members: ['Kyle','Kristen','Brielle','Casper'] },
  { id: 'family2', name: 'Beal Yosties',     color: '#b8860b', members: ['Jenni','Nat','Ridge','Foxton','Walker'] },
  { id: 'family3', name: 'Zihlmann Yosties', color: '#c0392b', members: ['Julie','Markus','Cohen','Oskar','Skye'] },
  { id: 'family4', name: 'Big Yosties',      color: '#1a7a4a', members: ['Tim','Laura'] },
];

const CABINS = [
  { room: '7596', family: 'K-Yosties',       color: '#4a7bc8', res: '43483369', connects: '7598', members: ['Kyle','Kristen','Brielle','Casper'], crossGuests: [] },
  { room: '7598', family: 'Beal Yosties',    color: '#b8860b', res: '43483397', connects: '7596', members: ['Jenni','Nat','Ridge','Foxton'],       crossGuests: [] },
  { room: '7594', family: 'Zihlmann Yosties',color: '#c0392b', res: '43483320', connects: '7592', members: ['Julie','Markus','Cohen','Oskar'],     crossGuests: [] },
  { room: '7592', family: 'Big Yosties',     color: '#1a7a4a', res: '43483320', connects: '7594', members: ['Tim','Laura'],                        crossGuests: [
    { name: 'Skye',   family: 'Zihlmann', color: '#c0392b' },
    { name: 'Walker', family: 'Beal',     color: '#b8860b' },
  ]},
];

const JOURNEY_LEGS = [
  { key: 'airport_hotel',    label: 'Airport → Hotel',    from: '✈️', to: '🏨', date: 'July 22' },
  { key: 'hotel_port',       label: 'Hotel → Port',       from: '🏨', to: '⚓', date: 'July 23' },
  { key: 'port_posthotel',   label: 'Port → Post-Hotel',  from: '⚓', to: '🏨', date: 'July 27' },
  { key: 'posthotel_airport',label: 'Post-Hotel → Airport',from: '🏨', to: '✈️', date: 'July 29' },
];

const INITIAL_GROUND = {
  family1: {
    airport_hotel:     '',
    hotel_port:        '',
    port_posthotel:    'Uber w/ car seats ~30 min',
    posthotel_airport: '',
  },
  family2: { airport_hotel: '', hotel_port: '', port_posthotel: '', posthotel_airport: '' },
  family3: { airport_hotel: '', hotel_port: '', port_posthotel: '', posthotel_airport: '' },
  family4: { airport_hotel: '', hotel_port: '', port_posthotel: '', posthotel_airport: '' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadLocal(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function saveLocal(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

const EMPTY_FLIGHT_FORM = { airline: '', flight: '', from: '', to: '', departs: '', arrives: '' };

// ── Tab 1: Hotels ─────────────────────────────────────────────────────────────

function HotelsTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
      <BoardingPassHotel
        label="PRE-CRUISE · JULY 22–23"
        accent="#E74C3C"
        accentLight="#fff0ee"
        name="Embassy Suites by Hilton Fort Lauderdale"
        address="1100 SE 17th St, Fort Lauderdale FL 33316"
        checkIn="July 22 · 4:00 PM"
        checkOut="July 23 · 11:00 AM"
        bookings={[
          { family: 'K-Yosties',             conf: '93532087' },
          { family: 'Zihlmann & Beal Yosties', conf: '90804314' },
          { family: 'Big Yosties',            conf: '92400011' },
        ]}
        notes="✓ Complimentary evening reception (apps & drinks) · ✓ Hot breakfast included · ✓ Pool on-site · Publix 12-min walk for alcohol & snacks"
      />
      <BoardingPassHotel
        label="POST-CRUISE · JULY 27–29"
        accent="#1ABC9C"
        accentLight="#e8fdf8"
        name="Pelican Grand Beach Resort"
        address="2000 North Ocean Blvd, Fort Lauderdale FL"
        checkIn="July 27 · 4:00 PM"
        checkOut="July 29 · 11:00 AM"
        bookings={[
          { family: 'All Families', conf: 'Chase Trip ID 1011540294' },
        ]}
        notes="✓ Oceanfront resort · Dinner nearby: Shooters Waterfront & Del Mar"
      />
    </div>
  );
}

function BoardingPassHotel({ label, accent, accentLight, name, address, checkIn, checkOut, bookings, notes }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      {/* Top band */}
      <div style={{ background: accent, padding: '10px 24px' }}>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>

      {/* Body — two columns with dashed divider */}
      <div style={{ display: 'flex' }}>
        {/* Left 65% */}
        <div style={{ flex: '0 0 65%', padding: '24px' }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
            {name}
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#999', marginBottom: '18px' }}>
            {address}
          </div>

          {/* Check-in/out */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            {[['CHECK-IN', checkIn], ['CHECK-OUT', checkOut]].map(([lbl, val]) => (
              <div key={lbl}>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{lbl}</div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Confirmations */}
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            CONFIRMATIONS
          </div>
          {bookings.map(b => (
            <div key={b.family} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#666' }}>{b.family}</span>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>{b.conf}</span>
            </div>
          ))}
        </div>

        {/* Dashed divider */}
        <div style={{ width: '1px', background: `repeating-linear-gradient(to bottom, ${accent} 0px, ${accent} 6px, transparent 6px, transparent 12px)`, flexShrink: 0, margin: '16px 0' }} />

        {/* Right 35% */}
        <div style={{ flex: 1, background: accentLight, padding: '20px 16px', display: 'flex', alignItems: 'center' }}>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#2C2C2C', lineHeight: 1.6, margin: 0 }}>
            {notes}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Tab 2: Flights ────────────────────────────────────────────────────────────

function FlightsTab() {
  const [flights, setFlights] = useState(() => loadLocal(FLIGHTS_STORAGE_KEY, INITIAL_FLIGHTS));

  function saveFlights(next) { setFlights(next); saveLocal(FLIGHTS_STORAGE_KEY, next); }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '28px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>Family Flights</div>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#999' }}>Click your family to submit or view your flight details</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {FAMILIES_META.map(fam => (
          <FlightCard key={fam.id} fam={fam} data={flights[fam.id]} onSave={(updated) => saveFlights({ ...flights, [fam.id]: updated })} />
        ))}
      </div>
    </div>
  );
}

function FlightCard({ fam, data, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    outAirline: '', outFlight: '', outFrom: '', outTo: '', outDeparts: '', outArrives: '',
    inAirline: '',  inFlight: '',  inFrom: '',  inTo: '',  inDeparts: '',  inArrives: '',
    groundNote: '',
  });

  function handleSave() {
    const updated = {
      status: 'booked',
      outbound:  { airline: form.outAirline, flight: form.outFlight, from: form.outFrom, to: form.outTo, departs: form.outDeparts, arrives: form.outArrives },
      inbound:   { airline: form.inAirline,  flight: form.inFlight,  from: form.inFrom,  to: form.inTo,  departs: form.inDeparts,  arrives: form.inArrives  },
      groundNote: form.groundNote,
    };
    onSave(updated);
    setEditing(false);
  }

  if (data.status === 'booked') {
    return (
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderLeft: `4px solid ${fam.color}` }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 700, color: 'var(--navy)' }}>{fam.name}</span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, background: '#edfcf2', color: '#22863a', padding: '4px 10px', borderRadius: '99px' }}>✅ Booked</span>
        </div>

        {/* Outbound */}
        <FlightLeg label="OUTBOUND" color={fam.color} f={data.outbound} />
        <div style={{ height: '12px' }} />
        {/* Return */}
        <FlightLeg label="RETURN" color={fam.color} f={data.inbound} />

        {/* Ground note */}
        {data.groundNote && (
          <div style={{ marginTop: '14px', background: '#fffbf0', borderRadius: '8px', padding: '10px 14px', fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#7a5c00' }}>
            🚗 Ground: {data.groundNote}
          </div>
        )}
      </div>
    );
  }

  // Pending — boarding pass placeholder or edit form
  if (editing) {
    return (
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: `2px dashed ${fam.color}` }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>{fam.name} — Flight Details</div>
        {[
          ['Outbound', 'out'],
          ['Return',   'in'],
        ].map(([lbl, prefix]) => (
          <div key={prefix} style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: 'var(--coral)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{lbl}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                [`${prefix}Airline`,  'Airline'],
                [`${prefix}Flight`,   'Flight #'],
                [`${prefix}From`,     'From (airport code)'],
                [`${prefix}To`,       'To (airport code)'],
                [`${prefix}Departs`,  'Departs (date & time)'],
                [`${prefix}Arrives`,  'Arrives'],
              ].map(([field, placeholder]) => (
                <input key={field} value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px 10px', fontFamily: 'Nunito, sans-serif', fontSize: '13px', width: '100%', boxSizing: 'border-box' }} />
              ))}
            </div>
          </div>
        ))}
        <input value={form.groundNote} onChange={e => setForm(p => ({ ...p, groundNote: e.target.value }))}
          placeholder="Ground transportation note (optional)"
          style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px 10px', fontFamily: 'Nunito, sans-serif', fontSize: '13px', width: '100%', boxSizing: 'border-box', marginBottom: '14px' }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', borderRadius: '8px', padding: '10px 20px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Save Our Details</button>
          <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#888', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    );
  }

  // Blank boarding pass
  return (
    <div style={{
      borderRadius: '16px', padding: '36px 24px', textAlign: 'center',
      border: `2px dashed #E74C3C`,
      background: 'repeating-linear-gradient(135deg, #fffaf8 0px, #fffaf8 10px, #fff5f0 10px, #fff5f0 20px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    }}>
      <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.35 }}>✈️</div>
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>{fam.name}</div>
      <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#F59E0B', marginBottom: '20px' }}>⏳ Flight Details Pending</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ width: '80%', height: '2px', background: 'var(--navy)', opacity: 0.12, borderRadius: '1px' }} />
        ))}
      </div>
      <button onClick={() => setEditing(true)} style={{
        background: 'transparent', border: '2px solid var(--gold)', color: 'var(--navy)',
        fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px',
        padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
      }}>
        Submit Our Flight Details →
      </button>
    </div>
  );
}

function FlightLeg({ label, color, f }) {
  if (!f) return null;
  return (
    <div style={{ background: '#f8f9fc', borderRadius: '10px', padding: '12px 16px' }}>
      <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[['Airline', f.airline], ['Flight', f.flight], ['Route', `${f.from} → ${f.to}`], ['Departs', f.departs]].map(([lbl, val]) => (
          <div key={lbl}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>{lbl}</div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#999', marginTop: '6px' }}>
        Arrives: {f.arrives}
      </div>
    </div>
  );
}

// ── Tab 3: Ground Transport ───────────────────────────────────────────────────

function GroundTab() {
  const { isAdmin } = useAdmin();
  const [ground, setGround] = useState(() => loadLocal(GROUND_STORAGE_KEY, INITIAL_GROUND));
  const [editingLeg, setEditingLeg] = useState(null); // { familyId, legKey }
  const [editVal, setEditVal] = useState('');

  function startEdit(familyId, legKey) {
    setEditingLeg({ familyId, legKey });
    setEditVal(ground[familyId]?.[legKey] || '');
  }
  function saveLeg() {
    const next = { ...ground, [editingLeg.familyId]: { ...ground[editingLeg.familyId], [editingLeg.legKey]: editVal } };
    setGround(next); saveLocal(GROUND_STORAGE_KEY, next);
    setEditingLeg(null);
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '28px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>Getting There &amp; Back</div>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#999' }}>The full journey for each family — from home to ship and back</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {FAMILIES_META.map(fam => (
          <div key={fam.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderLeft: `4px solid ${fam.color}` }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 700, color: 'var(--navy)' }}>{fam.name}</span>
            </div>

            {/* Journey timeline — horizontal */}
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '560px', gap: '0' }}>
                {JOURNEY_LEGS.map((leg, i) => {
                  const val = ground[fam.id]?.[leg.key] || '';
                  const isEditing = editingLeg?.familyId === fam.id && editingLeg?.legKey === leg.key;
                  return (
                    <div key={leg.key} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                      {/* Node */}
                      {i === 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: fam.color + '20', border: `2px solid ${fam.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            {leg.from}
                          </div>
                        </div>
                      )}

                      {/* Leg connector + details */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Arrow line */}
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', height: '40px' }}>
                          <div style={{ flex: 1, height: '2px', background: fam.color + '40' }} />
                          <div style={{ color: fam.color, fontSize: '14px', flexShrink: 0 }}>→</div>
                          <div style={{ flex: 1, height: '2px', background: fam.color + '40' }} />
                        </div>

                        {/* Leg label */}
                        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#aaa', textAlign: 'center', marginBottom: '4px' }}>
                          {leg.label}
                        </div>
                        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#bbb', marginBottom: '4px' }}>{leg.date}</div>

                        {/* Value / edit */}
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', width: '100%', padding: '0 4px' }}>
                            <input value={editVal} onChange={e => setEditVal(e.target.value)}
                              autoFocus
                              style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontFamily: 'Nunito, sans-serif', width: '100%', boxSizing: 'border-box' }}
                              onKeyDown={e => e.key === 'Enter' && saveLeg()}
                            />
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={saveLeg} style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, cursor: 'pointer' }}>Save</button>
                              <button onClick={() => setEditingLeg(null)} style={{ background: 'none', border: 'none', fontSize: '11px', color: '#aaa', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: val ? 'var(--navy)' : '#F59E0B' }}>
                              {val || 'TBD'}
                            </div>
                            {isAdmin && (
                              <button onClick={() => startEdit(fam.id, leg.key)}
                                style={{ background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#ccc', cursor: 'pointer', marginTop: '2px' }}>
                                + edit
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Destination node */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: fam.color + '20', border: `2px solid ${fam.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                          {leg.to}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab 4: Cabin Assignments ──────────────────────────────────────────────────

function CabinsTab() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '28px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>Your Home at Sea</div>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#b8860b' }}>4 connecting staterooms on Deck 7 · Disney Destiny</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {CABINS.map(c => (
          <div key={c.room} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            {/* Top band */}
            <div style={{ background: c.color, padding: '10px 16px', textAlign: 'center' }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: 'white' }}>{c.family}</span>
            </div>
            {/* Body */}
            <div style={{ padding: '28px 16px', textAlign: 'center' }}>
              {/* Big cabin number */}
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '52px', fontWeight: 700, color: c.color, lineHeight: 1, marginBottom: '4px' }}>
                {c.room}
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#aaa', marginBottom: '10px' }}>Deck 7</div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#aaa', marginBottom: '14px' }}>Res: {c.res}</div>

              {/* Member pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '16px' }}>
                {c.members.map(m => (
                  <span key={m} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 600, background: 'var(--navy)', color: 'white', padding: '3px 10px', borderRadius: '99px' }}>
                    {m}
                  </span>
                ))}
                {(c.crossGuests || []).map(g => (
                  <span key={g.name} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 600, background: g.color, color: 'white', padding: '3px 10px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {g.name}
                    <span style={{ opacity: 0.75, fontSize: '10px' }}>({g.family})</span>
                  </span>
                ))}
              </div>

              {/* Connects */}
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: 'var(--gold)' }}>
                ↔ Connects with Cabin {c.connects}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'hotels',   emoji: '🏨', label: 'Hotels' },
  { id: 'flights',  emoji: '✈️', label: 'Flights' },
  { id: 'ground',   emoji: '🚗', label: 'Ground Transport' },
  { id: 'cabins',   emoji: '🛳️', label: 'Cabin Assignments' },
];

export default function Transportation() {
  const [activeTab, setActiveTab] = useState('hotels');

  return (
    <div style={{ background: '#F8F6F2', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ background: '#1B2A4A', height: '140px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Gold lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'rgba(244,196,48,0.2)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'rgba(244,196,48,0.2)' }} />

        {/* Compass watermark */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: '200px', opacity: 0.06, color: 'white', userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }}>
          ✦
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
            ✈️ → 🚢 THE ADVENTURE STARTS HERE
          </div>
          <h1 style={{ fontFamily: '"Dancing Script", cursive', fontSize: '48px', fontWeight: 700, color: 'var(--gold)', margin: '0 0 6px', lineHeight: 1.1 }}>
            Journey Begins
          </h1>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            Hotels, flights, and getting the whole crew to Fort Lauderdale — and home again
          </p>
        </div>
      </div>

      {/* ── Port Everglades Callout ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
          borderRadius: '16px', padding: '28px 36px',
          display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
        }}>
          {/* Anchor circle */}
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
            ⚓
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              PORT EVERGLADES — YOUR DEPARTURE POINT
            </div>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
              Terminal 4 · 1800 SE 20th St, Fort Lauderdale FL 33316
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {[
                '🕐 Arrive 90 min before your Port Arrival Time (PAT)',
                '🧳 Drop luggage with porters BEFORE parking',
                '🅿️ On-site parking available',
              ].map(badge => (
                <span key={badge} style={{
                  background: 'white', color: '#C0392B',
                  fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600,
                  padding: '6px 14px', borderRadius: '20px',
                }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  minHeight: '56px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '4px',
                  background: active ? 'var(--navy)' : 'white',
                  color: active ? 'var(--gold)' : 'var(--navy)',
                  border: 'none', borderBottom: active ? 'none' : '2px solid var(--navy)',
                  cursor: 'pointer', padding: '12px 8px',
                  transition: 'background 0.2s',
                }}
              >
                <span style={{ fontSize: '22px', lineHeight: 1 }}>{tab.emoji}</span>
                <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '15px', fontWeight: 700, lineHeight: 1 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 80px' }}>
        {activeTab === 'hotels'  && <HotelsTab />}
        {activeTab === 'flights' && <FlightsTab />}
        {activeTab === 'ground'  && <GroundTab />}
        {activeTab === 'cabins'  && <CabinsTab />}
      </div>

    </div>
  );
}
