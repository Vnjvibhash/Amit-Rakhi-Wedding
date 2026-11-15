import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Heart, Phone, Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../context/WeddingContext';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader } from '../components/common/PageHeader';
import { FloralDivider } from '../components/common/MandalaArtwork';
import { submitGuestRSVP } from '../services/weddingService';
import { formatDateLong } from '../utils/calendar';

export const RSVPPage: React.FC = () => {
  const { events, settings } = useWedding();
  const { t, language } = useLanguage();
  const sortedEvents = [...events].sort((a, b) => a.order - b.order);

  const [guestName, setGuestName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<'attending' | 'not_attending' | 'maybe'>('attending');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(() =>
    sortedEvents.filter((e) => e.highlight).map((e) => e.title)
  );
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  const toggleEvent = (title: string) => {
    setSelectedEvents((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim().length < 2) {
      toast.error(t('rsvp.nameError'));
      return;
    }
    const digits = mobileNumber.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
      toast.error(t('rsvp.phoneError'));
      return;
    }
    if (attending !== 'not_attending' && selectedEvents.length === 0) {
      toast.error(t('rsvp.eventsError'));
      return;
    }

    setSubmitting(true);
    try {
      const id = await submitGuestRSVP({
        guestName: guestName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim() || undefined,
        attending,
        guestCount: attending === 'not_attending' ? 1 : Math.max(1, Math.min(25, guestCount)),
        eventsAttending: attending === 'not_attending' ? [] : selectedEvents,
        dietaryNotes: dietaryNotes.trim() || undefined,
        message: message.trim()
      });
      setConfirmationId(id);
      toast.success(
        language === 'hi'
          ? 'आपकी उपस्थिति सप्रेम दर्ज कर ली गई है!'
          : 'Your RSVP has been joyfully recorded!'
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit RSVP.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={t('rsvp.eyebrow')}
        title={t('rsvp.title')}
        subtitle={t('rsvp.subtitle')}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-3xl mx-auto">
          {confirmationId ? (
            <div className="royal-card p-8 sm:p-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <p className="text-xs uppercase tracking-[0.28em] text-gold-700 font-semibold">
                {t('rsvp.confirmedBadge')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900">
                {t('rsvp.confirmedTitle', { name: guestName })}
              </h2>
              <FloralDivider />
              <p className="text-sm sm:text-base text-maroon-900/85 max-w-lg mx-auto leading-relaxed">
                {attending === 'attending'
                  ? t('rsvp.confirmedDescAttending', { count: guestCount })
                  : attending === 'maybe'
                  ? t('rsvp.confirmedDescMaybe')
                  : t('rsvp.confirmedDescDeclined')}
              </p>
              <p className="text-xs text-maroon-700 bg-gold-50 border border-gold-400/50 rounded-xl py-2.5 px-4 inline-block">
                {t('rsvp.refId')} <strong>{confirmationId}</strong>
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmationId(null);
                    setGuestName('');
                    setMobileNumber('');
                    setEmail('');
                    setMessage('');
                    setDietaryNotes('');
                  }}
                  className="btn-outline-gold !text-xs"
                >
                  {t('rsvp.anotherBtn')}
                </button>
                <Link to="/" className="btn-royal !text-xs">
                  {t('rsvp.homeBtn')}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="royal-card p-7 sm:p-10 space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1.5">
                    {t('rsvp.nameLabel')}
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1.5">
                    {t('rsvp.mobileLabel')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder={t('rsvp.mobilePlaceholder')}
                    className="input-royal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1.5">
                  {t('rsvp.emailLabel')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('rsvp.emailPlaceholder')}
                  className="input-royal"
                />
              </div>

              {/* Attendance Status Radios */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-2">
                  {t('rsvp.attendingLabel')}
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { val: 'attending', label: t('rsvp.attendingYes') },
                    { val: 'maybe', label: t('rsvp.attendingMaybe') },
                    { val: 'not_attending', label: t('rsvp.attendingNo') }
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-semibold transition ${
                        attending === opt.val
                          ? 'bg-maroon-800 text-gold-200 border-gold-400 shadow-sm'
                          : 'bg-ivory-pure text-maroon-900 border-gold-400/40 hover:bg-gold-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={opt.val}
                        checked={attending === opt.val}
                        onChange={() => setAttending(opt.val as any)}
                        className="accent-maroon-700"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {attending !== 'not_attending' && (
                <>
                  {/* Guest count */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1.5">
                      {t('rsvp.guestCountLabel')}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="15"
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                        className="flex-1 accent-maroon-800 cursor-pointer"
                      />
                      <span className="w-12 h-10 rounded-xl bg-gold-100 text-maroon-950 font-serif font-bold text-lg flex items-center justify-center border border-gold-400/60 shrink-0">
                        {guestCount}
                      </span>
                    </div>
                  </div>

                  {/* Ceremonies checklist */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-2">
                      {t('rsvp.eventsLabel')}
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {sortedEvents.map((evt) => {
                        const checked = selectedEvents.includes(evt.title);
                        return (
                          <label
                            key={evt.id}
                            className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition ${
                              checked
                                ? 'bg-gold-50/90 border-gold-400 text-maroon-950 font-semibold shadow-sm'
                                : 'bg-ivory-pure border-gold-400/30 text-maroon-900/80 hover:bg-gold-50/50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleEvent(evt.title)}
                              className="accent-maroon-700 mt-0.5"
                            />
                            <div className="leading-tight">
                              <span className="block font-medium">{evt.title}</span>
                              <span className="text-[10px] text-maroon-700">
                                {formatDateLong(evt.date, language)}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dietary notes */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1.5">
                      {t('rsvp.dietLabel')}
                    </label>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder={t('rsvp.dietPlaceholder')}
                      className="input-royal"
                    />
                  </div>
                </>
              )}

              {/* Blessings & Wishes Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1.5">
                  {t('rsvp.messageLabel')}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('rsvp.messagePlaceholder')}
                  className="input-royal"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-royal w-full !py-3.5 !text-sm"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? t('rsvp.submitting') : t('rsvp.submitBtn')}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
