import React, { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';

export const MusicPlayer: React.FC = () => {
  const { settings } = useWedding();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
  }, []);

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

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      <audio
        ref={audioRef}
        src={settings.backgroundMusicUrl || '/audio/wedding-melody.wav'}
        loop
        preload="none"
      />
      <div className="flex items-center gap-2 rounded-full bg-maroon-900/95 text-ivory-pure border border-gold-400/60 shadow-royal backdrop-blur-md px-3 py-2">
        <button
          type="button"
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-gold-gradient text-maroon-950 flex items-center justify-center hover:scale-105 transition"
          aria-label={playing ? 'Pause wedding music' : 'Play wedding music'}
          title={playing ? 'Pause wedding music' : 'Play wedding music'}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="hidden sm:block pr-1 max-w-[155px]">
          <p className="text-[10px] uppercase tracking-wider text-gold-300 flex items-center gap-1">
            <Music className={`w-3 h-3 ${playing ? 'animate-pulse' : ''}`} />
            {playing ? 'Playing' : 'Wedding Music'}
          </p>
          <p className="text-[11px] text-ivory-pure/90 truncate">
            {settings.musicTrackTitle || 'Sacred Raga'}
          </p>
        </div>
        {playing && (
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-full text-gold-300 hover:bg-white/10"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

