import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      setDirection(prev => {
        switch (e.key) {
          case 'ArrowUp':
            return prev.y === 1 ? prev : { x: 0, y: -1 };
          case 'ArrowDown':
            return prev.y === -1 ? prev : { x: 0, y: 1 };
          case 'ArrowLeft':
            return prev.x === 1 ? prev : { x: -1, y: 0 };
          case 'ArrowRight':
            return prev.x === -1 ? prev : { x: 1, y: 0 };
          default:
            return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 100);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, score, onScoreChange]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Glitchy faint lines)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food (Magenta)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Draw Snake (Cyan)
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00ffff';
    snake.forEach((segment, index) => {
      // Glitch effect: occasionally offset snake segments slightly
      const glitchOffset = Math.random() > 0.95 ? (Math.random() * 4 - 2) : 0;
      
      if (index === 0) {
        ctx.fillStyle = '#ffffff'; // Head is white
      } else {
        ctx.fillStyle = '#00ffff';
      }
      
      ctx.fillRect(
        segment.x * CELL_SIZE + 1 + glitchOffset,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Reset shadow for text
    ctx.shadowBlur = 0;

  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setIsPaused(false);
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
  };

  return (
    <div className="relative border-2 border-[#00ffff] p-1 bg-[#050505] shadow-[0_0_15px_rgba(0,255,255,0.3)]">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none border border-[#ff00ff] opacity-50 mix-blend-screen animate-pulse"></div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="block"
      />
      
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-[#ff00ff]">
          <h2 className="text-4xl mb-4 glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
          <p className="text-xl text-[#00ffff] mb-6">SCORE: {score}</p>
          <button 
            onClick={resetGame}
            className="px-6 py-2 border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors uppercase tracking-widest"
          >
            REBOOT_SEQUENCE
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h2 className="text-3xl text-[#00ffff] glitch-text animate-pulse" data-text="STATE: PAUSED">STATE: PAUSED</h2>
        </div>
      )}
    </div>
  );
};
