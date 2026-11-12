import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Sparkles } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { PageHeader } from '../components/common/PageHeader';
import { FloralDivider, JharokhaFrame } from '../components/common/MandalaArtwork';

export const FamilyPage: React.FC = () => {
  const { family, settings, couple } = useWedding();

  const sorted = [...family].sort((a, b) => a.order - b.order);
  const groomSide = sorted.filter((m) => m.side === 'groom');
  const brideSide = sorted.filter((m) => m.side === 'bride');
  const combinedSide = sorted.filter((m) => m.side === 'both');

  return (
    <div>
      <PageHeader
        eyebrow="Roots, Love & Tradition"
        title={settings.familyBlessingHeader}
        subtitle={settings.invitationMessage}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Groom's Family */}
          <div>
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.28em] text-gold-700 font-semibold">
                Ladke Wale • {couple.groom.hometown}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 mt-1">
                Groom’s Family — Chharapatti, Madhubani
              </h2>
              <FloralDivider />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {groomSide.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="royal-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
                >
                  <JharokhaFrame className="w-36 h-44 shrink-0">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </JharokhaFrame>
                  <div className="text-center sm:text-left">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-gold-700">
                      {member.relation}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-maroon-900 mt-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-maroon-900/80 mt-2 leading-relaxed">{member.bio}</p>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-800 mt-3 hover:text-gold-700"
                      >
                        <Phone className="w-3.5 h-3.5" /> {member.phone}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bride's Family */}
          <div>
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.28em] text-gold-700 font-semibold">
                Ladki Wale • {couple.bride.hometown}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 mt-1">
                Bride’s Family — Paroriyahi, Madhubani
              </h2>
              <FloralDivider />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {brideSide.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="royal-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
                >
                  <JharokhaFrame className="w-36 h-44 shrink-0">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </JharokhaFrame>
                  <div className="text-center sm:text-left">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-gold-700">
                      {member.relation}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-maroon-900 mt-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-maroon-900/80 mt-2 leading-relaxed">{member.bio}</p>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-800 mt-3 hover:text-gold-700"
                      >
                        <Phone className="w-3.5 h-3.5" /> {member.phone}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Siblings & Hospitality Coordinators */}
          {combinedSide.length > 0 && (
            <div>
              <div className="text-center mb-10">
                <span className="text-xs uppercase tracking-[0.28em] text-gold-700 font-semibold">
                  Celebration Hosts
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 mt-1">
                  Siblings &amp; Family Coordinators
                </h2>
                <FloralDivider />
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {combinedSide.map((member) => (
                  <div
                    key={member.id}
                    className="royal-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
                  >
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-32 h-32 rounded-2xl object-cover border-2 border-gold-400/70 shrink-0"
                      loading="lazy"
                    />
                    <div className="text-center sm:text-left">
                      <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-gold-700">
                        <Sparkles className="w-3 h-3" /> {member.relation}
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-maroon-900 mt-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-maroon-900/80 mt-2">{member.bio}</p>
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-800 mt-3"
                        >
                          <Phone className="w-3.5 h-3.5" /> {member.phone}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

