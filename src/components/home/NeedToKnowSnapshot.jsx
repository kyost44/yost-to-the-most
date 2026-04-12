import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

export default function NeedToKnowSnapshot() {
  const { needToKnow } = useData();
  const items = needToKnow.slice(0, 3);

  return (
    <section className="py-14 px-6" style={{ background: '#EFF2F8' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p
              className="font-nunito font-bold uppercase tracking-widest mb-1"
              style={{ fontSize: '11px', color: 'var(--coral)', letterSpacing: '0.2em' }}
            >
              GOOD TO KNOW
            </p>
            <h2
              className="font-playfair font-black section-title"
              style={{ fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.1 }}
            >
              Before You Pack Your Bags
            </h2>
            <p className="font-nunito text-sm mt-1" style={{ color: '#888' }}>
              Critical info before you set sail
            </p>
          </div>
          <Link
            to="/need-to-know"
            className="font-nunito font-semibold text-sm px-5 py-2.5 rounded-xl border transition-all hover:shadow-md"
            style={{ borderColor: 'var(--coral)', color: 'var(--coral)', flexShrink: 0 }}
          >
            See All →
          </Link>
        </div>

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5"
              style={{
                borderLeft: '4px solid var(--coral)',
                boxShadow:  '0 2px 16px rgba(27,42,74,0.07)',
              }}
            >
              {/* Icon row + urgent dot */}
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: '26px', lineHeight: 1 }}>{item.icon}</span>
                {item.priority === 'urgent' && (
                  <span
                    className="font-nunito font-bold uppercase"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      background: 'var(--coral)',
                      color: 'white',
                      borderRadius: '999px',
                      padding: '2px 8px',
                    }}
                  >
                    Urgent
                  </span>
                )}
                {item.priority === 'important' && (
                  <span
                    className="font-nunito font-bold uppercase"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      background: '#fff8e1',
                      color: '#a16207',
                      border: '1px solid #fde68a',
                      borderRadius: '999px',
                      padding: '2px 8px',
                    }}
                  >
                    Important
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className="font-nunito font-bold leading-snug mb-2"
                style={{ fontSize: '15px', color: 'var(--navy)' }}
              >
                {item.title}
              </h3>

              {/* Body — 3-line clamp */}
              <p
                className="font-nunito text-sm leading-relaxed"
                style={{
                  color: '#666',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-6 text-center">
          <Link
            to="/need-to-know"
            className="font-nunito font-semibold text-sm transition-colors"
            style={{ color: 'var(--navy)' }}
          >
            View all reminders &amp; trip intel →
          </Link>
        </div>
      </div>
    </section>
  );
}
