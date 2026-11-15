import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../../context/WeddingContext';
import { LanguageToggle, useLanguage } from '../../context/LanguageContext';
import { FloralDivider, ToranCorner } from './MandalaArtwork';

interface InvitationCardModalProps {
  open: boolean;
  onClose: () => void;
}

export const InvitationCardModal: React.FC<InvitationCardModalProps> = ({ open, onClose }) => {
  const { settings, couple } = useWedding();
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  if (!open) return null;

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#4A0710'
      });
      const link = document.createElement('a');
      link.download = `${settings.coupleDisplayName.replace(/[^a-zA-Z0-9\u0900-\u097F]+/g, '-')}-Wedding-Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success(t('card.downloadSuccess'));
    } catch {
      toast.error(t('card.downloadError'));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={t('card.dialogTitle')}
    >
      <div className="relative max-w-xl w-full my-auto">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 w-9 h-9 rounded-full bg-ivory-pure text-maroon-900 shadow-lg flex items-center justify-center hover:bg-gold-100 transition"
          aria-label={t('card.close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable / Downloadable Card Canvas */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl bg-royal-gradient text-ivory-pure p-8 sm:p-10 border-2 border-gold-400 shadow-2xl text-center"
        >
          <ToranCorner className="absolute top-3 left-3 w-16 h-16" />
          <ToranCorner className="absolute top-3 right-3 w-16 h-16 scale-x-[-1]" />
          <ToranCorner className="absolute bottom-3 left-3 w-16 h-16 scale-y-[-1]" />
          <ToranCorner className="absolute bottom-3 right-3 w-16 h-16 scale-[-1]" />

          <div className="relative z-10 border border-gold-400/40 rounded-2xl p-6 sm:p-8 bg-maroon-950/35">
            <img
              src="/images/wedding-logo.png"
              alt="Royal Wedding Monogram"
              className="w-20 h-20 rounded-full mx-auto border-2 border-gold-400 shadow-gold mb-4"
            />
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-gold-300">
              {t('home.hero.invoc')}
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-beige-soft/80 mt-2">
              {settings.subHeadline}
            </p>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gold-300 mt-3">
              {settings.coupleDisplayName}
            </h2>
            <p className="text-xs text-beige-soft/85 mt-2">
              {couple.groom.parents} &amp; {couple.bride.parents}
            </p>

            <FloralDivider dark />

            <p className="text-xs sm:text-sm text-ivory-pure/90 leading-relaxed max-w-md mx-auto">
              {settings.invitationMessage}
            </p>

            <div className="mt-6 py-4 px-4 rounded-xl bg-maroon-900/70 border border-gold-400/40 space-y-1">
              <p className="font-serif text-2xl text-gold-300 font-semibold">
                {settings.weddingDateFormatted}
              </p>
              <p className="text-sm font-medium text-ivory-pure">{settings.primaryVenueName}</p>
              <p className="text-xs text-beige-soft/80">{settings.primaryVenueAddress}</p>
            </div>

            <p className="text-xs text-gold-300/80 mt-4 font-mono">{settings.hashtag}</p>
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-ivory-pure/80 font-medium">{t('lang.label')}</span>
            <LanguageToggle />
          </div>
          <button
            onClick={handleDownloadPNG}
            disabled={downloading}
            className="btn-gold !py-2.5 !px-5 !text-xs ml-auto"
          >
            <Download className="w-4 h-4" />
            {downloading ? t('card.generating') : t('card.downloadBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
