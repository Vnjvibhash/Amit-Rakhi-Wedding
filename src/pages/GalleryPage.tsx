import React, { useEffect, useMemo, useState } from 'react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  ImagePlus,
  Share2,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ALBUM_CATEGORIES } from '../data/sampleData';
import { CATEGORY_TRANSLATIONS } from '../data/localizedData';
import { useWedding } from '../context/WeddingContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader } from '../components/common/PageHeader';
import { AlbumCategory, WeddingPhoto } from '../types/wedding';
import { createPhotoRecord, uploadImageAsset } from '../services/weddingService';

export const GalleryPage: React.FC = () => {
  const { albums, photos, settings } = useWedding();
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'All' | AlbumCategory>('All');
  const [activeAlbumId, setActiveAlbumId] = useState<string>('all');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Upload modal state (for Admins or Guests when enabled)
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<AlbumCategory>('Friends & Guests');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const catMatch = activeCategory === 'All' || p.category === activeCategory;
      const albMatch = activeAlbumId === 'all' || p.albumId === activeAlbumId;
      return catMatch && albMatch;
    });
  }, [photos, activeCategory, activeAlbumId]);

  // Keyboard navigation in Lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') {
        setLightboxIdx((i) => (i === null ? null : (i + 1) % filteredPhotos.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((i) =>
          i === null ? null : (i - 1 + filteredPhotos.length) % filteredPhotos.length
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, filteredPhotos.length]);

  const currentPhoto: WeddingPhoto | null =
    lightboxIdx !== null ? filteredPhotos[lightboxIdx] || null : null;

  const canDownload = (photo: WeddingPhoto) => settings.allowPhotoDownload && photo.allowDownload;

  const handleSharePhoto = async (photo: WeddingPhoto) => {
    const shareText = `${photo.caption || (language === 'hi' ? 'विवाह स्मृति' : 'Wedding Memory')} — ${settings.coupleDisplayName} ${settings.hashtag}`;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: settings.coupleDisplayName, text: shareText, url });
        return;
      } catch {
        // Fallback to WhatsApp
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleDownloadPhoto = async (photo: WeddingPhoto) => {
    try {
      const resp = await fetch(photo.imageUrl);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${photo.category.replace(/\s+/g, '-').toLowerCase()}-${photo.id}.jpg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      toast.success(language === 'hi' ? 'तस्वीर डाउनलोड हो गई!' : 'Photo downloaded!');
    } catch {
      window.open(photo.imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error(language === 'hi' ? 'कृपया कम से कम एक तस्वीर चुनें।' : 'Please select at least one photo.');
      return;
    }
    setUploading(true);
    setProgress(0);

    try {
      const targetAlbum = albums.find((a) => a.category === uploadCategory) || albums[0];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadImageAsset(
          file,
          'photos',
          (pct) => setProgress(pct)
        );
        await createPhotoRecord({
          albumId: targetAlbum?.id || 'general',
          category: uploadCategory,
          imageUrl: uploadedUrl,
          caption: uploadCaption.trim() || file.name.replace(/\.[^.]+$/, ''),
          uploadedBy: uploaderName.trim() || undefined,
          allowDownload: true,
          createdAt: new Date().toISOString()
        });
      }

      toast.success(
        language === 'hi' ? 'तस्वीरें सफलतापूर्वक जोड़ी गईं!' : 'Photos added to gallery successfully!'
      );
      setUploadOpen(false);
      setFiles([]);
      setUploadCaption('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Photo upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={t('gallery.eyebrow')}
        title={t('gallery.title')}
        subtitle={t('gallery.subtitle')}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Category Tabs & Upload Button */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setActiveAlbumId('all');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                  activeCategory === 'All' && activeAlbumId === 'all'
                    ? 'bg-maroon-800 text-gold-200 border border-gold-400 shadow-sm'
                    : 'bg-ivory-pure text-maroon-800 border border-gold-400/40 hover:bg-gold-50'
                }`}
              >
                {t('gallery.filterAll')} ({photos.length})
              </button>
              {ALBUM_CATEGORIES.map((cat) => {
                const count = photos.filter((p) => p.category === cat).length;
                const label = CATEGORY_TRANSLATIONS[cat]?.[language] || cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setActiveAlbumId('all');
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                      activeCategory === cat
                        ? 'bg-maroon-800 text-gold-200 border border-gold-400 shadow-sm'
                        : 'bg-ivory-pure text-maroon-800 border border-gold-400/40 hover:bg-gold-50'
                    }`}
                  >
                    {label} {count > 0 ? `(${count})` : ''}
                  </button>
                );
              })}
            </div>

            {(isAdmin || settings.allowGuestPhotoUpload) && (
              <button onClick={() => setUploadOpen(true)} className="btn-gold !py-2.5 !px-5 !text-xs shrink-0">
                <ImagePlus className="w-4 h-4" /> {t('gallery.uploadBtn')}
              </button>
            )}
          </div>

          {/* Photo Masonry Grid */}
          {filteredPhotos.length === 0 ? (
            <div className="royal-card p-12 text-center">
              <Camera className="w-10 h-10 text-gold-600 mx-auto mb-3" />
              <h3 className="font-serif text-2xl font-bold text-maroon-900">
                {t('gallery.empty')}
              </h3>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIdx(idx)}
                  className="break-inside-avoid royal-card overflow-hidden cursor-pointer group hover:shadow-gold transition-all duration-300 relative"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Wedding Photo'}
                    className="w-full object-cover group-hover:scale-105 transition duration-500 rounded-2xl"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/85 via-maroon-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-ivory-pure rounded-2xl">
                    <span className="text-[10px] uppercase tracking-wider text-gold-300 font-semibold">
                      {CATEGORY_TRANSLATIONS[photo.category]?.[language] || photo.category}
                    </span>
                    <p className="font-serif text-lg font-bold line-clamp-2">
                      {photo.caption}
                    </p>
                    {photo.uploadedBy && (
                      <p className="text-[11px] text-beige-soft/75 mt-0.5">
                        {t('gallery.uploadedBy')} {photo.uploadedBy}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {currentPhoto && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between text-ivory-pure pb-2 z-10">
            <div>
              <span className="text-xs uppercase tracking-wider text-gold-300">
                {CATEGORY_TRANSLATIONS[currentPhoto.category]?.[language] || currentPhoto.category}
              </span>
              <h4 className="font-serif text-lg sm:text-2xl font-bold">
                {currentPhoto.caption}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSharePhoto(currentPhoto)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-gold-500/20 text-gold-200 transition"
                title={t('gallery.shareBtn')}
              >
                <Share2 className="w-5 h-5" />
              </button>
              {canDownload(currentPhoto) && (
                <button
                  onClick={() => handleDownloadPhoto(currentPhoto)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-gold-500/20 text-gold-200 transition"
                  title={t('gallery.downloadBtn')}
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setLightboxIdx(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-red-500/30 text-ivory-pure transition"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Large Image Preview */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-auto py-2">
            <button
              onClick={() =>
                setLightboxIdx((i) =>
                  i === null ? null : (i - 1 + filteredPhotos.length) % filteredPhotos.length
                )
              }
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-maroon-950/70 border border-gold-400/40 text-gold-200 hover:bg-gold-500/20"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.caption}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() =>
                setLightboxIdx((i) => (i === null ? null : (i + 1) % filteredPhotos.length))
              }
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-maroon-950/70 border border-gold-400/40 text-gold-200 hover:bg-gold-500/20"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center text-xs text-beige-soft/75 pt-2">
            {lightboxIdx + 1} / {filteredPhotos.length}
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {uploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="royal-card max-w-md w-full p-6 sm:p-8 space-y-4 relative">
            <button
              onClick={() => setUploadOpen(false)}
              className="absolute top-4 right-4 text-maroon-800 hover:text-maroon-950"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-bold text-maroon-900">
              {t('gallery.modalTitle')}
            </h3>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1">
                  {t('gallery.yourName')}
                </label>
                <input
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder={t('rsvp.namePlaceholder')}
                  className="input-royal"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1">
                  {t('gallery.caption')}
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder={
                    language === 'hi' ? 'उदा. हल्दी के सुंदर पल...' : 'e.g., Haldi smiles...'
                  }
                  className="input-royal"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1">
                  {t('gallery.category')}
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as AlbumCategory)}
                  className="input-royal"
                >
                  {ALBUM_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_TRANSLATIONS[c]?.[language] || c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-maroon-900 mb-1">
                  {t('gallery.selectFiles')}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="block w-full text-xs text-maroon-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-maroon-800 file:text-gold-200 hover:file:bg-maroon-900 cursor-pointer"
                />
              </div>
              {uploading && (
                <div className="w-full bg-gold-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gold-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="btn-outline-gold !py-2 !px-4 !text-xs"
                >
                  {t('gallery.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-royal !py-2 !px-5 !text-xs"
                >
                  {uploading ? t('gallery.submitting') : t('gallery.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
