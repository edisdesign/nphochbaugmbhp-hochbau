import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface PartnersSectionProps {
  lang: string;
}

const PARTNERS = [
  "EMPORA CONSTRUCTION", "KÖGEL BAU", "JÖST BAUUNTERNEHMEN", "ALI BAU GMBH", "FERAMUZ ATIK"
];

export function PartnersSection({ lang }: PartnersSectionProps) {
  return (
    <section className="py-20 bg-white dark:bg-neutral-900 border-y border-black/5 dark:border-white/5 overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-3xl md:text-4xl font-['Oswald'] font-bold text-black dark:text-white uppercase tracking-tight transition-colors">
          {lang === 'DE' ? 'Unsere Partner' : lang === 'EN' ? 'Our Partners' : 'Naši Partneri'}
        </h2>
        <div className="w-24 h-1 bg-[#F4B400] mt-4" />
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-32">
          {/* First Loop */}
          {PARTNERS.map((partner, index) => (
            <span 
              key={`p1-${index}`} 
              className="text-4xl md:text-6xl font-['Oswald'] font-black text-transparent bg-clip-text bg-gradient-to-b from-black/20 to-black/5 dark:from-white/20 dark:to-white/5 uppercase tracking-tighter hover:text-[#F4B400] dark:hover:text-[#F4B400] transition-colors cursor-default"
            >
              {partner}
            </span>
          ))}
          {/* Second Loop for seamless effect */}
          {PARTNERS.map((partner, index) => (
            <span 
              key={`p2-${index}`} 
              className="text-4xl md:text-6xl font-['Oswald'] font-black text-transparent bg-clip-text bg-gradient-to-b from-black/20 to-black/5 dark:from-white/20 dark:to-white/5 uppercase tracking-tighter hover:text-[#F4B400] dark:hover:text-[#F4B400] transition-colors cursor-default"
            >
              {partner}
            </span>
          ))}
           {/* Third Loop for safety on wide screens */}
           {PARTNERS.map((partner, index) => (
            <span 
              key={`p3-${index}`} 
              className="text-4xl md:text-6xl font-['Oswald'] font-black text-transparent bg-clip-text bg-gradient-to-b from-black/20 to-black/5 dark:from-white/20 dark:to-white/5 uppercase tracking-tighter hover:text-[#F4B400] dark:hover:text-[#F4B400] transition-colors cursor-default"
            >
              {partner}
            </span>
          ))}
        </div>
        
        {/* Vignette effect */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white dark:from-neutral-900 to-transparent z-10 transition-colors duration-300" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white dark:from-neutral-900 to-transparent z-10 transition-colors duration-300" />
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}
