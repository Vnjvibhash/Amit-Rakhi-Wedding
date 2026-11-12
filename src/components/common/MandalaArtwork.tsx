import React from 'react';

export const MandalaSpinner: React.FC<{ className?: string }> = ({
  className = 'w-64 h-64 text-gold-400/20'
}) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`animate-spin-slow pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
    <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="100" r="64" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="100" cy="100" r="42" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="100" r="18" stroke="currentColor" strokeWidth="1.2" />
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16;
      return (
        <g key={i} transform={`rotate(${angle} 100 100)`}>
          <path
            d="M100 18 C108 32, 108 46, 100 58 C92 46, 92 32, 100 18 Z"
            stroke="currentColor"
            strokeWidth="0.9"
            fill="currentColor"
            fillOpacity="0.06"
          />
          <path
            d="M100 6 C104 14, 104 20, 100 26 C96 20, 96 14, 100 6 Z"
            stroke="currentColor"
            strokeWidth="0.7"
          />
          <circle cx="100" cy="68" r="2.2" fill="currentColor" />
        </g>
      );
    })}
  </svg>
);

export const FloralDivider: React.FC<{ className?: string; dark?: boolean }> = ({
  className = '',
  dark = false
}) => {
  const lineColor = dark ? 'bg-gold-400/40' : 'bg-gold-500/40';
  const stroke = dark ? '#E6C97A' : '#B8860B';
  return (
    <div className={`flex items-center justify-center gap-3 my-4 ${className}`} aria-hidden="true">
      <span className={`h-px w-14 sm:w-24 ${lineColor}`} />
      <svg width="46" height="22" viewBox="0 0 46 22" fill="none">
        <path
          d="M23 2 C26 8, 30 11, 23 19 C16 11, 20 8, 23 2 Z"
          stroke={stroke}
          strokeWidth="1.2"
          fill={stroke}
          fillOpacity="0.18"
        />
        <path
          d="M23 11 C15 6, 8 7, 4 11 C8 15, 15 16, 23 11 Z"
          stroke={stroke}
          strokeWidth="1"
          fill={stroke}
          fillOpacity="0.1"
        />
        <path
          d="M23 11 C31 6, 38 7, 42 11 C38 15, 31 16, 23 11 Z"
          stroke={stroke}
          strokeWidth="1"
          fill={stroke}
          fillOpacity="0.1"
        />
        <circle cx="23" cy="11" r="2" fill={stroke} />
      </svg>
      <span className={`h-px w-14 sm:w-24 ${lineColor}`} />
    </div>
  );
};

export const ToranCorner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <path d="M4 4 L110 4 M4 4 L4 110" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.6" />
    <path d="M14 14 L85 14 M14 14 L14 85" stroke="#D4AF37" strokeWidth="0.9" strokeOpacity="0.4" />
    <path
      d="M4 4 C28 12, 34 28, 18 38 C28 34, 34 28, 38 18 C28 34, 12 28, 4 4 Z"
      fill="#D4AF37"
      fillOpacity="0.28"
      stroke="#D4AF37"
      strokeWidth="0.9"
    />
    <circle cx="14" cy="14" r="3" fill="#D4AF37" fillOpacity="0.7" />
  </svg>
);

export const JharokhaFrame: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`relative p-2 sm:p-3 bg-gradient-to-b from-gold-300/60 via-gold-500/40 to-gold-700/50 rounded-t-[999px] rounded-b-2xl shadow-royal ${className}`}
  >
    <div className="relative overflow-hidden rounded-t-[999px] rounded-b-xl border-2 border-ivory-pure/80 bg-maroon-900">
      {children}
    </div>
  </div>
);

