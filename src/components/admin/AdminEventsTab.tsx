import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Edit2, Plus, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../../context/WeddingContext';
import {
  deleteWeddingEvent,
  reorderWeddingEvents,
  saveWeddingEvent,
  uploadImageAsset
} from '../../services/weddingService';
import { CeremonyType, EventStatus, WeddingEvent } from '../../types/wedding';
import { formatDateLong, formatTimeDisplay, getEventStatus } from '../../utils/calendar';

const CEREMONY_OPTIONS: CeremonyType[] = [
  'Tilak Ceremony',
  'Engagement Ceremony',
  'Haldi Ceremony',
  'Mehendi Ceremony',
  'Sangeet Night',
  'Matkor Ceremony',
  'Mandapachadan',
  'Baraat',
  'Wedding Ceremony (Vivah)',
  'Kanyadaan',
  'Vidaai',
  'Reception',
  'Custom Family Event'
];

const EMPTY_EVENT: Omit<WeddingEvent, 'id'> = {
  title: '',
  ceremonyType: 'Tilak Ceremony',
  date: '2026-11-25',
  startTime: '10:00',
  endTime: '13:00',
  venueName: '',
  fullAddress: '',
  description: '',
  imageUrl: '/images/events/vivah.jpg',
  dressCode: '',
  googleMapsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
  statusOverride: 'auto',
  highlight: false,
  order: 1
};

export const AdminEventsTab: React.FC = () => {
  const { events } = useWedding();
  const sorted = [...events].sort((a, b) => a.order - b.order);

  const [editing, setEditing] = useState<(Omit<WeddingEvent, 'id'> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const handleOpenNew = () => {
    setEditing({ ...EMPTY_EVENT, order: sorted.length + 1 });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await saveWeddingEvent(editing);
      toast.success(editing.id ? 'Event updated!' : 'New wedding event added!');
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (evt: WeddingEvent) => {
    if (!confirm(`Delete "${evt.title}"?`)) return;
    try {
      await deleteWeddingEvent(evt.id);
      toast.success('Event deleted.');
    } catch {
      toast.error('Could not delete event.');
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const copy = [...sorted];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    try {
      await reorderWeddingEvents(copy);
      toast.success('Event order updated.');
    } catch {
      toast.error('Could not reorder events.');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!editing) return;
    setUploadingImg(true);
    try {
      const url = await uploadImageAsset(file, 'events');
      setEditing({ ...editing, imageUrl: url });
      toast.success('Event photograph uploaded!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingImg(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-bold text-maroon-900">Wedding Events Manager</h2>
          <p className="text-xs text-maroon-700">
            Add, edit, delete, reorder ceremonies, or override live event status.
          </p>
        </div>
        <button onClick={handleOpenNew} className="btn-royal !py-2.5 !px-5 !text-xs">
          <Plus className="w-4 h-4" /> Add New Ceremony
        </button>
      </div>

      {/* Editor Modal / Inline Drawer */}
      {editing && (
        <form onSubmit={handleSave} className="royal-card p-6 space-y-4 border-2 border-gold-500">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-maroon-900">
              {editing.id ? `Edit: ${editing.title}` : 'Create Wedding Event'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-xs font-semibold text-maroon-700 hover:underline"
            >
              Cancel
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="e.g., Haldi Ceremony"
                className="input-royal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Ceremony Category
              </label>
              <select
                value={editing.ceremonyType}
                onChange={(e) => setEditing({ ...editing, ceremonyType: e.target.value })}
                className="input-royal"
              >
                {CEREMONY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">Date *</label>
              <input
                type="date"
                required
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                className="input-royal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={editing.startTime}
                onChange={(e) => setEditing({ ...editing, startTime: e.target.value })}
                className="input-royal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={editing.endTime}
                onChange={(e) => setEditing({ ...editing, endTime: e.target.value })}
                className="input-royal"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                required
                value={editing.venueName}
                onChange={(e) => setEditing({ ...editing, venueName: e.target.value })}
                className="input-royal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Full Address *
              </label>
              <input
                type="text"
                required
                value={editing.fullAddress}
                onChange={(e) => setEditing({ ...editing, fullAddress: e.target.value })}
                className="input-royal"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Dress Code (Optional)
              </label>
              <input
                type="text"
                value={editing.dressCode || ''}
                onChange={(e) => setEditing({ ...editing, dressCode: e.target.value })}
                placeholder="e.g., Marigold Yellow & Ivory"
                className="input-royal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Google Maps Link *
              </label>
              <input
                type="url"
                required
                value={editing.googleMapsUrl}
                onChange={(e) => setEditing({ ...editing, googleMapsUrl: e.target.value })}
                className="input-royal"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Event Status Mode
              </label>
              <select
                value={editing.statusOverride || 'auto'}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    statusOverride: e.target.value as EventStatus | 'auto'
                  })
                }
                className="input-royal"
              >
                <option value="auto">Automatic (Based on Date & Time)</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-maroon-900 pb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(editing.highlight)}
                onChange={(e) => setEditing({ ...editing, highlight: e.target.checked })}
                className="accent-maroon-800"
              />
              Feature on Homepage Highlights
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">
              Event Description *
            </label>
            <textarea
              rows={3}
              required
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="input-royal"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Event Photo URL
              </label>
              <input
                type="text"
                value={editing.imageUrl}
                onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                className="input-royal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-maroon-900 mb-1">
                Or Upload Event Photo
              </label>
              <label className="btn-outline-gold !py-2.5 !px-4 !text-xs cursor-pointer w-full justify-center">
                <Upload className="w-4 h-4" />
                {uploadingImg ? 'Uploading...' : 'Choose Photo from Device'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="btn-outline-gold !py-2 !px-4 !text-xs"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving || uploadingImg} className="btn-royal !py-2 !px-6 !text-xs">
              {saving ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      )}

      {/* Chronological Events List */}
      <div className="space-y-3">
        {sorted.map((evt, index) => (
          <div
            key={evt.id}
            className="royal-card p-4 flex flex-col md:flex-row md:items-center gap-4"
          >
            <img
              src={evt.imageUrl}
              alt={evt.title}
              className="w-full md:w-24 h-28 md:h-20 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gold-700">#{index + 1}</span>
                <h4 className="font-serif text-xl font-bold text-maroon-900">{evt.title}</h4>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gold-100 text-maroon-900">
                  {getEventStatus(evt)}
                </span>
              </div>
              <p className="text-xs text-maroon-800 mt-0.5">
                {formatDateLong(evt.date)} • {formatTimeDisplay(evt.startTime)} –{' '}
                {formatTimeDisplay(evt.endTime)} • {evt.venueName}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleMove(index, -1)}
                disabled={index === 0}
                className="p-2 rounded-lg border border-gold-400/50 hover:bg-gold-50 disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="w-4 h-4 text-maroon-800" />
              </button>
              <button
                onClick={() => handleMove(index, 1)}
                disabled={index === sorted.length - 1}
                className="p-2 rounded-lg border border-gold-400/50 hover:bg-gold-50 disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4 text-maroon-800" />
              </button>
              <button
                onClick={() => setEditing(evt)}
                className="p-2 rounded-lg border border-gold-400/50 hover:bg-gold-50 text-maroon-800"
                title="Edit Event"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(evt)}
                className="p-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-700"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

