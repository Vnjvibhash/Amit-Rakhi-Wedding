import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { WeddingProvider, useWedding } from './context/WeddingContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MusicPlayer } from './components/common/MusicPlayer';
import { HomePage } from './pages/HomePage';
import { OurStoryPage } from './pages/OurStoryPage';
import { EventsPage } from './pages/EventsPage';
import { SchedulePage } from './pages/SchedulePage';
import { GalleryPage } from './pages/GalleryPage';
import { VideosPage } from './pages/VideosPage';
import { FamilyPage } from './pages/FamilyPage';
import { VenuePage } from './pages/VenuePage';
import { RSVPPage } from './pages/RSVPPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

const PAGE_TITLES: Record<string, { hi: string; en: string }> = {
  '/': { hi: 'डिजिटल विवाह निमंत्रण', en: 'Digital Wedding Invitation' },
  '/our-story': { hi: 'हमारी कहानी', en: 'Our Story' },
  '/events': { hi: 'विवाह कार्यक्रम व संस्कार', en: 'Wedding Events & Ceremonies' },
  '/schedule': { hi: 'कार्यक्रम तालिका व कैलेंडर', en: 'Schedule & Interactive Calendar' },
  '/gallery': { hi: 'तस्वीरें व गैलरी', en: 'Photo Gallery' },
  '/videos': { hi: 'विवाह वीडियो व रील्स', en: 'Wedding Videos & Highlights' },
  '/family': { hi: 'हमारे परिवारों का आशीर्वाद', en: 'With the Blessings of Our Families' },
  '/venue': { hi: 'विवाह स्थल व यात्रा मार्गदर्शिका', en: 'Venue & Travel Guide' },
  '/rsvp': { hi: 'उपस्थिति दर्ज करें (RSVP)', en: 'Guest RSVP' },
  '/contact': { hi: 'पारिवारिक संपर्क', en: 'Contact Our Families' },
  '/admin/login': { hi: 'एडमिन पोर्टल लॉगिन', en: 'Admin Portal Login' },
  '/admin': { hi: 'एडमिन डैशबोर्ड', en: 'Admin Dashboard' }
};

const RouteMetaManager: React.FC = () => {
  const { pathname } = useLocation();
  const { settings } = useWedding();
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const titleEntry = PAGE_TITLES[pathname];
    const section = titleEntry
      ? titleEntry[language] || titleEntry.hi
      : language === 'hi'
      ? 'पृष्ठ नहीं मिला'
      : 'Page Not Found';
    const suffix = language === 'hi' ? 'विवाह' : 'Wedding';
    document.title = `${section} | ${settings.coupleDisplayName} ${suffix}`;
  }, [pathname, settings.coupleDisplayName, language]);

  return null;
};

const AppShell: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-ivory text-maroon-950">
    <RouteMetaManager />
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/venue" element={<VenuePage />} />
        <Route path="/rsvp" element={<RSVPPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
    <MusicPlayer />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#4A0710',
          color: '#FAF6EE',
          border: '1px solid #D4AF37',
          fontSize: '13px'
        }
      }}
    />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <WeddingProvider>
            <AppShell />
          </WeddingProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
