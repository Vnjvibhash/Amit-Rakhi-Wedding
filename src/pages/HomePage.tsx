import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Copy,
  Download,
  Heart,
  MapPin,
  Share2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../context/WeddingContext';
import { CountdownTimer } from '../components/common/CountdownTimer';
import {
  FloralDivider,
  JharokhaFrame,
  MandalaSpinner,
  ToranCorner
} from '../components/common/MandalaArtwork';
import { InvitationCardModal } from '../components/common/InvitationCardModal';
import { formatDateLong, formatTimeDisplay } from '../utils/calendar';

export const HomePage: React.FC = () => {
  const { settings, couple, events } = useWedding();
  const exploreRef = useRef<HTMLDivElement | null>(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  const featuredEvents = [...events]
    .sort((a, b) => a.order - b.order)
    .filter((e) => e.highlight)
    .slice(0, 4);

  const handleExploreClick = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success('Wedding invitation link copied!');
    } catch {
      toast.error('Unable to copy link.');
    }
  };

  const handleWhatsAppShare = () => {
    const text = `|| Shubh Vivah || You are warmly invited to the Wedding Celebration of ${settings.coupleDisplayName} on ${settings.weddingDateFormatted} at ${settings.primaryVenueName}, ${settings.primaryVenueCity}. Explore events & RSVP: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      {/* HERO DIGITAL WEDDING INVITATION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-maroon-950 text-ivory-pure pt-24 pb-16 px-4">
        {/* Background Palace Imagery with Royal Maroon Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 opacity-35"
          style={{ backgroundImage: `url('/images/hero-palace.jpg')` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-maroon-950/90 via-maroon-900/75 to-maroon-950"
          aria-hidden="true"
        />

        {/* Rotating Ornamental Mandalas */}
        <div className="absolute -top-36 -left-36 opacity-25 pointer-events-none">
          <MandalaSpinner className="w-[420px] h-[420px] text-gold-300" />
        </div>
        <div className="absolute -bottom-36 -right-36 opacity-25 pointer-events-none">
          <MandalaSpinner className="w-[460px] h-[460px] text-gold-300" />
        </div>

        {/* Corner Torans */}
        <ToranCorner className="hidden md:block absolute top-20 left-6 w-24 h-24 opacity-70" />
        <ToranCorner className="hidden md:block absolute top-20 right-6 w-24 h-24 opacity-70 scale-x-[-1]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-4"
          >
            <img
              src="/images/wedding-logo.png"
              alt={`${settings.coupleDisplayName} Royal Crest`}
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border-2 border-gold-400 shadow-gold"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-xs sm:text-sm uppercase tracking-[0.35em] text-gold-300"
          >
            || Shri Ganeshaya Namah || • {settings.subHeadline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-ivory-pure mt-3 tracking-wide drop-shadow"
          >
            {settings.coupleDisplayName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-serif italic text-xl sm:text-2xl text-gold-200 mt-2"
          >
            {settings.weddingHeadline}
          </motion.p>

          <FloralDivider dark />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base text-beige-soft/95 mb-8"
          >
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              {settings.weddingDateFormatted}
            </span>
            <span className="hidden sm:inline text-gold-400">•</span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              {settings.primaryVenueName}, {settings.primaryVenueCity}
            </span>
          </motion.div>

          {/* Live Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="mb-8"
          >
            <CountdownTimer targetISO={settings.weddingDateISO} dark />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3.5"
          >
            <button onClick={handleExploreClick} className="btn-gold !px-8 !py-3.5 text-sm sm:text-base">
              <Sparkles className="w-4 h-4" />
              Enter Website &amp; Explore Wedding
            </button>
            <Link to="/rsvp" className="btn-royal !px-7 !py-3.5 text-sm sm:text-base">
              Confirm Attendance (RSVP)
            </Link>
            <button
              onClick={() => setCardModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-medium border border-gold-400/60 text-gold-200 hover:bg-white/10 transition"
            >
              <Download className="w-4 h-4" /> Download Invitation Card
            </button>
          </motion.div>
        </div>
      </section>

      {/* BRIDE & GROOM INVITATION WELCOME SECTION */}
      <section ref={exploreRef} className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="font-display text-xs uppercase tracking-[0.28em] text-maroon-700">
              {settings.familyBlessingHeader}
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-maroon-900 mt-2">
              A Cordial Family Invitation
            </h2>
            <FloralDivider />
            <p className="text-base sm:text-lg text-maroon-900/85 leading-relaxed">
              {settings.invitationMessage}
            </p>
            <p className="mt-4 font-serif italic text-lg text-gold-700">
              “{settings.welcomeMessage}”
            </p>
          </div>

          {/* Bride & Groom Portraits in Royal Jharokha Frames */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="royal-card p-6 sm:p-8 text-center"
            >
              <JharokhaFrame className="w-56 sm:w-64 h-72 sm:h-80 mx-auto mb-6">
                <img
                  src={couple.groom.photoUrl}
                  alt={couple.groom.fullName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </JharokhaFrame>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
                The Groom
              </span>
              <h3 className="font-serif text-3xl font-bold text-maroon-900 mt-1">
                {couple.groom.fullName}
              </h3>
              <p className="text-xs text-maroon-700 mt-1 font-medium">{couple.groom.parents}</p>
              <p className="text-sm text-maroon-900/80 mt-3 leading-relaxed">{couple.groom.bio}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="royal-card p-6 sm:p-8 text-center"
            >
              <JharokhaFrame className="w-56 sm:w-64 h-72 sm:h-80 mx-auto mb-6">
                <img
                  src={couple.bride.photoUrl}
                  alt={couple.bride.fullName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </JharokhaFrame>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
                The Bride
              </span>
              <h3 className="font-serif text-3xl font-bold text-maroon-900 mt-1">
                {couple.bride.fullName}
              </h3>
              <p className="text-xs text-maroon-700 mt-1 font-medium">{couple.bride.parents}</p>
              <p className="text-sm text-maroon-900/80 mt-3 leading-relaxed">{couple.bride.bio}</p>
            </motion.div>
          </div>

          <div className="text-center mt-10">
            <Link to="/our-story" className="btn-outline-gold">
              <Heart className="w-4 h-4 text-maroon-700" /> Read Our Love Story &amp; Journey
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED CEREMONIES PREVIEW */}
      <section className="section-padding bg-royal-gradient text-ivory-pure">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-300">
              Auspicious Ceremonies
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-2">
              Wedding Festivities
            </h2>
            <FloralDivider dark />
            <p className="text-sm text-beige-soft/85">
              From Priti Bhoj, vibrant Haldi &amp; Mehendi mornings, and Matkor to the sacred Shubh Vivah &amp; Panigrahan Sanskar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((evt, idx) => (
              <motion.article
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl overflow-hidden bg-maroon-950/70 border border-gold-400/40 flex flex-col hover:border-gold-300 transition group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold-500 text-maroon-950 font-semibold">
                    {formatDateLong(evt.date).split(',')[0]}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-serif text-2xl font-semibold text-gold-200">{evt.title}</h3>
                  <p className="text-xs text-beige-soft/80 mt-1">
                    {formatDateLong(evt.date)} • {formatTimeDisplay(evt.startTime)}
                  </p>
                  <p className="text-xs text-gold-300/90 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {evt.venueName}
                  </p>
                  <p className="text-xs text-beige-soft/75 mt-3 line-clamp-3 flex-1">
                    {evt.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link to="/events" className="btn-gold">
              Explore All {events.length} Ceremonies <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-gold-400/60 text-gold-200 hover:bg-white/10 transition"
            >
              <Calendar className="w-4 h-4" /> Interactive Schedule &amp; PDF
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK PORTAL LINKS & SHARE */}
      <section className="section-padding bg-beige-soft/45">
        <div className="max-w-5xl mx-auto royal-card p-8 sm:p-12 text-center">
          <p className="font-display text-xs uppercase tracking-[0.28em] text-maroon-700">
            Celebrate With Us
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 mt-2">
            Kindly Grace Us With Your Presence
          </h2>
          <FloralDivider />
          <p className="text-sm sm:text-base text-maroon-900/80 max-w-2xl mx-auto mb-8">
            Confirm your attendance, view venue travel instructions, browse ceremony photo albums, or share our digital invitation with family.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/rsvp" className="btn-royal">
              Submit Your RSVP
            </Link>
            <Link to="/gallery" className="btn-outline-gold">
              Browse Photo Gallery
            </Link>
            <Link to="/venue" className="btn-outline-gold">
              Venue &amp; Travel Guide
            </Link>
            <button onClick={handleWhatsAppShare} className="btn-gold">
              <Share2 className="w-4 h-4" /> WhatsApp Invite
            </button>
            <button onClick={handleCopyLink} className="btn-outline-gold">
              <Copy className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </div>
      </section>

      <InvitationCardModal open={cardModalOpen} onClose={() => setCardModalOpen(false)} />
    </div>
  );
};

