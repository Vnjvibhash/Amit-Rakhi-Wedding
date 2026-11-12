import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../context/WeddingContext';
import { PageHeader } from '../components/common/PageHeader';
import { FloralDivider } from '../components/common/MandalaArtwork';

export const ContactPage: React.FC = () => {
  const { family, settings } = useWedding();
  const coordinators = family.filter((f) => f.isContactCoordinator || f.phone);
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');

  const handleSendWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) {
      toast.error('Please enter your name and message.');
      return;
    }
    const composed = `Namaste! Message from ${guestName.trim()} regarding ${settings.coupleDisplayName}'s Wedding:\n\n${guestMessage.trim()}`;
    window.open(
      `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(composed)}`,
      '_blank',
      'noopener,noreferrer'
    );
    toast.success('Opening WhatsApp chat with our family hospitality desk!');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Hospitality & Warmth"
        title="Contact Our Families"
        subtitle={settings.welcomeMessage}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Personalized Welcome Banner */}
          <div className="royal-card p-8 text-center max-w-3xl mx-auto">
            <Sparkles className="w-7 h-7 text-gold-600 mx-auto mb-2" />
            <h2 className="font-serif text-3xl font-bold text-maroon-900">
              We Are Here to Assist You
            </h2>
            <FloralDivider />
            <p className="text-sm sm:text-base text-maroon-900/80 leading-relaxed">
              Whether you need airport transfer coordination, suite reservations, attire advice, or ceremony timings, please reach out to our family coordinators anytime.
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
                Family Hospitality Contacts
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
                          <Phone className="w-3.5 h-3.5" /> Call
                        </a>
                      )}
                      {(person.whatsapp || person.phone) && (
                        <a
                          href={`https://wa.me/${(person.whatsapp || person.phone || '').replace(
                            /\D/g,
                            ''
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-gold !py-2 !px-3.5 !text-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Message to Family via WhatsApp */}
            <div className="lg:col-span-5">
              <form onSubmit={handleSendWhatsAppInquiry} className="royal-card p-6 sm:p-8 space-y-4">
                <h3 className="font-serif text-2xl font-bold text-maroon-900">
                  Send a Note to the Family
                </h3>
                <p className="text-xs text-maroon-800/80">
                  Need travel assistance or have a question? Send us a direct WhatsApp message.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-maroon-900 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your full name"
                    className="input-royal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-maroon-900 mb-1">
                    Your Message / Travel Query *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder="Share your flight timing, hotel request, or warm wishes..."
                    className="input-royal"
                  />
                </div>
                <button type="submit" className="btn-royal w-full">
                  <Send className="w-4 h-4" /> Send via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

