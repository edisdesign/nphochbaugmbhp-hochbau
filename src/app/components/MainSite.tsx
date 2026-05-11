import { useState, useEffect } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { Hero } from '@/app/components/Hero';
import { PartnersSection } from '@/app/components/PartnersSection';
import { Services } from '@/app/components/Services';
import { TrustSection } from '@/app/components/TrustSection';
import { ReviewsSection } from '@/app/components/ReviewsSection';
import { ProjectsGallery } from '@/app/components/ProjectsGallery';
import { Careers } from '@/app/components/Careers';
import { InstagramSection } from '@/app/components/InstagramSection';
import { Contact } from '@/app/components/Contact';
import { Footer } from '@/app/components/Footer';
import { CustomCursor } from '@/app/components/CustomCursor';
import { AnimatePresence, motion } from 'motion/react';
import { Preloader } from '@/app/components/Preloader';
import { Toaster } from 'sonner';

import exampleImage from '@/assets/29a5671d9dd7270c99e2c242d612819c002c4c53.png';

export function MainSite() {
  const [lang, setLang] = useState('DE');
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [loading, setLoading] = useState(true);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#1A1A1A';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#FFFFFF';
    }
  }, [theme]);

  useEffect(() => {
    console.log("Design Reference Loaded:", exampleImage);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      <Toaster position="top-right" richColors />

      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
        <CustomCursor />
        <Navbar lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
        
        <main>
          <Hero lang={lang} theme={theme} />
          <PartnersSection lang={lang} />
          <Services lang={lang} theme={theme} />
          <InstagramSection lang={lang} />
          <TrustSection lang={lang} theme={theme} />
          <ReviewsSection lang={lang} theme={theme} />
          <ProjectsGallery lang={lang} theme={theme} />
          <Careers lang={lang} theme={theme} />
          <Contact lang={lang} theme={theme} />
        </main>

        <Footer lang={lang} theme={theme} />
        
        {/* Mobile Floating WhatsApp Button */}
        <motion.a
          href="https://wa.me/4917643273765"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center md:hidden"
          aria-label="Contact via WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </motion.a>
      </div>
    </>
  );
}