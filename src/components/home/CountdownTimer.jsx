import { useState, useEffect } from 'react';
import { TRIP } from '../../data/initialData';

const DEPARTURE = new Date(TRIP.departureDate);

function getTimeLeft() {
  const now = new Date();
  const diff = DEPARTURE - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, departed: true };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    departed: false,
  };
}

function Digit({ value, label }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="countdown-card px-5 py-4 sm:px-7 sm:py-5 min-w-[80px] sm:min-w-[108px] text-center">
        <span className="font-playfair font-black text-5xl sm:text-7xl leading-none"
              style={{ color: 'var(--gold)' }}>
          {display}
        </span>
      </div>
      <span className="font-nunito font-700 text-xs sm:text-sm mt-2 uppercase tracking-widest"
            style={{ color: 'rgba(174,214,241,0.8)' }}>
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.departed) {
    return (
      <section className="frozen-bg py-20 text-center">
        <div className="float">
          <div className="font-playfair font-black text-5xl sm:text-7xl" style={{ color: 'var(--gold)' }}>
            We're Sailing!
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="frozen-bg py-14 sm:py-20">
      <div style={{ maxWidth: '800px', margin: '0 auto' }} className="px-6 text-center">
        {/* Top label */}
        <p className="font-nunito font-700 text-sm sm:text-base uppercase tracking-widest mb-6"
           style={{ color: 'rgba(174,214,241,0.85)' }}>
          The magic begins in
        </p>

        {/* Digits */}
        <div className="flex justify-center items-end gap-3 sm:gap-5 flex-wrap">
          <Digit value={time.days}    label="Days" />
          <span className="font-playfair font-black text-4xl sm:text-6xl mb-8 leading-none"
                style={{ color: 'rgba(174,214,241,0.5)' }}>:</span>
          <Digit value={time.hours}   label="Hours" />
          <span className="font-playfair font-black text-4xl sm:text-6xl mb-8 leading-none"
                style={{ color: 'rgba(174,214,241,0.5)' }}>:</span>
          <Digit value={time.minutes} label="Minutes" />
          <span className="font-playfair font-black text-4xl sm:text-6xl mb-8 leading-none"
                style={{ color: 'rgba(174,214,241,0.5)' }}>:</span>
          <Digit value={time.seconds} label="Seconds" />
        </div>

        {/* Sub-label */}
        <p className="font-nunito text-base sm:text-lg mt-8" style={{ color: 'rgba(255,255,255,0.75)' }}>
          <span className="font-bold" style={{ color: 'var(--gold)' }}>Disney Destiny</span>
          {' '}sets sail from{' '}
          <span className="font-bold" style={{ color: 'var(--gold)' }}>Fort Lauderdale</span>
          {' '}·{' '}
          <span style={{ color: 'rgba(174,214,241,0.9)' }}>July 23, 2026</span>
        </p>

        {/* Snowflake accents */}
        <div className="mt-8 flex justify-center gap-5 text-xl" style={{ color: 'rgba(174,214,241,0.35)' }}>
          <span className="sparkle" style={{ animationDelay: '0s' }}>❄</span>
          <span className="sparkle" style={{ animationDelay: '0.5s' }}>✦</span>
          <span className="sparkle" style={{ animationDelay: '1s' }}>❄</span>
          <span className="sparkle" style={{ animationDelay: '1.5s' }}>✦</span>
          <span className="sparkle" style={{ animationDelay: '2s' }}>❄</span>
        </div>
      </div>
    </section>
  );
}
