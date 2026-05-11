import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { clsx } from 'clsx';

interface ReviewsSectionProps {
  lang: string;
  theme: 'dark' | 'light';
}

const REVIEWS = [
  {
    name: "Alessia Yesiltas",
    role: "Empora Construction GmbH",
    text: {
      DE: "Wahre Rohbau-Experten! Zuverlässig, geduldig und extrem fähig, für jede Situation auf der Baustelle sofort das passende Fachpersonal bereitzustellen.",
      EN: "True shell construction experts! Reliable, patient, and extremely capable of immediately providing the right skilled personnel for any situation on site.",
      BHS: "Pravi eksperti za roh-bau! Pouzdani, strpljivi i izuzetno sposobni da za svaku situaciju na gradilištu odmah pronađu odgovarajuće stručno osoblje."
    },
    stars: 5
  },
  {
    name: "Dozsa Lorant",
    role: "Geschäftsführer, Ali Bau GmbH",
    text: {
      DE: "Pünktlich, fair und ein starker Rückhalt für kleinere Partnerfirmen. Auf NP Hochbau ist immer Verlass – eine Zusammenarbeit auf Augenhöhe.",
      EN: "Punctual, fair, and a strong support for smaller partner companies. You can always rely on NP Hochbau – cooperation at eye level.",
      BHS: "Tačni, fer i pravi oslonac za manje firme. Na NP Hochbau se uvijek možemo osloniti – saradnja na vrhunskom nivou."
    },
    stars: 5
  },
  {
    name: "Feramuz Atik",
    role: "Inhaber, Feramuz Atik Eisenflechter",
    text: {
      DE: "Hervorragende Zusammenarbeit beim Projekt in Bochum. Ein Bauunternehmen mit Handschlagqualität, das unsere Arbeit als Eisenflechter wirklich wertschätzt.",
      EN: "Excellent cooperation on the project in Bochum. A construction company with integrity that truly values our work as steel fixers.",
      BHS: "Odlična saradnja na projektu u Bochumu. Firma od riječi koja istinski cijeni naš rad kao armirača. Preporuka za svakog ko traži poštenog partnera."
    },
    stars: 5
  }
];

export function ReviewsSection({ lang, theme }: ReviewsSectionProps) {
  const isDark = theme === 'dark';

  return (
    <section className={clsx("py-24 relative overflow-hidden", isDark ? "bg-[#111]" : "bg-gray-50")}>
      {/* Background Icon */}
      <Quote className={clsx("absolute top-10 left-10 w-64 h-64 opacity-5 rotate-12", isDark ? "text-white" : "text-black")} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#F4B400] text-[#F4B400]" />)}
                 </div>
                 <span className={clsx("font-bold text-sm", isDark ? "text-white/60" : "text-black/60")}>
                    5.0 {lang === 'DE' ? 'Google Bewertung' : lang === 'EN' ? 'Google Rating' : 'Google Ocjena'}
                 </span>
              </div>
              <h2 className={clsx("text-4xl md:text-5xl font-['Oswald'] font-bold uppercase leading-none", isDark ? "text-white" : "text-black")}>
                 {lang === 'DE' ? 'Kundenstimmen' : lang === 'EN' ? 'Client Reviews' : 'Riječ Klijenata'}
              </h2>
           </div>
           
           <div className="w-24 h-1 bg-[#F4B400]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={clsx(
                "p-8 border-l-4 relative group hover:-translate-y-2 transition-transform duration-300",
                isDark 
                  ? "bg-[#1A1A1A] border-[#F4B400] hover:bg-[#222]" 
                  : "bg-white border-[#F4B400] shadow-lg hover:shadow-xl"
              )}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(review.stars)].map((_, s) => (
                  <Star key={s} className="w-5 h-5 fill-[#F4B400] text-[#F4B400]" />
                ))}
              </div>

              <p className={clsx("font-['Inter'] text-lg italic mb-8 leading-relaxed", isDark ? "text-white/80" : "text-black/80")}>
                "{review.text[lang as keyof typeof review.text]}"
              </p>

              <div className="mt-auto">
                <p className={clsx("font-['Oswald'] font-bold uppercase tracking-wider text-lg", isDark ? "text-white" : "text-black")}>
                  {review.name}
                </p>
                <p className={clsx("text-sm font-['Inter']", isDark ? "text-white/40" : "text-black/40")}>
                  {review.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}