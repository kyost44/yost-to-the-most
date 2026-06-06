import { useState } from 'react';

// ── Check-In Cheat Sheet ──────────────────────────────────────────────────────
// Two-part section: (A) cheat-sheet image with lightbox,
//                   (B) article summary card linking to meandthemouse.com

export default function CheckInCheatSheet() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div style={{ background: '#FBF7F0', padding: '56px 0' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: 'var(--coral)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
            ✅ BE READY ON CHECK-IN DAY
          </div>
          <h2 style={{ fontFamily: '"Dancing Script", cursive', fontSize: '40px', fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.1 }}>
            Online Check-In Cheat Sheet
          </h2>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#777', margin: 0 }}>
            Check-in opens midnight EST on <strong>June 23, 2026</strong> — be ready!
          </p>
        </div>

        {/* ── Part A: Image ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            onClick={() => setLightboxOpen(true)}
            style={{ cursor: 'zoom-in', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxWidth: '480px', width: '100%' }}
          >
            <img
              src="/assets/checkin-cheatsheet.jpeg"
              alt="Disney Cruise Line Online Check-In Cheat Sheet"
              style={{ width: '100%', display: 'block', borderRadius: '16px' }}
            />
          </div>
          <button
            onClick={() => setLightboxOpen(true)}
            style={{
              background: 'transparent',
              border: '2px solid var(--gold)',
              color: 'var(--navy)',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              padding: '10px 24px',
              borderRadius: '99px',
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            🔍 View Full Size
          </button>
        </div>

        {/* ── Part B: Article summary card ── */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px 36px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
          border: '1px solid #f0e8d8',
        }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '22px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>
            📋 DCL Check-In — What You Need to Know
          </div>
          <ul style={{ margin: '0 0 24px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', listStyleType: 'none', padding: 0 }}>
            {[
              'Earlier check-in = earlier Port Arrival Time = earlier boarding — be ready at midnight EST',
              'Have your passport, a plain-background headshot for each traveler, hotel info, flight info, and a credit card on hand',
              'You can complete check-in on the Disney Cruise Line website',
            ].map((bullet, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--gold)', fontSize: '18px', lineHeight: 1.4, flexShrink: 0 }}>✦</span>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#444', lineHeight: 1.6 }}>{bullet}</span>
              </li>
            ))}
          </ul>

          <a
            href="https://meandthemouse.com/a-disney-cruise-line-online-check-in-cheat-sheet/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'transparent',
              border: '2px solid var(--gold)',
              color: 'var(--navy)',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              padding: '10px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              marginBottom: '16px',
            }}
          >
            Read the Full Article →
          </a>

          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>
            Source: <a href="https://meandthemouse.com" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>meandthemouse.com</a> — A Disney Cruise Line Online Check-In Cheat Sheet
          </div>
        </div>

      </div>

      {/* ── Lightbox overlay ── */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            cursor: 'zoom-out',
          }}
        >
          <img
            src="/assets/checkin-cheatsheet.jpeg"
            alt="Disney Cruise Line Online Check-In Cheat Sheet"
            style={{
              maxWidth: '90vw', maxHeight: '90vh',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              objectFit: 'contain',
            }}
          />
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'fixed', top: '24px', right: '24px',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: '44px', height: '44px',
              color: 'white', fontSize: '22px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
