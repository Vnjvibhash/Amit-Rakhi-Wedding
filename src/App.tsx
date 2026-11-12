import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
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

const PAGE_TITLES: Record<string, string> = {
  '/': 'Digital Wedding Invitation',
  '/our-story': 'Our Story',
  '/events': 'Wedding Events & Ceremonies',
  '/schedule': 'Schedule & Interactive Calendar',
  '/gallery': 'Photo Gallery',
  '/videos': 'Wedding Videos & Highlights',
  '/family': 'With the Blessings of Our Families',
  '/venue': 'Venue & Travel Guide',
  '/rsvp': 'Guest RSVP',
  '/contact': 'Contact Our Families',
  '/admin/login': 'Admin Portal Login',
  '/admin': 'Admin Dashboard'
};

const RouteMetaManager: React.FC = () => {
  const { pathname } = useLocation();
  const { settings } = useWedding();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const section = PAGE_TITLES[pathname] || 'Page Not Found';
    document.title = `${section} | ${settings.coupleDisplayName} Wedding`;
  }, [pathname, settings.coupleDisplayName]);

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
        <WeddingProvider>
          <AppShell />
        </WeddingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

