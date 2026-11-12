import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetISO: string;
  dark?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calcTimeLeft(targetISO: string): TimeLeft {
  const target = new Date(targetISO).getTime();
  const now = Date.now();
  const diff = target - now;
  if (isNaN(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false
  };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetISO, dark = true }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetISO));

  useEffect(() => {
    setTimeLeft(calcTimeLeft(targetISO));
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(targetISO)), 1000);
    return () => clearInterval(timer);
  }, [targetISO]);

  if (timeLeft.isPast) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500/20 border border-gold-300/60 text-gold-200 font-serif text-lg">
        Happily Celebrated — Forever Begins
      </div>
    );
  }

  const boxes = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg mx-auto" role="timer" aria-live="polite">
      {boxes.map((item) => (
        <div
          key={item.label}
          className={`flex flex-col items-center justify-center rounded-2xl px-2 py-3 sm:py-4 border backdrop-blur-md transition-transform hover:scale-105 ${
            dark
              ? 'bg-maroon-950/65 border-gold-400/50 text-ivory-pure shadow-gold'
              : 'bg-ivory-pure border-gold-400/60 text-maroon-900 shadow-royal'
          }`}
        >
          <span className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-gold-400">
            {String(item.value).padStart(2, '0')}
          </span>
          <span
            className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-1 ${
              dark ? 'text-beige-soft/80' : 'text-maroon-800/75'
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

