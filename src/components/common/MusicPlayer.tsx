import React, { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const MusicPlayer: React.FC = () => {
  const { settings } = useWedding();
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.40;

    const handlePlayEvent = () => setPlaying(true);
    const handlePauseEvent = () => setPlaying(false);

    audio.addEventListener('play', handlePlayEvent);
    audio.addEventListener('pause', handlePauseEvent);

    const attemptAutoplay = () => {
      audio
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          const handleFirstGesture = () => {
            audio
              .play()
              .then(() => {
                setPlaying(true);
              })
              .catch(() => {});
            cleanupGestureListeners();
          };

          const cleanupGestureListeners = () => {
            window.removeEventListener('click', handleFirstGesture);
            window.removeEventListener('touchstart', handleFirstGesture);
            window.removeEventListener('scroll', handleFirstGesture);
            window.removeEventListener('keydown', handleFirstGesture);
            window.removeEventListener('start-wedding-music', handleFirstGesture);
          };

          window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
          window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
          window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });
          window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
          window.addEventListener('start-wedding-music', handleFirstGesture, { once: true });
        });
    };

    attemptAutoplay();

    return () => {
      audio.removeEventListener('play', handlePlayEvent);
      audio.removeEventListener('pause', handlePauseEvent);
    };
  }, [settings.backgroundMusicUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const isHi = language === 'hi';

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      <audio
        ref={audioRef}
        src={settings.backgroundMusicUrl || '/audio/maithili-mangal-geet.mp3'}
        loop
        preload="auto"
      />
      <div className="flex items-center gap-2 rounded-full bg-maroon-900/95 text-ivory-pure border border-gold-400/60 shadow-royal backdrop-blur-md px-3 py-2">
        <button
          type="button"
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-gold-gradient text-maroon-950 flex items-center justify-center hover:scale-105 transition shadow-sm"
          aria-label={
            playing
              ? isHi ? 'मैथिली विवाह गीत रोकें' : 'Pause Maithili Vivah Geet'
              : isHi ? 'मैथिली विवाह गीत चलाएं' : 'Play Maithili Vivah Geet'
          }
          title={
            playing
              ? isHi ? 'संगीत रोकें' : 'Pause Music'
              : isHi ? 'संगीत चलाएं' : 'Play Music'
          }
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="hidden sm:block pr-1 max-w-[170px]">
          <p className="text-[10px] uppercase tracking-wider text-gold-300 flex items-center gap-1 font-semibold">
            <Music className={`w-3 h-3 ${playing ? 'animate-pulse text-gold-400' : ''}`} />
            {playing
              ? isHi ? 'मंगल गीत जारी है' : 'Playing Mangal Geet'
              : isHi ? 'मैथिली विवाह गीत' : 'Maithili Vivah Geet'}
          </p>
          <p className="text-[11px] text-ivory-pure/90 truncate font-serif">
            {settings.musicTrackTitle || (isHi ? 'मैथिली विवाह गीत — मंगल गान' : 'Maithili Vivah Geet — Mangal Gaan')}
          </p>
        </div>
        {playing && (
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-full text-gold-300 hover:bg-white/10"
            aria-label={muted ? (isHi ? 'ध्वनि चालू करें' : 'Unmute') : (isHi ? 'ध्वनि बंद करें' : 'Mute')}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
