import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Gamepad2, Trophy, ListMusic, Github, Twitter } from 'lucide-react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { TRACKS, Track } from './constants';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden p-6 relative">
      <div className="noise-overlay" />
      
      <div className="app-container grid grid-cols-[300px_1fr_250px] grid-rows-[1fr_120px] gap-4 h-full relative z-10">
        
        {/* Sidebar: DATA_STREAMS */}
        <aside className="playlist-section glitch-panel flex flex-col">
          <div className="glitch-text mb-6">DATA_STREAMS</div>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {TRACKS.map(track => (
              <button
                key={track.id}
                onClick={() => setCurrentTrack(track)}
                className={`w-full flex flex-col gap-1 p-3 border-2 transition-all text-left ${
                  currentTrack.id === track.id 
                    ? 'border-glitch-magenta bg-glitch-magenta/10' 
                    : 'border-glitch-cyan/20 hover:border-glitch-cyan hover:bg-glitch-cyan/5'
                }`}
              >
                <p className="font-pixel text-[8px] text-white truncate">{track.title}</p>
                <p className="text-[10px] text-glitch-cyan opacity-70 truncate">SRC: {track.artist}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* Main: CORE_SIMULATION */}
        <main className="game-window flex flex-col items-center justify-center relative">
          <div className="glitch-text mb-8 text-lg">CORE_SIMULATION_v4.0</div>
          <SnakeGame 
            accentColor={currentTrack.color} 
            onScoreChange={handleScoreChange}
          />
        </main>

        {/* Right: SYSTEM_METRICS */}
        <aside className="stats-section glitch-panel flex flex-col gap-10">
          <div className="glitch-text">SYSTEM_METRICS</div>
          
          <div className="space-y-2">
            <div className="text-[10px] text-glitch-cyan font-pixel">CURR_VAL:</div>
            <div className="font-mono text-4xl text-white tracking-widest">
              {score.toString().padStart(4, '0')}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] text-glitch-magenta font-pixel">PEAK_VAL:</div>
            <div className="font-mono text-4xl text-white tracking-widest">
              {highScore.toString().padStart(4, '0')}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t-2 border-glitch-cyan/20">
            <div className="text-[8px] font-pixel text-glitch-cyan mb-2">STATUS: ACTIVE</div>
            <div className="w-full h-2 bg-glitch-cyan/20 relative">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-glitch-cyan"
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>
          </div>
        </aside>

        {/* Bottom: SIGNAL_CONTROL */}
        <footer className="player-console glitch-panel col-span-3 flex items-center justify-between px-8">
          <div className="glitch-text absolute -top-2 left-4 bg-glitch-bg px-2 text-[8px]">SIGNAL_CONTROL</div>
          <MusicPlayer 
            currentTrack={currentTrack}
            onTrackChange={setCurrentTrack}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        </footer>
      </div>
    </div>
  );
}
