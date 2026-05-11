import { motion } from 'motion/react';
import { ShieldCheck, Clock, Users, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { ConstructionGame } from '@/app/components/ConstructionGame';

interface TrustSectionProps {
  lang: string;
  theme: 'dark' | 'light';
}

export function TrustSection({ lang, theme }: TrustSectionProps) {

  const content = {
    DE: {
      headline: "WARUM NP HOCHBAU?",
      items: [
        {
          title: "HÖCHSTE QUALITÄT",
          desc: "Wir setzen auf erstklassige Materialien und präzise Verarbeitung für langlebige Ergebnisse.",
          icon: ShieldCheck
        },
        {
          title: "TERMINGERECHT",
          desc: "Zeit ist Geld. Wir garantieren die Einhaltung vereinbarter Fristen und effiziente Abläufe.",
          icon: Clock
        },
        {
          title: "ERFAHRENES TEAM",
          desc: "Unser Team besteht aus qualifizierten Fachkräften mit langjähriger Erfahrung im Hochbau.",
          icon: Users
        }
      ],
      ratingText: "Google Bewertungen"
    },
    EN: {
      headline: "WHY NP HOCHBAU?",
      items: [
        {
          title: "HIGHEST QUALITY",
          desc: "We rely on first-class materials and precise workmanship for long-lasting results.",
          icon: ShieldCheck
        },
        {
          title: "ON TIME",
          desc: "Time is money. We guarantee adherence to agreed deadlines and efficient processes.",
          icon: Clock
        },
        {
          title: "EXPERIENCED TEAM",
          desc: "Our team consists of qualified specialists with many years of experience in structural engineering.",
          icon: Users
        }
      ],
      ratingText: "Google Reviews"
    },
    BHS: {
      headline: "ZAŠTO NP HOCHBAU?",
      items: [
        {
          title: "VRHUNSKI KVALITET",
          desc: "Koristimo prvoklasne materijale i preciznu izradu za dugotrajne rezultate.",
          icon: ShieldCheck
        },
        {
          title: "POŠTIVANJE ROKOVA",
          desc: "Vrijeme je novac. Garantujemo poštivanje dogovorenih rokova i efikasne procese.",
          icon: Clock
        },
        {
          title: "ISKUSAN TIM",
          desc: "Naš tim čine kvalifikovani stručnjaci sa dugogodišnjim iskustvom u visokogradnji.",
          icon: Users
        }
      ],
      ratingText: "Google Recenzije"
    }
  };

  const t = content[lang as keyof typeof content];
  const isDark = theme === 'dark';

  return (
    <section id="trust" className={clsx("py-24 relative overflow-hidden transition-colors duration-300", isDark ? "bg-[#161616]" : "bg-gray-50")}>
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Features */}
          <div>
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className={clsx("font-['Oswald'] text-5xl md:text-6xl font-bold uppercase mb-12", isDark ? "text-white" : "text-black")}
             >
               {t.headline}
             </motion.h2>

             <div className="flex flex-col gap-10">
               {t.items.map((item, index) => (
                 <motion.div 
                   key={index}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                   className="flex gap-6"
                 >
                   <div className="w-12 h-12 bg-[#F4B400] flex items-center justify-center shrink-0 rounded-sm">
                      <item.icon className="w-6 h-6 text-black" />
                   </div>
                   <div>
                      <h3 className={clsx("font-['Oswald'] text-xl uppercase mb-2", isDark ? "text-white" : "text-black")}>
                        {item.title}
                      </h3>
                      <p className={clsx("font-['Inter'] leading-relaxed", isDark ? "text-white/60" : "text-black/60")}>
                        {item.desc}
                      </p>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>

          {/* Right: Review & Stats & GAME */}
          <div className="relative mt-12 lg:mt-0 flex flex-col gap-8">
             
             {/* Google Rating Badge */}
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               viewport={{ once: true }}
               className={clsx(
                 "p-8 border rounded-sm relative overflow-hidden",
                 isDark ? "bg-[#1E1E1E] border-white/10" : "bg-white border-black/10 shadow-lg"
               )}
             >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F4B400] opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center gap-4 mb-4">
                   <div className="flex gap-1 text-[#F4B400]">
                      <Star className="w-6 h-6 fill-current" />
                      <Star className="w-6 h-6 fill-current" />
                      <Star className="w-6 h-6 fill-current" />
                      <Star className="w-6 h-6 fill-current" />
                      <Star className="w-6 h-6 fill-current" />
                   </div>
                   <span className={clsx("font-['Oswald'] text-2xl font-bold", isDark ? "text-white" : "text-black")}>5.0</span>
                </div>
                <p className={clsx("font-['Inter'] font-medium uppercase tracking-wider text-sm", isDark ? "text-white/40" : "text-black/40")}>
                   {t.ratingText}
                </p>
             </motion.div>

             {/* GAME CONTAINER - Always Visible */}
             <div className="relative h-[400px] border border-white/10 shadow-2xl">
                <ConstructionGame theme={theme} lang={lang} />
             </div>

          </div>

        </div>

      </div>
    </section>
  );
}
