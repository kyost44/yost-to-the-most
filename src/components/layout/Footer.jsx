export default function Footer() {
  return (
    <footer className="py-12" style={{ background: '#0F1B35' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="px-6 text-center">
        {/* Three decorative stars */}
        <div className="flex items-center justify-center gap-5 mb-4">
          <span style={{ color: 'var(--gold)', opacity: 0.5, fontSize: '12px', letterSpacing: '8px' }}>✦</span>
          <span style={{ color: 'var(--gold)', opacity: 0.9, fontSize: '16px', letterSpacing: '8px' }}>✦</span>
          <span style={{ color: 'var(--gold)', opacity: 0.5, fontSize: '12px', letterSpacing: '8px' }}>✦</span>
        </div>

        {/* Dancing Script title */}
        <div
          className="font-dancing font-bold mb-2"
          style={{ fontSize: '26px', color: 'var(--gold)' }}
        >
          Yost Disney Destiny
        </div>

        {/* Subtitle */}
        <p className="font-nunito" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.42)' }}>
          Disney Destiny · Fort Lauderdale · July 23–27, 2026
        </p>
      </div>
    </footer>
  );
}
