import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

// 4 primary links visible in the bar
const PRIMARY_LINKS = [
  { to: '/',             label: 'Home' },
  { to: '/todo',         label: 'To-Do' },
  { to: '/need-to-know', label: "Captain's Orders" },
  { to: '/calendar',     label: 'Schedule' },
];

// Links inside the "More ▾" dropdown — with icons for scannability
const MORE_LINKS = [
  { to: '/my-yosties',   label: 'My Yosties',     icon: '⭐' },
  { to: '/transportation',label: 'Journey Begins', icon: '✈️' },
  { to: '/tshirt',       label: 'Suit Up',         icon: '👕' },
  { to: '/highlights',   label: 'The Magic Aboard',icon: '✨' },
  { to: '/gallery',      label: 'Photo Gallery',   icon: '📸' },
];

const ALL_LINKS = [...PRIMARY_LINKS, ...MORE_LINKS];

export default function Header() {
  const { isAdmin, login, logout, loginError, setLoginError } = useAdmin();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [dropOpen,  setDropOpen]  = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pw, setPw]               = useState('');
  const [scrolled, setScrolled]   = useState(false);
  const location                  = useLocation();
  const dropRef                   = useRef(null);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location.pathname]);

  function handleLogin(e) {
    e.preventDefault();
    const ok = login(pw);
    if (ok) { setPw(''); setShowLogin(false); }
  }

  const isHome      = location.pathname === '/';
  const transparent = isHome && !scrolled;

  const headerBg     = transparent ? 'transparent' : '#1B2A4A';
  const headerShadow = transparent ? 'none' : '0 2px 24px rgba(0,0,0,0.28)';

  // Transparent over hero → pure white; Solid navy → warm gold
  const linkColor = transparent ? '#FFFFFF' : '#F4C430';

  function navLinkStyle(to) {
    const active = location.pathname === to;
    return {
      color:                   linkColor,
      fontWeight:              600,
      fontSize:                '16px',
      letterSpacing:           '0.04em',
      textDecorationLine:      active ? 'underline' : 'none',
      textDecorationColor:     '#F4C430',
      textDecorationThickness: '2px',
      textUnderlineOffset:     '5px',
    };
  }

  return (
    <>
      <header
        style={{
          position:   'fixed',
          top:        0,
          left:       0,
          right:      0,
          zIndex:     50,
          background: headerBg,
          boxShadow:  headerShadow,
          transition: 'background 0.35s ease, box-shadow 0.35s ease',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="px-5 py-3 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/" className="flex flex-col flex-shrink-0" style={{ gap: '2px', textDecoration: 'none' }}>
            <span
              className="font-dancing font-bold leading-none select-none"
              style={{ fontSize: '26px', color: 'var(--gold)', letterSpacing: '-0.5px' }}
            >
              Yost Disney Destiny
            </span>
            <span
              className="font-nunito"
              style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.06em', lineHeight: 1 }}
            >
              Disney Destiny · July 2026
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center" style={{ gap: '32px' }}>
            {PRIMARY_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="font-nunito rounded-lg transition-all hover:opacity-75"
                style={navLinkStyle(to)}
              >
                {label}
              </Link>
            ))}

            {/* More ▾ dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen(v => !v)}
                className="flex items-center gap-1 font-nunito transition-all hover:opacity-75"
                style={{
                  color:       linkColor,
                  fontSize:    '16px',
                  fontWeight:  600,
                  letterSpacing: '0.04em',
                  background:  'none',
                  border:      'none',
                  cursor:      'pointer',
                  padding:     0,
                }}
              >
                More
                <span style={{
                  display:    'inline-block',
                  transform:  dropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  fontSize:   '10px',
                  marginLeft: '2px',
                }}>▾</span>
              </button>

              {dropOpen && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden"
                  style={{
                    background: 'white',
                    boxShadow:  '0 8px 32px rgba(27,42,74,0.18)',
                    minWidth:   '220px',
                    border:     '1px solid rgba(27,42,74,0.08)',
                  }}
                >
                  {MORE_LINKS.map(({ to, label, icon }) => {
                    const active = location.pathname === to;
                    return (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center font-nunito font-semibold transition-all"
                        style={{
                          padding:        '16px 20px',
                          fontSize:       '15px',
                          gap:            '10px',
                          color:          active ? 'var(--coral)' : 'var(--navy)',
                          borderLeft:     active ? '3px solid var(--coral)' : '3px solid transparent',
                          textDecoration: 'none',
                          background:     active ? 'rgba(255,107,107,0.05)' : 'white',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderLeftColor = 'var(--coral)';
                          e.currentTarget.style.background = 'rgba(255,107,107,0.04)';
                        }}
                        onMouseLeave={e => {
                          if (!active) {
                            e.currentTarget.style.borderLeftColor = 'transparent';
                            e.currentTarget.style.background = 'white';
                          }
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{icon}</span>
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* ── Admin pill + hamburger ── */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1.5 font-bold rounded-full transition-colors"
                style={{
                  background: 'var(--gold)',
                  color:      '#1B2A4A',
                  fontSize:   '14px',
                  padding:    '10px 18px',
                  border:     'none',
                  cursor:     'pointer',
                }}
              >
                Admin · Sign Out
              </button>
            ) : (
              <button
                onClick={() => { setShowLogin(true); setLoginError(''); }}
                className="hidden md:flex items-center gap-1.5 font-bold rounded-full transition-all hover:bg-white/10"
                style={{
                  border:     `2px solid ${transparent ? '#FFFFFF' : '#F4C430'}`,
                  color:      transparent ? '#FFFFFF' : '#F4C430',
                  fontSize:   '14px',
                  padding:    '10px 18px',
                  background: 'none',
                  cursor:     'pointer',
                }}
              >
                Admin
              </button>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden text-2xl leading-none"
              style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <div
            className="md:hidden border-t px-5 py-4"
            style={{ background: '#1B2A4A', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <nav className="flex flex-col gap-1">
              {ALL_LINKS.map(({ to, label }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-nunito font-semibold transition-all"
                    style={{
                      fontSize:       '15px',
                      color:          active ? 'var(--gold)' : 'white',
                      background:     active ? 'rgba(244,196,48,0.15)' : undefined,
                      textDecoration: 'none',
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              {isAdmin ? (
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full font-bold px-3 py-2.5 rounded-xl"
                  style={{ background: 'var(--gold)', color: '#1B2A4A', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                  Admin Mode — Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { setShowLogin(true); setMenuOpen(false); setLoginError(''); }}
                  className="w-full border-2 font-bold px-3 py-2.5 rounded-xl"
                  style={{
                    borderColor: 'rgba(244,196,48,0.4)',
                    color:       'rgba(244,196,48,0.8)',
                    fontSize:    '13px',
                    background:  'none',
                    cursor:      'pointer',
                  }}
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Admin login modal ── */}
      {showLogin && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowLogin(false)}
        >
          <div
            className="rounded-2xl p-8 w-full max-w-sm shadow-2xl"
            style={{ background: 'white' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-xl"
                   style={{ background: '#1B2A4A' }}>
                🔑
              </div>
              <h2 className="font-playfair font-bold text-2xl" style={{ color: '#1B2A4A' }}>
                Admin Login
              </h2>
              <p className="text-gray-400 text-sm mt-1 font-nunito">Enter the magic password</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full border rounded-xl px-4 py-3 font-nunito focus:outline-none"
                style={{ borderColor: '#e0e0e0', color: 'var(--charcoal)' }}
              />
              {loginError && (
                <p className="text-red-500 text-sm text-center font-nunito">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full font-nunito font-bold py-3 rounded-xl text-white"
                style={{ background: '#1B2A4A' }}
              >
                Unlock
              </button>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="w-full text-gray-400 hover:text-gray-600 text-sm py-2 font-nunito"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
