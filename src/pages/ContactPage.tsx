import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../context/WeddingContext';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader } from '../components/common/PageHeader';
import { FloralDivider } from '../components/common/MandalaArtwork';

export const ContactPage: React.FC = () => {
  const { family, settings } = useWedding();
  const { t, language } = useLanguage();
  const coordinators = family.filter((f) => f.isContactCoordinator || f.phone);
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');

  const handleSendWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) {
      toast.error(t('contact.inputError'));
      return;
    }
    const composed =
      language === 'hi'
        ? `नमस्ते! ${guestName.trim()} का संदेश (${settings.coupleDisplayName} के विवाह उत्सव के संबंध में):\n\n${guestMessage.trim()}`
        : `Namaste! Message from ${guestName.trim()} regarding ${settings.coupleDisplayName}'s Wedding:\n\n${guestMessage.trim()}`;

    window.open(
      `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(composed)}`,
      '_blank',
      'noopener,noreferrer'
    );
    toast.success(
      language === 'hi'
        ? 'स्वागत डेस्क के साथ व्हाट्सएप खुल रहा है!'
        : 'Opening WhatsApp chat with our family hospitality desk!'
    );
  };

  return (
    <div>
      <PageHeader
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        subtitle={settings.welcomeMessage}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Personalized Welcome Banner */}
          <div className="royal-card p-8 text-center max-w-3xl mx-auto">
            <Sparkles className="w-7 h-7 text-gold-600 mx-auto mb-2" />
            <h2 className="font-serif text-3xl font-bold text-maroon-900">
              {t('contact.bannerTitle')}
            </h2>
            <FloralDivider />
            <p className="text-sm sm:text-base text-maroon-900/80 leading-relaxed">
              {t('contact.bannerDesc')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
              <a href={`tel:${settings.contactPhone}`} className="btn-royal !py-2.5 !px-5 !text-xs">
                <Phone className="w-4 h-4" /> {settings.contactPhone}
              </a>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="btn-outline-gold !py-2.5 !px-5 !text-xs"
              >
                <Mail className="w-4 h-4" /> {settings.contactEmail}
              </a>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Family Coordinators */}
            <div className="lg:col-span-7 space-y-5">
              <h3 className="font-serif text-3xl font-bold text-maroon-900">
                {t('contact.coordinatorsTitle')}
              </h3>
              <div className="space-y-4">
                {coordinators.map((person) => (
                  <div
                    key={person.id}
                    className="royal-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={person.photoUrl}
                        alt={person.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-gold-400/70 shrink-0"
                      />
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-gold-700">
                          {person.relation}
                        </span>
                        <h4 className="font-serif text-xl font-bold text-maroon-900">
                          {person.name}
                        </h4>
                        <p className="text-xs text-maroon-800/80 mt-0.5">{person.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {person.phone && (
                        <a
                          href={`tel:${person.phone}`}
                          className="btn-outline-gold !py-2 !px-3.5 !text-xs"
                        >
                          <Phone className="w-3.5 h-3.5" /> {t('family.call')}
                        </a>
                      )}
                      {(person.whatsapp || person.phone) && (
                        <a
                          href={`https://wa.me/${(person.whatsapp || person.phone || '').replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-gold !py-2 !px-3.5 !text-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> {t('family.whatsapp')}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Hospitality Desk Form */}
            <div className="lg:col-span-5 royal-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-maroon-900">
                <MessageCircle className="w-5 h-5 text-gold-700" />
                <h3 className="font-serif text-2xl font-bold">
                  {t('contact.whatsappBoxTitle')}
                </h3>
              </div>
              <p className="text-xs text-maroon-900/80 leading-relaxed">
                {t('contact.whatsappBoxDesc')}
              </p>
              <form onSubmit={handleSendWhatsAppInquiry} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1">
                    {t('contact.yourName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={t('rsvp.namePlaceholder')}
                    className="input-royal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1">
                    {t('contact.yourMessage')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder={
                      language === 'hi'
                        ? 'उदा. आगमन का समय, कमरों की व्यवस्था या कोई विशेष सहयोग...'
                        : 'e.g., Arrival timing, stay arrangements, or any assistance needed...'
                    }
                    className="input-royal"
                  />
                </div>
                <button type="submit" className="btn-royal w-full">
                  <Send className="w-4 h-4" /> {t('contact.sendWhatsApp')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
