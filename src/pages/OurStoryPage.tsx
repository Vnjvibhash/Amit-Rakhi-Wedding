import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader } from '../components/common/PageHeader';
import { FloralDivider, JharokhaFrame } from '../components/common/MandalaArtwork';

export const OurStoryPage: React.FC = () => {
  const { couple, settings } = useWedding();
  const { t } = useLanguage();

  return (
    <div>
      <PageHeader
        eyebrow={t('story.eyebrow')}
        title={t('story.title')}
        subtitle={couple.storySummary}
      />

      {/* Bride & Groom Biographies */}
      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="royal-card p-7 sm:p-9"
          >
            <div className="flex flex-col items-center text-center">
              <JharokhaFrame className="w-52 h-64 mb-5">
                <img
                  src={couple.groom.photoUrl}
                  alt={couple.groom.fullName}
                  className="w-full h-full object-cover"
                />
              </JharokhaFrame>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
                {t('story.groomBioTitle', { nickname: couple.groom.nickname })}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 mt-1">
                {couple.groom.fullName}
              </h2>
              <p className="text-xs text-maroon-700 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> {couple.groom.hometown}
              </p>
              <FloralDivider />
              <p className="text-sm text-maroon-900/85 leading-relaxed">{couple.groom.bio}</p>
              <div className="mt-5 pt-4 border-t border-gold-400/30 w-full text-xs text-maroon-800 space-y-1">
                <p className="font-semibold">{couple.groom.parents}</p>
                {couple.groom.grandparents && (
                  <p className="text-maroon-700/80">{couple.groom.grandparents}</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="royal-card p-7 sm:p-9"
          >
            <div className="flex flex-col items-center text-center">
              <JharokhaFrame className="w-52 h-64 mb-5">
                <img
                  src={couple.bride.photoUrl}
                  alt={couple.bride.fullName}
                  className="w-full h-full object-cover"
                />
              </JharokhaFrame>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
                {t('story.brideBioTitle', { nickname: couple.bride.nickname })}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 mt-1">
                {couple.bride.fullName}
              </h2>
              <p className="text-xs text-maroon-700 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> {couple.bride.hometown}
              </p>
              <FloralDivider />
              <p className="text-sm text-maroon-900/85 leading-relaxed">{couple.bride.bio}</p>
              <div className="mt-5 pt-4 border-t border-gold-400/30 w-full text-xs text-maroon-800 space-y-1">
                <p className="font-semibold">{couple.bride.parents}</p>
                {couple.bride.grandparents && (
                  <p className="text-maroon-700/80">{couple.bride.grandparents}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="section-padding bg-beige-soft/45">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-display text-xs uppercase tracking-[0.28em] text-maroon-700">
              {t('story.milestonesEyebrow')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-maroon-900 mt-2">
              {t('story.milestonesTitle')}
            </h2>
            <FloralDivider />
          </div>

          <div className="relative border-l-2 border-gold-400/50 ml-4 md:ml-32 space-y-12">
            {couple.milestones.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-7 sm:pl-9"
              >
                {/* Timeline node icon */}
                <span className="absolute -left-3.5 top-1.5 w-7 h-7 rounded-full bg-maroon-800 border-2 border-gold-400 flex items-center justify-center text-gold-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>

                <div className="royal-card p-6 sm:p-7 grid md:grid-cols-12 gap-6 items-center">
                  {m.imageUrl && (
                    <div className="md:col-span-4 h-44 rounded-xl overflow-hidden">
                      <img
                        src={m.imageUrl}
                        alt={m.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className={m.imageUrl ? 'md:col-span-8' : 'md:col-span-12'}>
                    <span className="text-xs uppercase tracking-wider font-semibold text-gold-700 bg-gold-100/70 px-2.5 py-1 rounded-full">
                      {m.year}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-maroon-900 mt-2">
                      {m.title}
                    </h3>
                    <p className="text-xs text-maroon-700 mt-1 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3" /> {m.location}
                    </p>
                    <p className="text-sm text-maroon-900/80 mt-3 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16 royal-card p-8 sm:p-10 max-w-2xl mx-auto">
            <Heart className="w-8 h-8 text-maroon-700 mx-auto mb-2 fill-maroon-700/20" />
            <h3 className="font-serif text-3xl font-bold text-maroon-900">
              {t('story.rsvpCardTitle')}
            </h3>
            <p className="text-sm text-maroon-900/80 mt-2 mb-6">
              {t('story.rsvpCardDesc')}
            </p>
            <Link to="/rsvp" className="btn-royal">
              {t('story.rsvpBtn')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
