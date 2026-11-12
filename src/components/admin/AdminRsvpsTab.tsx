import React, { useMemo, useState } from 'react';
import { Download, Search, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../../context/WeddingContext';
import { deleteGuestRSVP, updateGuestRSVP } from '../../services/weddingService';
import { GuestRSVP } from '../../types/wedding';

export const AdminRsvpsTab: React.FC = () => {
  const { rsvps } = useWedding();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | GuestRSVP['attending']>('all');

  const filtered = useMemo(() => {
    return rsvps.filter((r) => {
      const statusOk = statusFilter === 'all' || r.attending === statusFilter;
      const q = search.trim().toLowerCase();
      const qOk =
        !q ||
        r.guestName.toLowerCase().includes(q) ||
        r.mobileNumber.toLowerCase().includes(q) ||
        r.eventsAttending.some((e) => e.toLowerCase().includes(q));
      return statusOk && qOk;
    });
  }, [rsvps, search, statusFilter]);

  const confirmedGuests = useMemo(
    () => rsvps.filter((r) => r.attending === 'attending').reduce((sum, r) => sum + r.guestCount, 0),
    [rsvps]
  );

  const handleExportCSV = () => {
    const headers = [
      'Guest Name',
      'Mobile Number',
      'Email',
      'Status',
      'Guest Count',
      'Events Attending',
      'Dietary Notes',
      'Message',
      'Submitted At'
    ];
    const rows = filtered.map((r) => [
      r.guestName,
      r.mobileNumber,
      r.email || '',
      r.attending,
      String(r.guestCount),
      r.eventsAttending.join('; '),
      r.dietaryNotes || '',
      r.message || '',
      r.createdAt
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-guest-rsvps.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Guest RSVP list exported as CSV!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-bold text-maroon-900">Guest RSVP Management</h2>
          <p className="text-xs text-maroon-700 flex items-center gap-1.5 mt-0.5">
            <Users className="w-3.5 h-3.5" />
            {rsvps.length} total responses • {confirmedGuests} confirmed attending guests
          </p>
        </div>
        <button onClick={handleExportCSV} className="btn-gold !py-2.5 !px-5 !text-xs">
          <Download className="w-4 h-4" /> Export CSV ({filtered.length})
        </button>
      </div>

      <div className="royal-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-maroon-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest name, mobile, or ceremony..."
            className="input-royal pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | GuestRSVP['attending'])}
          className="input-royal sm:w-52"
        >
          <option value="all">All Statuses</option>
          <option value="attending">Attending</option>
          <option value="maybe">Maybe</option>
          <option value="not_attending">Not Attending</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="royal-card p-10 text-center text-sm text-maroon-800/75">
          No RSVP responses found for the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="royal-card p-5 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-maroon-900">{r.guestName}</h4>
                  <p className="text-xs text-maroon-800">
                    {r.mobileNumber} {r.email ? `• ${r.email}` : ''} •{' '}
                    <strong>{r.guestCount} Guest(s)</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={r.attending}
                    onChange={(e) =>
                      updateGuestRSVP(r.id, {
                        attending: e.target.value as GuestRSVP['attending']
                      }).then(() => toast.success('RSVP status updated'))
                    }
                    className="rounded-full border border-gold-400/60 bg-ivory-pure px-3 py-1 text-xs font-semibold text-maroon-900"
                  >
                    <option value="attending">Attending</option>
                    <option value="maybe">Maybe</option>
                    <option value="not_attending">Not Attending</option>
                  </select>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete RSVP from ${r.guestName}?`)) {
                        await deleteGuestRSVP(r.id);
                        toast.success('RSVP deleted.');
                      }
                    }}
                    className="p-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                    title="Delete RSVP"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {r.eventsAttending.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {r.eventsAttending.map((evtName) => (
                    <span
                      key={evtName}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold-100 text-maroon-900 border border-gold-400/50"
                    >
                      {evtName}
                    </span>
                  ))}
                </div>
              )}

              {r.dietaryNotes && (
                <p className="text-xs text-maroon-800">
                  <strong>Dietary / Arrival:</strong> {r.dietaryNotes}
                </p>
              )}
              {r.message && (
                <p className="text-sm italic text-maroon-900/85 bg-beige-soft/45 p-3 rounded-xl">
                  “{r.message}”
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

