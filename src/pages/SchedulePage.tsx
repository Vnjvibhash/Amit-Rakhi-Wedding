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
import { useLanguage } from '../context/LanguageContext';
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
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [notifEnabled, setNotifEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const sortedEvents = useMemo(() => [...events].sort((a, b) => a.order - b.order), [events]);

  const initialMonth = useMemo(() => {
    const first = sortedEvents[0]?.date;
    if (first) {
      const d = new Date(`${first}T12:00:00`);
      if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date(2026, 10, 1);
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
      new Notification(
        language === 'hi'
          ? `${settings.coupleDisplayName} विवाह स्मरण`
          : `${settings.coupleDisplayName} Wedding Reminder`,
        {
          body: next
            ? language === 'hi'
              ? `आगामी कार्यक्रम: ${next.title} — ${formatDateLong(next.date, language)} को ${formatTimeDisplay(next.startTime, language)}`
              : `Next ceremony: ${next.title} on ${formatDateLong(next.date, language)} at ${formatTimeDisplay(next.startTime, language)}`
            : language === 'hi'
            ? 'विवाह कार्यक्रम सूचनाएं सक्रिय हो गईं!'
            : 'Wedding ceremony notifications enabled!',
          icon: '/images/wedding-logo.png'
        }
      );
      toast.success(
        language === 'hi'
          ? 'आगामी कार्यक्रम की सूचनाएं सक्रिय हो गईं!'
          : 'Upcoming ceremony notifications enabled!'
      );
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

  const monthName = useMemo(() => {
    if (language === 'hi') {
      const hiMonths = [
        'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
        'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
      ];
      return `${hiMonths[month]} ${year}`;
    }
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentMonth, month, year, language]);

  return (
    <div>
      <PageHeader
        eyebrow={t('schedule.eyebrow')}
        title={t('schedule.title')}
        subtitle={t('schedule.subtitle')}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Top Controls: View Toggle, Reminders & PDF Download */}
          <div className="royal-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-gold-100/70 border border-gold-400/40">
              <button
                onClick={() => setViewMode('calendar')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition ${
                  viewMode === 'calendar'
                    ? 'bg-maroon-800 text-gold-200 shadow-sm'
                    : 'text-maroon-900 hover:text-gold-700'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" /> {t('schedule.calendarView')}
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition ${
                  viewMode === 'list'
                    ? 'bg-maroon-800 text-gold-200 shadow-sm'
                    : 'text-maroon-900 hover:text-gold-700'
                }`}
              >
                <List className="w-3.5 h-3.5" /> {t('schedule.listView')}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleEnableNotifications}
                className="btn-outline-gold !py-2 !px-3.5 !text-xs"
              >
                <Bell className={`w-3.5 h-3.5 ${notifEnabled ? 'text-emerald-600 fill-emerald-600' : ''}`} />
                {notifEnabled ? t('schedule.notifActive') : t('schedule.enableNotif')}
              </button>
              <button
                onClick={() => downloadWeddingSchedulePDF(sortedEvents, settings)}
                className="btn-gold !py-2 !px-4 !text-xs"
              >
                <Download className="w-3.5 h-3.5" /> {t('schedule.downloadPdf')}
              </button>
            </div>
          </div>

          {/* CALENDAR VIEW */}
          {viewMode === 'calendar' ? (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Calendar Month Card */}
              <div className="lg:col-span-7 royal-card p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gold-400/30">
                  <h3 className="font-serif text-2xl font-bold text-maroon-900">
                    {monthName}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                      className="p-2 rounded-full border border-gold-400/40 text-maroon-800 hover:bg-gold-50"
                      aria-label="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                      className="p-2 rounded-full border border-gold-400/40 text-maroon-800 hover:bg-gold-50"
                      aria-label="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gold-800 uppercase tracking-wider pb-2">
                  <span>{t('schedule.sun')}</span>
                  <span>{t('schedule.mon')}</span>
                  <span>{t('schedule.tue')}</span>
                  <span>{t('schedule.wed')}</span>
                  <span>{t('schedule.thu')}</span>
                  <span>{t('schedule.fri')}</span>
                  <span>{t('schedule.sat')}</span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarCells.map((cell, idx) => {
                    if (!cell.day || !cell.iso) {
                      return <div key={idx} className="h-16 sm:h-20 rounded-xl bg-beige-soft/20" />;
                    }
                    const hasEvents = (eventsByDate[cell.iso] || []).length > 0;
                    const isSelected = selectedDate === cell.iso;

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(cell.iso!)}
                        className={`h-16 sm:h-20 rounded-xl p-1.5 flex flex-col justify-between text-left transition border ${
                          isSelected
                            ? 'bg-maroon-800 text-gold-200 border-gold-400 shadow-md scale-[1.02]'
                            : hasEvents
                            ? 'bg-gold-100/80 text-maroon-900 border-gold-400/60 hover:bg-gold-200/60'
                            : 'bg-ivory-pure text-maroon-900/60 border-gold-400/20 hover:bg-gold-50'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold">{cell.day}</span>
                        {hasEvents && (
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                            <span className="text-[10px] truncate hidden sm:inline font-medium">
                              {eventsByDate[cell.iso].length}{' '}
                              {language === 'hi' ? 'रस्म' : 'evt'}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Details */}
              <div className="lg:col-span-5 royal-card p-6 sm:p-7 space-y-4">
                <div className="pb-3 border-b border-gold-400/30">
                  <span className="text-xs uppercase tracking-wider font-semibold text-gold-700">
                    {t('schedule.selectedDayTitle')}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-maroon-900 mt-0.5">
                    {selectedDate ? formatDateLong(selectedDate, language) : ''}
                  </h3>
                </div>

                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-maroon-800/75 italic py-6 text-center">
                    {t('schedule.noEventsOnDay')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedDayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-4 rounded-xl bg-gold-50/70 border border-gold-400/40 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-serif text-lg font-bold text-maroon-900">
                            {evt.title}
                          </h4>
                          <span className="text-[11px] font-semibold text-gold-800 bg-gold-200/70 px-2 py-0.5 rounded-full">
                            {formatTimeDisplay(evt.startTime, language)}
                          </span>
                        </div>
                        <p className="text-xs text-maroon-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                          <span>{evt.venueName}</span>
                        </p>
                        <p className="text-xs text-maroon-900/80 leading-relaxed line-clamp-2">
                          {evt.description}
                        </p>
                        <div className="pt-2 flex items-center gap-2 text-xs">
                          <a
                            href={buildGoogleCalendarUrl(evt, settings)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-gold-800 hover:underline font-semibold"
                          >
                            <CalendarPlus className="w-3 h-3" /> {t('events.addToCalendar')}
                          </a>
                          {evt.googleMapsUrl && (
                            <a
                              href={evt.googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-maroon-800 hover:underline font-medium ml-auto"
                            >
                              <Navigation className="w-3 h-3" /> {t('events.viewMap')}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-4">
              {sortedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="royal-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-gold-700">
                      {formatDateLong(evt.date, language)} • {formatTimeDisplay(evt.startTime, language)}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-maroon-900">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-maroon-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                      <span>{evt.venueName} — {evt.fullAddress}</span>
                    </p>
                    <p className="text-xs text-maroon-900/80 pt-1 max-w-2xl">{evt.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={buildGoogleCalendarUrl(evt, settings)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline-gold !py-2 !px-3.5 !text-xs"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" /> {t('events.addToCalendar')}
                    </a>
                    {evt.googleMapsUrl && (
                      <a
                        href={evt.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline-gold !py-2 !px-3.5 !text-xs"
                      >
                        <Navigation className="w-3.5 h-3.5" /> {t('events.viewMap')}
                      </a>
                    )}
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
