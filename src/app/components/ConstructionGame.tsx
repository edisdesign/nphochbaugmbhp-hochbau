import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

interface ConstructionGameProps {
  theme: 'dark' | 'light';
  lang: string;
}

// Game Constants
const ROWS = 10;
const COLS = 6;
const BLOCK_SIZE = 40;

export function ConstructionGame({ theme, lang }: ConstructionGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game State
  const [grid, setGrid] = useState<boolean[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(false)));
  const [mouseX, setMouseX] = useState(0); 
  const [activeCol, setActiveCol] = useState(0);
  const [fallingBlock, setFallingBlock] = useState<{ col: number; row: number; y: number } | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  
  const totalBlocks = ROWS * COLS;

  // Translations
  const content = {
    DE: {
      progress: "BAUFORTSCHRITT",
      complete: "MAUER FERTIGGESTELLT",
      integrity: "Strukturelle Integrität verifiziert.",
      restart: "NEUE MAUER BAUEN",
      instruction: "KLICKEN ZUM PLATZIEREN • FÜLLE DAS RASTER"
    },
    EN: {
      progress: "SITE PROGRESS",
      complete: "WALL COMPLETE",
      integrity: "Structural integrity verified.",
      restart: "BUILD NEW WALL",
      instruction: "CLICK TO DROP • FILL THE GRID"
    },
    BHS: {
      progress: "NAPREDAK GRADNJE",
      complete: "ZID ZAVRŠEN",
      integrity: "Strukturni integritet potvrđen.",
      restart: "GRADI NOVI ZID",
      instruction: "KLIKNI ZA POSTAVLJANJE • POPUNI MREŽU"
    }
  };

  const t = content[lang as keyof typeof content] || content.DE;

  // Mouse Movement Handler
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameWon || fallingBlock) return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const x = clientX - rect.left;
      
      const clampedX = Math.max(0, Math.min(x, rect.width));
      setMouseX(clampedX);

      const colWidth = rect.width / COLS;
      const col = Math.floor(clampedX / colWidth);
      setActiveCol(Math.max(0, Math.min(col, COLS - 1)));
    }
  };

  // Real Falling Logic
  useEffect(() => {
     if (!fallingBlock) return;

     let animationFrameId: number;
     
     const animate = () => {
        setFallingBlock(prev => {
           if (!prev) return null;

           const rowHeight = 100 / ROWS; 
           const targetY = 100 - ((prev.row + 1) * rowHeight); 
           
           const currentY = prev.y;
           const speed = 3; 
           
           if (currentY >= targetY) {
              const newGrid = [...grid];
              newGrid[prev.row][prev.col] = true;
              setGrid(newGrid);
              setScore(s => s + 1);
              
              if (score + 1 >= totalBlocks) {
                 setGameWon(true);
              }
              
              return null;
           }

           return { ...prev, y: currentY + speed };
        });
        
        animationFrameId = requestAnimationFrame(animate);
     };

     animationFrameId = requestAnimationFrame(animate);
     return () => cancelAnimationFrame(animationFrameId);
  }, [fallingBlock, grid, score, totalBlocks]);

  const triggerDrop = () => {
     if (gameWon || fallingBlock) return;
     
     let targetRow = -1;
     for (let r = 0; r < ROWS; r++) {
        if (!grid[r][activeCol]) {
           targetRow = r;
           break;
        }
     }
     
     if (targetRow !== -1) {
        setFallingBlock({ col: activeCol, row: targetRow, y: -10 }); 
     }
  };

  const resetGame = (e?: React.MouseEvent) => {
     e?.stopPropagation();
     setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(false)));
     setScore(0);
     setGameWon(false);
     setFallingBlock(null);
  };

  const Block = ({ type = 'static', col, row, y }: { type?: 'static' | 'falling' | 'ghost', col: number, row?: number, y?: number }) => {
     const widthPercent = 100 / COLS;
     const heightPercent = 100 / ROWS;
     const left = col * widthPercent;
     const top = type === 'falling' ? y : (row !== undefined ? (100 - ((row + 1) * heightPercent)) : 0);

     return (
        <div 
           className="absolute z-10 preserve-3d"
           style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${widthPercent}%`,
              height: `${heightPercent}%`,
              padding: '2px' 
           }}
        >
           <div className={clsx(
              "w-full h-full relative shadow-inner transition-transform",
              type === 'ghost' && "opacity-20",
              type === 'falling' && "z-50"
           )}>
              <div className="absolute inset-0 bg-[#777] border border-[#555] flex items-center justify-center">
                 <div className="w-full h-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-40 mix-blend-multiply" />
                 <div className="absolute inset-1 border border-white/10" />
                 {row !== undefined && (row + col) % 3 === 0 && type !== 'ghost' && (
                    <span className="text-[8px] md:text-[10px] text-white/30 font-bold font-['Oswald']">NP</span>
                 )}
              </div>
              <div className="absolute right-0 bottom-0 w-full h-1 bg-black/40" />
              <div className="absolute right-0 top-0 w-1 h-full bg-black/40" />
           </div>
        </div>
     );
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] bg-[#111] relative overflow-hidden cursor-none select-none group border-y border-[#333]"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onClick={triggerDrop}
      onMouseLeave={() => setFallingBlock(null)} 
    >
       <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-10" />
       <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

       <div className="absolute inset-0 flex">
          {Array(COLS).fill(0).map((_, i) => (
             <div key={i} className="flex-1 border-r border-white/5 last:border-0" />
          ))}
       </div>
       <div className="absolute inset-0 flex flex-col">
          {Array(ROWS).fill(0).map((_, i) => (
             <div key={i} className="flex-1 border-b border-white/5 last:border-0" />
          ))}
       </div>

       <div className="absolute top-4 left-6 z-30 pointer-events-none">
          <div className="flex items-center gap-3">
             <div className="bg-[#F4B400] text-black text-xs font-bold px-2 py-1 uppercase tracking-widest font-['Oswald']">
                {t.progress}
             </div>
             <div className="text-white font-['Oswald'] text-lg tracking-wider">
                {Math.round((score / totalBlocks) * 100)}%
             </div>
          </div>
       </div>

       {!gameWon && (
          <div 
             className="absolute top-0 z-40 pointer-events-none transition-transform duration-75 ease-out will-change-transform"
             style={{ 
                left: mouseX,
                transform: 'translateX(-50%)' 
             }}
          >
             <div className="w-[2px] h-[40px] bg-gradient-to-b from-[#666] to-[#999] mx-auto" />
             <div className="w-8 h-8 -mt-1 relative">
                <svg viewBox="0 0 24 24" className="w-full h-full text-[#F4B400] drop-shadow-lg">
                   <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 3.31 1.68 6.24 4.29 8L5 22h14l-1.29-2c2.61-1.76 4.29-4.69 4.29-8 0-5.52-4.48-10-10-10zm0 2c4.42 0 8 3.58 8 8 0 2.21-1.07 4.21-2.76 5.56L16 16h-2l-1.24 1.56C12.51 17.81 12.26 18 12 18s-.51-.19-.76-.44L10 16H8l-1.24 1.56C5.07 16.21 4 14.21 4 12c0-4.42 3.58-8 8-8z"/>
                </svg>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-50">
                   <div className="w-6 h-6 border-2 border-dashed border-[#F4B400]" />
                </div>
             </div>
          </div>
       )}

       <div className="absolute inset-0 z-10 p-4">
           {grid.map((rowArr, r) => 
               rowArr.map((filled, c) => 
                   filled ? <Block key={`${r}-${c}`} col={c} row={r} /> : null
               )
           )}

           {fallingBlock && (
               <Block 
                  type="falling" 
                  col={fallingBlock.col} 
                  y={fallingBlock.y} 
               />
           )}
       </div>

       <AnimatePresence>
          {gameWon && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm"
             >
                <div className="text-center p-8 border border-[#F4B400] bg-[#111]">
                   <CheckCircle className="w-20 h-20 text-[#F4B400] mx-auto mb-6" />
                   <h2 className="text-4xl md:text-5xl font-['Oswald'] text-white uppercase mb-2">{t.complete}</h2>
                   <p className="text-gray-400 font-['Inter'] mb-8">{t.integrity}</p>
                   
                   <button 
                      onClick={(e) => resetGame(e)}
                      className="bg-[#F4B400] text-black font-['Oswald'] font-bold text-lg px-8 py-3 hover:bg-white transition-colors uppercase tracking-widest flex items-center gap-2 mx-auto"
                   >
                      <RotateCcw className="w-5 h-5" />
                      {t.restart}
                   </button>
                </div>
             </motion.div>
          )}
       </AnimatePresence>

       {!gameWon && score === 0 && !fallingBlock && (
          <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none animate-pulse">
             <span className="text-white/50 text-sm font-['Inter'] uppercase tracking-[0.2em]">
                {t.instruction}
             </span>
          </div>
       )}
    </div>
  );
}
