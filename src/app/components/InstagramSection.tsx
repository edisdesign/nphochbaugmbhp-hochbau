import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import type { GalleryPhoto } from '@/app/lib/dataStore';

interface InstagramSectionProps {
  lang: string;
}

const CYCLE_MS = 4000;

export function InstagramSection({ lang }: InstagramSectionProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Load from PocketBase
  useEffect(() => {
    const load = async () => {
      try {
        const { getGalleryFromPB } = await import('@/app/lib/dataStore');
        const g = await getGalleryFromPB();
        setPhotos(g.filter(p => p.src)); // only with images
      } catch {
        // silent
      }
    };
    load();
    const handleUpdate = () => { load(); };
    window.addEventListener('np-data-updated', handleUpdate);
    return () => window.removeEventListener('np-data-updated', handleUpdate);
  }, []);

  // Auto-cycle
  const next = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrent(prev => (prev + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const timer = setInterval(next, CYCLE_MS);
    return () => clearInterval(timer);
  }, [paused, next, photos.length]);

  // Reset index if photos change
  useEffect(() => {
    setCurrent(0);
  }, [photos.length]);

  const content = {
    DE: {
      headline: 'AKTUELLE EINBLICKE',
      subtitle: 'Momentaufnahmen unserer Baustellen',
      onSite: 'NP HOCHBAU GMBH ON SITE',
    },
    EN: {
      headline: 'CURRENT INSIGHTS',
      subtitle: 'Snapshots from our construction sites',
      onSite: 'NP HOCHBAU GMBH ON SITE',
    },
    BHS: {
      headline: 'AKTUELNI UVIDI',
      subtitle: 'Momentalni snimci sa naših gradilišta',
      onSite: 'NP HOCHBAU GMBH NA TERENU',
    },
  };

  const t = content[lang as keyof typeof content] || content.DE;

  if (photos.length === 0) return null;

  const photo = photos[current];
  if (!photo) return null;

  const displayName = photo.baustelle || photo.caption || '';
  const displayLocation = photo.location || t.onSite;
  const categoryLabel = photo.category === 'GEWERBEBAU'
    ? (lang === 'EN' ? 'COMMERCIAL' : lang === 'BHS' ? 'KOMERCIJALNI' : 'GEWERBEBAU')
    : photo.category === 'WOHNBAU'
    ? (lang === 'EN' ? 'RESIDENTIAL' : lang === 'BHS' ? 'STAMBENI' : 'WOHNBAU')
    : '';

  return (
    <section className="py-20 bg-[#1A1A1A] relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-['Oswald'] font-bold uppercase text-white leading-none">
              {t.headline}
            </h2>
            <p className="mt-2 text-sm font-['Inter'] text-white/40 uppercase tracking-wider">
              {t.subtitle}
            </p>
          </div>

          {/* Dot indicators */}
          {photos.length > 1 && (
            <div className="flex items-center gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPaused(true); setTimeout(() => setPaused(false), 6000); }}
                  className={clsx(
                    'h-1 rounded-full transition-all duration-500',
                    i === current
                      ? 'w-6 bg-[#F4B400]'
                      : 'w-1.5 bg-white/20 hover:bg-white/40'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Main image area */}
        <div
          className="relative w-full aspect-[16/8] md:aspect-[16/7] overflow-hidden cursor-pointer"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onClick={next}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={photo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={photo.src}
                alt={displayName}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Content overlay — always visible, not animated with image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={photo.id + '-text'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Category badge */}
                {categoryLabel && (
                  <span className="inline-block bg-[#F4B400] text-black font-['Inter'] font-bold text-[11px] tracking-widest uppercase px-3 py-1 mb-3">
                    {categoryLabel}
                  </span>
                )}

                {/* Project name */}
                {displayName && (
                  <h3 className="font-['Oswald'] text-2xl md:text-4xl lg:text-5xl font-bold uppercase text-white leading-[1.05] max-w-2xl">
                    {displayName}
                  </h3>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 mt-3">
                  <MapPin className="w-4 h-4 text-[#F4B400]" />
                  <span className="font-['Inter'] text-white/60 text-xs md:text-sm uppercase tracking-wider">
                    {displayLocation}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar at bottom */}
          {photos.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20">
              <motion.div
                key={current}
                className="h-full bg-[#F4B400]"
                initial={{ width: '0%' }}
                animate={{ width: paused ? undefined : '100%' }}
                transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
