import HeroSection from '../components/home/HeroSection';
import TodoSummaryWidget from '../components/home/TodoSummaryWidget';
import CheckInCheatSheet from '../components/home/CheckInCheatSheet';
import NavButtons from '../components/home/NavButtons';

export default function Home() {
  return (
    <div>
      {/* Hero — full viewport, pulls up behind fixed header via marginTop: -68px */}
      <HeroSection />

      {/* Mission Control — family to-do progress */}
      <TodoSummaryWidget />

      {/* Check-In Cheat Sheet + article summary */}
      <CheckInCheatSheet />

      {/* Explore the Magic — 3 featured page cards */}
      <NavButtons />
    </div>
  );
}
