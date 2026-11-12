import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { PageHeader } from '../components/common/PageHeader';
import { FloralDivider, JharokhaFrame } from '../components/common/MandalaArtwork';

export const OurStoryPage: React.FC = () => {
  const { couple, settings } = useWedding();

  return (
    <div>
      <PageHeader
        eyebrow="The Couple & Their Journey"
        title="Our Story"
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
                Groom • “{couple.groom.nickname}”
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
                Bride • “{couple.bride.nickname}”
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
              Milestones of Togetherness
            </p>
            <h2 className="font-serif text-4xl font-bold text-maroon-900 mt-2">
              How Forever Unfolded
            </h2>
            <FloralDivider />
          </div>

          <div className="space-y-8 relative before:hidden md:before:block before:absolute before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-gold-400/60">
            {couple.milestones.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative md:flex items-center gap-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="md:w-1/2">
                    <div className="royal-card overflow-hidden">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-52 object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="p-6">
                        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-gold-700">
                          <Sparkles className="w-3.5 h-3.5" /> {item.year} • {item.location}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-maroon-900 mt-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-maroon-900/80 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-maroon-800 border-2 border-gold-400 text-gold-300 z-10 shrink-0 shadow-gold">
                    <Heart className="w-4 h-4 fill-gold-400 text-gold-400" />
                  </div>
                  <div className="md:w-1/2" />
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-14">
            <Link to="/events" className="btn-royal">
              Join Us at {settings.primaryVenueCity} Celebrations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

