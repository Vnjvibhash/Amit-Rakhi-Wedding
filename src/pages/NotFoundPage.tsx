import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { FloralDivider, MandalaSpinner } from '../components/common/MandalaArtwork';

export const NotFoundPage: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center bg-royal-gradient text-ivory-pure px-4 py-28 overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
      <MandalaSpinner className="w-[520px] h-[520px] text-gold-300" />
    </div>
    <div className="relative z-10 max-w-lg text-center space-y-4">
      <p className="font-display text-xs uppercase tracking-[0.35em] text-gold-300">
        Royal Celebration Portal
      </p>
      <h1 className="font-serif text-7xl sm:text-8xl font-bold text-gold-400">404</h1>
      <h2 className="font-serif text-3xl sm:text-4xl font-semibold">
        This Courtyard Could Not Be Found
      </h2>
      <FloralDivider dark />
      <p className="text-sm text-beige-soft/85 leading-relaxed">
        It seems you wandered off the palace path. Let us guide you back to the wedding festivities.
      </p>
      <div className="pt-4">
        <Link to="/" className="btn-gold">
          <Home className="w-4 h-4" /> Return to Wedding Invitation
        </Link>
      </div>
    </div>
  </section>
);

