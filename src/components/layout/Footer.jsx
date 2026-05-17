import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-12" style={{ background: '#0F1B35' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="px-6">

        {/* 3-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          alignItems: 'start',
          marginBottom: '32px',
        }}>
          {/* Col 1 — Site identity */}
          <div style={{ textAlign: 'center' }}>
            <div className="font-dancing font-bold mb-1" style={{ fontSize: '26px', color: 'var(--gold)' }}>
              Yost Disney Destiny
            </div>
            <p className="font-nunito" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', margin: 0 }}>
              Disney Destiny · Fort Lauderdale<br />July 23–27, 2026
            </p>
          </div>

          {/* Col 2 — Quick links */}
          <div style={{ textAlign: 'center' }}>
            <div className="font-nunito font-bold mb-3" style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Quick Links
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { to: '/my-yosties',   label: 'My Yosties' },
                { to: '/need-to-know', label: "Captain's Orders" },
                { to: '/calendar',     label: 'Schedule' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="font-nunito footer-link"
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Cruise details */}
          <div style={{ textAlign: 'center' }}>
            <p className="font-nunito" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: 0 }}>
              Disney Destiny<br />
              Fort Lauderdale<br />
              July 23–27, 2026
            </p>
          </div>
        </div>

        {/* Divider stars — centered below all columns */}
        <div className="flex items-center justify-center gap-5">
          <span style={{ color: 'var(--gold)', opacity: 0.5, fontSize: '12px', letterSpacing: '8px' }}>✦</span>
          <span style={{ color: 'var(--gold)', opacity: 0.9, fontSize: '16px', letterSpacing: '8px' }}>✦</span>
          <span style={{ color: 'var(--gold)', opacity: 0.5, fontSize: '12px', letterSpacing: '8px' }}>✦</span>
        </div>
      </div>
    </footer>
  );
}
