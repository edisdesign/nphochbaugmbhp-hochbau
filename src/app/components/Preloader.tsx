import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('INITIALIZING SYSTEM...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 150);

    const textTimer = setInterval(() => {
      const texts = [
        'LOADING ASSETS...',
        'CALIBRATING GEOMETRY...',
        'ESTABLISHING CONNECTION...',
        'RENDERING VIEWPORT...'
      ];
      setText(texts[Math.floor(Math.random() * texts.length)]);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center font-['Inter']"
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-64 md:w-96">
        <div className="flex justify-between text-[#F4B400] text-xs font-mono mb-2 uppercase tracking-widest">
          <span>{text}</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-1 w-full bg-[#1A1A1A] relative overflow-hidden">
          <motion.div 
            className="h-full bg-[#F4B400]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Decorative Tech Lines */}
        <div className="mt-4 flex justify-between opacity-30">
           <div className="h-2 w-2 border-l border-b border-[#F4B400]" />
           <div className="h-2 w-2 border-r border-b border-[#F4B400]" />
        </div>
      </div>
    </motion.div>
  );
}
