import { motion } from 'motion/react';
import { Building2, Factory, Home, Landmark, Hammer, RefreshCw, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

interface ServicesProps {
  lang: string;
  theme: 'dark' | 'light';
}

export function Services({ lang, theme }: ServicesProps) {
  const content = {
    DE: {
      headline: "UNSERE LEISTUNGEN",
      subheadline: "Umfassende Baulösungen für Frankfurt und Umgebung.",
      services: [
        {
          id: "01",
          title: "GEWERBEBAU",
          desc: "Ob Bürokomplexe oder Einzelhandelsflächen – wir realisieren funktionale und repräsentative Gewerbeimmobilien.",
          icon: Building2
        },
        {
          id: "02",
          title: "INDUSTRIEBAU",
          desc: "Hallen, Lagerflächen und Produktionsstätten. Robuste Bauweise für maximale Effizienz und Langlebigkeit.",
          icon: Factory
        },
        {
          id: "03",
          title: "WOHNUNGSBAU",
          desc: "Vom Einfamilienhaus bis zum Mehrfamilienkomplex. Moderner Wohnraum nach höchsten Standards.",
          icon: Home
        },
        {
          id: "04",
          title: "ÖFFENTLICHER BAU",
          desc: "Schulen, Kindergärten und öffentliche Einrichtungen. Verantwortungsvolles Bauen für die Gemeinschaft.",
          icon: Landmark
        },
        {
          id: "05",
          title: "ERWEITERTER ROHBAU",
          desc: "Das fundamentale Gerüst Ihres Projekts. Beton-, Maurer- und Stahlbetonarbeiten in Präzision.",
          icon: Hammer
        },
        {
          id: "06",
          title: "SANIERUNG & UMBAU",
          desc: "Bestandserhaltung und Modernisierung. Wir machen alte Bausubstanz fit für die Zukunft.",
          icon: RefreshCw
        }
      ],
      cta: "ALLE LEISTUNGEN ANSEHEN"
    },
    EN: {
      headline: "OUR SERVICES",
      subheadline: "Comprehensive construction solutions for Frankfurt and surroundings.",
      services: [
        { id: "01", title: "COMMERCIAL", desc: "Office complexes or retail spaces – we realize functional and representative commercial properties.", icon: Building2 },
        { id: "02", title: "INDUSTRIAL", desc: "Halls, warehouses, and production sites. Robust construction for maximum efficiency.", icon: Factory },
        { id: "03", title: "RESIDENTIAL", desc: "From single-family homes to apartment complexes. Modern living space to the highest standards.", icon: Home },
        { id: "04", title: "PUBLIC BUILDINGS", desc: "Schools, kindergartens, and public facilities. Responsible building for the community.", icon: Landmark },
        { id: "05", title: "EXTENDED SHELL", desc: "The fundamental framework of your project. Concrete, masonry, and reinforced concrete work.", icon: Hammer },
        { id: "06", title: "RENOVATION", desc: "Preservation and modernization. We make old building fabric fit for the future.", icon: RefreshCw }
      ],
      cta: "VIEW ALL SERVICES"
    },
    BHS: {
      headline: "NAŠE USLUGE",
      subheadline: "Sveobuhvatna građevinska rješenja za Frankfurt i okolinu.",
      services: [
        { id: "01", title: "KOMERCIJALNA GRADNJA", desc: "Bilo da se radi o uredima ili maloprodajnim prostorima – realizujemo funkcionalne objekte.", icon: Building2 },
        { id: "02", title: "INDUSTRIJSKA GRADNJA", desc: "Hale, skladišta i proizvodni pogoni. Čvrsta gradnja za maksimalnu efikasnost i dugotrajnost.", icon: Factory },
        { id: "03", title: "STAMBENA GRADNJA", desc: "Od porodičnih kuća do stambenih kompleksa. Moderan životni prostor po najvišim standardima.", icon: Home },
        { id: "04", title: "JAVNI OBJEKTI", desc: "Škole, vrtići i javne ustanove. Odgovorna gradnja za zajednicu i buduće generacije.", icon: Landmark },
        { id: "05", title: "ROH-BAU", desc: "Temeljni okvir vašeg projekta. Betonski, zidarski i armirano-betonski radovi.", icon: Hammer },
        { id: "06", title: "SANACIJA & ADAPTACIJA", desc: "Očuvanje i modernizacija. Činimo stare objekte spremnim za budućnost.", icon: RefreshCw }
      ],
      cta: "POGLEDAJ SVE USLUGE"
    }
  };

  const t = content[lang as keyof typeof content];
  const isDark = theme === 'dark';
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className={clsx("py-32 relative transition-colors duration-300 overflow-hidden", isDark ? "bg-[#1A1A1A]" : "bg-white")}>
      
      {/* CAD Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
          backgroundImage: `linear-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }} />

      {/* Background massive stroke text for atmosphere */}
      <div className="absolute top-20 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
        <h1 className="text-[20vw] leading-none font-['Oswald'] font-bold text-white whitespace-nowrap">
          CONSTRUCTION
        </h1>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#F4B400] font-['Oswald'] tracking-widest uppercase font-bold text-sm block mb-4"
            >
               / {lang === 'DE' ? 'Leistungen' : lang === 'EN' ? 'Services' : 'Usluge'}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={clsx("font-['Oswald'] text-6xl md:text-8xl font-bold uppercase leading-[0.9]", isDark ? "text-white" : "text-black")}
            >
              {t.headline}
            </motion.h2>
          </div>
          
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 }}
             className={clsx("max-w-md font-['Inter'] text-lg leading-relaxed border-l-2 pl-6", isDark ? "border-[#F4B400] text-white/60" : "border-black text-black/60")}
          >
             {t.subheadline}
          </motion.div>
        </div>

        {/* Sexy Interactive List Layout */}
        <div className="flex flex-col">
          {t.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
              className={clsx(
                "group relative border-t py-12 md:py-16 transition-all duration-500 cursor-pointer overflow-hidden",
                isDark ? "border-white/10 hover:border-white/0" : "border-black/10 hover:border-black/0"
              )}
            >
              {/* Hover Background */}
              <div 
                className={clsx(
                  "absolute inset-0 bg-[#F4B400] transform origin-left transition-transform duration-500 ease-out z-0",
                  hoveredIndex === index ? "scale-x-100" : "scale-x-0"
                )}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:px-8">
                
                {/* ID Number */}
                <span className={clsx(
                  "font-['Oswald'] text-4xl md:text-6xl font-bold opacity-30 group-hover:opacity-100 transition-opacity duration-300",
                  hoveredIndex === index ? "text-black" : (isDark ? "text-white" : "text-black")
                )}>
                  {service.id}
                </span>

                {/* Title */}
                <div className="flex-1">
                  <h3 className={clsx(
                    "font-['Oswald'] text-4xl md:text-5xl lg:text-6xl font-bold uppercase transition-transform duration-500 group-hover:translate-x-4",
                    hoveredIndex === index ? "text-black" : (isDark ? "text-white" : "text-black")
                  )}>
                    {service.title}
                  </h3>
                </div>

                {/* Description (Reveal on desktop, visible on mobile click) */}
                <div className="md:w-1/3 overflow-hidden">
                  {/* Desktop Version */}
                  <p className={clsx(
                    "hidden md:block font-['Inter'] text-lg leading-relaxed transition-all duration-500 md:translate-y-full md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                    hoveredIndex === index ? "text-black/80" : "text-transparent"
                  )}>
                    {service.desc}
                  </p>
                  
                  {/* Mobile Version - Accordion Style */}
                  <motion.div 
                    initial={false}
                    animate={{ 
                        height: hoveredIndex === index ? 'auto' : 0,
                        opacity: hoveredIndex === index ? 1 : 0
                    }}
                    className="md:hidden overflow-hidden"
                  >
                      <p className={clsx(
                          "pt-4 font-['Inter'] text-base", 
                          hoveredIndex === index ? "text-black/80" : (isDark ? "text-white/60" : "text-black/60")
                      )}>
                         {service.desc}
                      </p>
                  </motion.div>
                </div>

                {/* Arrow Icon */}
                <div className={clsx(
                   "w-12 h-12 border rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-45 group-hover:border-black",
                   hoveredIndex === index ? "border-black text-black" : (isDark ? "border-white/20 text-white" : "border-black/20 text-black")
                )}>
                   <ArrowUpRight className="w-6 h-6" />
                </div>

              </div>

            </motion.div>
          ))}
           {/* Final Border */}
           <div className={clsx("border-t", isDark ? "border-white/10" : "border-black/10")} />
        </div>

      </div>
    </section>
  );
}