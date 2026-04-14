import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DAYS, DAY_GRAD, TAG_CONFIG, DEFAULT_NODE } from '../data/scheduleData';

const SHOWS = [
  {
    emoji: '🎭', title: 'Disney Hercules',
    desc: 'Brand-new Broadway-style musical — exclusive to Disney Destiny. Zero to hero on the high seas!',
    exclusive: true,
  },
  {
    emoji: '🎭', title: 'Frozen: A Musical Spectacular',
    desc: 'Broadway-style fan favorite. Perfect for the whole Yosties crew!',
    exclusive: false,
  },
  {
    emoji: '🎭', title: 'Disney Seas the Adventure',
    desc: 'Fun Broadway-style show celebrating the magic of Disney at sea.',
    exclusive: false,
  },
  {
    emoji: '🏴‍☠️', title: 'Pirate Night + Fireworks at Sea',
    desc: 'Deck party on FunnelVision Deck 11. Costume encouraged! Fireworks ~10 PM. Earlier pirate events for little ones.',
    exclusive: false,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDefaultDayIdx() {
  const now = new Date();
  const start = new Date('2026-07-22T00:00:00');
  const end   = new Date('2026-07-29T23:59:59');
  if (now >= start && now <= end) {
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return Math.min(diff, 7);
  }
  return 0; // Default to July 22
}

// ── Timeline ──────────────────────────────────────────────────────────────────

function Timeline({ day }) {
  const cfg = DAY_GRAD[day.type];
  const accentColor = cfg.from;

  // Special: resort day with no scheduled events
  if (day.events.length === 0 && day.type === 'resort') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
        borderRadius: '16px',
        padding: '52px 24px',
        textAlign: 'center',
        border: '2px dashed #81c784',
      }}>
        <div style={{ fontSize: '56px', marginBottom: '16px', lineHeight: 1 }}>🏖️</div>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '26px', fontWeight: 700, color: '#1E8449', marginBottom: '10px' }}>
          Enjoy Your Day!
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#388e3c', lineHeight: 1.7, margin: '0 auto', maxWidth: '440px' }}>
          No group schedule today — relax at the resort, hit the beach, and soak up the last day together before heading home.
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '36px' }}>
      {/* Vertical line */}
      <div style={{
        position: 'absolute',
        left: '9px',
        top: '10px',
        bottom: '10px',
        width: '3px',
        background: `linear-gradient(to bottom, ${cfg.from}, ${cfg.to})`,
        borderRadius: '2px',
        opacity: 1,
      }} />

      {day.events.map((ev, idx) => {
        const nextEv = day.events[idx + 1];
        const tagCfg = ev.tag ? TAG_CONFIG[ev.tag] : null;
        const nodeColor = tagCfg ? tagCfg.node : DEFAULT_NODE;

        return (
          <div key={idx}>
            {/* Event row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
              {/* Node */}
              <div style={{
                position: 'absolute',
                left: '-27px',
                top: '12px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: nodeColor,
                border: '3px solid white',
                boxShadow: `0 0 0 2px ${nodeColor}40`,
                flexShrink: 0,
                zIndex: 1,
              }} />

              {/* Short connector from node to card */}
              <div style={{
                position: 'absolute',
                left: '-7px',
                top: '21px',
                width: '16px',
                height: '2px',
                background: nodeColor + '60',
              }} />

              {/* Event card */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '12px 20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                flex: 1,
                borderLeft: `3px solid ${nodeColor}`,
              }}>
                <div style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: accentColor,
                  marginBottom: '4px',
                }}>
                  {ev.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#2C2C2C',
                    lineHeight: 1.4,
                  }}>
                    {ev.text}
                  </span>
                  {tagCfg && (
                    <span style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      background: tagCfg.bg,
                      color: tagCfg.color,
                      padding: '2px 8px',
                      borderRadius: '99px',
                      flexShrink: 0,
                      alignSelf: 'flex-start',
                      marginTop: '3px',
                    }}>
                      {tagCfg.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed 70px gap between events */}
            {nextEv && <div style={{ height: '70px' }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Day Hero Band ─────────────────────────────────────────────────────────────

function DayHero({ day }) {
  const cfg = DAY_GRAD[day.type];
  return (
    <div style={{
      position: 'relative',
      background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})`,
      borderRadius: '20px',
      height: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: '32px',
    }}>
      {/* Watermark emoji */}
      <div style={{
        position: 'absolute',
        right: '24px',
        fontSize: '96px',
        opacity: 0.15,
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {cfg.watermark}
      </div>

      {/* Content */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 24px' }}>
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '28px',
          fontWeight: 900,
          color: 'white',
          lineHeight: 1.1,
          marginBottom: '6px',
        }}>
          Day {day.day} — {day.label}
        </div>
        <div style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.8)',
        }}>
          {day.dateLong}
        </div>
      </div>

      {/* Day type pill */}
      <div style={{
        position: 'absolute',
        right: '20px',
        top: '16px',
        background: 'rgba(255,255,255,0.9)',
        color: cfg.from,
        fontFamily: 'Nunito, sans-serif',
        fontSize: '12px',
        fontWeight: 700,
        padding: '4px 12px',
        borderRadius: '99px',
        letterSpacing: '0.04em',
      }}>
        {cfg.label}
      </div>
    </div>
  );
}

// ── Card Deck Navigation ──────────────────────────────────────────────────────

function CardDeck({ currentIdx, onSelect }) {
  return (
    <div style={{ position: 'relative', marginBottom: '32px' }}>
      {/* Arrow left */}
      <button
        onClick={() => currentIdx > 0 && onSelect(currentIdx - 1)}
        disabled={currentIdx === 0}
        style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'white', border: '1px solid #e0e0e0',
          color: 'var(--navy)', fontSize: '18px', fontWeight: 'bold',
          cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
          opacity: currentIdx === 0 ? 0.3 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10, border: 'none',
          transition: 'opacity 0.2s',
        }}
        aria-label="Previous day"
      >
        ←
      </button>

      {/* Cards row */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        padding: '16px 56px',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        {DAYS.map((d, i) => {
          const cfg = DAY_GRAD[d.type];
          const isActive = i === currentIdx;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                flexShrink: 0,
                width: '150px',
                minHeight: '80px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})`,
                border: 'none',
                cursor: 'pointer',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transform: isActive ? 'translateY(-12px) scale(1.05)' : 'scale(0.95)',
                boxShadow: isActive
                  ? `0 16px 32px ${cfg.from}60`
                  : '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                opacity: isActive ? 1 : 0.75,
                outline: isActive ? `2px solid rgba(255,255,255,0.5)` : 'none',
                outlineOffset: '2px',
                textAlign: 'left',
              }}
              aria-label={`Day ${d.day}: ${d.label}`}
            >
              {/* Icon top-right */}
              <div style={{
                position: 'absolute', top: '8px', right: '10px',
                fontSize: '18px', lineHeight: 1,
              }}>
                {cfg.icon}
              </div>

              {/* Day number */}
              <div style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '26px',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1,
              }}>
                {d.day}
              </div>

              {/* Date + destination */}
              <div>
                <div style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}>
                  {d.dateShort}
                </div>
                <div style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.3,
                  marginTop: '2px',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}>
                  {d.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Arrow right */}
      <button
        onClick={() => currentIdx < DAYS.length - 1 && onSelect(currentIdx + 1)}
        disabled={currentIdx === DAYS.length - 1}
        style={{
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'white',
          color: 'var(--navy)', fontSize: '18px', fontWeight: 'bold',
          cursor: currentIdx === DAYS.length - 1 ? 'not-allowed' : 'pointer',
          opacity: currentIdx === DAYS.length - 1 ? 0.3 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10, border: 'none',
          transition: 'opacity 0.2s',
        }}
        aria-label="Next day"
      >
        →
      </button>
    </div>
  );
}

// ── My Yosties Callout ────────────────────────────────────────────────────────

function MyYostiesCallout() {
  return (
    <div style={{
      background: '#1B2A4A',
      borderRadius: '12px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      marginTop: '24px',
    }}>
      <p style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '15px',
        color: 'white',
        margin: 0,
      }}>
        Want to add your family's personal plans to the schedule?
      </p>
      <Link
        to="/my-yosties"
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '14px',
          fontWeight: 700,
          background: 'var(--gold)',
          color: 'var(--navy)',
          padding: '10px 20px',
          borderRadius: '10px',
          textDecoration: 'none',
          flexShrink: 0,
          transition: 'opacity 0.2s',
        }}
      >
        Go to My Yosties →
      </Link>
    </div>
  );
}

// ── Broadway Shows ────────────────────────────────────────────────────────────

function BroadwayShows() {
  return (
    <div style={{ marginTop: '64px' }}>
      {/* Section header band */}
      <div style={{
        background: '#1B2A4A',
        borderRadius: '20px 20px 0 0',
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }}>
        <div style={{
          fontFamily: '"Dancing Script", cursive',
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--gold)',
        }}>
          🎭 Broadway Shows &amp; Special Events
        </div>
        <div style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.7)',
        }}>
          Happening aboard Disney Destiny · Days 2–5 · Check the Navigator App for exact times
        </div>
      </div>

      {/* 2×2 grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        background: '#111a2e',
        padding: '24px',
        borderRadius: '0 0 20px 20px',
        alignItems: 'stretch',
      }}>
        {SHOWS.map((show, i) => (
          <ShowCard key={i} show={show} />
        ))}
      </div>
    </div>
  );
}

function ShowCard({ show }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(135deg, #2C0E37, #4A235A)',
        borderRadius: '20px',
        padding: '36px 28px',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--gold)' : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        cursor: 'default',
        border: hovered ? '1px solid var(--gold)' : '1px solid transparent',
      }}
    >
      {/* Star pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        borderRadius: '20px',
      }} />

      {/* Show emoji */}
      <div style={{ fontSize: '48px', lineHeight: 1, position: 'relative', zIndex: 1 }}>
        {show.emoji}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--gold)',
        lineHeight: 1.2,
        position: 'relative', zIndex: 1,
      }}>
        {show.title}
      </div>

      {/* Description */}
      <div style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 1.6,
        flex: 1,
        position: 'relative', zIndex: 1,
      }}>
        {show.desc}
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <span style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          background: '#FF6B6B',
          color: 'white',
          padding: '3px 10px',
          borderRadius: '99px',
          letterSpacing: '0.04em',
        }}>
          Days 2–5 · Check Navigator App
        </span>
        {show.exclusive && (
          <span style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            background: 'transparent',
            color: 'var(--gold)',
            padding: '3px 10px',
            borderRadius: '99px',
            letterSpacing: '0.04em',
            border: '1px solid var(--gold)',
          }}>
            EXCLUSIVE TO DESTINY
          </span>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CalendarPorts() {
  const [currentIdx, setCurrentIdx] = useState(getDefaultDayIdx);

  const day = DAYS[currentIdx];

  return (
    <div style={{ background: '#f8f6f2', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Page Header ── */}
        <div style={{
          maxHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginBottom: '32px',
        }}>
          <h1 style={{
            fontFamily: '"Dancing Script", cursive',
            fontSize: '42px',
            fontWeight: 700,
            color: 'var(--gold)',
            margin: 0,
            lineHeight: 1.1,
          }}>
            🌊 Adventure Map
          </h1>
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '15px',
            color: '#999',
            margin: '4px 0 0',
          }}>
            Your complete 8-day journey · July 22–29, 2026
          </p>
        </div>

        {/* ── Card Deck Navigation ── */}
        <CardDeck currentIdx={currentIdx} onSelect={setCurrentIdx} />

        {/* ── Day Hero ── */}
        <DayHero day={day} />

        {/* ── Timeline ── */}
        <Timeline day={day} />

        {/* ── My Yosties Callout ── */}
        <MyYostiesCallout />

        {/* ── Broadway Shows ── */}
        <BroadwayShows />

      </div>
    </div>
  );
}
