import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 'TRK_01',
    title: 'AI_GEN_ALPHA // NEURAL_DRIFT',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'TRK_02',
    title: 'AI_GEN_BETA // SYNTHETIC_PULSE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'TRK_03',
    title: 'AI_GEN_GAMMA // VOID_RESONANCE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  return (
    <div className="border border-[#ff00ff] bg-[#050505] p-4 relative overflow-hidden">
      {/* Glitch background element */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#ff00ff]/10 to-transparent pointer-events-none"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-[#00ffff] mb-1 opacity-70">CURRENT_AUDIO_STREAM</p>
            <h3 className="text-lg text-[#ff00ff] glitch-text truncate w-48 sm:w-64" data-text={currentTrack.title}>
              {currentTrack.title}
            </h3>
          </div>
          <div className="text-[#00ffff] text-xs border border-[#00ffff] px-2 py-1 animate-pulse">
            {isPlaying ? 'ACTIVE' : 'STANDBY'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-900 border border-[#00ffff]/30 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#00ffff] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <button onClick={prevTrack} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay} 
              className="w-10 h-10 flex items-center justify-center border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
          
          <button onClick={toggleMute} className="text-[#ff00ff] hover:text-[#00ffff] transition-colors">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
