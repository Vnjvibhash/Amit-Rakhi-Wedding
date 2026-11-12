export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

export type CeremonyType =
  | 'Tilak Ceremony'
  | 'Engagement Ceremony'
  | 'Haldi Ceremony'
  | 'Mehendi Ceremony'
  | 'Sangeet Night'
  | 'Matkor Ceremony'
  | 'Mandapachadan'
  | 'Baraat'
  | 'Wedding Ceremony (Vivah)'
  | 'Kanyadaan'
  | 'Vidaai'
  | 'Reception'
  | 'Custom Family Event';

export type AlbumCategory =
  | 'Pre-Wedding Photoshoot'
  | 'Engagement Photos'
  | 'Haldi Ceremony'
  | 'Mehendi Ceremony'
  | 'Sangeet Night'
  | 'Wedding Day'
  | 'Bride & Groom'
  | 'Family Moments'
  | 'Friends & Guests'
  | 'Reception'
  | 'Other Memories';

export interface WeddingSettings {
  id?: string;
  coupleDisplayName: string;
  groomFirstName: string;
  brideFirstName: string;
  weddingHeadline: string;
  subHeadline: string;
  welcomeMessage: string;
  invitationMessage: string;
  familyBlessingHeader: string;
  weddingDateISO: string; // e.g., "2027-02-20T19:30:00+05:30"
  weddingDateFormatted: string; // e.g., "20th February 2027"
  primaryVenueName: string;
  primaryVenueCity: string;
  primaryVenueAddress: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  backgroundMusicUrl: string;
  musicTrackTitle: string;
  allowPhotoDownload: boolean;
  allowGuestPhotoUpload: boolean;
  hashtag: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  venueDetails: {
    nearbyAccommodations: Array<{
      name: string;
      distance: string;
      category: string;
      notes: string;
    }>;
    parkingInfo: string;
    transportationInfo: string;
    travelInstructions: string[];
  };
}

export interface StoryMilestone {
  id: string;
  year: string;
  title: string;
  location: string;
  description: string;
  imageUrl?: string;
}

export interface CoupleDetails {
  id?: string;
  bride: {
    fullName: string;
    nickname: string;
    photoUrl: string;
    bio: string;
    parents: string;
    grandparents?: string;
    hometown: string;
  };
  groom: {
    fullName: string;
    nickname: string;
    photoUrl: string;
    bio: string;
    parents: string;
    grandparents?: string;
    hometown: string;
  };
  storySummary: string;
  milestones: StoryMilestone[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  side: 'bride' | 'groom' | 'both';
  generation: 'grandparents' | 'parents' | 'siblings_relatives';
  photoUrl: string;
  bio: string;
  phone?: string;
  whatsapp?: string;
  isContactCoordinator?: boolean;
  order: number;
}

export interface WeddingEvent {
  id: string;
  title: string;
  ceremonyType: CeremonyType | string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h) or display string
  endTime: string;
  venueName: string;
  fullAddress: string;
  description: string;
  imageUrl: string;
  dressCode?: string;
  googleMapsUrl: string;
  statusOverride?: EventStatus | 'auto';
  highlight?: boolean;
  order: number;
}

export interface WeddingAlbum {
  id: string;
  title: string;
  category: AlbumCategory;
  description: string;
  coverImageUrl: string;
  allowDownload: boolean;
  order: number;
  createdAt: string;
}

export interface WeddingPhoto {
  id: string;
  albumId: string;
  category: AlbumCategory;
  imageUrl: string;
  caption: string;
  uploadedBy?: string;
  allowDownload: boolean;
  createdAt: string;
}

export type VideoCategory =
  | 'Pre-Wedding Videos'
  | 'Wedding Invitation Videos'
  | 'Ceremony Highlights'
  | 'Short Wedding Reels'
  | 'Family Messages';

export interface WeddingVideo {
  id: string;
  title: string;
  category: VideoCategory;
  sourceType: 'youtube' | 'storage';
  videoUrl: string;
  thumbnailUrl?: string;
  description: string;
  duration?: string;
  createdAt: string;
}

export interface GuestRSVP {
  id: string;
  guestName: string;
  mobileNumber: string;
  email?: string;
  attending: 'attending' | 'not_attending' | 'maybe';
  guestCount: number;
  eventsAttending: string[]; // event IDs or titles
  dietaryNotes?: string;
  message: string;
  createdAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'super_admin';
}

