import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_ALBUMS,
  DEFAULT_COUPLE,
  DEFAULT_EVENTS,
  DEFAULT_FAMILY,
  DEFAULT_PHOTOS,
  DEFAULT_SETTINGS,
  DEFAULT_VIDEOS
} from '../data/sampleData';
import {
  subscribeAlbums,
  subscribeCouple,
  subscribeEvents,
  subscribeFamily,
  subscribePhotos,
  subscribeRsvps,
  subscribeSettings,
  subscribeVideos
} from '../services/weddingService';
import {
  CoupleDetails,
  FamilyMember,
  GuestRSVP,
  WeddingAlbum,
  WeddingEvent,
  WeddingPhoto,
  WeddingSettings,
  WeddingVideo
} from '../types/wedding';
import { useAuth } from './AuthContext';

interface WeddingContextValue {
  settings: WeddingSettings;
  couple: CoupleDetails;
  family: FamilyMember[];
  events: WeddingEvent[];
  albums: WeddingAlbum[];
  photos: WeddingPhoto[];
  videos: WeddingVideo[];
  rsvps: GuestRSVP[];
  loading: boolean;
}

const WeddingContext = createContext<WeddingContextValue | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState<WeddingSettings>(DEFAULT_SETTINGS);
  const [couple, setCouple] = useState<CoupleDetails>(DEFAULT_COUPLE);
  const [family, setFamily] = useState<FamilyMember[]>(DEFAULT_FAMILY);
  const [events, setEvents] = useState<WeddingEvent[]>(DEFAULT_EVENTS);
  const [albums, setAlbums] = useState<WeddingAlbum[]>(DEFAULT_ALBUMS);
  const [photos, setPhotos] = useState<WeddingPhoto[]>(DEFAULT_PHOTOS);
  const [videos, setVideos] = useState<WeddingVideo[]>(DEFAULT_VIDEOS);
  const [rsvps, setRsvps] = useState<GuestRSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs = [
      subscribeSettings((d) => {
        setSettings(d);
        setLoading(false);
      }),
      subscribeCouple(setCouple),
      subscribeFamily(setFamily),
      subscribeEvents(setEvents),
      subscribeAlbums(setAlbums),
      subscribePhotos(setPhotos),
      subscribeVideos(setVideos)
    ];

    return () => unsubs.forEach((u) => u());
  }, []);

  useEffect(() => {
    const unsub = subscribeRsvps(setRsvps, isAdmin);
    return () => unsub();
  }, [isAdmin]);

  return (
    <WeddingContext.Provider
      value={{
        settings,
        couple,
        family,
        events,
        albums,
        photos,
        videos,
        rsvps,
        loading
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export function useWedding(): WeddingContextValue {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error('useWedding must be used inside WeddingProvider');
  return ctx;
}

