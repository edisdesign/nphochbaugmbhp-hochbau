import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Menu, X, Globe, Sun, Moon, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Import logos
import logoWhite from 'figma:asset/bc2e48b7921d8873d5b86d52150de03fe4507903.png';
import logoBlack from 'figma:asset/a2996f8a1380f2301030d05c784c4d8a5ea4cde4.png';

interface NavbarProps {
  lang: string;
  setLang: (lang: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export function Navbar({ lang, setLang, theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: { DE: 'Leistungen', EN: 'Services', BHS: 'Usluge' }, href: '#services' },
    { label: { DE: 'Warum wir?', EN: 'Why Us?', BHS: 'Zašto mi?' }, href: '#trust' },
    { label: { DE: 'Referenzen', EN: 'Projects', BHS: 'Projekti' }, href: '#projects' },
    { label: { DE: 'Karriere', EN: 'Careers', BHS: 'Karijera' }, href: '#careers' },
    { label: { DE: 'Kontakt', EN: 'Contact', BHS: 'Kontakt' }, href: '#contact' },
  ];

  const languages = [
    { code: 'DE', label: 'Deutsch' },
    { code: 'EN', label: 'English' },
    { code: 'BHS', label: 'B/H/S' }
  ];

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-black';
  const bgColor = isDark ? 'bg-[#1A1A1A]' : 'bg-white';
  const borderColor = isDark ? 'border-white/10' : 'border-black/10';

  return (
    <nav
      className={twMerge(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b backdrop-blur-md',
        scrolled ? `${bgColor}/90 py-4 shadow-lg ${borderColor}` : `bg-transparent py-6 ${isDark ? 'border-white/10' : 'border-black/5'}`,
        !scrolled && !isDark && 'bg-white/50' // Ensure visibility on light mode top
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img 
            src={isDark ? logoWhite : logoBlack} 
            alt="NP Hochbau GmbH" 
            className="h-16 md:h-20 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={clsx(
                "font-medium text-sm transition-colors uppercase tracking-widest font-['Inter'] hover:text-[#F4B400] relative group",
                isDark ? "text-white/80" : "text-black/70"
              )}
            >
              {link.label[lang as keyof typeof link.label]}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#F4B400] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          {/* Modern Lang Switcher */}
          <div className={clsx("relative pl-6 border-l", isDark ? "border-white/20" : "border-black/20")} ref={langMenuRef}>
            <button 
               onClick={() => setLangMenuOpen(!langMenuOpen)}
               className={clsx(
                  "flex items-center gap-2 text-xs font-['Inter'] font-bold uppercase tracking-wider py-1 px-2 rounded-sm transition-all hover:bg-white/5",
                  textColor
               )}
            >
               <Globe className="w-4 h-4 text-[#F4B400]" />
               <span>{lang}</span>
               <ChevronDown className={clsx("w-3 h-3 transition-transform", langMenuOpen ? "rotate-180" : "")} />
            </button>

            <AnimatePresence>
              {langMenuOpen && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className={clsx(
                       "absolute top-full right-0 mt-2 w-32 shadow-xl border rounded-sm overflow-hidden",
                       isDark ? "bg-[#222] border-white/10" : "bg-white border-black/10"
                    )}
                 >
                    {languages.map((l) => (
                       <button
                          key={l.code}
                          onClick={() => {
                             setLang(l.code);
                             setLangMenuOpen(false);
                          }}
                          className={clsx(
                             "w-full text-left px-4 py-3 text-xs font-['Inter'] uppercase tracking-wider flex items-center justify-between hover:bg-[#F4B400] hover:text-black transition-colors",
                             lang === l.code ? "text-[#F4B400] font-bold" : (isDark ? "text-white/70" : "text-black/70")
                          )}
                       >
                          <span>{l.label}</span>
                          {lang === l.code && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                       </button>
                    ))}
                 </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#F4B400]" />
            ) : (
              <Moon className="w-4 h-4 text-black" />
            )}
          </button>

          {/* CTA */}
          <a
            href="#contact"
            className="bg-[#F4B400] text-black font-['Oswald'] font-bold px-6 py-2 uppercase tracking-wide text-sm hover:bg-white transition-colors rounded-sm clip-path-slant"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}
          >
            {lang === 'DE' ? 'Anfrage' : lang === 'EN' ? 'Inquiry' : 'Upit'}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={clsx("md:hidden p-2", textColor)}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={clsx(
              "md:hidden absolute top-full left-0 right-0 border-b shadow-2xl overflow-hidden",
              isDark ? "bg-[#1A1A1A] border-white/10" : "bg-white border-black/10"
            )}
          >
            <div className="p-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "text-xl font-['Oswald'] uppercase tracking-wider hover:text-[#F4B400] flex items-center gap-4",
                    textColor
                  )}
                >
                  <span className="w-1 h-1 bg-[#F4B400] rounded-full" />
                  {link.label[lang as keyof typeof link.label]}
                </a>
              ))}
              
              <div className={clsx("h-px w-full my-2", isDark ? "bg-white/10" : "bg-black/10")} />

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <span className="text-xs text-[#F4B400] font-bold uppercase tracking-widest">
                      {lang === 'DE' ? 'Sprache' : lang === 'EN' ? 'Language' : 'Jezik'}
                    </span>
                    <div className="flex flex-col gap-2">
                      {languages.map((l) => (
                         <button 
                           key={l.code}
                           onClick={() => setLang(l.code)} 
                           className={clsx(
                              "text-sm font-['Inter'] text-left py-1", 
                              lang === l.code 
                                ? "text-[#F4B400] font-bold" 
                                : (isDark ? "text-gray-500" : "text-black/40")
                           )}
                         >
                           {l.label}
                         </button>
                      ))}
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-xs text-[#F4B400] font-bold uppercase tracking-widest">
                      {lang === 'DE' ? 'Ansicht' : lang === 'EN' ? 'Theme' : 'Tema'}
                    </span>
                    <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-gray-400">
                      {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
                      <span>{isDark 
                        ? (lang === 'DE' ? 'Heller Modus' : lang === 'EN' ? 'Light Mode' : 'Svijetli mod') 
                        : (lang === 'DE' ? 'Dunkler Modus' : lang === 'EN' ? 'Dark Mode' : 'Tamni mod')
                      }</span>
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar - Attached to bottom of Navbar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-[#F4B400] origin-left z-50"
        style={{ scaleX }}
      />
    </nav>
  );
}