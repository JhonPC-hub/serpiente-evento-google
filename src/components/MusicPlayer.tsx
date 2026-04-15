import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track, TRACKS } from '../constants';

interface MusicPlayerProps {
  currentTrack: Track;
  onTrackChange: (track: Track) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  onTrackChange,
  isPlaying,
  setIsPlaying,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, setIsPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % TRACKS.length;
    } else {
      nextIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    }
    onTrackChange(TRACKS[nextIndex]);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="flex items-center justify-between w-full gap-8 relative">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleSkip('next')}
      />

      {/* Now Playing: SIGNAL_ID */}
      <div className="flex items-center gap-4 w-[280px]">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-14 h-14 border-2 border-glitch-magenta flex-shrink-0 relative overflow-hidden"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-glitch-magenta/20 mix-blend-overlay" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-pixel text-[8px] text-white truncate mb-1">{currentTrack.title}</h3>
          <p className="text-[10px] text-glitch-cyan opacity-60 truncate font-mono">SRC: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls: EXEC_CMD */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => handleSkip('prev')}
          className="glitch-btn !p-2"
        >
          <SkipBack size={14} />
        </button>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="glitch-btn !px-6 !py-3 !text-[10px] bg-glitch-cyan text-black"
        >
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>

        <button 
          onClick={() => handleSkip('next')}
          className="glitch-btn !p-2"
        >
          <SkipForward size={14} />
        </button>
      </div>

      {/* Progress: FLOW_STATE */}
      <div className="flex-1 max-w-[350px]">
        <div className="relative h-4 border-2 border-glitch-cyan/30 bg-black/40">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-glitch-cyan/40"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-pixel text-[6px] text-white mix-blend-difference">FLOW_STATE: {Math.round(progress)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between font-mono text-[8px] text-glitch-cyan mt-1">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '00:00'}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : '00:00'}</span>
        </div>
      </div>

      {/* Volume: GAIN_LVL */}
      <div className="flex items-center gap-3 w-[140px]">
        <span className="font-pixel text-[6px] text-glitch-magenta">GAIN</span>
        <div className="flex-1 h-2 border border-glitch-magenta/30 relative bg-black/40">
          <div 
            className="absolute inset-y-0 left-0 bg-glitch-magenta"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
