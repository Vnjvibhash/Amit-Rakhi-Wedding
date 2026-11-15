import { jsPDF } from 'jspdf';
import { EventStatus, WeddingEvent, WeddingSettings } from '../types/wedding';

/**
 * Computes event status dynamically unless overridden by an admin.
 */
export function getEventStatus(event: WeddingEvent, now: Date = new Date()): EventStatus {
  if (event.statusOverride && event.statusOverride !== 'auto') {
    return event.statusOverride;
  }
  const start = new Date(`${event.date}T${normalizeTime(event.startTime)}:00+05:30`);
  const end = new Date(`${event.date}T${normalizeTime(event.endTime)}:00+05:30`);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'upcoming';
  }
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'completed';
}

function normalizeTime(timeStr: string): string {
  const clean = timeStr.trim();
  if (/^\d{2}:\d{2}$/.test(clean)) return clean;
  if (/^\d{1}:\d{2}$/.test(clean)) return `0${clean}`;
  return '09:00';
}

export function formatTimeDisplay(timeStr: string, locale: 'hi' | 'en' = 'hi'): string {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return timeStr;
  let hour = parseInt(match[1], 10);
  const mins = match[2];
  if (locale === 'hi') {
    let period = 'दोपहर';
    if (hour < 12 && hour >= 4) period = 'प्रातः';
    else if (hour >= 12 && hour < 16) period = 'दोपहर';
    else if (hour >= 16 && hour < 20) period = 'सायं';
    else period = 'रात्रि';
    const displayHour = hour % 12 || 12;
    return `${period} ${displayHour}:${mins} बजे`;
  }
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${mins} ${period}`;
}

export function formatDateLong(dateStr: string, locale: 'hi' | 'en' = 'hi'): string {
  const d = new Date(`${dateStr}T12:00:00`);
  if (isNaN(d.getTime())) return dateStr;
  if (locale === 'hi') {
    const weekdays = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const months = [
      'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
    ];
    return `${weekdays[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Generates an Add-to-Google-Calendar URL for a wedding event.
 */
export function buildGoogleCalendarUrl(event: WeddingEvent, settings: WeddingSettings): string {
  const compactDate = event.date.replace(/-/g, '');
  const startCompact = normalizeTime(event.startTime).replace(':', '') + '00';
  const endCompact = normalizeTime(event.endTime).replace(':', '') + '00';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} — ${settings.coupleDisplayName} Wedding`,
    dates: `${compactDate}T${startCompact}/${compactDate}T${endCompact}`,
    ctz: 'Asia/Kolkata',
    details: `${event.description}${event.dressCode ? `\n\nDress Code: ${event.dressCode}` : ''}`,
    location: `${event.venueName}, ${event.fullAddress}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Exports the complete wedding schedule as a styled PDF document.
 */
export function downloadWeddingSchedulePDF(
  events: WeddingEvent[],
  settings: WeddingSettings
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const drawFrame = () => {
    doc.setFillColor(250, 246, 238);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setDrawColor(107, 15, 26);
    doc.setLineWidth(1.2);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.rect(11, 11, pageWidth - 22, pageHeight - 22);
  };

  drawFrame();

  // Header
  doc.setTextColor(107, 15, 26);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text(`${settings.coupleDisplayName}`, pageWidth / 2, 24, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(143, 101, 8);
  doc.text('Shubh Vivah — Complete Wedding Schedule & Ceremonies', pageWidth / 2, 31, {
    align: 'center'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(80, 40, 40);
  doc.text(
    `${settings.weddingDateFormatted}  •  ${settings.primaryVenueName}, ${settings.primaryVenueCity}`,
    pageWidth / 2,
    37,
    { align: 'center' }
  );

  doc.setDrawColor(212, 175, 55);
  doc.line(25, 41, pageWidth - 25, 41);

  let y = 49;
  const sorted = [...events].sort((a, b) => a.order - b.order);

  const pdfSafe = (text: string) =>
    text
      .replace(/\s*\([^)]*[^\x00-\x7F]+[^)]*\)/g, '')
      .replace(/[^\x20-\x7E\u2013\u2014\u2022]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  sorted.forEach((evt, idx) => {
    if (y > pageHeight - 34) {
      doc.addPage();
      drawFrame();
      y = 22;
    }

    // Event badge & title
    doc.setFillColor(107, 15, 26);
    doc.roundedRect(16, y - 4.5, 8, 6, 1.5, 1.5, 'F');
    doc.setTextColor(250, 246, 238);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`${idx + 1}`, 20, y - 0.5, { align: 'center' });

    doc.setTextColor(107, 15, 26);
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text(pdfSafe(evt.title), 27, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(143, 101, 8);
    const dateTimeLabel = `${formatDateLong(evt.date)} | ${formatTimeDisplay(
      evt.startTime
    )} - ${formatTimeDisplay(evt.endTime)}`;
    doc.text(dateTimeLabel, 27, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 30, 30);
    doc.text(pdfSafe(`Venue: ${evt.venueName}, ${evt.fullAddress}`), 27, y + 9.5, {
      maxWidth: pageWidth - 45
    });

    if (evt.dressCode) {
      doc.setTextColor(107, 15, 26);
      doc.text(pdfSafe(`Dress Code: ${evt.dressCode}`), 27, y + 14.5, {
        maxWidth: pageWidth - 45
      });
      y += 22;
    } else {
      y += 17;
    }

    doc.setDrawColor(234, 219, 192);
    doc.line(20, y - 3, pageWidth - 20, y - 3);
  });

  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(107, 15, 26);
  doc.text(
    `With love & warm regards — ${settings.coupleDisplayName} & Families (${settings.contactPhone})`,
    pageWidth / 2,
    pageHeight - 14,
    { align: 'center' }
  );

  doc.save(`${settings.coupleDisplayName.replace(/[^a-zA-Z0-9]+/g, '-')}-Wedding-Schedule.pdf`);
}

