import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Calendar,
  Camera,
  Film,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../context/WeddingContext';
import { AdminEventsTab } from '../components/admin/AdminEventsTab';
import { AdminGalleryTab } from '../components/admin/AdminGalleryTab';
import { AdminVideosTab } from '../components/admin/AdminVideosTab';
import { AdminRsvpsTab } from '../components/admin/AdminRsvpsTab';
import { AdminFamilyTab } from '../components/admin/AdminFamilyTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { getEventStatus } from '../utils/calendar';

type AdminTab = 'overview' | 'events' | 'gallery' | 'videos' | 'rsvps' | 'family' | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin, loading, adminProfile, isDemoMode, logout } = useAuth();
  const { events, photos, videos, rsvps, family, settings } = useWedding();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const upcomingCount = useMemo(
    () => events.filter((e) => getEventStatus(e) === 'upcoming').length,
    [events]
  );

  const attendingHeadcount = useMemo(
    () => rsvps.filter((r) => r.attending === 'attending').reduce((s, r) => s + r.guestCount, 0),
    [rsvps]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory text-maroon-900 font-serif text-2xl">
        Verifying Royal Administrator Session...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'events', label: `Events (${events.length})`, icon: <Calendar className="w-4 h-4" /> },
    { id: 'gallery', label: `Photos (${photos.length})`, icon: <Camera className="w-4 h-4" /> },
    { id: 'videos', label: `Videos (${videos.length})`, icon: <Film className="w-4 h-4" /> },
    { id: 'rsvps', label: `RSVPs (${rsvps.length})`, icon: <Users className="w-4 h-4" /> },
    { id: 'family', label: `Couple & Family`, icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Content', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-ivory pt-20 pb-16">
      {/* Admin Top Banner */}
      <div className="bg-royal-gradient text-ivory-pure py-8 px-4 sm:px-6 border-b border-gold-400/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {isDemoMode ? 'Preview Mode CMS' : 'Live Firebase CMS'} • {adminProfile?.role}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
              {settings.coupleDisplayName} — Admin Dashboard
            </h1>
            <p className="text-xs text-beige-soft/80 mt-0.5">Signed in as {adminProfile?.email}</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/50 text-gold-200 hover:bg-white/10 text-xs font-semibold self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeTab === t.id
                  ? 'bg-gold-gradient text-maroon-950 shadow-gold'
                  : 'bg-maroon-950/50 text-ivory-pure/85 border border-gold-400/30 hover:bg-white/10'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => setActiveTab('events')}
                className="royal-card p-6 cursor-pointer hover:shadow-gold transition"
              >
                <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold">
                  Total Wedding Events
                </p>
                <p className="font-serif text-4xl font-bold text-maroon-900 mt-2">
                  {events.length}
                </p>
                <p className="text-xs text-maroon-700 mt-1">{upcomingCount} upcoming ceremonies</p>
              </div>

              <div
                onClick={() => setActiveTab('events')}
                className="royal-card p-6 cursor-pointer hover:shadow-gold transition"
              >
                <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold">
                  Upcoming Ceremonies
                </p>
                <p className="font-serif text-4xl font-bold text-maroon-900 mt-2">
                  {upcomingCount}
                </p>
                <p className="text-xs text-maroon-700 mt-1">Chronological itinerary active</p>
              </div>

              <div
                onClick={() => setActiveTab('gallery')}
                className="royal-card p-6 cursor-pointer hover:shadow-gold transition"
              >
                <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold">
                  Uploaded Photographs
                </p>
                <p className="font-serif text-4xl font-bold text-maroon-900 mt-2">
                  {photos.length}
                </p>
                <p className="text-xs text-maroon-700 mt-1">Across ceremony albums</p>
              </div>

              <div
                onClick={() => setActiveTab('rsvps')}
                className="royal-card p-6 cursor-pointer hover:shadow-gold transition"
              >
                <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold">
                  Total Guest RSVPs
                </p>
                <p className="font-serif text-4xl font-bold text-maroon-900 mt-2">
                  {rsvps.length}
                </p>
                <p className="text-xs text-maroon-700 mt-1">
                  {attendingHeadcount} confirmed attending guests
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="royal-card p-6 space-y-3">
                <h3 className="font-serif text-2xl font-bold text-maroon-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-700" /> Quick Management Actions
                </h3>
                <p className="text-xs text-maroon-800/80">
                  Manage every section of your wedding celebration portal dynamically without editing source code.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button
                    onClick={() => setActiveTab('events')}
                    className="btn-royal !py-2 !px-4 !text-xs"
                  >
                    Manage Events
                  </button>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="btn-gold !py-2 !px-4 !text-xs"
                  >
                    Upload Wedding Photos
                  </button>
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className="btn-outline-gold !py-2 !px-4 !text-xs"
                  >
                    View &amp; Export RSVPs
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="btn-outline-gold !py-2 !px-4 !text-xs"
                  >
                    Edit Invitation Text
                  </button>
                </div>
              </div>

              <div className="royal-card p-6 space-y-3">
                <h3 className="font-serif text-2xl font-bold text-maroon-900">
                  Recent Guest RSVPs
                </h3>
                {rsvps.length === 0 ? (
                  <p className="text-sm text-maroon-800/75">No RSVPs submitted yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {rsvps.slice(0, 4).map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-xs p-3 rounded-xl bg-beige-soft/45"
                      >
                        <div>
                          <p className="font-bold text-maroon-900">{r.guestName}</p>
                          <p className="text-maroon-700">
                            {r.guestCount} guest(s) • {r.mobileNumber}
                          </p>
                        </div>
                        <span className="uppercase font-bold px-2.5 py-1 rounded-full bg-gold-100 text-maroon-900 text-[10px]">
                          {r.attending}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="royal-card p-5 text-xs text-maroon-800/80 flex flex-wrap items-center justify-between gap-2">
              <span>
                Active Family Profiles: <strong>{family.length}</strong> • Videos:{' '}
                <strong>{videos.length}</strong>
              </span>
              <span>
                {isDemoMode
                  ? 'Preview Mode saves changes in browser localStorage. Add Firebase keys in .env to persist in Cloud Firestore.'
                  : 'Connected to Live Cloud Firestore & Firebase Storage.'}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'events' && <AdminEventsTab />}
        {activeTab === 'gallery' && <AdminGalleryTab />}
        {activeTab === 'videos' && <AdminVideosTab />}
        {activeTab === 'rsvps' && <AdminRsvpsTab />}
        {activeTab === 'family' && <AdminFamilyTab />}
        {activeTab === 'settings' && <AdminSettingsTab />}
      </div>
    </div>
  );
};

