import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Heart, Instagram, Mail, Phone, Share2, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../../context/WeddingContext';
import { LanguageToggle, useLanguage } from '../../context/LanguageContext';
import { FloralDivider } from './MandalaArtwork';

export const Footer: React.FC = () => {
  const { settings } = useWedding();
  const { t, language } = useLanguage();

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t('home.share.success'));
    } catch {
      toast.error(t('home.share.error'));
    }
  };

  const handleWhatsAppShare = () => {
    const text =
      language === 'hi'
        ? `|| शुभ विवाह || आप सादर आमंत्रित हैं ${settings.coupleDisplayName} के विवाह उत्सव में। तिथि: ${settings.weddingDateFormatted}, शुभ स्थल: ${settings.primaryVenueName}, ${settings.primaryVenueCity}। निमंत्रण पत्र एवं कार्यक्रम विवरण देखें व RSVP करें: ${shareUrl}`
        : `You are cordially invited to the Royal Wedding Celebration of ${settings.coupleDisplayName} on ${settings.weddingDateFormatted} at ${settings.primaryVenueName}, ${settings.primaryVenueCity}. View invitation & RSVP here: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-maroon-950 text-ivory-pure border-t border-gold-400/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-2xl mx-auto">
          <img
            src="/images/wedding-logo.png"
            alt={`${settings.coupleDisplayName} Crest`}
            className="w-16 h-16 rounded-full mx-auto border-2 border-gold-400/70 shadow-gold mb-4"
          />
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-gold-300">
            {settings.coupleDisplayName}
          </h2>
          <p className="text-xs uppercase tracking-[0.28em] text-beige-soft/80 mt-1">
            {settings.weddingDateFormatted} • {settings.primaryVenueCity} • {settings.hashtag}
          </p>
          <FloralDivider dark />
          <p className="text-sm text-beige-soft/80 leading-relaxed">{settings.welcomeMessage}</p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button onClick={handleWhatsAppShare} className="btn-gold !py-2.5 !px-5 !text-xs">
              <Share2 className="w-4 h-4" /> {t('footer.shareWhatsApp')}
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium border border-gold-400/50 text-gold-200 hover:bg-white/10 transition"
            >
              <Copy className="w-4 h-4" /> {t('footer.copyLink')}
            </button>
          </div>

          {/* Quick Language Preference Pill in Footer */}
          <div className="flex items-center justify-center gap-2.5 mt-6 pt-5 border-t border-gold-400/15">
            <span className="text-xs text-beige-soft/80">{t('lang.label')}</span>
            <LanguageToggle />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-12 pt-10 border-t border-gold-400/20 text-sm">
          <div>
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-gold-300 mb-3">
              {t('footer.celebration')}
            </h3>
            <ul className="space-y-2 text-beige-soft/80">
              <li><Link to="/" className="hover:text-gold-300">{t('nav.home')}</Link></li>
              <li><Link to="/our-story" className="hover:text-gold-300">{t('nav.ourStory')}</Link></li>
              <li><Link to="/events" className="hover:text-gold-300">{t('nav.events')}</Link></li>
              <li><Link to="/schedule" className="hover:text-gold-300">{t('nav.schedule')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-gold-300 mb-3">
              {t('footer.memories')}
            </h3>
            <ul className="space-y-2 text-beige-soft/80">
              <li><Link to="/gallery" className="hover:text-gold-300">{t('nav.gallery')}</Link></li>
              <li><Link to="/videos" className="hover:text-gold-300">{t('nav.videos')}</Link></li>
              <li><Link to="/family" className="hover:text-gold-300">{t('nav.family')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-gold-300 mb-3">
              {t('footer.services')}
            </h3>
            <ul className="space-y-2 text-beige-soft/80">
              <li><Link to="/venue" className="hover:text-gold-300">{t('nav.venue')}</Link></li>
              <li><Link to="/rsvp" className="hover:text-gold-300">{t('nav.rsvp')}</Link></li>
              <li><Link to="/contact" className="hover:text-gold-300">{t('nav.contact')}</Link></li>
              <li><Link to="/admin/login" className="hover:text-gold-300">{t('nav.adminPortal')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-gold-300 mb-3">
              {t('footer.connect')}
            </h3>
            <ul className="space-y-2.5 text-beige-soft/80">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-gold-300">
                  {settings.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-gold-300 truncate">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-3 pt-1">
                {settings.socialLinks?.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="p-2 rounded-full bg-white/5 hover:bg-gold-500/20 text-gold-300"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.youtube && (
                  <a
                    href={settings.socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="p-2 rounded-full bg-white/5 hover:bg-gold-500/20 text-gold-300"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gold-400/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-beige-soft/70">
          <p className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            <span>{t('footer.craftedWith')}</span>
          </p>
          <p className="flex items-center gap-1.5 text-center sm:text-right">
            <span>{t('footer.createdBy')}</span>
            <span className="text-gold-300 font-semibold">VivekaJee</span>
            <span>&amp;</span>
            <a
              href="https://innovateria.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-300 font-semibold hover:text-gold-200 hover:underline transition"
            >
              Innovateria.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
