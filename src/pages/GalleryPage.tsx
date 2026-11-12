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
import { useWedding } from '../context/WeddingContext';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/common/PageHeader';
import { AlbumCategory, WeddingPhoto } from '../types/wedding';
import { createPhotoRecord, uploadImageAsset } from '../services/weddingService';

export const GalleryPage: React.FC = () => {
  const { albums, photos, settings } = useWedding();
  const { isAdmin } = useAuth();
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
    const shareText = `${photo.caption || 'Wedding Memory'} — ${settings.coupleDisplayName} ${settings.hashtag}`;
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
      toast.success('Photo downloaded!');
    } catch {
      window.open(photo.imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) {
      toast.error('Please choose one or more photographs to upload.');
      return;
    }
    setUploading(true);
    try {
      const targetAlbum = albums.find((a) => a.category === uploadCategory);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImageAsset(file, 'photos', (pct) => {
          setProgress(Math.round(((i + pct / 100) / files.length) * 100));
        });
        await createPhotoRecord({
          albumId: targetAlbum?.id || 'alb-other',
          category: uploadCategory,
          imageUrl: url,
          caption: uploadCaption.trim() || `${uploadCategory} Moment`,
          uploadedBy: uploaderName.trim() || (isAdmin ? 'Wedding Admin' : 'Wedding Guest'),
          allowDownload: true,
          createdAt: new Date().toISOString()
        });
      }
      toast.success(`${files.length} photograph(s) added to the gallery!`);
      setFiles([]);
      setUploadCaption('');
      setUploadOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Captured Memories"
        title="Wedding Photo Gallery"
        subtitle="Relive cherished moments across every ceremony—from royal pre-wedding portraits and vibrant Haldi splashes to the sacred Vivah."
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-7xl mx-auto">
          {/* Album Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-serif text-3xl font-bold text-maroon-900">Ceremony Albums</h2>
              <p className="text-xs text-maroon-700/80 mt-0.5">
                {filteredPhotos.length} photograph{filteredPhotos.length === 1 ? '' : 's'} shown
              </p>
            </div>
            {(isAdmin || settings.allowGuestPhotoUpload) && (
              <button onClick={() => setUploadOpen(true)} className="btn-royal !py-2.5 !px-5 !text-xs">
                <ImagePlus className="w-4 h-4" /> Upload Photos (Mobile / Desktop)
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => {
                setActiveCategory('All');
                setActiveAlbumId('all');
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeCategory === 'All'
                  ? 'bg-maroon-800 text-gold-200 border border-gold-400 shadow-sm'
                  : 'bg-ivory-pure text-maroon-800 border border-gold-400/40 hover:bg-gold-50'
              }`}
            >
              All Memories ({photos.length})
            </button>
            {ALBUM_CATEGORIES.map((cat) => {
              const count = photos.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveAlbumId('all');
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition ${
                    activeCategory === cat
                      ? 'bg-maroon-800 text-gold-200 border border-gold-400 shadow-sm'
                      : 'bg-ivory-pure text-maroon-800 border border-gold-400/40 hover:bg-gold-50'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Responsive Masonry Grid */}
          {filteredPhotos.length === 0 ? (
            <div className="royal-card p-12 text-center">
              <Camera className="w-10 h-10 text-gold-600 mx-auto mb-3" />
              <p className="font-serif text-2xl text-maroon-900">No photographs in this album yet.</p>
              <p className="text-sm text-maroon-800/75 mt-1">
                Upload new ceremony photographs or switch to another album category.
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {filteredPhotos.map((photo, index) => (
                <figure
                  key={photo.id}
                  onClick={() => setLightboxIdx(index)}
                  className="break-inside-avoid royal-card overflow-hidden cursor-pointer group hover:shadow-gold transition-all"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption}
                      loading="lazy"
                      className="w-full h-auto object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs font-medium text-gold-200">
                        Click to view full screen
                      </span>
                    </div>
                  </div>
                  <figcaption className="p-4">
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-gold-700 font-semibold">
                      <span>{photo.category}</span>
                      <span>{new Date(photo.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-sm text-maroon-950 font-medium mt-1">{photo.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Full-Screen Lightbox */}
      {currentPhoto && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Photo Lightbox"
        >
          <div className="flex items-center justify-between text-ivory-pure">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold-300">
                {currentPhoto.category} • {lightboxIdx + 1} / {filteredPhotos.length}
              </p>
              <p className="font-serif text-lg sm:text-xl">{currentPhoto.caption}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSharePhoto(currentPhoto)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gold-200"
                title="Share photo"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {canDownload(currentPhoto) && (
                <button
                  onClick={() => handleDownloadPhoto(currentPhoto)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gold-200"
                  title="Download photo"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setLightboxIdx(null)}
                className="p-2.5 rounded-full bg-maroon-800 hover:bg-maroon-700 text-ivory-pure"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={() =>
                setLightboxIdx((lightboxIdx - 1 + filteredPhotos.length) % filteredPhotos.length)
              }
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-maroon-800 text-ivory-pure border border-gold-400/40"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.caption}
              className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl border border-gold-400/30"
            />

            <button
              onClick={() => setLightboxIdx((lightboxIdx + 1) % filteredPhotos.length)}
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-maroon-800 text-ivory-pure border border-gold-400/40"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center text-xs text-beige-soft/75">
            Uploaded {new Date(currentPhoto.createdAt).toLocaleDateString('en-IN')}
            {currentPhoto.uploadedBy ? ` • By ${currentPhoto.uploadedBy}` : ''}
          </div>
        </div>
      )}

      {/* Multi-Photo Upload Modal (Mobile & Desktop friendly) */}
      {uploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !uploading && setUploadOpen(false)}
        >
          <form
            onSubmit={handleUploadSubmit}
            onClick={(e) => e.stopPropagation()}
            className="royal-card max-w-lg w-full p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-maroon-900">
                Share Wedding Photographs
              </h3>
              <button
                type="button"
                onClick={() => setUploadOpen(false)}
                className="p-1.5 rounded-full hover:bg-gold-100 text-maroon-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-800 mb-1">
                Album Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as AlbumCategory)}
                className="input-royal"
              >
                {ALBUM_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-800 mb-1">
                Select Multiple Photos (Camera or Phone Gallery)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="input-royal !py-2"
                required
              />
              {files.length > 0 && (
                <p className="text-xs text-gold-700 mt-1 font-medium">
                  {files.length} file(s) ready for optimized upload
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-800 mb-1">
                Photo Caption
              </label>
              <input
                type="text"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="e.g., Dancing at the Sangeet courtyard!"
                className="input-royal"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-800 mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="e.g., Meera Auntie / Cousin Vikram"
                className="input-royal"
              />
            </div>

            {uploading && (
              <div className="w-full bg-beige-warm rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-maroon-800 h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUploadOpen(false)}
                disabled={uploading}
                className="btn-outline-gold !py-2 !px-4 !text-xs"
              >
                Cancel
              </button>
              <button type="submit" disabled={uploading} className="btn-royal !py-2 !px-6 !text-xs">
                {uploading ? `Uploading (${progress}%)...` : 'Upload Photographs'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

