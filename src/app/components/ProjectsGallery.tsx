import { useState, useEffect } from 'react';
import type { SiteProject } from '@/app/lib/dataStore';
import { motion, AnimatePresence } from 'motion/react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { clsx } from 'clsx';
import { X, ArrowUpRight, Hammer, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  id: number;
  category: 'GEWERBEBAU' | 'WOHNBAU';
  image: string;
  title: string;
  location: string;
  gallery: string[];
  description: {
    DE: string;
    EN: string;
    BHS: string;
  };
  details?: {
      year: string;
      partner?: string;
  }
}

interface ProjectsGalleryProps {
  lang: string;
  theme: 'dark' | 'light';
}

export function ProjectsGallery({ lang, theme }: ProjectsGalleryProps) {
  const [filter, setFilter] = useState<'ALL' | 'WOHNBAU' | 'GEWERBEBAU'>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [adminProjects, setAdminProjects] = useState<SiteProject[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<{id: string; src: string; caption: string}[]>([]);

  // Load admin-added projects from PocketBase
  useEffect(() => {
    const load = async () => {
      try {
        const { getProjectsFromPB, getGalleryFromPB } = await import('@/app/lib/dataStore');
        const [p, g] = await Promise.all([getProjectsFromPB(), getGalleryFromPB()]);
        setAdminProjects(p);
        setGalleryPhotos(g);
      } catch {
        // silent fail - hardcoded projects still show
      }
    };
    load();
    const handleUpdate = () => { load(); };
    window.addEventListener('np-data-updated', handleUpdate);
    return () => {
      window.removeEventListener('np-data-updated', handleUpdate);
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      setActiveImageIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const content = {
    DE: {
      headline: "AKTUELLE PROJEKTE",
      filters: { ALL: "ALLE", WOHNBAU: "WOHNBAU", GEWERBEBAU: "GEWERBEBAU" },
      cta_title: "Haben Sie ein ähnliches Projekt?",
      cta_text: "Wir sind Ihr verlässlicher Partner für Rohbau und Hochbau.",
      cta_button: "KONTAKT AUFNEHMEN"
    },
    EN: {
      headline: "LATEST PROJECTS",
      filters: { ALL: "ALL", WOHNBAU: "RESIDENTIAL", GEWERBEBAU: "COMMERCIAL" },
      cta_title: "Planning a similar project?",
      cta_text: "We are your reliable partner for structural and high-rise construction.",
      cta_button: "GET IN TOUCH"
    },
    BHS: {
      headline: "AKTUELNI PROJEKTI",
      filters: { ALL: "SVE", WOHNBAU: "STAMBENI", GEWERBEBAU: "KOMERCIJALNI" },
      cta_title: "Imate li sličan projekat na umu?",
      cta_text: "Mi smo vaš pouzdan izvođač za sve vrste grubih radova.",
      cta_button: "KONTAKTIRAJTE NAS"
    }
  };

  const t = content[lang as keyof typeof content];
  const isDark = theme === 'dark';

  const projects: Project[] = [
    // Admin-added projects first (from PocketBase)
    ...adminProjects.map((p, idx) => ({
      id: 100 + idx,
      category: p.category,
      image: p.image,
      title: p.title,
      location: p.location,
      gallery: p.gallery,
      description: p.description,
      details: p.details,
    } as Project)),
  ];

  const filteredProjects = filter === 'ALL' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className={clsx("py-24 transition-colors duration-300 relative", isDark ? "bg-[#1A1A1A]" : "bg-[#F5F5F5]")}>
      
      {/* Background Noise/Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
           backgroundImage: `linear-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
           backgroundSize: '40px 40px'
       }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
           <motion.h2 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className={clsx("font-['Oswald'] text-5xl md:text-7xl font-bold uppercase transition-colors leading-none", isDark ? "text-white" : "text-black")}
           >
             {t.headline}
           </motion.h2>

           <div className="flex gap-4 mt-8 md:mt-0 flex-wrap">
              {(Object.keys(t.filters) as Array<keyof typeof t.filters>).map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={clsx(
                    "px-4 py-2 font-['Inter'] text-sm font-bold uppercase tracking-widest transition-all duration-300 border",
                    filter === key 
                      ? 'bg-[#F4B400] text-black border-[#F4B400]' 
                      : isDark 
                        ? 'bg-transparent text-white/50 hover:text-white border-white/10 hover:border-white/30' 
                        : 'bg-transparent text-black/50 hover:text-black border-black/10 hover:border-black/30'
                  )}
                >
                  {t.filters[key]}
                </button>
              ))}
           </div>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 900: 2}}>
          <Masonry gutter="24px">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(project)}
                className={clsx(
                    "group relative overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500", 
                    isDark ? "bg-[#222]" : "bg-white"
                )}
              >
                <div className="aspect-[4/5] w-full overflow-hidden">
                   <ImageWithFallback
                     src={project.image}
                     alt={project.title}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                   />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                <div className="absolute top-4 right-4 bg-[#F4B400] text-black p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                    <ArrowUpRight className="w-5 h-5" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                   <div className="text-[#F4B400] text-xs font-['Inter'] font-bold uppercase tracking-widest mb-2">
                     {project.category}
                   </div>
                   <h3 className="text-white font-['Oswald'] text-2xl font-bold uppercase mb-1">{project.title}</h3>
                   <div className="flex items-center gap-2 text-white/60 text-sm font-['Inter']">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                   </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>

      </div>

      {/* PROJECT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
            
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-white dark:bg-[#111] w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
            >
                <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 z-50 p-3 bg-black/20 hover:bg-[#F4B400] hover:text-black text-white backdrop-blur-md rounded-full transition-all duration-300"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Side: Images */}
                <div className="w-full md:w-3/5 bg-gray-100 dark:bg-black relative overflow-hidden flex flex-col">
                    {/* All images array: main + gallery */}
                    {(() => {
                      const allImages = [selectedProject.image, ...selectedProject.gallery];
                      return (
                        <>
                          {/* Main Image with Navigation */}
                          <div className="h-[40vh] md:flex-1 w-full relative group/nav">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                              >
                                <ImageWithFallback 
                                  src={allImages[activeImageIndex]} 
                                  alt={`${selectedProject.title} - ${activeImageIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden" />
                            <div className="absolute bottom-6 left-6 md:hidden">
                              <div className="text-[#F4B400] font-bold text-sm tracking-widest mb-1">{selectedProject.category}</div>
                              <h2 className="text-white text-4xl font-['Oswald'] font-bold uppercase">{selectedProject.title}</h2>
                            </div>

                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1); }}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-[#F4B400] text-white hover:text-black backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/nav:opacity-100"
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1); }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-[#F4B400] text-white hover:text-black backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/nav:opacity-100"
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </button>

                                {/* Image Counter */}
                                <div className="absolute bottom-3 right-3 z-20 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-['Oswald'] tracking-wider">
                                  {activeImageIndex + 1} / {allImages.length}
                                </div>
                              </>
                            )}
                          </div>
                     
                          {/* Scrollable Thumbnail Strip */}
                          {allImages.length > 1 && (
                            <div className="h-[80px] md:h-[100px] shrink-0 bg-white dark:bg-black border-t border-black/10 dark:border-white/10">
                              <div className="flex h-full overflow-x-auto gap-1 p-1 scrollbar-thin">
                                {allImages.map((img, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={clsx(
                                      "relative h-full aspect-[4/3] shrink-0 overflow-hidden transition-all duration-300",
                                      activeImageIndex === idx 
                                        ? "ring-2 ring-[#F4B400] opacity-100" 
                                        : "opacity-50 hover:opacity-80"
                                    )}
                                  >
                                    <ImageWithFallback 
                                      src={img} 
                                      alt={`Thumbnail ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col md:overflow-y-auto shrink-0">
                    
                    <div className="hidden md:block mb-8">
                        <div className="text-[#F4B400] font-['Oswald'] font-bold tracking-widest mb-2">
                             / {selectedProject.category}
                        </div>
                        <h2 className={clsx("text-4xl lg:text-5xl font-['Oswald'] font-bold uppercase leading-none mb-4", isDark ? "text-white" : "text-black")}>
                            {selectedProject.title}
                        </h2>
                        <div className={clsx("flex items-center gap-2 text-lg", isDark ? "text-white/60" : "text-black/60")}>
                            <MapPin className="w-5 h-5 text-[#F4B400]" />
                            {selectedProject.location}
                        </div>
                    </div>

                    <div className={clsx("h-px w-20 mb-8", isDark ? "bg-white/20" : "bg-black/20")} />

                    {/* Meta Details */}
                    {selectedProject.details && (
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <div className={clsx("text-xs font-bold uppercase tracking-widest mb-1", isDark ? "text-white/40" : "text-black/40")}>
                                  {lang === 'DE' ? 'Jahr' : lang === 'EN' ? 'Year' : 'Godina'}
                                </div>
                                <div className={clsx("font-['Oswald'] text-lg", isDark ? "text-white" : "text-black")}>{selectedProject.details.year}</div>
                            </div>
                            {selectedProject.details.partner && (
                                <div>
                                    <div className={clsx("text-xs font-bold uppercase tracking-widest mb-1", isDark ? "text-white/40" : "text-black/40")}>
                                      {lang === 'DE' ? 'Partner' : lang === 'EN' ? 'Partner' : 'Partner'}
                                    </div>
                                    <div className={clsx("font-['Oswald'] text-lg", isDark ? "text-white" : "text-black")}>{selectedProject.details.partner}</div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={clsx("prose max-w-none font-['Inter'] leading-relaxed mb-12", isDark ? "text-white/80" : "text-black/80")}>
                        <p>{selectedProject.description[lang as keyof typeof selectedProject.description]}</p>
                    </div>

                    {/* CTA Box */}
                    <div className="mt-12 bg-[#F4B400] p-8 md:p-10 text-black relative group rounded-sm">
                        <div className="relative z-20 flex flex-col items-start">
                            <h4 className="font-['Oswald'] font-bold text-2xl uppercase mb-3 leading-tight">
                                {t.cta_title}
                            </h4>
                            <p className="font-['Inter'] mb-6 text-black/90 max-w-[90%] leading-relaxed">
                                {t.cta_text}
                            </p>
                            <a 
                                href="#contact-form" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedProject(null);
                                    setTimeout(() => {
                                        const contactSection = document.getElementById('contact-form');
                                        if (contactSection) {
                                            contactSection.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            window.location.href = "mailto:nphochbau@gmail.com";
                                        }
                                    }, 100);
                                }}
                                className="inline-flex items-center gap-3 font-bold uppercase tracking-wider border-b-2 border-black pb-1 hover:pl-2 transition-all cursor-pointer text-black"
                            >
                                <span>{t.cta_button}</span>
                                <ArrowUpRight className="w-5 h-5" />
                            </a>
                        </div>
                        
                        {/* Decorative pattern */}
                        <div className="absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden pointer-events-none z-10">
                            <div className="absolute top-[-20px] right-[-20px] opacity-10 transform rotate-[-12deg]">
                                <Hammer className="w-32 h-32" />
                            </div>
                        </div>
                    </div>

                </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}