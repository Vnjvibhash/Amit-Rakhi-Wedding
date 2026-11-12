import React, { useMemo, useState } from 'react';
import {
  Bell,
  Calendar as CalendarIcon,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  List,
  MapPin,
  Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../context/WeddingContext';
import { PageHeader } from '../components/common/PageHeader';
import {
  buildGoogleCalendarUrl,
  downloadWeddingSchedulePDF,
  formatDateLong,
  formatTimeDisplay,
  getEventStatus
} from '../utils/calendar';

export const SchedulePage: React.FC = () => {
  const { events, settings } = useWedding();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [notifEnabled, setNotifEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  // Initialize calendar month to the earliest upcoming/first wedding event month
  const sortedEvents = useMemo(() => [...events].sort((a, b) => a.order - b.order), [events]);

  const initialMonth = useMemo(() => {
    const first = sortedEvents[0]?.date;
    if (first) {
      const d = new Date(`${first}T12:00:00`);
      if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date(2027, 1, 1);
  }, [sortedEvents]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);
  const [selectedDate, setSelectedDate] = useState<string>(sortedEvents[0]?.date || '');

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof sortedEvents> = {};
    sortedEvents.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [sortedEvents]);

  const upcomingEvents = useMemo(
    () => sortedEvents.filter((e) => getEventStatus(e) !== 'completed'),
    [sortedEvents]
  );

  const handleEnableNotifications = async () => {
    if (typeof Notification === 'undefined') {
      toast.error('Browser notifications are not supported on this device.');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotifEnabled(true);
      const next = upcomingEvents[0];
      new Notification(`${settings.coupleDisplayName} Wedding Reminder`, {
        body: next
          ? `Next ceremony: ${next.title} on ${formatDateLong(next.date)} at ${formatTimeDisplay(next.startTime)}`
          : 'Wedding ceremony notifications enabled!',
        icon: '/images/wedding-logo.png'
      });
      toast.success('Upcoming ceremony notifications enabled!');
    } else {
      toast.error('Notification permission was declined.');
    }
  };

  // Calendar grid computation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells: Array<{ day: number | null; iso?: string }> = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarCells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ day: d, iso });
  }

  const selectedDayEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  return (
    <div>
      <PageHeader
        eyebrow="Plan Your Celebrations"
        title="Wedding Schedule & Calendar"
        subtitle="Explore our multi-day royal celebrations by month or date-wise itinerary, add ceremonies to Google Calendar, or download the printable PDF."
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-7xl mx-auto">
          {/* Action Toolbar */}
          <div className="royal-card p-4 sm:p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
                  viewMode === 'calendar'
                    ? 'bg-maroon-800 text-gold-200 border border-gold-400'
                    : 'bg-ivory-pure text-maroon-800 border border-gold-400/40'
                }`}
              >
                <CalendarIcon className="w-4 h-4" /> Monthly Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-maroon-800 text-gold-200 border border-gold-400'
                    : 'bg-ivory-pure text-maroon-800 border border-gold-400/40'
                }`}
              >
                <List className="w-4 h-4" /> Date-Wise List
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleEnableNotifications}
                className="btn-outline-gold !py-2 !px-4 !text-xs"
              >
                <Bell className="w-4 h-4 text-maroon-700" />
                {notifEnabled ? 'Reminders Active' : 'Enable Event Reminders'}
              </button>
              <button
                onClick={() => {
                  downloadWeddingSchedulePDF(events, settings);
                  toast.success('Schedule PDF downloaded!');
                }}
                className="btn-gold !py-2 !px-5 !text-xs"
              >
                <Download className="w-4 h-4" /> Download Schedule PDF
              </button>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Monthly Calendar */}
              <div className="lg:col-span-7 royal-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                    className="p-2 rounded-full border border-gold-400/50 hover:bg-gold-50 text-maroon-900"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-900">
                    {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                    className="p-2 rounded-full border border-gold-400/50 hover:bg-gold-50 text-maroon-900"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Jump Chips for Wedding Dates */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {Object.keys(eventsByDate)
                    .sort()
                    .map((dIso) => {
                      const dObj = new Date(`${dIso}T12:00:00`);
                      return (
                        <button
                          key={dIso}
                          onClick={() => {
                            setCurrentMonth(new Date(dObj.getFullYear(), dObj.getMonth(), 1));
                            setSelectedDate(dIso);
                          }}
                          className={`text-xs px-3 py-1 rounded-full border transition ${
                            selectedDate === dIso
                              ? 'bg-maroon-800 text-gold-200 border-gold-400'
                              : 'bg-gold-50 text-maroon-800 border-gold-400/50 hover:bg-gold-100'
                          }`}
                        >
                          {dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} (
                          {eventsByDate[dIso].length})
                        </button>
                      );
                    })}
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-maroon-700 uppercase tracking-wider mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="py-2">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {calendarCells.map((cell, i) => {
                    if (!cell.day || !cell.iso) {
                      return <div key={i} className="h-16 sm:h-20 rounded-xl bg-beige-soft/20" />;
                    }
                    const dayEvts = eventsByDate[cell.iso] || [];
                    const hasEvents = dayEvts.length > 0;
                    const isSelected = selectedDate === cell.iso;

                    return (
                      <button
                        key={cell.iso}
                        onClick={() => setSelectedDate(cell.iso!)}
                        className={`h-16 sm:h-20 rounded-xl p-1.5 border text-left flex flex-col justify-between transition ${
                          isSelected
                            ? 'bg-maroon-800 text-ivory-pure border-gold-400 shadow-gold'
                            : hasEvents
                            ? 'bg-gold-100/80 border-gold-500 text-maroon-950 hover:bg-gold-200/70'
                            : 'bg-ivory-pure/70 border-gold-400/20 text-maroon-900/70 hover:bg-gold-50'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-bold">{cell.day}</span>
                        {hasEvents && (
                          <div className="space-y-0.5">
                            <span
                              className={`block text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded truncate ${
                                isSelected
                                  ? 'bg-gold-500 text-maroon-950'
                                  : 'bg-maroon-800 text-gold-200'
                              }`}
                            >
                              {dayEvts.length} {dayEvts.length === 1 ? 'Event' : 'Events'}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Events */}
              <div className="lg:col-span-5 space-y-4">
                <div className="royal-card p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
                    Selected Day Itinerary
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-900 mt-1">
                    {selectedDate ? formatDateLong(selectedDate) : 'Select a Date'}
                  </h3>

                  {selectedDayEvents.length === 0 ? (
                    <p className="text-sm text-maroon-900/70 mt-4">
                      No ceremonies scheduled on this date. Click a highlighted gold date to view ceremonies.
                    </p>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {selectedDayEvents.map((evt) => (
                        <div
                          key={evt.id}
                          className="p-4 rounded-xl bg-beige-soft/45 border border-gold-400/50 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-xl font-bold text-maroon-900">
                              {evt.title}
                            </h4>
                            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-maroon-800 text-gold-200 shrink-0">
                              {getEventStatus(evt)}
                            </span>
                          </div>
                          <p className="text-xs text-maroon-800 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gold-700" />
                            {formatTimeDisplay(evt.startTime)} – {formatTimeDisplay(evt.endTime)}
                          </p>
                          <p className="text-xs text-maroon-900/80 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                            <span>
                              {evt.venueName}, {evt.fullAddress}
                            </span>
                          </p>
                          <p className="text-xs text-maroon-900/80 leading-relaxed">
                            {evt.description}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <a
                              href={buildGoogleCalendarUrl(evt, settings)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-gold !py-1.5 !px-3.5 !text-xs"
                            >
                              <CalendarPlus className="w-3.5 h-3.5" /> Add to Google Calendar
                            </a>
                            <a
                              href={evt.googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-outline-gold !py-1.5 !px-3.5 !text-xs"
                            >
                              <Navigation className="w-3.5 h-3.5" /> Map
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Date-Wise Grouped List View */
            <div className="space-y-8">
              {Object.keys(eventsByDate)
                .sort()
                .map((dateIso) => (
                  <div key={dateIso} className="royal-card p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-gold-400/40">
                      <h2 className="font-serif text-3xl font-bold text-maroon-900">
                        {formatDateLong(dateIso)}
                      </h2>
                      <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-gold-100 text-maroon-900 border border-gold-400/60">
                        {eventsByDate[dateIso].length} Ceremonies
                      </span>
                    </div>

                    <div className="space-y-5">
                      {eventsByDate[dateIso].map((evt) => (
                        <div
                          key={evt.id}
                          className="flex flex-col md:flex-row md:items-center gap-5 p-4 rounded-xl bg-ivory border border-gold-400/30"
                        >
                          <img
                            src={evt.imageUrl}
                            alt={evt.title}
                            className="w-full md:w-36 h-32 md:h-24 rounded-xl object-cover shrink-0"
                            loading="lazy"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-2xl font-bold text-maroon-900">
                                {evt.title}
                              </h3>
                              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-maroon-800 text-gold-200">
                                {getEventStatus(evt)}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-gold-800">
                              {formatTimeDisplay(evt.startTime)} – {formatTimeDisplay(evt.endTime)} •{' '}
                              {evt.venueName}
                            </p>
                            <p className="text-sm text-maroon-900/80">{evt.description}</p>
                          </div>
                          <div className="flex md:flex-col gap-2 shrink-0">
                            <a
                              href={buildGoogleCalendarUrl(evt, settings)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-gold !py-2 !px-4 !text-xs"
                            >
                              <CalendarPlus className="w-3.5 h-3.5" /> Google Cal
                            </a>
                            <a
                              href={evt.googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-outline-gold !py-2 !px-4 !text-xs"
                            >
                              <Navigation className="w-3.5 h-3.5" /> Directions
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

