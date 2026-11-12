import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarPlus,
  Clock,
  MapPin,
  Navigation,
  Search,
  Shirt,
  Sparkles
} from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { PageHeader } from '../components/common/PageHeader';
import { EventStatus, WeddingEvent } from '../types/wedding';
import {
  buildGoogleCalendarUrl,
  formatDateLong,
  formatTimeDisplay,
  getEventStatus
} from '../utils/calendar';

const STATUS_BADGE: Record<EventStatus, { label: string; className: string }> = {
  upcoming: {
    label: 'Upcoming',
    className: 'bg-gold-100 text-gold-800 border-gold-400/60'
  },
  ongoing: {
    label: 'Ongoing Now',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-400'
  },
  completed: {
    label: 'Completed',
    className: 'bg-stone-200 text-stone-700 border-stone-300'
  }
};

export const EventsPage: React.FC = () => {
  const { events, settings } = useWedding();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>('all');
  const [selectedEvent, setSelectedEvent] = useState<WeddingEvent | null>(null);

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
        eyebrow="Sacred Traditions & Celebrations"
        title="Wedding Events & Ceremonies"
        subtitle="Every ritual woven with joy, devotion, and heritage—arranged chronologically so you never miss a single moment."
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
                placeholder="Search Tilak, Haldi, Mehendi, Sangeet, Baraat, Vivah, Reception..."
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
                  {st === 'all' ? 'All Events' : st}
                </button>
              ))}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="royal-card p-12 text-center">
              <p className="font-serif text-2xl text-maroon-900">No ceremonies matched your filter.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="btn-outline-gold mt-4"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredEvents.map((evt, idx) => {
                const status = getEventStatus(evt);
                const badge = STATUS_BADGE[status];
                return (
                  <motion.article
                    key={evt.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 6) * 0.05 }}
                    className="royal-card overflow-hidden flex flex-col group hover:shadow-gold transition-all"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/75 via-transparent to-transparent" />
                      <span
                        className={`absolute top-3 right-3 text-[11px] font-semibold px-3 py-1 rounded-full border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <span className="absolute bottom-3 left-3 text-xs font-medium text-ivory-pure bg-maroon-950/75 px-3 py-1 rounded-full border border-gold-400/40">
                        {formatDateLong(evt.date)}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-2xl font-bold text-maroon-900">
                          {evt.title}
                        </h3>
                        {evt.highlight && (
                          <Sparkles className="w-4 h-4 text-gold-600 shrink-0 mt-1.5" />
                        )}
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs text-maroon-900/80">
                        <p className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                          <span>
                            {formatTimeDisplay(evt.startTime)} – {formatTimeDisplay(evt.endTime)}
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-maroon-900">{evt.venueName}</strong>
                            <br />
                            {evt.fullAddress}
                          </span>
                        </p>
                        {evt.dressCode && (
                          <p className="flex items-start gap-2">
                            <Shirt className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                            <span>Dress Code: {evt.dressCode}</span>
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-maroon-900/80 mt-4 leading-relaxed flex-1">
                        {evt.description}
                      </p>

                      <div className="mt-5 pt-4 border-t border-gold-400/30 flex flex-wrap items-center gap-2">
                        <a
                          href={evt.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-royal !py-2 !px-4 !text-xs flex-1"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Directions
                        </a>
                        <a
                          href={buildGoogleCalendarUrl(evt, settings)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline-gold !py-2 !px-3.5 !text-xs"
                          title="Add to Google Calendar"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" /> Calendar
                        </a>
                        <button
                          onClick={() => setSelectedEvent(evt)}
                          className="text-xs font-semibold text-maroon-800 hover:text-gold-700 px-2 py-1"
                        >
                          Details
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

      {/* Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="royal-card max-w-xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gold-700 font-semibold">
                  {selectedEvent.ceremonyType}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-0.5 rounded-full border ${
                    STATUS_BADGE[getEventStatus(selectedEvent)].className
                  }`}
                >
                  {STATUS_BADGE[getEventStatus(selectedEvent)].label}
                </span>
              </div>
              <h3 className="font-serif text-3xl font-bold text-maroon-900">
                {selectedEvent.title}
              </h3>
              <p className="text-sm text-maroon-800 font-medium">
                {formatDateLong(selectedEvent.date)} • {formatTimeDisplay(selectedEvent.startTime)} –{' '}
                {formatTimeDisplay(selectedEvent.endTime)}
              </p>
              <p className="text-sm text-maroon-900/80">
                <strong>Venue:</strong> {selectedEvent.venueName}, {selectedEvent.fullAddress}
              </p>
              {selectedEvent.dressCode && (
                <p className="text-sm text-maroon-900/80">
                  <strong>Dress Code:</strong> {selectedEvent.dressCode}
                </p>
              )}
              <p className="text-sm text-maroon-900/85 leading-relaxed pt-2">
                {selectedEvent.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href={selectedEvent.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-royal !py-2.5 !px-5 !text-xs"
                >
                  <Navigation className="w-4 h-4" /> Open in Google Maps
                </a>
                <a
                  href={buildGoogleCalendarUrl(selectedEvent, settings)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold !py-2.5 !px-5 !text-xs"
                >
                  <CalendarPlus className="w-4 h-4" /> Add to Google Calendar
                </a>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="btn-outline-gold !py-2.5 !px-4 !text-xs ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

