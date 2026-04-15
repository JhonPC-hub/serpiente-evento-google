import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, CANVAS_SIZE, GAME_SPEED } from '../constants';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  accentColor: string;
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ accentColor, onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        // Check collisions
        if (
          head.x < 0 ||
          head.x >= CANVAS_SIZE / GRID_SIZE ||
          head.y < 0 ||
          head.y >= CANVAS_SIZE / GRID_SIZE ||
          prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas - Dark background with scanlines effect
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid (very subtle pixelated grid)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#ff00ff';
      
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      
      // Pixelated segments
      ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
      
      // Glitch effect for head
      if (isHead && Math.random() > 0.95) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 2, y + 2, GRID_SIZE + 4, GRID_SIZE - 4);
      }
    });

    // Draw food
    ctx.fillStyle = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
    const foodX = food.x * GRID_SIZE;
    const foodY = food.y * GRID_SIZE;
    ctx.fillRect(foodX + 4, foodY + 4, GRID_SIZE - 8, GRID_SIZE - 8);

    // Random noise/static
    if (Math.random() > 0.9) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for(let i=0; i<10; i++) {
        ctx.fillRect(Math.random()*CANVAS_SIZE, Math.random()*CANVAS_SIZE, 2, 2);
      }
    }
  }, [snake, food]);

  return (
    <div className="relative group">
      <div 
        className="relative border-4 border-glitch-cyan overflow-hidden"
        style={{ boxShadow: '-4px 0 0 #ff00ff, 4px 0 0 #00ffff' }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block"
          id="game-canvas"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              {isGameOver ? (
                <>
                  <h2 className="glitch-text text-2xl mb-4">SIM_TERMINATED</h2>
                  <p className="font-mono text-glitch-magenta mb-8">FINAL_VAL: {score}</p>
                  <button
                    onClick={resetGame}
                    className="glitch-btn"
                  >
                    REBOOT_SIM
                  </button>
                </>
              ) : (
                <>
                  <h2 className="glitch-text text-2xl mb-8">SIM_HALTED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="glitch-btn"
                  >
                    RESUME_EXEC
                  </button>
                  <p className="mt-6 text-[8px] font-pixel text-glitch-cyan animate-pulse">PRESS_SPACE_TO_TOGGLE</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Controls Hint */}
      <div className="mt-4 flex justify-between items-center px-2">
        <div className="flex gap-2">
          {['↑', '←', '↓', '→'].map(key => (
            <span key={key} className="w-8 h-8 flex items-center justify-center border border-white/10 rounded text-xs text-gray-400 font-mono">
              {key}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Use arrows to move</span>
      </div>
    </div>
  );
};
