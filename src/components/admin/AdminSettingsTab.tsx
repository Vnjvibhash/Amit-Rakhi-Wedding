import React, { useEffect, useState } from 'react';
import { Database, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWedding } from '../../context/WeddingContext';
import { saveSettings, seedAllSampleData } from '../../services/weddingService';
import { WeddingSettings } from '../../types/wedding';

export const AdminSettingsTab: React.FC = () => {
  const { settings } = useWedding();
  const [form, setForm] = useState<WeddingSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings(form);
      toast.success('Website settings & content saved!');
    } catch {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (
      !confirm(
        'Populate / reset sample wedding events, albums, photos, videos, couple & family details?'
      )
    ) {
      return;
    }
    setSeeding(true);
    try {
      await seedAllSampleData();
      toast.success('Sample royal wedding data populated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to seed data.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-bold text-maroon-900">
            Website Content, Venue &amp; Settings
          </h2>
          <p className="text-xs text-maroon-700">
            Edit headlines, invitation message, countdown target, social links, and permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="btn-outline-gold !py-2 !px-4 !text-xs"
          >
            <Database className="w-4 h-4" /> {seeding ? 'Seeding...' : 'Seed Sample Data'}
          </button>
          <button type="submit" disabled={saving} className="btn-royal !py-2 !px-5 !text-xs">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="royal-card p-6 space-y-4">
        <h3 className="font-serif text-2xl font-bold text-maroon-900">
          Invitation Content &amp; Countdown
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">
              Couple Display Name
            </label>
            <input
              type="text"
              value={form.coupleDisplayName}
              onChange={(e) => setForm({ ...form, coupleDisplayName: e.target.value })}
              className="input-royal"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">
              Wedding Headline
            </label>
            <input
              type="text"
              value={form.weddingHeadline}
              onChange={(e) => setForm({ ...form, weddingHeadline: e.target.value })}
              className="input-royal"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">
              Wedding Date Formatted
            </label>
            <input
              type="text"
              value={form.weddingDateFormatted}
              onChange={(e) => setForm({ ...form, weddingDateFormatted: e.target.value })}
              className="input-royal"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">
              Countdown Target ISO DateTime
            </label>
            <input
              type="text"
              value={form.weddingDateISO}
              onChange={(e) => setForm({ ...form, weddingDateISO: e.target.value })}
              className="input-royal"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-maroon-900 mb-1">
            Personalized Welcome Message
          </label>
          <textarea
            rows={2}
            value={form.welcomeMessage}
            onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
            className="input-royal"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-maroon-900 mb-1">
            Family Invitation Message
          </label>
          <textarea
            rows={3}
            value={form.invitationMessage}
            onChange={(e) => setForm({ ...form, invitationMessage: e.target.value })}
            className="input-royal"
          />
        </div>
      </div>

      <div className="royal-card p-6 space-y-4">
        <h3 className="font-serif text-2xl font-bold text-maroon-900">
          Primary Venue, Contact &amp; Social Media Links
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={form.primaryVenueName}
            onChange={(e) => setForm({ ...form, primaryVenueName: e.target.value })}
            placeholder="Primary Venue Name"
            className="input-royal"
          />
          <input
            type="text"
            value={form.primaryVenueAddress}
            onChange={(e) => setForm({ ...form, primaryVenueAddress: e.target.value })}
            placeholder="Full Venue Address"
            className="input-royal"
          />
          <input
            type="url"
            value={form.googleMapsEmbedUrl}
            onChange={(e) => setForm({ ...form, googleMapsEmbedUrl: e.target.value })}
            placeholder="Google Maps Embed URL (iframe)"
            className="input-royal"
          />
          <input
            type="url"
            value={form.googleMapsDirectionsUrl}
            onChange={(e) => setForm({ ...form, googleMapsDirectionsUrl: e.target.value })}
            placeholder="Google Maps Directions / Route URL"
            className="input-royal"
          />
          <input
            type="text"
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            placeholder="Contact Phone"
            className="input-royal"
          />
          <input
            type="email"
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            placeholder="Contact Email"
            className="input-royal"
          />
          <input
            type="url"
            value={form.socialLinks?.instagram || ''}
            onChange={(e) =>
              setForm({
                ...form,
                socialLinks: { ...form.socialLinks, instagram: e.target.value }
              })
            }
            placeholder="Instagram URL"
            className="input-royal"
          />
          <input
            type="url"
            value={form.socialLinks?.youtube || ''}
            onChange={(e) =>
              setForm({
                ...form,
                socialLinks: { ...form.socialLinks, youtube: e.target.value }
              })
            }
            placeholder="YouTube Channel URL"
            className="input-royal"
          />
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-maroon-900 cursor-pointer">
            <input
              type="checkbox"
              checked={form.allowPhotoDownload}
              onChange={(e) => setForm({ ...form, allowPhotoDownload: e.target.checked })}
              className="accent-maroon-800"
            />
            Allow Guests to Download Photos
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-maroon-900 cursor-pointer">
            <input
              type="checkbox"
              checked={form.allowGuestPhotoUpload}
              onChange={(e) => setForm({ ...form, allowGuestPhotoUpload: e.target.checked })}
              className="accent-maroon-800"
            />
            Allow Guests to Upload Memories in Gallery
          </label>
        </div>
      </div>
    </form>
  );
};

