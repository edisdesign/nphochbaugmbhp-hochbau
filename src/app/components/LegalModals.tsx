import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'impressum' | 'privacy' | null;
  lang: string;
}

export function LegalModal({ isOpen, onClose, type, lang }: LegalModalProps) {
  if (!isOpen || !type) return null;

  // Translation Dictionary
  const content = {
    DE: {
      impressum: {
        title: "Impressum",
        section1: "Angaben gemäß § 5 TMG",
        represented: "Vertreten durch:",
        ceo: "Geschäftsführer",
        contact: "Kontakt:",
        register: "Registereintrag:",
        court: "Registergericht:",
        vat: "Umsatzsteuer:",
        vatId: "Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:",
        responsible: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:",
        disputeTitle: "EU-Streitschlichtung",
        disputeText: "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:",
        liabilityContentTitle: "Haftung für Inhalte",
        liabilityContentText: "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
        liabilityLinksTitle: "Haftung für Links",
        liabilityLinksText: "Unsere Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
        copyrightTitle: "Urheberrecht",
        copyrightText: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."
      },
      privacy: {
        title: "Datenschutzerklärung",
        s1_title: "1. Datenschutz auf einen Blick",
        s1_text: "Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung informieren wir Sie darüber, welche personenbezogenen Daten wir erheben, wie wir sie nutzen und welche Rechte Sie in Bezug auf Ihre Daten haben.",
        s2_title: "2. Verantwortliche Stelle",
        s3_title: "3. Erhebung und Verarbeitung personenbezogener Daten",
        s3_intro: "Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Dienstleistungen erforderlich ist. Die von uns erfassten Daten können umfassen:",
        s3_list: ["Name, Vorname", "Telefonnummer", "E-Mail-Adresse", "IP-Adresse", "Browsertyp und -version", "Besuchte Seiten unserer Website"],
        s3_outro: "Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) zur Sicherstellung der Funktionalität unserer Website.",
        s4_title: "4. Cookies",
        s4_text: "Unsere Website verwendet Cookies, um die Nutzung zu erleichtern und die Benutzererfahrung zu verbessern. Sie können die Speicherung von Cookies in den Einstellungen Ihres Browsers deaktivieren.",
        s5_title: "5. Weitergabe von Daten an Dritte",
        s5_text: "Wir geben Ihre personenbezogenen Daten nicht ohne Ihre ausdrückliche Zustimmung an Dritte weiter, es sei denn, dies ist gesetzlich erforderlich oder dient der Vertragsabwicklung.",
        s6_title: "6. Ihre Rechte als betroffene Person",
        s6_intro: "Sie haben das Recht:",
        s6_list: [
            "Auskunft über die von uns gespeicherten Daten zu erhalten (Art. 15 DSGVO)",
            "Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)",
            "Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)",
            "Die Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)",
            "Der Datenverarbeitung zu widersprechen (Art. 21 DSGVO)"
        ],
        s7_title: "7. Kontakt für Datenschutzanfragen",
        s7_text: "Falls Sie Fragen zum Datenschutz oder zu Ihren Rechten haben, kontaktieren Sie uns bitte unter:",
        s8_title: "8. Änderungen der Datenschutzerklärung",
        s8_text: "Wir behalten uns das Recht vor, diese Datenschutzerklärung jederzeit anzupassen, um gesetzlichen Anforderungen zu entsprechen oder Änderungen unserer Dienstleistungen zu berücksichtigen."
      }
    },
    EN: {
      impressum: {
        title: "Legal Notice",
        section1: "Information pursuant to § 5 TMG",
        represented: "Represented by:",
        ceo: "CEO",
        contact: "Contact:",
        register: "Register Entry:",
        court: "Register Court:",
        vat: "VAT ID:",
        vatId: "Sales tax identification number according to § 27 a Sales Tax Law:",
        responsible: "Responsible for content according to § 18 Paragraph 2 MStV:",
        disputeTitle: "EU Dispute Resolution",
        disputeText: "The European Commission provides a platform for online dispute resolution (ODR):",
        liabilityContentTitle: "Liability for Contents",
        liabilityContentText: "As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 Paragraph 1 of the German Telemedia Act (TMG). However, according to §§ 8 to 10 TMG, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.",
        liabilityLinksTitle: "Liability for Links",
        liabilityLinksText: "Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.",
        copyrightTitle: "Copyright",
        copyrightText: "The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator."
      },
      privacy: {
        title: "Privacy Policy",
        s1_title: "1. Data Protection at a Glance",
        s1_text: "The protection of your personal data is important to us. In this privacy policy, we inform you about what personal data we collect, how we use it, and what rights you have regarding your data.",
        s2_title: "2. Responsible Party",
        s3_title: "3. Collection and Processing of Personal Data",
        s3_intro: "We process personal data only insofar as this is necessary to provide a functional website as well as our content and services. The data collected by us may include:",
        s3_list: ["Name, First Name", "Phone Number", "Email Address", "IP Address", "Browser Type and Version", "Visited pages of our website"],
        s3_outro: "The processing of this data is based on Art. 6 Para. 1 lit. f GDPR (legitimate interest) to ensure the functionality of our website.",
        s4_title: "4. Cookies",
        s4_text: "Our website uses cookies to facilitate use and improve the user experience. You can deactivate the storage of cookies in your browser settings.",
        s5_title: "5. Disclosure of Data to Third Parties",
        s5_text: "We do not pass on your personal data to third parties without your express consent, unless this is legally required or serves the execution of the contract.",
        s6_title: "6. Your Rights as a Data Subject",
        s6_intro: "You have the right to:",
        s6_list: [
            "Obtain information about the data stored by us (Art. 15 GDPR)",
            "Request correction of incorrect data (Art. 16 GDPR)",
            "Request deletion of your data (Art. 17 GDPR)",
            "Request restriction of processing (Art. 18 GDPR)",
            "Object to data processing (Art. 21 GDPR)"
        ],
        s7_title: "7. Contact for Privacy Inquiries",
        s7_text: "If you have questions about data protection or your rights, please contact us at:",
        s8_title: "8. Changes to the Privacy Policy",
        s8_text: "We reserve the right to adapt this privacy policy at any time to comply with legal requirements or to take changes in our services into account."
      }
    },
    BHS: {
      impressum: {
        title: "Impresum",
        section1: "Podaci prema § 5 TMG",
        represented: "Zastupnik:",
        ceo: "Direktor",
        contact: "Kontakt:",
        register: "Registracija:",
        court: "Registarski sud:",
        vat: "PDV:",
        vatId: "PDV identifikacioni broj prema § 27 a Zakona o PDV-u:",
        responsible: "Odgovoran za sadržaj prema § 18 Stav 2 MStV:",
        disputeTitle: "EU Rješavanje sporova",
        disputeText: "Evropska komisija nudi platformu za online rješavanje sporova (ODR):",
        liabilityContentTitle: "Odgovornost za sadržaj",
        liabilityContentText: "Kao pružalac usluga odgovorni smo za sopstveni sadržaj na ovim stranicama prema opštim zakonima u skladu sa § 7 Stav 1 TMG. Međutim, prema §§ 8 do 10 TMG, kao pružalac usluga nismo obavezni da nadgledamo prenesene ili sačuvane informacije trećih strana ili da istražujemo okolnosti koje ukazuju na nezakonite aktivnosti.",
        liabilityLinksTitle: "Odgovornost za linkove",
        liabilityLinksText: "Naša web stranica sadrži linkove ka eksternim web stranicama trećih strana na čiji sadržaj nemamo uticaj. Stoga ne možemo preuzeti nikakvu odgovornost za ovaj eksterni sadržaj. Za sadržaj linkovanih stranica uvijek je odgovoran dotični provajder ili operater stranica.",
        copyrightTitle: "Autorska prava",
        copyrightText: "Sadržaj i djela koja su kreirali operateri stranica na ovim stranicama podliježu njemačkom zakonu o autorskim pravima. Umnožavanje, obrada, distribucija i svaka vrsta eksploatacije izvan granica autorskog prava zahtijevaju pismenu saglasnost odgovarajućeg autora ili kreatora."
      },
      privacy: {
        title: "Politika Privatnosti",
        s1_title: "1. Zaštita podataka na prvi pogled",
        s1_text: "Zaštita vaših ličnih podataka nam je važna. U ovoj politici privatnosti vas obavještavamo o tome koje lične podatke prikupljamo, kako ih koristimo i koja prava imate u vezi sa vašim podacima.",
        s2_title: "2. Odgovorno tijelo",
        s3_title: "3. Prikupljanje i obrada ličnih podataka",
        s3_intro: "Lične podatke obrađujemo samo ukoliko je to neophodno za pružanje funkcionalne web stranice, kao i naših sadržaja i usluga. Podaci koje prikupljamo mogu uključivati:",
        s3_list: ["Prezime, Ime", "Broj telefona", "Email adresa", "IP adresa", "Tip i verzija pretraživača", "Posjećene stranice naše web stranice"],
        s3_outro: "Obrada ovih podataka se vrši na osnovu čl. 6 st. 1 lit. f DSGVO (legitimni interes) kako bi se osigurala funkcionalnost naše web stranice.",
        s4_title: "4. Kolačići (Cookies)",
        s4_text: "Naša web stranica koristi kolačiće kako bi olakšala korištenje i poboljšala korisničko iskustvo. Možete deaktivirati čuvanje kolačića u postavkama vašeg pretraživača.",
        s5_title: "5. Prijenos podataka trećim licima",
        s5_text: "Vaše lične podatke ne prosljeđujemo trećim licima bez vašeg izričitog pristanka, osim ako je to zakonski obavezno ili služi za izvršenje ugovora.",
        s6_title: "6. Vaša prava",
        s6_intro: "Imate pravo da:",
        s6_list: [
            "Dobijete informacije o podacima koje čuvamo o vama (Čl. 15 DSGVO)",
            "Zahtijevate ispravku netačnih podataka (Čl. 16 DSGVO)",
            "Zahtijevate brisanje vaših podataka (Čl. 17 DSGVO)",
            "Zahtijevate ograničenje obrade (Čl. 18 DSGVO)",
            "Uložite prigovor na obradu podataka (Čl. 21 DSGVO)"
        ],
        s7_title: "7. Kontakt za pitanja o privatnosti",
        s7_text: "Ako imate pitanja o zaštiti podataka ili vašim pravima, molimo kontaktirajte nas na:",
        s8_title: "8. Izmjene politike privatnosti",
        s8_text: "Zadržavamo pravo da u bilo kom trenutku prilagodimo ovu politiku privatnosti kako bismo ispunili zakonske zahtjeve ili uzeli u obzir promjene u našim uslugama."
      }
    }
  };

  const t = content[lang as keyof typeof content] || content.DE;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-[#1A1A1A] w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-sm shadow-2xl border border-[#F4B400]"
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors z-10"
            >
                <X className="w-6 h-6 dark:text-white text-black" />
            </button>

            <div className="p-8 md:p-12">
                {type === 'impressum' ? (
                    <div className="prose dark:prose-invert max-w-none font-['Inter']">
                        <h2 className="text-3xl font-['Oswald'] font-bold mb-6 text-[#F4B400]">{t.impressum.title}</h2>
                        
                        <div className="mb-6">
                            <p className="font-bold mb-2">{t.impressum.section1}</p>
                            <p>
                                <strong>NP Hochbau GmbH</strong><br />
                                Heinrichstraße 9<br />
                                60327 Frankfurt am Main<br />
                                Deutschland
                            </p>
                        </div>

                        <div className="mb-6">
                            <p>
                                <strong>Handelsregister:</strong> HRB 134293<br />
                                <strong>{t.impressum.court}</strong> Amtsgericht Frankfurt am Main
                            </p>
                            <p>
                                <strong>Steuernummer:</strong> 014 240 40178<br />
                                <strong>{t.impressum.vatId}</strong> DE450216924<br />
                                <strong>Betriebsnummer:</strong> 73581671
                            </p>
                        </div>

                        <div className="mb-6">
                            <p className="font-bold mb-1">{t.impressum.represented}</p>
                            <p>Edis Muminovic ({t.impressum.ceo})</p>
                        </div>

                        <div className="mb-6">
                            <p className="font-bold mb-1">{t.impressum.contact}</p>
                            <p>
                                Telefon: 0176 43273765<br />
                                E-Mail: nphochbau@gmail.com
                            </p>
                        </div>

                        <div className="mb-6">
                            <p className="font-bold mb-1">{t.impressum.responsible}</p>
                            <p>
                                Edis Muminovic<br />
                                Heinrichstraße 9<br />
                                60327 Frankfurt am Main
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-bold font-['Oswald'] uppercase text-[#F4B400] mb-2">{t.impressum.disputeTitle}</h3>
                            <p>
                                {t.impressum.disputeText} 
                                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#F4B400] hover:underline ml-1">
                                    https://ec.europa.eu/consumers/odr
                                </a>.<br />
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-bold font-['Oswald'] uppercase text-[#F4B400] mb-2">{t.impressum.liabilityContentTitle}</h3>
                            <p>{t.impressum.liabilityContentText}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-bold font-['Oswald'] uppercase text-[#F4B400] mb-2">{t.impressum.liabilityLinksTitle}</h3>
                            <p>{t.impressum.liabilityLinksText}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold font-['Oswald'] uppercase text-[#F4B400] mb-2">{t.impressum.copyrightTitle}</h3>
                            <p>{t.impressum.copyrightText}</p>
                        </div>
                    </div>
                ) : (
                    <div className="prose dark:prose-invert max-w-none font-['Inter']">
                        <h2 className="text-3xl font-['Oswald'] font-bold mb-6 text-[#F4B400]">{t.privacy.title}</h2>
                        
                        <div className="mb-8">
                            <h3 className="text-xl font-bold font-['Oswald'] uppercase mb-4 text-[#F4B400]">{t.privacy.s1_title}</h3>
                            <p>{t.privacy.s1_text}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold font-['Oswald'] uppercase mb-4 text-[#F4B400]">{t.privacy.s2_title}</h3>
                            <p className="mb-4">
                                <strong>NP Hochbau GmbH</strong><br />
                                Heinrichstraße 9, 60327 Frankfurt am Main, Deutschland
                            </p>
                            <p className="mb-4">
                                HRB-Nummer: HRB 134293, Amtsgericht Frankfurt am Main<br />
                                Steuernummer: 014 240 40178<br />
                                USt-IdNr.: DE450216924<br />
                                Betriebsnummer: 752816671
                            </p>
                            <p>
                                E-Mail: nphochbau@gmail.com<br />
                                Telefon: 0176 43273765
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold font-['Oswald'] uppercase mb-4 text-[#F4B400]">{t.privacy.s3_title}</h3>
                            <p className="mb-4">{t.privacy.s3_intro}</p>
                            <ul className="list-disc pl-5 mb-4">
                                {t.privacy.s3_list.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                            <p>{t.privacy.s3_outro}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold font-['Oswald'] uppercase mb-4 text-[#F4B400]">{t.privacy.s4_title}</h3>
                            <p>{t.privacy.s4_text}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold font-['Oswald'] uppercase mb-4 text-[#F4B400]">{t.privacy.s5_title}</h3>
                            <p>{t.privacy.s5_text}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold font-['Oswald'] uppercase mb-4 text-[#F4B400]">{t.privacy.s6_title}</h3>
                            <p className="mb-2">{t.privacy.s6_intro}</p>
                            <ul className="list-disc pl-5">
                                {t.privacy.s6_list.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold font-['Oswald'] uppercase mb-4 text-[#F4B400]">{t.privacy.s7_title}</h3>
                            <p className="mb-4">{t.privacy.s7_text}</p>
                            <p>
                                <strong>NP Hochbau GmbH</strong><br />
                                Heinrichstraße 9<br />
                                60327 Frankfurt am Main, Deutschland<br />
                                E-Mail: nphochbau@gmail.com<br />
                                Telefon: 0176 43273765
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold font-['Oswald'] uppercase mb-4 text-[#F4B400]">{t.privacy.s8_title}</h3>
                            <p>{t.privacy.s8_text}</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
