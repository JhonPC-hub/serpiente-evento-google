export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Sunset',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
    color: '#ff00ff', // Magenta neon
  },
  {
    id: '2',
    title: 'Cyber Drift',
    artist: 'RetroFuture AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400',
    color: '#00ffff', // Cyan neon
  },
  {
    id: '3',
    title: 'Midnight Protocol',
    artist: 'GlitchCore AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400',
    color: '#39ff14', // Lime neon
  },
];

export const GAME_SPEED = 100;
export const GRID_SIZE = 20;
export const CANVAS_SIZE = 400;
