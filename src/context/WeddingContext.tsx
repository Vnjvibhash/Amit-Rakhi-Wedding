import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
  HI_ALBUMS,
  HI_COUPLE,
  HI_EVENTS,
  HI_FAMILY,
  HI_SETTINGS,
  HI_VIDEOS
} from '../data/localizedData';
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
import { useLanguage } from './LanguageContext';

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
  const { language } = useLanguage();

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

  // Localized data representations based on user's active language preference
  const localizedSettings = useMemo(() => {
    if (language === 'hi') {
      return {
        ...settings,
        coupleDisplayName: HI_SETTINGS.coupleDisplayName,
        groomFirstName: HI_SETTINGS.groomFirstName,
        brideFirstName: HI_SETTINGS.brideFirstName,
        weddingHeadline: HI_SETTINGS.weddingHeadline,
        subHeadline: HI_SETTINGS.subHeadline,
        welcomeMessage: HI_SETTINGS.welcomeMessage,
        invitationMessage: HI_SETTINGS.invitationMessage,
        familyBlessingHeader: HI_SETTINGS.familyBlessingHeader,
        weddingDateFormatted: HI_SETTINGS.weddingDateFormatted,
        primaryVenueName: HI_SETTINGS.primaryVenueName,
        primaryVenueCity: HI_SETTINGS.primaryVenueCity,
        primaryVenueAddress: HI_SETTINGS.primaryVenueAddress,
        musicTrackTitle: HI_SETTINGS.musicTrackTitle,
        venueDetails: {
          ...settings.venueDetails,
          nearbyAccommodations: HI_SETTINGS.venueDetails.nearbyAccommodations,
          parkingInfo: HI_SETTINGS.venueDetails.parkingInfo,
          transportationInfo: HI_SETTINGS.venueDetails.transportationInfo,
          travelInstructions: HI_SETTINGS.venueDetails.travelInstructions
        }
      };
    }
    return settings;
  }, [settings, language]);

  const localizedCouple = useMemo(() => {
    if (language === 'hi') {
      return {
        ...couple,
        bride: {
          ...couple.bride,
          fullName: HI_COUPLE.bride.fullName,
          nickname: HI_COUPLE.bride.nickname,
          bio: HI_COUPLE.bride.bio,
          parents: HI_COUPLE.bride.parents,
          grandparents: HI_COUPLE.bride.grandparents,
          hometown: HI_COUPLE.bride.hometown
        },
        groom: {
          ...couple.groom,
          fullName: HI_COUPLE.groom.fullName,
          nickname: HI_COUPLE.groom.nickname,
          bio: HI_COUPLE.groom.bio,
          parents: HI_COUPLE.groom.parents,
          grandparents: HI_COUPLE.groom.grandparents,
          hometown: HI_COUPLE.groom.hometown
        },
        storySummary: HI_COUPLE.storySummary,
        milestones: couple.milestones.map((m) => {
          const hiMilestone = HI_COUPLE.milestones.find((h) => h.id === m.id);
          if (hiMilestone) {
            return {
              ...m,
              year: hiMilestone.year,
              title: hiMilestone.title,
              location: hiMilestone.location,
              description: hiMilestone.description
            };
          }
          return m;
        })
      };
    }
    return couple;
  }, [couple, language]);

  const localizedFamily = useMemo(() => {
    if (language === 'hi') {
      return family.map((f) => {
        const hiMember = HI_FAMILY.find((h) => h.id === f.id);
        if (hiMember) {
          return {
            ...f,
            name: hiMember.name,
            relation: hiMember.relation,
            bio: hiMember.bio
          };
        }
        return f;
      });
    }
    return family;
  }, [family, language]);

  const localizedEvents = useMemo(() => {
    if (language === 'hi') {
      return events.map((e) => {
        const hiEvt = HI_EVENTS.find((h) => h.id === e.id);
        if (hiEvt) {
          return {
            ...e,
            title: hiEvt.title,
            ceremonyType: hiEvt.ceremonyType,
            venueName: hiEvt.venueName,
            fullAddress: hiEvt.fullAddress,
            description: hiEvt.description,
            dressCode: hiEvt.dressCode
          };
        }
        return e;
      });
    }
    return events;
  }, [events, language]);

  const localizedAlbums = useMemo(() => {
    if (language === 'hi') {
      return albums.map((a) => {
        const hiAlb = HI_ALBUMS.find((h) => h.id === a.id);
        if (hiAlb) {
          return {
            ...a,
            title: hiAlb.title,
            description: hiAlb.description
          };
        }
        return a;
      });
    }
    return albums;
  }, [albums, language]);

  const localizedVideos = useMemo(() => {
    if (language === 'hi') {
      return videos.map((v) => {
        const hiVid = HI_VIDEOS.find((h) => h.id === v.id);
        if (hiVid) {
          return {
            ...v,
            title: hiVid.title,
            description: hiVid.description
          };
        }
        return v;
      });
    }
    return videos;
  }, [videos, language]);

  return (
    <WeddingContext.Provider
      value={{
        settings: localizedSettings,
        couple: localizedCouple,
        family: localizedFamily,
        events: localizedEvents,
        albums: localizedAlbums,
        photos,
        videos: localizedVideos,
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
