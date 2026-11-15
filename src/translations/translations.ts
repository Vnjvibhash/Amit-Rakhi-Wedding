export type Language = 'hi' | 'en';

export interface TranslationDictionary {
  [key: string]: {
    hi: string;
    en: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Navigation
  'nav.home': { hi: 'मुख्य पृष्ठ', en: 'Home' },
  'nav.ourStory': { hi: 'हमारी कहानी', en: 'Our Story' },
  'nav.events': { hi: 'विवाह कार्यक्रम', en: 'Events' },
  'nav.schedule': { hi: 'कार्यक्रम तालिका', en: 'Schedule' },
  'nav.gallery': { hi: 'तस्वीरें', en: 'Gallery' },
  'nav.videos': { hi: 'वीडियो', en: 'Videos' },
  'nav.family': { hi: 'हमारा परिवार', en: 'Family' },
  'nav.venue': { hi: 'शुभ स्थल व मार्ग', en: 'Venue' },
  'nav.contact': { hi: 'संपर्क', en: 'Contact' },
  'nav.rsvp': { hi: 'उपस्थिति दर्ज करें', en: 'RSVP' },
  'nav.rsvpNow': { hi: 'उपस्थिति (RSVP)', en: 'RSVP Now' },
  'nav.adminPortal': { hi: 'एडमिन पोर्टल', en: 'Admin Portal' },
  'nav.adminDashboard': { hi: 'एडमिन डैशबोर्ड', en: 'Admin Dashboard' },
  'nav.confirmAttendance': { hi: 'उपस्थिति दर्ज करें', en: 'Confirm Attendance' },

  // Language selector
  'lang.label': { hi: 'भाषा:', en: 'Language:' },
  'lang.hindi': { hi: 'हिंदी', en: 'Hindi' },
  'lang.english': { hi: 'English', en: 'English' },

  // Countdown Timer
  'countdown.days': { hi: 'दिन', en: 'Days' },
  'countdown.hours': { hi: 'घंटे', en: 'Hours' },
  'countdown.minutes': { hi: 'मिनट', en: 'Minutes' },
  'countdown.seconds': { hi: 'सेकंड', en: 'Seconds' },
  'countdown.celebrated': {
    hi: 'विवाह संपन्न — नवदंपति को अनंत मंगल आशीर्वाद',
    en: 'Happily Celebrated — Forever Begins'
  },

  // Home Page Hero
  'home.hero.invoc': {
    hi: '|| श्री गणेशाय नमः ||',
    en: '|| Shri Ganeshaya Namah ||'
  },
  'home.hero.enterBtn': {
    hi: 'शुभ विवाह में प्रवेश करें',
    en: 'Enter Website & Explore Wedding'
  },
  'home.hero.rsvpBtn': {
    hi: 'उपस्थिति दर्ज करें (RSVP)',
    en: 'Confirm Attendance (RSVP)'
  },
  'home.hero.downloadCardBtn': {
    hi: 'निमंत्रण पत्र डाउनलोड करें',
    en: 'Download Invitation Card'
  },
  'home.share.success': {
    hi: 'विवाह निमंत्रण लिंक कॉपी हो गया!',
    en: 'Wedding invitation link copied!'
  },
  'home.share.error': {
    hi: 'लिंक कॉपी करने में असमर्थ।',
    en: 'Unable to copy link.'
  },

  // Home Page Welcome Section
  'home.welcome.title': {
    hi: 'सस्नेह पारिवारिक निमंत्रण',
    en: 'A Cordial Family Invitation'
  },
  'home.welcome.groomLabel': { hi: 'वर (दूल्हा)', en: 'The Groom' },
  'home.welcome.brideLabel': { hi: 'वधू (दुल्हन)', en: 'The Bride' },
  'home.welcome.storyBtn': {
    hi: 'हमारी प्रेम यात्रा व कहानी पढ़ें',
    en: 'Read Our Love Story & Journey'
  },

  // Home Page Featured Ceremonies
  'home.ceremonies.eyebrow': { hi: 'मांगलिक उत्सव', en: 'Auspicious Ceremonies' },
  'home.ceremonies.title': { hi: 'विवाह समारोह', en: 'Wedding Festivities' },
  'home.ceremonies.subtitle': {
    hi: 'प्रीति भोज, मनभावन हल्दी-मेंहदी, मटकोर से लेकर पावन शुभ विवाह एवं पाणिग्रहण संस्कार तक के सभी मांगलिक क्षण।',
    en: 'From Priti Bhoj, vibrant Haldi & Mehendi mornings, and Matkor to the sacred Shubh Vivah & Panigrahan Sanskar.'
  },
  'home.ceremonies.exploreAll': {
    hi: 'सभी {count} कार्यक्रम देखें',
    en: 'Explore All {count} Ceremonies'
  },
  'home.ceremonies.scheduleBtn': {
    hi: 'इंटरैक्टिव शेड्यूल व कैलेंडर',
    en: 'Interactive Schedule & PDF'
  },

  // Home Page Quick Action
  'home.action.eyebrow': { hi: 'हमारे उत्सव में सम्मिलित हों', en: 'Celebrate With Us' },
  'home.action.title': {
    hi: 'अपनी गरिमामयी उपस्थिति से हमें अनुग्रहित करें',
    en: 'Kindly Grace Us With Your Presence'
  },
  'home.action.desc': {
    hi: 'अपनी उपस्थिति की पुष्टि करें, यात्रा व ठहरने की व्यवस्था देखें, समारोहों की तस्वीरें देखें अथवा सगे-संबंधियों के साथ यह डिजिटल निमंत्रण साझा करें।',
    en: 'Confirm your attendance, view venue travel instructions, browse ceremony photo albums, or share our digital invitation with family.'
  },
  'home.action.rsvpBtn': { hi: 'उपस्थिति दर्ज करें', en: 'Submit Your RSVP' },
  'home.action.galleryBtn': { hi: 'तस्वीरें देखें', en: 'Browse Photo Gallery' },
  'home.action.venueBtn': { hi: 'स्थल व यात्रा मार्गदर्शिका', en: 'Venue & Travel Guide' },
  'home.action.whatsappBtn': { hi: 'व्हाट्सएप निमंत्रण', en: 'WhatsApp Invite' },
  'home.action.copyLinkBtn': { hi: 'लिंक कॉपी करें', en: 'Copy Link' },

  // Invitation Card Modal
  'card.dialogTitle': {
    hi: 'डिजिटल विवाह निमंत्रण पत्र',
    en: 'Digital Wedding Invitation Card'
  },
  'card.downloadBtn': {
    hi: 'निमंत्रण पत्र डाउनलोड करें (PNG)',
    en: 'Download Invitation Card (PNG)'
  },
  'card.generating': {
    hi: 'निमंत्रण पत्र तैयार हो रहा है...',
    en: 'Generating Card Image...'
  },
  'card.downloadSuccess': {
    hi: 'विवाह निमंत्रण पत्र सफलतापूर्वक डाउनलोड हो गया!',
    en: 'Wedding invitation card downloaded!'
  },
  'card.downloadError': {
    hi: 'कार्ड छवि तैयार करने में असमर्थ।',
    en: 'Could not generate card image.'
  },
  'card.close': { hi: 'बंद करें', en: 'Close' },
  'card.routeLabel': { hi: 'यात्रा मार्ग:', en: 'Travel Route:' },

  // Our Story Page
  'story.eyebrow': { hi: 'वर-वधू एवं उनकी पावन यात्रा', en: 'The Couple & Their Journey' },
  'story.title': { hi: 'हमारी कहानी', en: 'Our Story' },
  'story.groomBioTitle': { hi: 'वर • “{nickname}”', en: 'Groom • “{nickname}”' },
  'story.brideBioTitle': { hi: 'वधू • “{nickname}”', en: 'Bride • “{nickname}”' },
  'story.milestonesEyebrow': {
    hi: 'साथ के यादगार पड़ाव',
    en: 'Milestones of Togetherness'
  },
  'story.milestonesTitle': {
    hi: 'स्नेह, परंपरा व नियति का बंधन',
    en: 'Woven by Destiny & Shared Heritage'
  },
  'story.rsvpCardTitle': {
    hi: 'हमारे इस पवित्र गठबंधन के साक्षी बनें',
    en: 'Witness Our Sacred Alliance'
  },
  'story.rsvpCardDesc': {
    hi: 'आपकी उपस्थिति और स्नेहिल आशीर्वाद हमारे इस नए जीवन की सबसे अनमोल धरोहर होगी।',
    en: 'Your blessings and warm presence will make our new beginnings truly unforgettable.'
  },
  'story.rsvpBtn': {
    hi: 'शुभ विवाह में पधारें — RSVP',
    en: 'Join Our Celebrations — RSVP'
  },

  // Events Page
  'events.eyebrow': {
    hi: 'मांगलिक परंपराएं एवं उत्सव',
    en: 'Sacred Traditions & Celebrations'
  },
  'events.title': {
    hi: 'विवाह कार्यक्रम व संस्कार',
    en: 'Wedding Events & Ceremonies'
  },
  'events.subtitle': {
    hi: 'प्रत्येक रस्म उल्लास, भक्ति और मिथिला परंपरा से सजी — ताकि आप किसी भी पावन क्षण से वंचित न रहें।',
    en: 'Every ritual woven with joy, devotion, and heritage—arranged chronologically so you never miss a single moment.'
  },
  'events.searchPlaceholder': {
    hi: 'खोजें - प्रीति भोज, हल्दी, मेंहदी, मटकोर, बरात, शुभ विवाह, मुण्डन...',
    en: 'Search Tilak, Haldi, Mehendi, Sangeet, Baraat, Vivah, Reception...'
  },
  'events.filterAll': { hi: 'सभी कार्यक्रम', en: 'All Events' },
  'events.filterUpcoming': { hi: 'आगामी', en: 'Upcoming' },
  'events.filterOngoing': { hi: 'प्रगति पर', en: 'Ongoing Now' },
  'events.filterCompleted': { hi: 'सम्पन्न', en: 'Completed' },
  'events.noMatch': {
    hi: 'आपकी खोज के अनुसार कोई कार्यक्रम नहीं मिला।',
    en: 'No ceremonies match your search or filter.'
  },
  'events.clearFilters': { hi: 'फ़िल्टर हटाएं', en: 'Clear Filters' },
  'events.dressCode': { hi: 'परिधान (ड्रेस कोड)', en: 'Dress Code' },
  'events.addToCalendar': { hi: 'कैलेंडर में जोड़ें', en: 'Add to Calendar' },
  'events.viewMap': { hi: 'गूगल मैप्स पर देखें', en: 'View on Maps' },
  'events.fullDetails': { hi: 'विस्तृत विवरण देखें', en: 'View Full Details' },
  'events.modalTitle': { hi: 'कार्यक्रम विवरण', en: 'Ceremony Details' },
  'events.modalClose': { hi: 'बंद करें', en: 'Close' },

  // Schedule Page
  'schedule.eyebrow': {
    hi: 'अपनी उपस्थिति की योजना बनाएं',
    en: 'Plan Your Celebrations'
  },
  'schedule.title': {
    hi: 'कार्यक्रम तालिका व कैलेंडर',
    en: 'Schedule & Interactive Calendar'
  },
  'schedule.subtitle': {
    hi: 'दिन-प्रतिदिन का सम्पूर्ण कार्यक्रम, अनुष्ठान समय एवं कैलेंडर डाउनलोड।',
    en: 'Synchronize your travel with ceremony timings, daily itineraries, and personal calendar sync.'
  },
  'schedule.calendarView': { hi: 'कैलेंडर दृश्य', en: 'Calendar View' },
  'schedule.listView': { hi: 'सूची दृश्य', en: 'List View' },
  'schedule.downloadPdf': { hi: 'कार्यक्रम PDF डाउनलोड', en: 'Download Schedule PDF' },
  'schedule.enableNotif': {
    hi: 'कार्यक्रम सूचनाएं चालू करें',
    en: 'Enable Event Reminders'
  },
  'schedule.notifActive': { hi: 'सूचनाएं चालू हैं', en: 'Reminders Active' },
  'schedule.selectedDayTitle': {
    hi: 'चुनी गई तिथि के कार्यक्रम',
    en: 'Ceremonies on Selected Date'
  },
  'schedule.noEventsOnDay': {
    hi: 'इस तिथि को कोई विशेष सार्वजनिक कार्यक्रम निर्धारित नहीं है।',
    en: 'No ceremonies scheduled on this date.'
  },
  'schedule.sun': { hi: 'रवि', en: 'Sun' },
  'schedule.mon': { hi: 'सोम', en: 'Mon' },
  'schedule.tue': { hi: 'मंगल', en: 'Tue' },
  'schedule.wed': { hi: 'बुध', en: 'Wed' },
  'schedule.thu': { hi: 'गुरु', en: 'Thu' },
  'schedule.fri': { hi: 'शुक्र', en: 'Fri' },
  'schedule.sat': { hi: 'शनि', en: 'Sat' },

  // Gallery Page
  'gallery.eyebrow': { hi: 'अविस्मरणीय यादें', en: 'Captured Memories' },
  'gallery.title': { hi: 'तस्वीरें व गैलरी', en: 'Photo Gallery' },
  'gallery.subtitle': {
    hi: 'प्री-वेडिंग से लेकर वरमाला, विदाई एवं पारिवारिक उत्सव के सजीव पल।',
    en: 'Glimpse the joy, emotions, and cherished memories across all ceremonies.'
  },
  'gallery.filterAll': { hi: 'सभी तस्वीरें', en: 'All Photos' },
  'gallery.uploadBtn': { hi: 'तस्वीर जोड़ें', en: 'Upload Photo' },
  'gallery.downloadBtn': { hi: 'डाउनलोड', en: 'Download' },
  'gallery.shareBtn': { hi: 'शेयर करें', en: 'Share' },
  'gallery.empty': {
    hi: 'इस श्रेणी में अभी कोई तस्वीर उपलब्ध नहीं है।',
    en: 'No photographs found in this album.'
  },
  'gallery.uploadedBy': { hi: 'द्वारा:', en: 'Uploaded by:' },
  'gallery.modalTitle': { hi: 'तस्वीर साझा करें', en: 'Share a Wedding Photo' },
  'gallery.yourName': { hi: 'आपका नाम', en: 'Your Name' },
  'gallery.caption': { hi: 'तस्वीर का शीर्षक या संदेश', en: 'Caption or message' },
  'gallery.category': { hi: 'समारोह श्रेणी', en: 'Ceremony Category' },
  'gallery.selectFiles': { hi: 'तस्वीर चुनें (अधिकतम 10MB)', en: 'Select photo (Max 10MB)' },
  'gallery.submitting': { hi: 'अपलोड हो रहा है...', en: 'Uploading...' },
  'gallery.submit': { hi: 'अपलोड करें', en: 'Upload Photo' },
  'gallery.cancel': { hi: 'रद्द करें', en: 'Cancel' },

  // Videos Page
  'videos.eyebrow': { hi: 'चलचित्र व स्मृतियाँ', en: 'Cinema & Blessings' },
  'videos.title': { hi: 'विवाह वीडियो व रील्स', en: 'Wedding Videos & Memories' },
  'videos.subtitle': {
    hi: 'विवाह निमंत्रण फिल्म, प्री-वेडिंग टीज़र, कार्यक्रम हाइलाइट्स और पारिवारिक संदेश।',
    en: 'Watch our royal wedding invitation film, pre-wedding teaser, ceremony highlights, dance reels, and heartfelt family messages.'
  },
  'videos.allVideos': { hi: 'सभी वीडियो ({count})', en: 'All Videos ({count})' },
  'videos.empty': {
    hi: 'इस श्रेणी में अभी कोई वीडियो उपलब्ध नहीं है।',
    en: 'No videos in this category yet.'
  },

  // Family Page
  'family.eyebrow': { hi: 'संस्कार, परंपरा एवं आत्मीयता', en: 'Roots, Love & Tradition' },
  'family.groomSideBadge': {
    hi: 'लड़के वाले (वर पक्ष)',
    en: 'Ladke Wale'
  },
  'family.groomSideTitle': {
    hi: 'वर पक्ष — ग्राम छरापट्टी, मधुबनी',
    en: 'Groom’s Family — Chharapatti, Madhubani'
  },
  'family.brideSideBadge': {
    hi: 'लड़की वाले (वधू पक्ष)',
    en: 'Ladki Wale'
  },
  'family.brideSideTitle': {
    hi: 'वधू पक्ष — ग्राम परोरियाही, मधुबनी',
    en: 'Bride’s Family — Paroriyahi, Madhubani'
  },
  'family.combinedTitle': {
    hi: 'स्नेही स्वजन, सहोदर एवं स्वागत समिति',
    en: 'Siblings, Relatives & Hospitality Team'
  },
  'family.call': { hi: 'कॉल करें', en: 'Call' },
  'family.whatsapp': { hi: 'व्हाट्सएप', en: 'WhatsApp' },

  // Venue Page
  'venue.eyebrow': { hi: 'गंतव्य एवं आतिथ्य', en: 'Destination & Hospitality' },
  'venue.title': { hi: 'विवाह स्थल व यात्रा मार्गदर्शिका', en: 'Venue & Travel Guide' },
  'venue.routeBadge': {
    hi: 'विवाह यात्रा मार्ग एवं स्थल',
    en: 'Wedding Route & Travel Corridor'
  },
  'venue.openMap': {
    hi: 'गूगल मैप्स पर यात्रा मार्ग देखें',
    en: 'Open Region Map on Google Maps'
  },
  'venue.stayEyebrow': { hi: 'कहाँ ठहरें', en: 'Where to Stay' },
  'venue.stayTitle': {
    hi: 'आस-पास ठहरने की व्यवस्था',
    en: 'Nearby Accommodations'
  },
  'venue.parkingTitle': { hi: 'पार्किंग सुविधा', en: 'Parking Information' },
  'venue.transportTitle': {
    hi: 'वाहन व बरात आवागमन',
    en: 'Transportation & Baraat Route'
  },
  'venue.travelTipsTitle': {
    hi: 'महत्वपूर्ण यात्रा निर्देश',
    en: 'Essential Travel Guidelines'
  },

  // RSVP Page
  'rsvp.eyebrow': { hi: 'उपस्थिति की सूचना', en: 'Kindly Respond' },
  'rsvp.title': { hi: 'अतिथि उपस्थिति (RSVP)', en: 'Guest RSVP' },
  'rsvp.subtitle': {
    hi: 'कृपया अपनी उपस्थिति एवं कार्यक्रम वरीयता साझा करें ताकि हमारे परिवार मधुबनी में आपके भव्य स्वागत की समुचित व्यवस्था कर सकें।',
    en: 'Please share your attendance & ceremony preferences so our families can prepare a warm royal welcome for you in Madhubani, Bihar.'
  },
  'rsvp.nameLabel': { hi: 'आपका पूरा नाम *', en: 'Your Full Name *' },
  'rsvp.namePlaceholder': { hi: 'उदा. राजेश कुमार सिंह', en: 'e.g., Rajesh Kumar Singh' },
  'rsvp.mobileLabel': { hi: 'मोबाइल नंबर (व्हाट्सएप) *', en: 'Mobile Number (WhatsApp) *' },
  'rsvp.mobilePlaceholder': { hi: '10 अंकों का मोबाइल नंबर', en: '10-digit mobile number' },
  'rsvp.emailLabel': { hi: 'ईमेल पता (वैकल्पिक)', en: 'Email Address (Optional)' },
  'rsvp.emailPlaceholder': { hi: 'rajesh@example.com', en: 'rajesh@example.com' },
  'rsvp.attendingLabel': { hi: 'क्या आप पधार रहे हैं? *', en: 'Will you be joining us? *' },
  'rsvp.attendingYes': { hi: 'हाँ! अवश्य पधारेंगे', en: 'Joyfully Attending' },
  'rsvp.attendingMaybe': { hi: 'शायद / प्रयास करेंगे', en: 'Maybe / Tentative' },
  'rsvp.attendingNo': { hi: 'क्षमा करें, उपस्थित नहीं हो सकेंगे', en: 'Regretfully Declining' },
  'rsvp.guestCountLabel': {
    hi: 'सम्मिलित होने वाले कुल सदस्यों की संख्या',
    en: 'Total Number of Guests Attending'
  },
  'rsvp.eventsLabel': {
    hi: 'किन कार्यक्रमों में सम्मिलित होंगे?',
    en: 'Which ceremonies will you attend?'
  },
  'rsvp.dietLabel': {
    hi: 'खान-पान संबंधी निर्देश या संदेश (वैकल्पिक)',
    en: 'Dietary Preferences or Dietary Requests'
  },
  'rsvp.dietPlaceholder': {
    hi: 'उदा. शुद्ध शाकाहारी / जैन आहार / कोई विशेष निर्देश...',
    en: 'e.g., Pure vegetarian / Jain food / Special needs...'
  },
  'rsvp.messageLabel': {
    hi: 'वर-वधू के लिए शुभकामना संदेश',
    en: 'Warm Blessings & Wishes for the Couple'
  },
  'rsvp.messagePlaceholder': {
    hi: 'अमित एवं राखी के लिए अपना स्नेह व मंगल आशीर्वाद लिखें...',
    en: 'Share your blessings and advice for Amit & Rakhi...'
  },
  'rsvp.submitBtn': { hi: 'उपस्थिति दर्ज करें', en: 'Submit Guest RSVP' },
  'rsvp.submitting': { hi: 'दर्ज किया जा रहा है...', en: 'Recording RSVP...' },
  'rsvp.confirmedBadge': { hi: 'उपस्थिति दर्ज हुई', en: 'RSVP Confirmed' },
  'rsvp.confirmedTitle': { hi: 'धन्यवाद, {name}!', en: 'Dhanyavaad, {name}!' },
  'rsvp.confirmedDescAttending': {
    hi: 'हम अमित एवं राखी के विवाह उत्सव में आपके परिवार के {count} अतिथियों का हार्दिक स्वागत करने के लिए उत्सुक हैं।',
    en: 'We are thrilled to welcome {count} guest(s) to celebrate Amit & Rakhi! Your hospitality details have been saved.'
  },
  'rsvp.confirmedDescMaybe': {
    hi: 'जानकारी देने के लिए धन्यवाद! हम आशा करते हैं कि आप उत्सव में पधारेंगे।',
    en: 'Thank you for letting us know! We hope to celebrate with you and will stay in touch.'
  },
  'rsvp.confirmedDescDeclined': {
    hi: 'हम आपको अवश्य याद करेंगे और दूर से भी आपका मंगल आशीर्वाद हमारे साथ रहेगा।',
    en: 'We will miss your presence, and we cherish your warm blessings from afar.'
  },
  'rsvp.refId': { hi: 'संदर्भ संख्या (Reference ID):', en: 'Reference ID:' },
  'rsvp.anotherBtn': { hi: 'एक अन्य उपस्थिति दर्ज करें', en: 'Submit Another RSVP' },
  'rsvp.homeBtn': { hi: 'मुख्य पृष्ठ पर लौटें', en: 'Return to Invitation' },
  'rsvp.nameError': { hi: 'कृपया अपना पूरा नाम दर्ज करें।', en: 'Please enter your full name.' },
  'rsvp.phoneError': { hi: 'कृपया वैध मोबाइल नंबर दर्ज करें।', en: 'Please enter a valid mobile number.' },
  'rsvp.eventsError': {
    hi: 'कृपया कम से कम एक कार्यक्रम का चयन करें।',
    en: 'Please select at least one wedding ceremony you plan to attend.'
  },

  // Contact Page
  'contact.eyebrow': { hi: 'आतिथ्य एवं स्नेह', en: 'Hospitality & Warmth' },
  'contact.title': { hi: 'पारिवारिक संपर्क', en: 'Contact Our Families' },
  'contact.bannerTitle': {
    hi: 'हम आपकी सेवा में उपस्थित हैं',
    en: 'We Are Here to Assist You'
  },
  'contact.bannerDesc': {
    hi: 'हवाई अड्डा आवागमन, आवास आरक्षण, परिधान संबंधी परामर्श अथवा कार्यक्रमों के समय की जानकारी हेतु हमारे समन्वयकों से कभी भी संपर्क करें।',
    en: 'Whether you need airport transfer coordination, suite reservations, attire advice, or ceremony timings, please reach out to our family coordinators anytime.'
  },
  'contact.coordinatorsTitle': {
    hi: 'पारिवारिक स्वागत एवं सहयोग समिति',
    en: 'Family Hospitality Contacts'
  },
  'contact.whatsappBoxTitle': {
    hi: 'व्हाट्सएप सहायता केंद्र',
    en: 'Direct WhatsApp Family Desk'
  },
  'contact.whatsappBoxDesc': {
    hi: 'सीधे हमारे परिवार की स्वागत डेस्क पर संदेश भेजें और त्वरित सहायता प्राप्त करें।',
    en: 'Connect directly with our hospitality coordinators on WhatsApp for quick assistance.'
  },
  'contact.yourName': { hi: 'आपका नाम *', en: 'Your Name *' },
  'contact.yourMessage': { hi: 'संदेश या प्रश्न *', en: 'Message or Question *' },
  'contact.sendWhatsApp': {
    hi: 'व्हाट्सएप पर भेजें',
    en: 'Send Inquiry on WhatsApp'
  },
  'contact.inputError': {
    hi: 'कृपया अपना नाम एवं संदेश दर्ज करें।',
    en: 'Please enter your name and message.'
  },

  // Footer
  'footer.celebration': { hi: 'विवाह उत्सव', en: 'Celebration' },
  'footer.memories': { hi: 'स्मृतियाँ', en: 'Memories' },
  'footer.services': { hi: 'अतिथि सेवा', en: 'Guest Services' },
  'footer.connect': { hi: 'संपर्क सूत्र', en: 'Connect' },
  'footer.shareWhatsApp': { hi: 'व्हाट्सएप पर शेयर करें', en: 'Share on WhatsApp' },
  'footer.copyLink': { hi: 'निमंत्रण लिंक कॉपी करें', en: 'Copy Invitation Link' },
  'footer.craftedWith': {
    hi: 'सप्रेम निर्मित • अमित एवं राखी विवाह',
    en: 'Crafted with love for Amit & Rakhi'
  },
  'footer.createdBy': { hi: 'निर्माता:', en: 'Created by' },

  // Music Player
  'music.toggleMute': { hi: 'ध्वनि चालू/बंद करें', en: 'Toggle Audio Mute' },
  'music.play': { hi: 'संगीत चलाएं', en: 'Play Music' },
  'music.pause': { hi: 'संगीत रोकें', en: 'Pause Music' },

  // 404 Page
  'notFound.eyebrow': { hi: 'शाही विवाह पोर्टल', en: 'Royal Celebration Portal' },
  'notFound.title': {
    hi: 'यह पृष्ठ उपलब्ध नहीं है',
    en: 'This Courtyard Could Not Be Found'
  },
  'notFound.desc': {
    hi: 'लगता है आप महल के मुख्य मार्ग से भटक गए हैं। आइए हम आपको विवाह उत्सव के मुख्य पृष्ठ पर ले चलते हैं।',
    en: 'It seems you wandered off the palace path. Let us guide you back to the wedding festivities.'
  },
  'notFound.returnBtn': {
    hi: 'विवाह निमंत्रण पर लौटें',
    en: 'Return to Wedding Invitation'
  }
};
