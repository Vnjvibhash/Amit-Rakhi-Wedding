import {
  AlbumCategory,
  CoupleDetails,
  FamilyMember,
  GuestRSVP,
  WeddingAlbum,
  WeddingEvent,
  WeddingPhoto,
  WeddingSettings,
  WeddingVideo
} from '../types/wedding';

export const ALBUM_CATEGORIES: AlbumCategory[] = [
  'Pre-Wedding Photoshoot',
  'Engagement Photos',
  'Haldi Ceremony',
  'Mehendi Ceremony',
  'Sangeet Night',
  'Wedding Day',
  'Bride & Groom',
  'Family Moments',
  'Friends & Guests',
  'Reception',
  'Other Memories'
];

export const DEFAULT_SETTINGS: WeddingSettings = {
  id: 'main',
  coupleDisplayName: 'Amit & Rakhi',
  groomFirstName: 'Amit',
  brideFirstName: 'Rakhi',
  weddingHeadline: 'Bani Thi Sita Ram Ke Liye, Swayamwar To Ek Bahana Tha, Amit Ki Zindagi Mein To Rakhi Ko Hi Aana Tha',
  subHeadline: 'Shubh Panigrahan Sanskar • Vivah Invitation',
  welcomeMessage:
    'Humare utsuk nayan aapke swagat hetu pratiksharat rahenge — Your presence and warm blessings are our greatest treasure.',
  invitationMessage:
    'With the divine grace of Lord Ganesha & Bhagwan Vishnu, Shri Bhola Prasad Singh & Smt. Sunita Devi (Gram Chhadapatti, Post Bathnaha, Madhubani) and Shri Om Prakash Singh & Smt. Anju Devi (Gram Paroriyahi, Post Gajhara, Madhubani) cordially invite you to grace the auspicious Shubh Vivah of Amit Kumar & Rakhi Kumari.',
  familyBlessingHeader: 'With the Blessings of Our Families',
  weddingDateISO: '2026-11-25T20:00:00+05:30',
  weddingDateFormatted: '25th November 2026',
  primaryVenueName: 'Gram Chhadapatti & Paroriyahi, Madhubani',
  primaryVenueCity: 'Madhubani, Bihar',
  primaryVenueAddress:
    'Village Chhadapatti, Post Bathnaha & Village Paroriyahi, Post Gajhara, Madhubani, Bihar',
  googleMapsEmbedUrl: 'https://www.google.com/maps?q=26.434079,86.392661&z=15&output=embed',
  googleMapsDirectionsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
  backgroundMusicUrl: '/audio/wedding-melody.wav',
  musicTrackTitle: 'Raag Yaman — Sacred Vivah Melody',
  allowPhotoDownload: true,
  allowGuestPhotoUpload: true,
  hashtag: '#AmitWedsRakhi',
  contactEmail: 'blessings@amitrakhi.wedding',
  contactPhone: '+91 98350 11223',
  whatsappNumber: '919835011223',
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com'
  },
  venueDetails: {
    nearbyAccommodations: [
      {
        name: 'Hotel Heritage Mithila & Guest House',
        distance: 'Madhubani Town Center (15 mins)',
        category: 'Family Hospitality Block',
        notes:
          'Mention "Amit & Rakhi Wedding — Singh Family" for pre-reserved rooms and transport assistance.'
      },
      {
        name: 'Mithila Vatika Resort',
        distance: 'Station Road, Madhubani (18 mins)',
        category: 'Comfortable Stay & Banquet',
        notes: 'Family shuttle pickups operate morning and evening for all wedding functions.'
      },
      {
        name: 'Hotel Samrat International',
        distance: 'Near Madhubani Railway Station',
        category: 'Deluxe Guest Accommodation',
        notes: 'Ideal for guests arriving via train at Madhubani (MBI) or Darbhanga (DBG).'
      }
    ],
    parkingInfo:
      'Spacious dedicated family & guest parking is arranged near the Gram Chhadapatti (Bathnaha) wedding courtyard and Gram Paroriyahi (Gajhara) Vivah Mandap with volunteers guiding arrivals.',
    transportationInfo:
      'Baraat departs from Gram Chhadapatti (Post Bathnaha) at 8:00 PM sharp on Wednesday, 25th November 2026 towards Gram Paroriyahi (Post Gajhara). Family vehicles and guest shuttles are coordinated from Madhubani town & station.',
    travelInstructions: [
      'Nearest Airport: Darbhanga Airport (DBR) — approx. 42 km (1 hr 15 mins drive).',
      'Nearest Railway Station: Madhubani Railway Station (MBI) / Sakri Junction (SKI) / Jaynagar.',
      'Priti Bhoj begins at 4:00 PM on Monday, 23rd November 2026 at Gram Chhadapatti, Post Bathnaha.',
      'Baraat departure is scheduled promptly at 8:00 PM on Wednesday, 25th November 2026.',
      'Shubh Mundan ceremony of Rachit & Radhika will be celebrated on Thursday, 26th November 2026.'
    ]
  }
};

export const DEFAULT_COUPLE: CoupleDetails = {
  id: 'main',
  bride: {
    fullName: 'Rakhi Kumari',
    nickname: 'Rakhi',
    photoUrl: '/images/couple/bride.jpg',
    bio: 'Graceful, kind-hearted, and deeply rooted in Mithila traditions—cherishing family values, warmth, and joyful celebrations.',
    parents: 'Daughter of Shri Om Prakash Singh & Smt. Anju Devi',
    grandparents: 'Blessed by the elders of Paroriyahi, Gajhara, Madhubani',
    hometown: 'Gram Paroriyahi, Post Gajhara, Madhubani, Bihar'
  },
  groom: {
    fullName: 'Amit Kumar',
    nickname: 'Amit',
    photoUrl: '/images/couple/groom.jpg',
    bio: 'Warm, dedicated, and family-loving—proudly carrying forward the traditions and hospitality of the Singh family of Madhubani.',
    parents: 'Son of Shri Bhola Prasad Singh & Smt. Sunita Devi',
    grandparents: 'Blessed by Shri Badrinarayan Singh, Shri Ramvriksh Singh & Elders',
    hometown: 'Gram Chhadapatti, Post Bathnaha, Madhubani, Bihar'
  },
  storySummary:
    '“बनी थी सीता राम के लिए, स्वयंवर तो एक बहाना था, अमित की जिंदगी में तो राखी को ही आना था।” — Two hearts and two respected families of Mithila united by destiny, devotion, and timeless blessings.',
  milestones: [
    {
      id: 'm1',
      year: 'Blessings of Elders',
      title: 'Two Mithila Families Unite',
      location: 'Madhubani, Bihar',
      description:
        'With the warm blessings of Shri Badrinarayan Singh, Shri Ramvriksh Singh, and both families from Chhadapatti & Paroriyahi, Amit & Rakhi’s sacred alliance was finalized.',
      imageUrl: '/images/couple/couple-hero.jpg'
    },
    {
      id: 'm2',
      year: '23 November 2026',
      title: 'Priti Bhoj (प्रिति भोज)',
      location: 'Gram Chhadapatti, Bathnaha, Madhubani',
      description:
        'Auspicious community feast starting 4:00 PM onwards on Monday, 23rd November 2026 with warm Mithila hospitality.',
      imageUrl: '/images/events/reception.jpg'
    },
    {
      id: 'm3',
      year: '24 November 2026',
      title: 'Haldi & Mehendi (हल्दी एवं मेंहदी)',
      location: 'Madhubani, Bihar',
      description:
        'Tuesday, 24th November 2026 — Golden turmeric blessings, traditional folk songs, and bridal mehendi with loved ones.',
      imageUrl: '/images/events/haldi.jpg'
    },
    {
      id: 'm4',
      year: '25–26 November 2026',
      title: 'Matkor, Shubh Vivah & Shubh Mundan',
      location: 'Gram Chhadapatti & Gram Paroriyahi, Madhubani',
      description:
        'Matkor at 5:00 PM & Baraat at 8:00 PM on Wednesday 25th Nov for Shubh Vivah, followed by Shubh Mundan of Rachit & Radhika on Thursday 26th Nov.',
      imageUrl: '/images/events/vivah.jpg'
    }
  ]
};

export const DEFAULT_FAMILY: FamilyMember[] = [
  {
    id: 'f1',
    name: 'Shri Badrinarayan Singh & Shri Ramvriksh Singh',
    relation: 'Vineet / Senior Family Elders (Groom’s Side)',
    side: 'groom',
    generation: 'grandparents',
    photoUrl: '/images/family/grandparents.jpg',
    bio: 'Revered elders welcoming all guests with traditional Mithila warmth, affection, and heartfelt hospitality.',
    order: 1
  },
  {
    id: 'f2',
    name: 'Shri Bhola Prasad Singh & Smt. Sunita Devi',
    relation: 'Parents of the Groom (Amit Kumar)',
    side: 'groom',
    generation: 'parents',
    photoUrl: '/images/family/groom-parents.jpg',
    bio: 'Residents of Gram Chhadapatti, Post Bathnaha, Madhubani, Bihar — eagerly awaiting your gracious presence to bless Amit & Rakhi.',
    phone: '+91 98350 11223',
    whatsapp: '919835011223',
    isContactCoordinator: true,
    order: 2
  },
  {
    id: 'f3',
    name: 'Shri Om Prakash Singh & Smt. Anju Devi',
    relation: 'Parents of the Bride (Rakhi Kumari)',
    side: 'bride',
    generation: 'parents',
    photoUrl: '/images/family/bride-parents.jpg',
    bio: 'Residents of Gram Paroriyahi, Post Gajhara, Madhubani, Bihar — joyfully welcoming the Baraat and cherishing your blessings for Rakhi & Amit.',
    phone: '+91 98352 44556',
    whatsapp: '919835244556',
    isContactCoordinator: true,
    order: 3
  },
  {
    id: 'f4',
    name: 'Ram Bhajan Singh, Ramadhar Singh & Ravishankar Singh',
    relation: 'Darshanabhilashi & Family Elders',
    side: 'groom',
    generation: 'grandparents',
    photoUrl: '/images/gallery/family-1.jpg',
    bio: 'Joining together in welcoming every relative, neighbour, and cherished friend to the Shubh Vivah celebrations.',
    order: 4
  },
  {
    id: 'f5',
    name: 'Raja, Rashmi, Rachit, Ankush, Radhika, Nancy & Entire Singh Family',
    relation: 'Darshanabhilashi • Siblings, Youngsters & Hospitality Team',
    side: 'both',
    generation: 'siblings_relatives',
    photoUrl: '/images/gallery/friends-1.jpg',
    bio: 'Coordinating guest welcome, Baraat arrangements, Haldi-Mehendi celebrations, and Shubh Mundan of Rachit & Radhika.',
    phone: '+91 98355 77889',
    whatsapp: '919835577889',
    isContactCoordinator: true,
    order: 5
  }
];

export const DEFAULT_EVENTS: WeddingEvent[] = [
  {
    id: 'evt-priti-bhoj',
    title: 'Priti Bhoj (प्रिति भोज)',
    ceremonyType: 'Custom Family Event',
    date: '2026-11-23',
    startTime: '16:00',
    endTime: '22:00',
    venueName: 'Singh Family Courtyard, Gram Chhadapatti',
    fullAddress: 'Gram Chhadapatti, Post Bathnaha, Madhubani, Bihar',
    description:
      'Auspicious Priti Bhoj (wedding feast) hosted with love and warmth on Monday, 23rd November 2026 from 4:00 PM onwards.',
    imageUrl: '/images/events/reception.jpg',
    dressCode: 'Traditional Indian Festive Attire',
    googleMapsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
    statusOverride: 'auto',
    highlight: true,
    order: 1
  },
  {
    id: 'evt-haldi',
    title: 'Haldi Ceremony (हल्दी)',
    ceremonyType: 'Haldi Ceremony',
    date: '2026-11-24',
    startTime: '10:00',
    endTime: '13:30',
    venueName: 'Aangan Courtyard, Gram Chhadapatti & Paroriyahi',
    fullAddress: 'Madhubani, Bihar',
    description:
      'Morning Haldi rituals on Tuesday, 24th November 2026 with sacred turmeric paste, marigold petals, and joyful Maithili geet.',
    imageUrl: '/images/events/haldi.jpg',
    dressCode: 'Mustard Yellow & Marigold Shades',
    googleMapsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
    statusOverride: 'auto',
    highlight: true,
    order: 2
  },
  {
    id: 'evt-mehendi',
    title: 'Mehendi Ceremony (मेंहदी)',
    ceremonyType: 'Mehendi Ceremony',
    date: '2026-11-24',
    startTime: '15:00',
    endTime: '19:00',
    venueName: 'Family Courtyards, Madhubani',
    fullAddress: 'Madhubani, Bihar',
    description:
      'Traditional bridal & family henna artistry on Tuesday, 24th November 2026 accompanied by folk songs, dholak beats, and festive sweets.',
    imageUrl: '/images/events/mehendi.jpg',
    dressCode: 'Emerald Green & Festive Pastels',
    googleMapsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
    statusOverride: 'auto',
    highlight: false,
    order: 3
  },
  {
    id: 'evt-matkor',
    title: 'Matkor Ceremony (मटकोर)',
    ceremonyType: 'Matkor Ceremony',
    date: '2026-11-25',
    startTime: '17:00',
    endTime: '18:30',
    venueName: 'Village Sacred Ground, Gram Chhadapatti',
    fullAddress: 'Gram Chhadapatti, Post Bathnaha, Madhubani, Bihar',
    description:
      'Sacred Matkor earth-worship ritual on Wednesday, 25th November 2026 at 5:00 PM led by the women of the family with traditional Mithila hymns.',
    imageUrl: '/images/events/matkor.jpg',
    dressCode: 'Traditional Red & Yellow Saree / Ethnic Wear',
    googleMapsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
    statusOverride: 'auto',
    highlight: true,
    order: 4
  },
  {
    id: 'evt-baraat',
    title: 'Baraat Prasthan (बरात प्रस्थान)',
    ceremonyType: 'Baraat',
    date: '2026-11-25',
    startTime: '20:00',
    endTime: '21:30',
    venueName: 'Departs Gram Chhadapatti to Gram Paroriyahi',
    fullAddress: 'From Post Bathnaha to Post Gajhara, Madhubani, Bihar',
    description:
      'Grand wedding procession departing promptly at 8:00 PM on Wednesday, 25th November 2026 with dhol, shehnai, lights, and festive celebration.',
    imageUrl: '/images/events/baraat.jpg',
    dressCode: 'Royal Safas, Sherwanis & Festive Sarees',
    googleMapsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
    statusOverride: 'auto',
    highlight: false,
    order: 5
  },
  {
    id: 'evt-vivah',
    title: 'Shubh Vivah — Panigrahan Sanskar (शुभविवाह)',
    ceremonyType: 'Wedding Ceremony (Vivah)',
    date: '2026-11-25',
    startTime: '21:30',
    endTime: '23:55',
    venueName: 'Vivah Mandap, Gram Paroriyahi',
    fullAddress: 'Gram Paroriyahi, Post Gajhara, Madhubani, Bihar',
    description:
      'Varmala exchange, Vedic mantras, Shubh Panigrahan Sanskar, and sacred Saptapadi on Wednesday, 25th November 2026 uniting Amit Kumar & Rakhi Kumari forever.',
    imageUrl: '/images/events/vivah.jpg',
    dressCode: 'Traditional Bridal / Royal Maroon, Crimson & Gold',
    googleMapsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
    statusOverride: 'auto',
    highlight: true,
    order: 6
  },
  {
    id: 'evt-vidaai',
    title: 'Kanyadaan & Vidaai Ceremony',
    ceremonyType: 'Vidaai',
    date: '2026-11-26',
    startTime: '06:30',
    endTime: '09:00',
    venueName: 'Paroriyahi Courtyard, Madhubani',
    fullAddress: 'Gram Paroriyahi, Post Gajhara, Madhubani, Bihar',
    description:
      'Sacred morning completion of nuptial blessings and heartfelt Vidaai on Thursday, 26th November 2026 as Rakhi embarks on her new journey with Amit.',
    imageUrl: '/images/events/vidaai.jpg',
    dressCode: 'Subtle Morning Silk & Pastels',
    googleMapsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
    statusOverride: 'auto',
    highlight: false,
    order: 7
  },
  {
    id: 'evt-mundan',
    title: 'Shubh Mundan — Rachit & Radhika (शुभमुण्डन)',
    ceremonyType: 'Custom Family Event',
    date: '2026-11-26',
    startTime: '10:30',
    endTime: '13:30',
    venueName: 'Singh Family Courtyard, Gram Chhadapatti',
    fullAddress: 'Gram Chhadapatti, Post Bathnaha, Madhubani, Bihar',
    description:
      'Auspicious Shubh Mundan ceremony of beloved children Rachit & Radhika on Thursday, 26th November 2026 with traditional prayers and elders’ blessings.',
    imageUrl: '/images/events/mandap.jpg',
    dressCode: 'Traditional Festive Morning Attire',
    googleMapsUrl: 'https://maps.app.goo.gl/5XDdM1mYsZJr7mwJ7',
    statusOverride: 'auto',
    highlight: false,
    order: 8
  }
];

export const DEFAULT_ALBUMS: WeddingAlbum[] = [
  {
    id: 'alb-prewedding',
    title: 'Heritage Pre-Wedding Portraits',
    category: 'Pre-Wedding Photoshoot',
    description: 'Timeless portraits celebrating Amit & Rakhi ahead of their Shubh Vivah.',
    coverImageUrl: '/images/gallery/prewedding-1.jpg',
    allowDownload: true,
    order: 1,
    createdAt: '2026-11-01T10:00:00Z'
  },
  {
    id: 'alb-engagement',
    title: 'Tilak & Engagement Moments',
    category: 'Engagement Photos',
    description: 'Sacred tilak rituals, ring exchange, and joyful smiles.',
    coverImageUrl: '/images/events/engagement.jpg',
    allowDownload: true,
    order: 2,
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'alb-haldi',
    title: 'Auspicious Haldi Morning',
    category: 'Haldi Ceremony',
    description: 'Marigold petals, turmeric blessings, and festive laughter.',
    coverImageUrl: '/images/events/haldi.jpg',
    allowDownload: true,
    order: 3,
    createdAt: '2026-11-03T10:00:00Z'
  },
  {
    id: 'alb-mehendi',
    title: 'Mehendi & Maithili Geet',
    category: 'Mehendi Ceremony',
    description: 'Intricate bridal henna and traditional songs.',
    coverImageUrl: '/images/events/mehendi.jpg',
    allowDownload: true,
    order: 4,
    createdAt: '2026-11-04T10:00:00Z'
  },
  {
    id: 'alb-sangeet',
    title: 'Sangeet & Celebration Night',
    category: 'Sangeet Night',
    description: 'Family dances, dholak rhythms, and festive evenings.',
    coverImageUrl: '/images/events/sangeet.jpg',
    allowDownload: true,
    order: 5,
    createdAt: '2026-11-05T10:00:00Z'
  },
  {
    id: 'alb-wedding',
    title: 'Shubh Vivah & Mandap',
    category: 'Wedding Day',
    description: 'Matkor, Baraat arrival, Varmala, and sacred Pheras.',
    coverImageUrl: '/images/events/vivah.jpg',
    allowDownload: true,
    order: 6,
    createdAt: '2026-11-06T10:00:00Z'
  },
  {
    id: 'alb-couple',
    title: 'Amit & Rakhi Portraits',
    category: 'Bride & Groom',
    description: 'Ceremonial portraits of the bride and groom.',
    coverImageUrl: '/images/couple/couple-hero.jpg',
    allowDownload: true,
    order: 7,
    createdAt: '2026-11-07T10:00:00Z'
  },
  {
    id: 'alb-family',
    title: 'Singh Family Blessings',
    category: 'Family Moments',
    description: 'Warm embraces from parents, elders, and Darshanabhilashi.',
    coverImageUrl: '/images/gallery/family-1.jpg',
    allowDownload: true,
    order: 8,
    createdAt: '2026-11-08T10:00:00Z'
  },
  {
    id: 'alb-friends',
    title: 'Baraatis, Cousins & Friends',
    category: 'Friends & Guests',
    description: 'Unfiltered celebration with Raja, Rashmi, Rachit, Ankush, Radhika & friends.',
    coverImageUrl: '/images/gallery/friends-1.jpg',
    allowDownload: true,
    order: 9,
    createdAt: '2026-11-09T10:00:00Z'
  },
  {
    id: 'alb-reception',
    title: 'Priti Bhoj & Reception',
    category: 'Reception',
    description: 'Grand feast and warm hospitality in Madhubani.',
    coverImageUrl: '/images/events/reception.jpg',
    allowDownload: true,
    order: 10,
    createdAt: '2026-11-10T10:00:00Z'
  },
  {
    id: 'alb-other',
    title: 'Sacred Mandap & Details',
    category: 'Other Memories',
    description: 'Kalash, marigold garlands, earthen diyas, and ritual artistry.',
    coverImageUrl: '/images/gallery/decor-1.jpg',
    allowDownload: true,
    order: 11,
    createdAt: '2026-11-11T10:00:00Z'
  }
];

// Gallery photographs will be uploaded during and after the wedding ceremonies (23–26 Nov 2026)
export const DEFAULT_PHOTOS: WeddingPhoto[] = [];

export const DEFAULT_VIDEOS: WeddingVideo[] = [
  {
    id: 'vid-1',
    title: 'Amit & Rakhi — Shubh Vivah Digital Invitation',
    category: 'Wedding Invitation Videos',
    sourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    thumbnailUrl: '/images/hero-palace.jpg',
    description:
      'Cordial video invitation from the Singh families of Madhubani welcoming all loved ones for 23–26 November 2026.',
    duration: '02:15',
    createdAt: '2026-11-01T10:00:00Z'
  },
  {
    id: 'vid-2',
    title: 'Pre-Wedding Teaser: Amit & Rakhi',
    category: 'Pre-Wedding Videos',
    sourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    thumbnailUrl: '/images/gallery/prewedding-1.jpg',
    description: 'Golden moments and traditional heritage frames.',
    duration: '03:40',
    createdAt: '2026-11-03T10:00:00Z'
  },
  {
    id: 'vid-3',
    title: 'Haldi, Mehendi & Matkor Ceremony Glimpses',
    category: 'Ceremony Highlights',
    sourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    thumbnailUrl: '/images/events/haldi.jpg',
    description: 'Marigolds, Maithili geet, and warm family rituals.',
    duration: '04:12',
    createdAt: '2026-11-07T10:00:00Z'
  },
  {
    id: 'vid-4',
    title: 'Family Dance & Baraat Prep Reel',
    category: 'Short Wedding Reels',
    sourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    thumbnailUrl: '/images/events/sangeet.jpg',
    description: 'Cousins and friends gearing up for the 8:00 PM Baraat departure.',
    duration: '01:05',
    createdAt: '2026-11-05T10:00:00Z'
  },
  {
    id: 'vid-5',
    title: 'Blessings from Badrinarayan Singh, Ramvriksh Singh & Elders',
    category: 'Family Messages',
    sourceType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnailUrl: '/images/family/grandparents.jpg',
    description: 'Warm blessings and welcome message from both families.',
    duration: '02:50',
    createdAt: '2026-11-09T10:00:00Z'
  }
];

export const DEFAULT_RSVPS: GuestRSVP[] = [
  {
    id: 'rsvp-1',
    guestName: 'Ram Bhajan Singh & Family',
    mobileNumber: '+91 98351 55432',
    email: 'rambhajan@example.com',
    attending: 'attending',
    guestCount: 5,
    eventsAttending: [
      'Priti Bhoj (प्रिति भोज)',
      'Haldi Ceremony (हल्दी)',
      'Matkor Ceremony (मटकोर)',
      'Baraat Prasthan (बरात प्रस्थान)',
      'Shubh Vivah — Panigrahan Sanskar (शुभविवाह)',
      'Shubh Mundan — Rachit & Radhika (शुभमुण्डन)'
    ],
    dietaryNotes: 'Pure Vegetarian Mithila Cuisine',
    message: 'Warmest blessings to Amit & Rakhi for a lifetime of happiness!',
    createdAt: '2026-11-08T09:30:00Z'
  },
  {
    id: 'rsvp-2',
    guestName: 'Ravishankar Singh & Family',
    mobileNumber: '+91 99340 33445',
    attending: 'attending',
    guestCount: 4,
    eventsAttending: [
      'Priti Bhoj (प्रिति भोज)',
      'Matkor Ceremony (मटकोर)',
      'Shubh Vivah — Panigrahan Sanskar (शुभविवाह)'
    ],
    message: 'Excited to join the Baraat on 25th November at 8:00 PM!',
    createdAt: '2026-11-10T16:45:00Z'
  }
];
