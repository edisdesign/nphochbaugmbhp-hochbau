import { motion } from 'motion/react';
import { Send, MapPin, Phone, MessageCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';
import { useState } from 'react';
import { toast } from 'sonner';

interface ContactProps {
  lang: string;
  theme: 'dark' | 'light';
}

export function Contact({ lang, theme }: ContactProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    DE: {
      headline: "PROJEKT ANFRAGEN",
      subheadline: "Lassen Sie uns gemeinsam Großes bauen. Senden Sie uns Ihre Projektdaten.",
      fields: {
        name: "Name / Firma",
        email: "E-Mail Adresse",
        phone: "Telefonnummer",
        type: "Projekttyp",
        message: "Nachricht / Details",
        submit: "ANFRAGE SENDEN",
        sending: "WIRD GESENDET..."
      },
      types: ["Wohnbau", "Gewerbebau", "Sanierung", "Sonstiges"],
      whatsapp: "Kontakt per WhatsApp",
      success: "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.",
      error: "Es gab einen Fehler beim Senden. Bitte versuchen Sie es später erneut."
    },
    EN: {
      headline: "REQUEST PROJECT",
      subheadline: "Let's build something great together. Send us your project details.",
      fields: {
        name: "Name / Company",
        email: "E-Mail Address",
        phone: "Phone Number",
        type: "Project Type",
        message: "Message / Details",
        submit: "SEND INQUIRY",
        sending: "SENDING..."
      },
      types: ["Residential", "Commercial", "Renovation", "Other"],
      whatsapp: "Contact via WhatsApp",
      success: "Thank you! Your message has been sent successfully.",
      error: "There was an error sending your message. Please try again later."
    },
    BHS: {
      headline: "ZATRAŽITE PONUDU",
      subheadline: "Gradimo velike stvari zajedno. Pošaljite nam detalje projekta.",
      fields: {
        name: "Ime / Firma",
        email: "E-Mail Adresa",
        phone: "Broj Telefona",
        type: "Tip Projekta",
        message: "Poruka / Detalji",
        submit: "POŠALJI UPIT",
        sending: "ŠALJE SE..."
      },
      types: ["Stambeni", "Komercijalni", "Sanacija", "Ostalo"],
      whatsapp: "Kontaktirajte putem WhatsApp-a",
      success: "Hvala! Vaša poruka je uspješno poslana.",
      error: "Došlo je do greške prilikom slanja. Molimo pokušajte ponovo kasnije."
    }
  };

  const t = content[lang as keyof typeof content];
  const isDark = theme === 'dark';

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
        const response = await fetch("https://formsubmit.co/ajax/nphochbau@gmail.com", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                ...data,
                _subject: `Neue Projektanfrage von ${data.name}`,
                _template: "table",
                _captcha: "false"
            })
        });

        if (response.ok) {
            toast.success(t.success);
            reset();
        } else {
            throw new Error("Failed to send");
        }
    } catch (error) {
        toast.error(t.error);
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const inputClasses = clsx(
    "w-full bg-transparent border-b-2 py-4 px-0 font-['Inter'] text-lg focus:outline-none transition-colors rounded-none",
    isDark 
      ? "border-white/20 text-white focus:border-[#F4B400] placeholder:text-white/30" 
      : "border-black/20 text-black focus:border-[#F4B400] placeholder:text-black/30"
  );

  const labelClasses = clsx(
    "font-['Oswald'] text-sm uppercase tracking-widest mb-2 block",
    isDark ? "text-[#F4B400]" : "text-black/60"
  );

  return (
    <section id="contact" className={clsx("py-24 relative overflow-hidden transition-colors duration-300", isDark ? "bg-[#161616]" : "bg-white")}>
      
      {/* Background Decor */}
      <div className={clsx("absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none", isDark ? "bg-white" : "bg-black")} 
           style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Text Side */}
          <div className="lg:w-1/3 flex flex-col h-full">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={clsx("font-['Oswald'] text-5xl md:text-6xl font-bold uppercase mb-6 leading-none", isDark ? "text-white" : "text-black")}
            >
              {t.headline}
            </motion.h2>
            <p className={clsx("font-['Inter'] text-lg leading-relaxed mb-8", isDark ? "text-white/60" : "text-black/60")}>
              {t.subheadline}
            </p>
            <div className="w-24 h-1 bg-[#F4B400] mb-12" />

            {/* Address & Contact Info */}
            <div className="mt-auto space-y-8">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F4B400] text-black">
                     <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className={clsx("font-['Oswald'] font-bold text-xl uppercase mb-1", isDark ? "text-white" : "text-black")}>
                        NP Hochbau GmbH
                     </h4>
                     <p className={clsx("font-['Inter'] leading-relaxed", isDark ? "text-white/70" : "text-black/70")}>
                        Heinrichstraße 9<br/>
                        60326 Frankfurt am Main<br/>
                        Deutschland
                     </p>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F4B400] text-black">
                     <Phone className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className={clsx("font-['Oswald'] font-bold text-xl uppercase mb-1", isDark ? "text-white" : "text-black")}>
                        {lang === 'DE' ? 'Büro' : lang === 'EN' ? 'Office' : 'Ured'}
                     </h4>
                     <a href="tel:+496937301378" className={clsx("font-['Inter'] leading-relaxed hover:text-[#F4B400] transition-colors", isDark ? "text-white/70" : "text-black/70")}>
                        +49 69 37301378
                     </a>
                  </div>
               </div>
               
               {/* Map Container */}
               <div className={clsx(
                  "w-full h-48 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden border-2 mt-6",
                  isDark ? "border-white/10" : "border-black/10"
               )}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src="https://maps.google.com/maps?q=Heinrichstra%C3%9Fe%209%2C%2060326%20Frankfurt%20am%20Main&t=m&z=15&output=embed&iwloc=near"
                    title="NP Hochbau Location"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  >
                  </iframe>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              <div className="group">
                <label className={labelClasses}>{t.fields.name}</label>
                <input 
                  type="text" 
                  {...register("name", { required: true })}
                  className={inputClasses}
                  placeholder={lang === 'DE' ? "Musterfirma GmbH" : "Example Company Ltd"}
                />
                {errors.name && <span className="text-red-500 text-xs mt-1">Required</span>}
              </div>

              <div className="group">
                <label className={labelClasses}>{t.fields.email}</label>
                <input 
                  type="email" 
                  {...register("email", { required: true })}
                  className={inputClasses}
                  placeholder="contact@example.com"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">Required</span>}
              </div>

              <div className="group">
                <label className={labelClasses}>{t.fields.phone}</label>
                <input 
                  type="tel" 
                  {...register("phone")}
                  className={inputClasses}
                  placeholder="+49 ..."
                />
              </div>

              <div className="group">
                <label className={labelClasses}>{t.fields.type}</label>
                <select 
                  {...register("type")}
                  className={clsx(inputClasses, "cursor-pointer appearance-none rounded-none")}
                >
                  {t.types.map((type, i) => (
                    <option key={i} value={type} className="text-black bg-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 group">
                <label className={labelClasses}>{t.fields.message}</label>
                <textarea 
                  {...register("message", { required: true })}
                  className={clsx(inputClasses, "min-h-[100px] resize-y")}
                  placeholder="..."
                />
                {errors.message && <span className="text-red-500 text-xs mt-1">Required</span>}
              </div>

              <div className="md:col-span-2 mt-8 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-[#F4B400] text-black font-['Oswald'] text-xl font-bold px-12 py-4 uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      {t.fields.sending}
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      {t.fields.submit}
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <a 
                    href="https://wa.me/4917643273765" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={clsx(
                        "flex items-center gap-3 font-['Inter'] font-medium transition-colors group",
                        isDark ? "text-white/70 hover:text-[#25D366]" : "text-black/70 hover:text-[#25D366]"
                    )}
                >
                    <div className="p-2 rounded-full border border-current group-hover:bg-[#25D366] group-hover:border-[#25D366] group-hover:text-white transition-all">
                        <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider">{t.whatsapp}</span>
                </a>
              </div>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}