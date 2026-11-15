import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarPlus,
  Clock,
  MapPin,
  Navigation,
  Search,
  Shirt,
  Sparkles,
  X
} from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader } from '../components/common/PageHeader';
import { EventStatus, WeddingEvent } from '../types/wedding';
import {
  buildGoogleCalendarUrl,
  formatDateLong,
  formatTimeDisplay,
  getEventStatus
} from '../utils/calendar';

export const EventsPage: React.FC = () => {
  const { events, settings } = useWedding();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>('all');
  const [selectedEvent, setSelectedEvent] = useState<WeddingEvent | null>(null);

  const statusBadgeInfo: Record<EventStatus, { label: string; className: string }> = {
    upcoming: {
      label: t('events.filterUpcoming'),
      className: 'bg-gold-100 text-gold-800 border-gold-400/60'
    },
    ongoing: {
      label: t('events.filterOngoing'),
      className: 'bg-emerald-100 text-emerald-800 border-emerald-400'
    },
    completed: {
      label: t('events.filterCompleted'),
      className: 'bg-stone-200 text-stone-700 border-stone-300'
    }
  };

  const filteredEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.order - b.order);
    return sorted.filter((evt) => {
      const status = getEventStatus(evt);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const q = searchTerm.trim().toLowerCase();
      const matchesQuery =
        !q ||
        evt.title.toLowerCase().includes(q) ||
        evt.ceremonyType.toLowerCase().includes(q) ||
        evt.venueName.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [events, searchTerm, statusFilter]);

  return (
    <div>
      <PageHeader
        eyebrow={t('events.eyebrow')}
        title={t('events.title')}
        subtitle={t('events.subtitle')}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-7xl mx-auto">
          {/* Search & Filter Controls */}
          <div className="royal-card p-4 sm:p-5 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-maroon-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('events.searchPlaceholder')}
                className="input-royal pl-10"
                aria-label="Search wedding events"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                    statusFilter === st
                      ? 'bg-maroon-800 text-gold-200 border border-gold-400 shadow-sm'
                      : 'bg-ivory-pure text-maroon-800 border border-gold-400/40 hover:bg-gold-50'
                  }`}
                >
                  {st === 'all'
                    ? t('events.filterAll')
                    : st === 'upcoming'
                    ? t('events.filterUpcoming')
                    : st === 'ongoing'
                    ? t('events.filterOngoing')
                    : t('events.filterCompleted')}
                </button>
              ))}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="royal-card p-12 text-center">
              <Sparkles className="w-10 h-10 text-gold-600 mx-auto mb-3" />
              <h3 className="font-serif text-2xl font-bold text-maroon-900">
                {t('events.noMatch')}
              </h3>
              <p className="text-sm text-maroon-800/80 mt-1">
                {searchTerm ? `"${searchTerm}"` : ''}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="btn-outline-gold mt-4 !text-xs"
              >
                {t('events.clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredEvents.map((evt, idx) => {
                const status = getEventStatus(evt);
                const badge = statusBadgeInfo[status];
                const gCalUrl = buildGoogleCalendarUrl(evt, settings);

                return (
                  <motion.article
                    key={evt.id}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="royal-card overflow-hidden flex flex-col group hover:shadow-gold transition duration-300"
                  >
                    <div className="relative h-60 overflow-hidden bg-maroon-950">
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/85 via-maroon-950/20 to-transparent" />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span
                          className={`text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full border shadow-sm ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        {evt.highlight && (
                          <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-gold-gradient text-maroon-950 shadow-gold">
                            ★ Highlight
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-ivory-pure">
                        <span className="text-xs uppercase tracking-[0.2em] text-gold-300 font-semibold">
                          {evt.ceremonyType}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-0.5">
                          {evt.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5 text-sm text-maroon-900/85">
                        <p className="flex items-center gap-2 font-medium text-maroon-950">
                          <Clock className="w-4 h-4 text-gold-700 shrink-0" />
                          <span>
                            {formatDateLong(evt.date, language)} • {formatTimeDisplay(evt.startTime, language)}
                            {evt.endTime ? ` - ${formatTimeDisplay(evt.endTime, language)}` : ''}
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-maroon-950">{evt.venueName}</strong> —{' '}
                            <span className="text-xs text-maroon-800">{evt.fullAddress}</span>
                          </span>
                        </p>
                        {evt.dressCode && (
                          <p className="flex items-center gap-2 text-xs bg-gold-50/90 border border-gold-400/40 rounded-xl px-3 py-2 text-maroon-900">
                            <Shirt className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                            <span>
                              <strong>{t('events.dressCode')}:</strong> {evt.dressCode}
                            </span>
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-maroon-900/80 leading-relaxed pt-1">
                          {evt.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gold-400/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <a
                            href={gCalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-outline-gold !py-2 !px-3.5 !text-xs"
                          >
                            <CalendarPlus className="w-3.5 h-3.5 text-maroon-700" />
                            {t('events.addToCalendar')}
                          </a>
                          {evt.googleMapsUrl && (
                            <a
                              href={evt.googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-outline-gold !py-2 !px-3.5 !text-xs"
                            >
                              <Navigation className="w-3.5 h-3.5 text-maroon-700" />
                              {t('events.viewMap')}
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(evt)}
                          className="text-maroon-800 hover:text-gold-700 font-semibold underline underline-offset-4"
                        >
                          {t('events.fullDetails')}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Event Details Dialog Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative royal-card max-w-lg w-full p-6 sm:p-8 my-auto space-y-4">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-maroon-800 hover:text-maroon-950"
              aria-label={t('events.modalClose')}
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase tracking-wider font-semibold text-gold-700">
              {selectedEvent.ceremonyType}
            </span>
            <h3 className="font-serif text-3xl font-bold text-maroon-900">
              {selectedEvent.title}
            </h3>
            <div className="h-44 rounded-xl overflow-hidden">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs sm:text-sm text-maroon-900/85 space-y-2">
              <p>
                <strong>{formatDateLong(selectedEvent.date, language)}</strong> •{' '}
                {formatTimeDisplay(selectedEvent.startTime, language)}
                {selectedEvent.endTime ? ` - ${formatTimeDisplay(selectedEvent.endTime, language)}` : ''}
              </p>
              <p>
                <strong>{selectedEvent.venueName}</strong> ({selectedEvent.fullAddress})
              </p>
              {selectedEvent.dressCode && (
                <p>
                  <strong>{t('events.dressCode')}:</strong> {selectedEvent.dressCode}
                </p>
              )}
              <p className="pt-2 leading-relaxed">{selectedEvent.description}</p>
            </div>
            <div className="pt-3 flex items-center justify-end gap-2">
              <button onClick={() => setSelectedEvent(null)} className="btn-royal !py-2 !px-5 !text-xs">
                {t('events.modalClose')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
