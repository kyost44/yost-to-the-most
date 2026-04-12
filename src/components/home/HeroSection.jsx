import { useState, useEffect } from 'react';

// Departure: July 23, 2026 at 3:00 PM
const DEPARTURE = new Date('2026-07-23T15:00:00');

// 50 deterministic stars
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id:       i,
  top:      ((i * 37 + 11) % 90) + 2,
  left:     ((i * 61 + 7)  % 96) + 2,
  size:     ((i % 4) === 0 ? 2.5 : (i % 3) === 0 ? 2 : 1.5),
  duration: 2 + (i % 5) * 0.6,
  delay:    (i * 0.18) % 4,
  opacity:  0.55 + ((i % 5) * 0.09),
}));

function computeTimeLeft() {
  const diff = DEPARTURE - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function CountdownDigit({ value, label }) {
  const display = String(value).padStart(2, '0');
  return (
    <div
      className="flex flex-col items-center justify-start"
      style={{ minHeight: '90px' }}
    >
      <span
        className="font-playfair font-black leading-none tabular-nums"
        style={{
          fontSize:      'clamp(48px, 9vw, 72px)',
          color:         'white',
          letterSpacing: '-2px',
          lineHeight:    1,
        }}
      >
        {display}
      </span>
      <span
        className="font-nunito font-semibold uppercase tracking-widest"
        style={{
          fontSize:      '11px',
          color:         'rgba(255,255,255,0.45)',
          letterSpacing: '0.18em',
          marginTop:     '12px',
          whiteSpace:    'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Dot() {
  return (
    <span
      className="font-playfair font-black"
      style={{
        fontSize:   'clamp(36px, 6vw, 58px)',
        color:      'var(--gold)',
        lineHeight: 1,
        marginTop:  '4px',
        opacity:    0.6,
        alignSelf:  'flex-start',
        paddingTop: '8px',
      }}
    >
      ·
    </span>
  );
}

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState(computeTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(computeTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      style={{
        position:      'relative',
        height:        '100vh',
        minHeight:     '560px',
        marginTop:     '-68px',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        justifyContent:'center',
        background:    'linear-gradient(170deg, #0F1B35 0%, #1B2A4A 45%, #2D1B69 100%)',
        overflow:      'visible',
      }}
    >
      {/* ── Star field ── */}
      {STARS.map(s => (
        <span
          key={s.id}
          style={{
            position:      'absolute',
            top:           `${s.top}%`,
            left:          `${s.left}%`,
            width:         `${s.size}px`,
            height:        `${s.size}px`,
            borderRadius:  '50%',
            background:    'white',
            opacity:       s.opacity,
            animation:     `star-twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Content ── */}
      <div
        className="relative text-center px-5"
        style={{ maxWidth: '860px', width: '100%', zIndex: 2 }}
      >
        {/* Eyebrow */}
        <p
          className="font-nunito font-bold uppercase tracking-widest hero-fade-in"
          style={{
            fontSize:      '12px',
            color:         'rgba(255,255,255,0.5)',
            letterSpacing: '0.22em',
            marginBottom:  '18px',
            animationDelay:'0s',
          }}
        >
          DISNEY DESTINY · JULY 2026
        </p>

        {/* Main title */}
        <h1
          className="font-dancing font-bold hero-fade-in"
          style={{
            fontSize:      'clamp(40px, 9vw, 72px)',
            color:         'var(--gold)',
            lineHeight:    1.1,
            marginBottom:  '14px',
            animationDelay:'0.18s',
            textShadow:    '0 2px 30px rgba(244,196,48,0.25)',
          }}
        >
          Yost to the Most
        </h1>

        {/* Gold divider line */}
        <div
          className="hero-fade-in"
          style={{
            height:        '1px',
            background:    'linear-gradient(to right, transparent, rgba(244,196,48,0.5), transparent)',
            margin:        '0 auto 36px',
            maxWidth:      '280px',
            animationDelay:'0.3s',
          }}
        />

        {/* Countdown */}
        <div
          className="flex items-start justify-center gap-3 sm:gap-5 hero-fade-in"
          style={{ animationDelay: '0.45s', flexWrap: 'wrap' }}
        >
          <CountdownDigit value={timeLeft.days}    label="Days"    />
          <Dot />
          <CountdownDigit value={timeLeft.hours}   label="Hours"   />
          <Dot />
          <CountdownDigit value={timeLeft.minutes} label="Minutes" />
          <Dot />
          <CountdownDigit value={timeLeft.seconds} label="Seconds" />
        </div>

        {/* Two-line subtitle */}
        <div
          className="hero-fade-in"
          style={{ marginTop: '20px', animationDelay: '0.6s' }}
        >
          <p
            className="font-playfair font-bold"
            style={{ fontSize: '20px', color: '#F4C430', lineHeight: 1.3 }}
          >
            Disney Destiny
          </p>
          <p
            className="font-nunito"
            style={{
              fontSize:   '15px',
              color:      'rgba(255,255,255,0.85)',
              marginTop:  '12px',
              lineHeight: 1.4,
            }}
          >
            July 23 – July 27, 2026 · Fort Lauderdale
          </p>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="scroll-bounce"
        style={{
          position:   'absolute',
          bottom:     '96px',   // above the wave
          left:       '50%',
          transform:  'translateX(-50%)',
          zIndex:     2,
          display:    'flex',
          flexDirection:'column',
          alignItems: 'center',
          gap:        '6px',
          cursor:     'default',
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        <span
          style={{
            color:    'rgba(255,255,255,0.6)',
            fontSize: '28px',
            lineHeight: 1,
          }}
        >
          ↓
        </span>
        <span
          className="font-nunito"
          style={{
            fontSize:      '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.35)',
          }}
        >
          scroll to explore
        </span>
      </div>

      {/* ── Wave divider ── */}
      <div
        style={{
          position:   'absolute',
          bottom:     '-2px',
          left:       0,
          width:      '100%',
          overflow:   'hidden',
          lineHeight: 0,
          zIndex:     3,
        }}
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '80px' }}
        >
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#FFF8F0"
          />
        </svg>
      </div>
    </section>
  );
}
