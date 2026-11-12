import React, { useState } from 'react';
import { CheckCircle2, Heart, Phone, Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../context/WeddingContext';
import { PageHeader } from '../components/common/PageHeader';
import { FloralDivider } from '../components/common/MandalaArtwork';
import { submitGuestRSVP } from '../services/weddingService';
import { formatDateLong } from '../utils/calendar';

export const RSVPPage: React.FC = () => {
  const { events, settings } = useWedding();
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
      toast.error('Please enter your full name.');
      return;
    }
    const digits = mobileNumber.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
      toast.error('Please enter a valid mobile number.');
      return;
    }
    if (attending !== 'not_attending' && selectedEvents.length === 0) {
      toast.error('Please select at least one wedding ceremony you plan to attend.');
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
      toast.success('Your RSVP has been joyfully recorded!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit RSVP.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Kindly Respond"
        title="Guest RSVP"
        subtitle={`Please share your attendance & ceremony preferences so our families can prepare a warm royal welcome for you in ${settings.primaryVenueCity}.`}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-3xl mx-auto">
          {confirmationId ? (
            <div className="royal-card p-8 sm:p-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <p className="text-xs uppercase tracking-[0.28em] text-gold-700 font-semibold">
                RSVP Confirmed
              </p>
              <h2 className="font-serif text-4xl font-bold text-maroon-900">
                Dhanyavaad, {guestName}!
              </h2>
              <FloralDivider />
              <p className="text-sm sm:text-base text-maroon-900/85 max-w-lg mx-auto leading-relaxed">
                {attending === 'attending'
                  ? `We are thrilled to welcome ${guestCount} guest(s) to celebrate ${settings.coupleDisplayName}! Your hospitality details have been saved.`
                  : attending === 'maybe'
                  ? 'Thank you for letting us know! We hope to celebrate with you and will stay in touch.'
                  : 'We will miss your presence, and we cherish your warm blessings from afar.'}
              </p>
              <p className="text-xs text-maroon-700 bg-gold-50 border border-gold-400/50 rounded-xl py-2.5 px-4 inline-block">
                Reference ID: <strong>{confirmationId}</strong>
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setConfirmationId(null);
                    setGuestName('');
                    setMobileNumber('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="btn-outline-gold"
                >
                  Submit Another RSVP
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="royal-card p-6 sm:p-10 space-y-6">
              <div className="text-center">
                <h2 className="font-serif text-3xl font-bold text-maroon-900">
                  Confirm Your Presence
                </h2>
                <p className="text-xs text-maroon-700 mt-1">
                  Celebrations: {settings.weddingDateFormatted} • {settings.primaryVenueName}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-maroon-900 mb-1.5">
                    Full Name / Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g., Rajesh & Sunita Kapoor"
                    className="input-royal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-maroon-900 mb-1.5">
                    Mobile / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-maroon-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="input-royal pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-maroon-900 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-royal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-maroon-900 mb-1.5">
                    Number of Accompanying Guests *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-maroon-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={guestCount}
                      disabled={attending === 'not_attending'}
                      onChange={(e) => setGuestCount(parseInt(e.target.value || '1', 10))}
                      className="input-royal pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Choice */}
              <div>
                <label className="block text-xs font-semibold text-maroon-900 mb-2">
                  Will You Be Joining Us? *
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { value: 'attending', label: 'Joyfully Attending' },
                    { value: 'maybe', label: 'Tentative / Confirming Soon' },
                    { value: 'not_attending', label: 'Sending Blessings From Afar' }
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setAttending(opt.value as typeof attending)}
                      className={`px-4 py-3 rounded-xl text-xs font-semibold border transition text-center ${
                        attending === opt.value
                          ? 'bg-maroon-800 text-gold-200 border-gold-400 shadow-sm'
                          : 'bg-ivory-pure text-maroon-900 border-gold-400/50 hover:bg-gold-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Checklist */}
              {attending !== 'not_attending' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-maroon-900">
                      Select Ceremonies You Plan to Attend *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEvents(
                          selectedEvents.length === sortedEvents.length
                            ? []
                            : sortedEvents.map((e) => e.title)
                        )
                      }
                      className="text-xs font-semibold text-gold-700 hover:underline"
                    >
                      {selectedEvents.length === sortedEvents.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {sortedEvents.map((evt) => {
                      const checked = selectedEvents.includes(evt.title);
                      return (
                        <label
                          key={evt.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                            checked
                              ? 'bg-gold-50 border-gold-500 text-maroon-950'
                              : 'bg-ivory-pure border-gold-400/30 text-maroon-900/80'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleEvent(evt.title)}
                            className="mt-1 accent-maroon-800"
                          />
                          <div className="text-xs">
                            <span className="font-semibold block">{evt.title}</span>
                            <span className="text-[11px] text-maroon-700/80">
                              {formatDateLong(evt.date)}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-maroon-900 mb-1.5">
                  Dietary Preferences or Arrival Details (Optional)
                </label>
                <input
                  type="text"
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="e.g., Jain meals preferred / Arriving Feb 18 morning flight"
                  className="input-royal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-maroon-900 mb-1.5">
                  Special Blessings &amp; Wishes for {settings.coupleDisplayName}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a heartfelt blessing or note for the bride, groom, and families..."
                  className="input-royal"
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-royal w-full !py-3.5">
                <Send className="w-4 h-4" />
                {submitting ? 'Recording Your RSVP...' : 'Submit RSVP With Blessings'}
              </button>

              <p className="text-[11px] text-center text-maroon-800/70 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-maroon-700" /> Need help with travel? Call{' '}
                {settings.contactPhone}
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

