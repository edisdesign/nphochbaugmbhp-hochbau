import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LegalModal } from '@/app/components/LegalModals';

// Import logos
import logoWhite from '@/assets/bc2e48b7921d8873d5b86d52150de03fe4507903.png';

interface FooterProps {
  lang: string;
  theme: 'dark' | 'light';
}

export function Footer({ lang, theme }: FooterProps) {
  const [modalType, setModalType] = useState<'impressum' | 'privacy' | null>(null);
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className={clsx(
          "pt-20 pb-10 border-t transition-colors duration-300",
          isDark ? "bg-[#111] text-white border-white/10" : "bg-[#F5F5F5] text-black border-black/10"
      )}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img 
                  src={logoWhite} 
                  alt="NP Hochbau GmbH" 
                  className={clsx(
                      "h-16 w-auto object-contain opacity-90 transition-all duration-300",
                      isDark ? "invert-0" : "invert"
                  )}
                />
              </a>
              <p className={clsx(
                  "text-sm font-['Inter'] leading-relaxed transition-colors",
                  isDark ? "text-white/60" : "text-black/60"
              )}>
                {lang === 'DE' 
                  ? 'Ihr Partner für Hochbau, Rohbau und Sanierung. Qualität und Präzision seit über 20 Jahren.'
                  : lang === 'EN'
                  ? 'Your partner for construction, structural work and renovation. Quality and precision for over 20 years.'
                  : 'Vaš partner za visokogradnju, grubi rad i renoviranje. Kvalitet i preciznost već preko 20 godina.'
                }
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/p/NP-Hochbau-GmbH-61554273870427/" target="_blank" rel="noopener noreferrer" className={clsx(
                    "p-2 rounded-full hover:bg-[#F4B400] hover:text-black transition-colors",
                    isDark ? "bg-white/5" : "bg-black/5"
                )}>
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/np.hochbau.gmbh/" target="_blank" rel="noopener noreferrer" className={clsx(
                    "p-2 rounded-full hover:bg-[#F4B400] hover:text-black transition-colors",
                    isDark ? "bg-white/5" : "bg-black/5"
                )}>
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://de.linkedin.com/company/nphochbaugmbh" target="_blank" rel="noopener noreferrer" className={clsx(
                    "p-2 rounded-full hover:bg-[#F4B400] hover:text-black transition-colors",
                    isDark ? "bg-white/5" : "bg-black/5"
                )}>
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-['Oswald'] font-bold text-lg uppercase tracking-wider mb-6 text-[#F4B400]">
                {lang === 'DE' ? 'Menü' : lang === 'EN' ? 'Menu' : 'Meni'}
              </h3>
              <ul className={clsx("space-y-3 font-['Inter'] text-sm transition-colors", isDark ? "text-white/70" : "text-black/70")}>
                <li>
                    <a href="#services" className={clsx("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>
                        {lang === 'DE' ? 'Leistungen' : lang === 'EN' ? 'Services' : 'Usluge'}
                    </a>
                </li>
                <li>
                    <a href="#projects" className={clsx("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>
                        {lang === 'DE' ? 'Projekte' : lang === 'EN' ? 'Projects' : 'Projekti'}
                    </a>
                </li>
                <li>
                    <a href="#trust" className={clsx("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>
                        {lang === 'DE' ? 'Warum Wir' : lang === 'EN' ? 'Why Us' : 'Zašto Mi'}
                    </a>
                </li>
                <li>
                    <a href="#careers" className={clsx("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>
                        {lang === 'DE' ? 'Karriere' : lang === 'EN' ? 'Careers' : 'Karijera'}
                    </a>
                </li>
                <li>
                    <a href="#contact" className={clsx("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>
                        {lang === 'DE' ? 'Kontakt' : lang === 'EN' ? 'Contact' : 'Kontakt'}
                    </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h3 className="font-['Oswald'] font-bold text-lg uppercase tracking-wider mb-6 text-[#F4B400]">
                {lang === 'DE' ? 'Kontakt' : lang === 'EN' ? 'Contact' : 'Kontakt'}
              </h3>
              <ul className={clsx("space-y-4 font-['Inter'] text-sm transition-colors", isDark ? "text-white/70" : "text-black/70")}>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#F4B400] shrink-0" />
                  <span>Heinrichstraße 9,<br />60326 Frankfurt am Main, DE</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#F4B400] shrink-0" />
                  <a href="tel:+496937301378" className={clsx("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>+49 69 37301378</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#F4B400] shrink-0" />
                  <a href="mailto:info@nphochbau.com" className={clsx("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>info@nphochbau.com</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Areas */}
            <div>
              <h3 className="font-['Oswald'] font-bold text-lg uppercase tracking-wider mb-6 text-[#F4B400]">
                {lang === 'DE' ? 'Einsatzgebiete' : lang === 'EN' ? 'Service Areas' : 'Lokacije rada'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Frankfurt am Main', 'Hessen', 'Ruhrgebiet', 'Duisburg', 'Düsseldorf', 'Köln', 'NRW'].map(city => (
                  <span key={city} className={clsx(
                      "px-3 py-1 text-xs rounded-sm border transition-colors",
                      isDark ? "bg-white/5 text-white/60 border-white/10" : "bg-black/5 text-black/60 border-black/10"
                  )}>
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={clsx(
              "border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors",
              isDark ? "border-white/10" : "border-black/10"
          )}>
            <p className={clsx("text-xs font-['Inter'] transition-colors", isDark ? "text-white/40" : "text-black/40")}>
              &copy; {currentYear} NP Hochbau GmbH. {lang === 'DE' ? 'Alle Rechte vorbehalten.' : lang === 'EN' ? 'All rights reserved.' : 'Sva prava zadržana.'}
              <button
                onClick={() => navigate('/admin')}
                className="ml-1 opacity-20 hover:opacity-60 transition-opacity cursor-pointer"
                aria-label="Admin"
              >
                ···
              </button>
            </p>
            <div className={clsx("flex gap-6 text-xs font-['Inter'] font-bold uppercase tracking-wider transition-colors", isDark ? "text-white/40" : "text-black/40")}>
              <button onClick={() => setModalType('impressum')} className="hover:text-[#F4B400] transition-colors">Impressum</button>
              <button onClick={() => setModalType('privacy')} className="hover:text-[#F4B400] transition-colors">Datenschutz</button>
            </div>
          </div>

          {/* Credit */}
          <div className="mt-4 text-center">
            <span className={clsx("text-[10px] font-['Inter'] transition-colors", isDark ? "text-white/15" : "text-black/15")}>
              design by{' '}
              <a
                href="mailto:edis.design@outlook.com"
                className="hover:text-[#F4B400]/60 transition-colors"
              >
                Edi
              </a>
            </span>
          </div>
        </div>
      </footer>

      <LegalModal 
        isOpen={!!modalType} 
        onClose={() => setModalType(null)} 
        type={modalType} 
        lang={lang} 
      />
    </>
  );
}