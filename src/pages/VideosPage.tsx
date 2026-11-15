import React, { useMemo, useState } from 'react';
import { Film, Play, X } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader } from '../components/common/PageHeader';
import { VideoCategory, WeddingVideo } from '../types/wedding';
import { VIDEO_CATEGORY_TRANSLATIONS } from '../data/localizedData';
import { extractYouTubeId } from '../utils/imageOptimizer';

const VIDEO_CATEGORIES: VideoCategory[] = [
  'Pre-Wedding Videos',
  'Wedding Invitation Videos',
  'Ceremony Highlights',
  'Short Wedding Reels',
  'Family Messages'
];

export const VideosPage: React.FC = () => {
  const { videos } = useWedding();
  const { t, language } = useLanguage();
  const [activeCat, setActiveCat] = useState<'All' | VideoCategory>('All');
  const [playingVideo, setPlayingVideo] = useState<WeddingVideo | null>(null);

  const filtered = useMemo(
    () => (activeCat === 'All' ? videos : videos.filter((v) => v.category === activeCat)),
    [videos, activeCat]
  );

  const getThumbnail = (v: WeddingVideo) => {
    if (v.thumbnailUrl) return v.thumbnailUrl;
    const ytId = v.sourceType === 'youtube' ? extractYouTubeId(v.videoUrl) : null;
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    return '/images/hero-palace.jpg';
  };

  return (
    <div>
      <PageHeader
        eyebrow={t('videos.eyebrow')}
        title={t('videos.title')}
        subtitle={t('videos.subtitle')}
      />

      <section className="section-padding bg-ivory bg-mandala-pattern">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <button
              onClick={() => setActiveCat('All')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeCat === 'All'
                  ? 'bg-maroon-800 text-gold-200 border border-gold-400'
                  : 'bg-ivory-pure text-maroon-800 border border-gold-400/40'
              }`}
            >
              {t('videos.allVideos', { count: videos.length })}
            </button>
            {VIDEO_CATEGORIES.map((cat) => {
              const label = VIDEO_CATEGORY_TRANSLATIONS[cat]?.[language] || cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                    activeCat === cat
                      ? 'bg-maroon-800 text-gold-200 border border-gold-400'
                      : 'bg-ivory-pure text-maroon-800 border border-gold-400/40'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="royal-card p-12 text-center">
              <Film className="w-10 h-10 text-gold-600 mx-auto mb-3" />
              <p className="font-serif text-2xl text-maroon-900">{t('videos.empty')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((vid) => (
                <article
                  key={vid.id}
                  onClick={() => setPlayingVideo(vid)}
                  className="royal-card overflow-hidden cursor-pointer group hover:shadow-gold transition-all flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden bg-maroon-950">
                    <img
                      src={getThumbnail(vid)}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-maroon-950/35 flex items-center justify-center">
                      <span className="w-14 h-14 rounded-full bg-gold-gradient text-maroon-950 flex items-center justify-center shadow-gold group-hover:scale-110 transition">
                        <Play className="w-6 h-6 ml-0.5 fill-maroon-950" />
                      </span>
                    </div>
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-maroon-900/90 text-gold-200 border border-gold-400/40">
                      {VIDEO_CATEGORY_TRANSLATIONS[vid.category]?.[language] || vid.category}
                    </span>
                    {vid.duration && (
                      <span className="absolute bottom-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded bg-black/70 text-ivory-pure">
                        {vid.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-maroon-900 group-hover:text-gold-700 transition">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-maroon-900/75 mt-1.5 leading-relaxed line-clamp-2">
                        {vid.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Player Modal */}
      {playingVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-4xl w-full bg-maroon-950 rounded-2xl overflow-hidden border border-gold-400/50 shadow-2xl">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-ivory-pure hover:bg-gold-500/30"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full bg-black">
              {playingVideo.sourceType === 'youtube' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(playingVideo.videoUrl)}?autoplay=1`}
                  title={playingVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={playingVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="p-4 sm:p-5 bg-maroon-950 text-ivory-pure">
              <span className="text-xs uppercase tracking-wider text-gold-300">
                {VIDEO_CATEGORY_TRANSLATIONS[playingVideo.category]?.[language] || playingVideo.category}
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1 text-gold-200">
                {playingVideo.title}
              </h3>
              <p className="text-xs text-beige-soft/80 mt-1 leading-relaxed">
                {playingVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
