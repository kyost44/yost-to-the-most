import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LS_KEY = 'ydd_welcomed';

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(LS_KEY, 'true');
    setVisible(false);
  }

  function skip() {
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={skip}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: '20px',
          maxWidth: '520px', width: '100%',
          padding: '40px 36px', textAlign: 'center',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Castle emoji */}
        <div style={{ fontSize: '56px', lineHeight: 1, marginBottom: '16px' }}>🏰</div>

        {/* Heading */}
        <h2 style={{
          fontFamily: '"Dancing Script", cursive',
          fontSize: '36px', fontWeight: 700,
          color: 'var(--navy)', margin: '0 0 16px',
          lineHeight: 1.2,
        }}>
          Welcome to Yost Disney Destiny!
        </h2>

        {/* Subtext */}
        <p style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '15px',
          color: '#333', lineHeight: 1.7, margin: '0 0 28px',
        }}>
          Your all-in-one guide to the Disney Destiny cruise — July 23–27, 2026.
          Everything your family needs to prepare, plan, and get excited is right here.
        </p>

        {/* 3-step guide */}
        <div style={{
          background: '#f8f9fc', borderRadius: '14px',
          padding: '20px 24px', marginBottom: '28px', textAlign: 'left',
        }}>
          {[
            { num: '1️⃣', text: 'Go to My Yosties and select your family' },
            { num: '2️⃣', text: "Check Captain's Orders for what needs doing now" },
            { num: '3️⃣', text: 'Browse the Schedule to see what\'s coming' },
          ].map(({ num, text }) => (
            <div key={num} style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              marginBottom: '12px', fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: 'var(--navy)',
            }}>
              <span style={{ fontSize: '20px', lineHeight: 1.2, flexShrink: 0 }}>{num}</span>
              <span style={{ lineHeight: 1.5, paddingTop: '2px' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <Link
          to="/my-yosties"
          onClick={accept}
          style={{
            display: 'block', width: '100%',
            padding: '16px 40px', borderRadius: '12px',
            background: 'var(--gold)', color: 'var(--navy)',
            fontFamily: '"Dancing Script", cursive', fontSize: '18px', fontWeight: 700,
            textDecoration: 'none', marginBottom: '14px',
            boxShadow: '0 4px 20px rgba(244,196,48,0.4)',
          }}
        >
          Let's Go! →
        </Link>

        {/* Skip link */}
        <button
          onClick={skip}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#aaa',
            textDecoration: 'underline',
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
