import { Link } from 'react-router-dom';

// Three featured cards shown on the homepage
const FEATURED = [
  {
    to:       '/my-yosties',
    label:    'My Yosties',
    icon:     '🏰',
    desc:     'Your family dashboard — cabin details, members & group stats',
    gradient: 'linear-gradient(135deg, #1B2A4A 0%, #2a3f6a 100%)',
    accent:   'var(--gold)',
  },
  {
    to:       '/calendar',
    label:    'Adventure Map',
    icon:     '⚓',
    desc:     'Day-by-day itinerary · Nassau · Castaway Cay · Sea Days',
    gradient: 'linear-gradient(135deg, #0d4a4a 0%, #145f5f 100%)',
    accent:   '#5ce0d8',
  },
  {
    to:       '/highlights',
    label:    'Hidden Mickeys',
    icon:     '🎭',
    desc:     'Top experiences, must-dos & onboard secrets',
    gradient: 'linear-gradient(135deg, #5a1010 0%, #7a1a1a 100%)',
    accent:   '#ff9f9f',
  },
];

export default function NavButtons() {
  return (
    <section className="px-6" style={{ background: 'var(--cream)', paddingTop: '72px', paddingBottom: '72px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section header */}
        <div className="mb-8">
          <p
            className="font-nunito font-bold uppercase tracking-widest mb-1"
            style={{ fontSize: '11px', color: 'var(--coral)', letterSpacing: '0.2em' }}
          >
            🏰 EXPLORE
          </p>
          <h2
            className="font-playfair font-black section-title"
            style={{ fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.1 }}
          >
            Explore the Magic
          </h2>
        </div>

        {/* 3 featured gradient cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURED.map(card => (
            <Link
              key={card.to}
              to={card.to}
              className="rounded-2xl p-7 flex flex-col"
              style={{
                background:    card.gradient,
                textDecoration:'none',
                minHeight:     '220px',
                position:      'relative',
                overflow:      'hidden',
                transition:    'transform 0.25s ease, box-shadow 0.25s ease',
                boxShadow:     '0 4px 16px rgba(0,0,0,0.18)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.32)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
              }}
            >
              {/* Big faded icon in background */}
              <span
                aria-hidden="true"
                style={{
                  position:   'absolute',
                  right:      '-8px',
                  bottom:     '-8px',
                  fontSize:   '80px',
                  opacity:    0.08,
                  lineHeight: 1,
                  pointerEvents: 'none',
                }}
              >
                {card.icon}
              </span>

              {/* Small foreground icon */}
              <span style={{ fontSize: '36px', marginBottom: '12px' }}>{card.icon}</span>

              {/* Label */}
              <div
                className="font-playfair font-black mb-2"
                style={{ fontSize: '20px', color: card.accent, lineHeight: 1.2 }}
              >
                {card.label}
              </div>

              {/* Description */}
              <p
                className="font-nunito text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.65)', flexGrow: 1 }}
              >
                {card.desc}
              </p>

              {/* Arrow */}
              <div
                className="mt-4 font-nunito font-bold"
                style={{ fontSize: '14px', color: 'var(--gold)' }}
                onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
              >
                Explore →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
