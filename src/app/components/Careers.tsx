import { motion } from 'motion/react';
import { Upload, Check, ArrowRight, User, Mail, Briefcase, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useState } from 'react';
import { clsx } from 'clsx';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CareersProps {
  lang: string;
  theme: 'dark' | 'light';
}

export function Careers({ lang, theme }: CareersProps) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  
  // Watch for file selection to show filename
  const resumeFile = watch('resume');
  const fileName = resumeFile?.[0]?.name;

  const content = {
    DE: {
      headline: "WERDE EINER VON UNS",
      subheadline: "BAUE DEINE ZUKUNFT MIT NP HOCHBAU",
      desc: "Wir suchen Macher, die anpacken können. Bei uns zählt Leistung und Teamgeist. Bewirb dich jetzt initiativ.",
      benefits: [
        "Überdurchschnittliche Bezahlung",
        "Modernste Ausrüstung & Werkzeuge",
        "Sicherer Arbeitsplatz & Aufstiegschancen",
        "Familiäres Betriebsklima"
      ],
      form: {
        name: "Vollständiger Name",
        email: "E-Mail Adresse",
        position: "Gewünschte Position (z.B. Maurer, Bauleiter)",
        upload: "Lebenslauf hochladen (PDF)",
        uploadSub: "oder hierher ziehen",
        fileSelected: "Datei ausgewählt:",
        submit: "BEWERBUNG ABSENDEN",
        sending: "WIRD GESENDET...",
        success: "Bewerbung erfolgreich gesendet!",
        error: "Fehler beim Senden. Bitte erneut versuchen."
      }
    },
    EN: {
      headline: "BECOME ONE OF US",
      subheadline: "BUILD YOUR FUTURE WITH NP HOCHBAU",
      desc: "We are looking for doers who can get things done. Performance and team spirit count with us. Send an unsolicited application now.",
      benefits: [
        "Above-average pay",
        "State-of-the-art equipment & tools",
        "Secure job & career opportunities",
        "Family-like working atmosphere"
      ],
      form: {
        name: "Full Name",
        email: "Email Address",
        position: "Desired Position (e.g. Bricklayer, Site Manager)",
        upload: "Upload CV (PDF)",
        uploadSub: "or drag and drop here",
        fileSelected: "File selected:",
        submit: "SEND APPLICATION",
        sending: "SENDING...",
        success: "Application sent successfully!",
        error: "Error sending application. Please try again."
      }
    },
    BHS: {
      headline: "POSTANI DIO TIMA",
      subheadline: "GRADI SVOJU BUDUĆNOST SA NP HOCHBAU",
      desc: "Tražimo ljude od akcije. Kod nas se cijeni trud i timski duh. Pošalji otvorenu prijavu odmah.",
      benefits: [
        "Iznadprosječna primanja",
        "Najmodernija oprema i alati",
        "Siguran posao i mogućnost napredovanja",
        "Porodična radna atmosfera"
      ],
      form: {
        name: "Ime i Prezime",
        email: "Email Adresa",
        position: "Željena pozicija (npr. Zidar, Poslovođa)",
        upload: "Učitaj CV (PDF)",
        uploadSub: "ili prevuci ovdje",
        fileSelected: "Datoteka odabrana:",
        submit: "POŠALJI PRIJAVU",
        sending: "ŠALJE SE...",
        success: "Prijava uspješno poslana!",
        error: "Greška pri slanju. Molimo pokušajte ponovo."
      }
    }
  };

  const t = content[lang as keyof typeof content];
  const isDark = theme === 'dark';

  const onSubmit = async (data: any) => {
    setFormState('submitting');
    
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('position', data.position);
        formData.append('_subject', `Bewerbung: ${data.position} - ${data.name}`);
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');

        if (data.resume && data.resume[0]) {
            formData.append('attachment', data.resume[0]);
        }

        const response = await fetch("https://formsubmit.co/nphochbau@gmail.com", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            setFormState('success');
            toast.success(t.form.success);
            reset();
        } else {
            throw new Error("Failed to send");
        }
    } catch (error) {
        console.error(error);
        toast.error(t.form.error);
        setFormState('idle');
    }
  };

  return (
    <section id="careers" className={clsx("py-24 relative overflow-hidden", isDark ? "bg-[#111]" : "bg-white")}>
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-stretch">
          
          {/* Left Side: Info & Image */}
          <div className="lg:w-1/2 flex flex-col">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mb-10"
             >
                <div className="inline-block bg-[#F4B400] text-black px-3 py-1 font-['Inter'] font-bold text-xs tracking-widest uppercase mb-4">
                   {lang === 'DE' ? 'JOBS & KARRIERE' : lang === 'EN' ? 'JOBS & CAREERS' : 'POSAO & KARIJERA'}
                </div>
                <h2 className={clsx("font-['Oswald'] text-5xl md:text-6xl font-bold uppercase mb-6 leading-[0.9]", isDark ? "text-white" : "text-black")}>
                  {t.headline}
                </h2>
                <h3 className={clsx("font-['Oswald'] text-2xl text-[#F4B400] uppercase mb-6")}>
                  {t.subheadline}
                </h3>
                <p className={clsx("font-['Inter'] text-lg leading-relaxed mb-8 border-l-4 border-[#F4B400] pl-6", isDark ? "text-white/70" : "text-black/70")}>
                  {t.desc}
                </p>

                <ul className="grid grid-cols-1 gap-4 mb-10">
                   {t.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-full bg-[#F4B400]/20 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-[#F4B400]" />
                         </div>
                         <span className={clsx("font-['Inter'] font-medium", isDark ? "text-white" : "text-black")}>{benefit}</span>
                      </li>
                   ))}
                </ul>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="mt-auto relative h-[300px] overflow-hidden rounded-sm group grayscale hover:grayscale-0 transition-all duration-500"
             >
                <ImageWithFallback 
                   src="https://images.unsplash.com/photo-1648372430008-94c9343cca7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjB0ZWFtJTIwcG9ydHJhaXQlMjBkYXJrJTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3Njk3MzI0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                   alt="NP Hochbau Team"
                   className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
             </motion.div>
          </div>

          {/* Right Side: Application Form */}
          <div className="lg:w-1/2">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className={clsx(
                  "h-full p-8 md:p-10 border relative", 
                  isDark ? "bg-[#1A1A1A] border-white/10" : "bg-gray-50 border-black/10"
               )}
             >
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#F4B400]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#F4B400]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#F4B400]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#F4B400]" />

                {formState === 'success' ? (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="h-full flex flex-col items-center justify-center text-center space-y-6"
                   >
                      <div className="w-20 h-20 bg-[#F4B400] rounded-full flex items-center justify-center mb-4">
                         <Check className="w-10 h-10 text-black" />
                      </div>
                      <h3 className={clsx("text-3xl font-['Oswald'] uppercase font-bold", isDark ? "text-white" : "text-black")}>
                        {t.form.success}
                      </h3>
                      <p className={clsx("font-['Inter']", isDark ? "text-white/60" : "text-black/60")}>
                        {lang === 'DE' ? 'Wir werden uns in Kürze bei Ihnen melden.' : lang === 'EN' ? 'We will get back to you shortly.' : 'Javit ćemo vam se uskoro.'}
                      </p>
                      <button 
                        onClick={() => setFormState('idle')} 
                        className="mt-8 text-sm uppercase font-bold tracking-widest text-[#F4B400] hover:text-white transition-colors"
                      >
                        {lang === 'DE' ? 'Neue Bewerbung senden' : lang === 'EN' ? 'Send another application' : 'Pošalji novu prijavu'}
                      </button>
                   </motion.div>
                ) : (
                   <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full justify-center">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className={clsx("text-xs font-['Oswald'] uppercase tracking-widest", isDark ? "text-white/60" : "text-black/60")}>
                               {t.form.name}
                            </label>
                            <div className="relative group cursor-hover">
                               <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4B400]" />
                               <input 
                                 type="text" 
                                 {...register("name", { required: true })}
                                 className={clsx(
                                    "w-full bg-transparent border-b-2 py-3 pl-10 pr-4 font-['Inter'] focus:outline-none transition-colors",
                                    isDark ? "border-white/10 text-white focus:border-[#F4B400]" : "border-black/10 text-black focus:border-[#F4B400]"
                                 )}
                               />
                               {errors.name && <span className="text-red-500 text-xs absolute -bottom-4 left-0">Required</span>}
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className={clsx("text-xs font-['Oswald'] uppercase tracking-widest", isDark ? "text-white/60" : "text-black/60")}>
                               {t.form.email}
                            </label>
                            <div className="relative group cursor-hover">
                               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4B400]" />
                               <input 
                                 type="email" 
                                 {...register("email", { required: true })}
                                 className={clsx(
                                    "w-full bg-transparent border-b-2 py-3 pl-10 pr-4 font-['Inter'] focus:outline-none transition-colors",
                                    isDark ? "border-white/10 text-white focus:border-[#F4B400]" : "border-black/10 text-black focus:border-[#F4B400]"
                                 )}
                               />
                               {errors.email && <span className="text-red-500 text-xs absolute -bottom-4 left-0">Required</span>}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className={clsx("text-xs font-['Oswald'] uppercase tracking-widest", isDark ? "text-white/60" : "text-black/60")}>
                            {t.form.position}
                         </label>
                         <div className="relative group cursor-hover">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4B400]" />
                            <input 
                              type="text" 
                              {...register("position", { required: true })}
                              className={clsx(
                                 "w-full bg-transparent border-b-2 py-3 pl-10 pr-4 font-['Inter'] focus:outline-none transition-colors",
                                 isDark ? "border-white/10 text-white focus:border-[#F4B400]" : "border-black/10 text-black focus:border-[#F4B400]"
                              )}
                            />
                            {errors.position && <span className="text-red-500 text-xs absolute -bottom-4 left-0">Required</span>}
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className={clsx("text-xs font-['Oswald'] uppercase tracking-widest", isDark ? "text-white/60" : "text-black/60")}>
                            {t.form.upload}
                         </label>
                         <label className={clsx(
                            "w-full border-2 border-dashed rounded-sm py-8 flex flex-col items-center justify-center transition-all cursor-pointer group cursor-hover hover:border-[#F4B400] hover:bg-[#F4B400]/5 relative",
                            isDark ? "border-white/10" : "border-black/10"
                         )}>
                            <input 
                                type="file" 
                                accept=".pdf,.doc,.docx"
                                {...register("resume")}
                                className="hidden" 
                            />
                            <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                               <Upload className="w-5 h-5 text-[#F4B400]" />
                            </div>
                            
                            {fileName ? (
                                <div className="text-center">
                                    <span className={clsx("font-['Oswald'] text-sm uppercase font-bold text-[#F4B400]")}>{t.form.fileSelected}</span>
                                    <p className={clsx("text-xs mt-1 break-all px-4", isDark ? "text-white" : "text-black")}>{fileName}</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <span className={clsx("font-['Oswald'] text-sm uppercase font-bold", isDark ? "text-white" : "text-black")}>{t.form.upload}</span>
                                    <span className={clsx("block text-xs mt-1", isDark ? "text-white/40" : "text-black/40")}>{t.form.uploadSub}</span>
                                </div>
                            )}
                         </label>
                      </div>

                      <button 
                        type="submit"
                        disabled={formState === 'submitting'}
                        className="group w-full bg-[#F4B400] text-black font-['Oswald'] text-lg font-bold py-4 mt-4 uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3 cursor-hover disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                         {formState === 'submitting' ? (
                            <>
                                <span className="">{t.form.sending}</span>
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </>
                         ) : (
                            <>
                               {t.form.submit}
                               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                         )}
                      </button>
                   </form>
                )}
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}