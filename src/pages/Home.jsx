import HeroSection from '../components/home/HeroSection';
import TodoSummaryWidget from '../components/home/TodoSummaryWidget';
import KristensTop3 from '../components/home/KristensTop3';
import NavButtons from '../components/home/NavButtons';

export default function Home() {
  return (
    <div>
      {/* Hero — full viewport, pulls up behind fixed header via marginTop: -68px */}
      <HeroSection />

      {/* Mission Control — family to-do progress */}
      <TodoSummaryWidget />

      {/* Kristen's Top 3 — most important actions this week */}
      <KristensTop3 />

      {/* Explore the Magic — 3 featured page cards */}
      <NavButtons />
    </div>
  );
}
