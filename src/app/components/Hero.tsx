import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useRef } from 'react';
import { clsx } from 'clsx';

interface HeroProps {
  lang: string;
  theme: 'dark' | 'light';
}

export function Hero({ lang, theme }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const isDark = theme === 'dark';
  
  // Vertical Parallax
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring for mouse parallax
  const springConfig = { damping: 30, stiffness: 200 };
  const moveX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), springConfig);
  const moveY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX / width) - 0.5;
    const yPct = (clientY / height) - 0.5;
    
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const content = {
    DE: {
      headline: "STARKE TEAMS. STARKE LEISTUNG.",
      subheadline: "Ihr Spezialist für Rohbau & Hochbau in Deutschland.",
      cta: "Projekt Anfragen",
      experience: "MITARBEITER",
      scroll: "SCROLLEN"
    },
    EN: {
      headline: "STRONG TEAMS. STRONG PERFORMANCE.",
      subheadline: "Your specialist for structural & building construction in Germany.",
      cta: "Request Project",
      experience: "EMPLOYEES",
      scroll: "SCROLL"
    },
    BHS: {
      headline: "SNAŽNI TIMOVI. SNAŽNA IZVEDBA.",
      subheadline: "Vaš specijalista za grubi rad i visokogradnju u Njemačkoj.",
      cta: "Zatražite Ponudu",
      experience: "ZAPOSLENIH",
      scroll: "SCROLL"
    }
  };

  const t = content[lang as keyof typeof content];

  // Text Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={clsx(
        "relative h-screen w-full overflow-hidden flex items-center justify-center perspective-1000 transition-colors duration-500",
        isDark ? "bg-[#0A0A0A]" : "bg-[#F0F0F0]"
      )}
    >
      {/* Parallax Background Image */}
      <motion.div 
        style={{ y, x: moveX, translateY: moveY, opacity }}
        className="absolute inset-0 z-0 scale-110 will-change-transform"
      >
        <ImageWithFallback
          src={isDark 
            ? "https://images.unsplash.com/photo-1764512179337-08f5f11aa769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwY29uc3RydWN0aW9uJTIwc2l0ZSUyMG5pZ2h0JTIwY3JhbmUlMjBjb25jcmV0ZXxlbnwxfHx8fDE3Njk3NTcwNTN8MA&ixlib=rb-4.1.0&q=80&w=1920"
            : "https://images.unsplash.com/photo-1733471754436-a7b293256c43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNvbmNyZXRlJTIwbWluaW1hbCUyMGFyY2hpdGVjdHVyZSUyMGJyaWdodCUyMGNvbnN0cnVjdGlvbnxlbnwxfHx8fDE3Njk5ODU1NzN8MA&ixlib=rb-4.1.0&q=80&w=1920"
          }
          alt="Construction Site"
          className={clsx(
            "w-full h-full object-cover transition-all duration-700",
            isDark 
                ? "grayscale brightness-75 hover:brightness-100 hover:grayscale-0" 
                : "grayscale-0 brightness-110 opacity-90"
          )}
        />
        {/* Overlays for texture */}
        <div className={clsx(
            "absolute inset-0 transition-colors duration-500",
            isDark 
                ? "bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-black/20" 
                : "bg-gradient-to-t from-white via-white/40 to-white/10"
        )} />
        
        {/* Noise/Grain Overlay */}
        <div className={clsx("absolute inset-0 pointer-events-none mix-blend-overlay", isDark ? "opacity-20" : "opacity-10")}
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
               filter: 'contrast(120%) brightness(100%)'
             }}
        />
        
        {/* Dynamic Spotlight Effect */}
        <motion.div 
           className="absolute inset-0 pointer-events-none"
           style={{
             background: `radial-gradient(circle at ${50 + mouseX.get() * 20}% ${50 + mouseY.get() * 20}%, transparent 10%, ${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)'} 50%)`
           }}
        />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-5xl">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-[#F4B400] text-black px-4 py-1 font-['Inter'] font-bold text-xs tracking-[0.2em] uppercase mb-8 shadow-[4px_4px_0_rgba(0,0,0,0.5)] cursor-hover hover:translate-x-1 transition-transform">
              <span className="w-2 h-2 bg-black animate-pulse" />
              NP Hochbau GmbH
            </div>
          </motion.div>

          {/* Staggered Headline Animation */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 overflow-hidden"
          >
            {t.headline.split('.').map((part, i) => (
               part.trim() && (
                 <div key={i} className="overflow-hidden mb-2">
                   <motion.h1 
                      variants={itemVariants}
                      className={clsx(
                        "font-['Oswald'] text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.9] tracking-tight cursor-hover select-none transition-colors duration-300 mix-blend-difference",
                         isDark ? "text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-white hover:to-[#ccc]" : "text-black hover:text-[#333]"
                      )}
                   >
                     {part}.
                   </motion.h1>
                 </div>
               )
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className={clsx(
                "font-['Inter'] text-lg md:text-xl font-light tracking-wide max-w-2xl mb-12 border-l-4 border-[#F4B400] pl-6 py-2 transition-colors duration-300",
                isDark ? "text-white/80 backdrop-blur-sm bg-black/10" : "text-black/80 backdrop-blur-sm bg-white/10"
            )}
          >
            {t.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-8 items-start sm:items-center"
          >
            <a
              href="#contact"
              className={clsx(
                "group cursor-hover relative bg-transparent border-2 border-[#F4B400] text-[#F4B400] overflow-hidden px-8 py-4 font-['Oswald'] text-lg font-bold uppercase tracking-widest transition-all",
                isDark ? "hover:text-black" : "hover:text-white"
              )}
            >
              <div className={clsx("absolute inset-0 bg-[#F4B400] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out")} />
              <div className="relative flex items-center gap-3">
                {t.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </a>

            <div className="flex items-center gap-4 cursor-hover group">
              <span className={clsx(
                "text-5xl font-['Oswald'] font-bold text-transparent bg-clip-text bg-gradient-to-b transition-all",
                isDark 
                    ? "from-white to-gray-500 group-hover:from-[#F4B400] group-hover:to-[#F4B400]" 
                    : "from-black to-gray-500 group-hover:from-[#F4B400] group-hover:to-[#F4B400]"
              )}>
                20+
              </span>
              <span className={clsx(
                "text-xs tracking-widest uppercase max-w-[80px] leading-tight border-l pl-3 transition-colors duration-300",
                isDark ? "text-white/60 border-white/20" : "text-black/60 border-black/20"
              )}>
                {t.experience}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className={clsx("text-[10px] uppercase tracking-[0.3em] font-['Oswald'] transition-colors", isDark ? "text-white/40" : "text-black/40")}>
            {t.scroll}
        </span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-[#F4B400]" />
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className={clsx("absolute top-0 right-0 w-[40vw] h-full border-l pointer-events-none hidden lg:block", isDark ? "border-white/5" : "border-black/5")} />
      <div className={clsx("absolute bottom-0 left-0 w-full h-[30vh] border-t pointer-events-none hidden lg:block", isDark ? "border-white/5" : "border-black/5")} />
      
      {/* Floating Plus Marks */}
      <div className="absolute top-1/4 right-1/4 text-[#F4B400]/20 text-4xl font-thin pointer-events-none select-none">+</div>
      <div className="absolute bottom-1/3 left-10 text-[#F4B400]/20 text-4xl font-thin pointer-events-none select-none">+</div>

    </section>
  );
}
