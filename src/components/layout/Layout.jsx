import Header from './Header';
import Footer from './Footer';
import { useAdmin } from '../../contexts/AdminContext';

export default function Layout({ children }) {
  const { isAdmin } = useAdmin();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>
      {isAdmin && (
        <div className="text-center text-xs font-bold py-1.5 font-nunito z-50"
             style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
          Admin Mode — You can edit all content sitewide
        </div>
      )}
      <Header />
      {/* paddingTop reserves space for the fixed header on all pages;
          HeroSection on the homepage pulls itself up by the same amount via marginTop: -68px */}
      <main className="flex-1" style={{ paddingTop: '68px' }}>{children}</main>
      <Footer />
    </div>
  );
}
