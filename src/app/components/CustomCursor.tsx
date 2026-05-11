import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { clsx } from 'clsx';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the cursor movement
  const springConfig = { damping: 30, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-hover') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Horizontal Line - Full Screen */}
      <motion.div
        className="fixed top-0 left-0 w-full h-[1px] bg-[#F4B400] pointer-events-none z-[9998] opacity-30 mix-blend-difference hidden md:block"
        style={{
            y: cursorY,
        }}
      />

      {/* Vertical Line - Full Screen */}
      <motion.div
        className="fixed top-0 left-0 h-full w-[1px] bg-[#F4B400] pointer-events-none z-[9998] opacity-30 mix-blend-difference hidden md:block"
        style={{
            x: cursorX,
        }}
      />

      {/* Central Crosshair / Interaction Marker */}
      <motion.div
        className={clsx(
          "fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center" 
        )}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {/* The Box/Frame */}
        <motion.div 
            className="border border-[#F4B400]"
            animate={{
                width: isHovering ? 40 : 20,
                height: isHovering ? 40 : 20,
                rotate: isHovering ? 45 : 0,
                backgroundColor: isHovering ? 'rgba(244, 180, 0, 0.2)' : 'rgba(244, 180, 0, 0)',
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />

        {/* Center Dot */}
        <div className="absolute w-1 h-1 bg-[#F4B400]" />

        {/* Coordinates Label (Optional technical detail) */}
        {!isHovering && (
            <motion.div 
                className="absolute top-2 left-4 text-[9px] font-mono text-[#F4B400] whitespace-nowrap opacity-60"
            >
                X: {Math.round(mouseX.get())} Y: {Math.round(mouseY.get())}
            </motion.div>
        )}
      </motion.div>
    </>
  );
}
