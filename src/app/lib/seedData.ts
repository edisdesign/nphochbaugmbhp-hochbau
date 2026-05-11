// Auto-seed initial projects & gallery into PocketBase when collections are empty
import { pb, isCollectionAvailable } from './pb';

import imgSunset from '@/assets/a8be6061aa9cf0a7aafa8fe869cbed45c59266a5.png';
import imgCranes from '@/assets/7b6dd1a72da29d9c2740b676373efeea2df524b6.png';
import imgWide from '@/assets/31baed233e7887515269742f5563015a26251998.png';
import imgSteinfurt1 from '@/assets/4ab2a116f3334c6c36da4341b0d3c09d1c983dd0.png';
import imgSteinfurt2 from '@/assets/d9f6c272323b3aaaa5158eec92210e0a4afb3c40.png';
import imgSteinfurt3 from '@/assets/e1867714d93605fb053bafa74fc38d72d0dd2f9e.png';

interface SeedProject {
  title: string;
  location: string;
  year: string;
  category: string;
  partner: string;
  description_de: string;
  description_en: string;
  description_bhs: string;
  mainImageUrl: string;
  galleryImageUrls: string[];
}

const SEED_PROJECTS: SeedProject[] = [
  {
    title: 'Marienhospital Steinfurt',
    location: 'Steinfurt',
    year: '2025 - 2026',
    category: 'GEWERBEBAU',
    partner: 'Kögel Bau GmbH',
    description_de:
      'Neubau des Bettenhauses für das Marienhospital in Steinfurt. In Zusammenarbeit mit der Firma Kögel Bau GmbH führen wir die erweiterten Rohbauarbeiten durch. Dieses anspruchsvolle Projekt im Gesundheitswesen erfordert höchste Präzision und Termintreue. Bauzeitraum: Ende 2025 bis voraussichtlich Oktober 2026.',
    description_en:
      'New construction of the ward building for Marienhospital in Steinfurt. In cooperation with Kögel Bau GmbH, we are executing the extended structural work. This demanding healthcare project requires the highest precision and adherence to schedules. Construction period: Late 2025 to approx. October 2026.',
    description_bhs:
      'Izgradnja novog bolničkog krila (Bettenhaus) za Marienhospital u Steinfurtu. U saradnji sa firmom Kögel Bau GmbH izvodimo proširene grube radove. Ovaj zahtevan projekat u zdravstvu zahteva vrhunsku preciznost i poštovanje rokova. Period gradnje: Kraj 2025. do otprilike oktobra 2026.',
    mainImageUrl: imgSteinfurt1,
    galleryImageUrls: [imgSteinfurt2, imgSteinfurt3, imgSteinfurt1],
  },
  {
    title: 'Wohnen am Ostpark',
    location: 'Bochum',
    year: '2025 - 2026',
    category: 'WOHNBAU',
    partner: 'Empora Construction',
    description_de:
      "Ein Leuchtturmprojekt in Bochum: 'Wohnen am Ostpark'. In enger Partnerschaft mit Empora Construction realisieren wir den erweiterten Rohbau für dieses anspruchsvolle Wohnquartier. Mit einem starken Team von zeitweise über 20 Fachkräften und dem Einsatz von zwei Hochbaukranen sorgen wir für einen reibungslosen Baufortschritt. Das Projekt befindet sich in der finalen Phase und wird voraussichtlich im April dieses Jahres fertiggestellt.",
    description_en:
      "A flagship project in Bochum: 'Wohnen am Ostpark'. In close partnership with Empora Construction, we are realizing the extended structural shell for this sophisticated residential quarter. With a strong team of over 20 skilled workers at peak times and the use of two tower cranes, we ensure smooth construction progress. The project is in its final phase and is expected to be completed in April of this year.",
    description_bhs:
      "Vodeći projekat u Bochumu: 'Wohnen am Ostpark'. U bliskoj saradnji sa Empora Construction realizujemo proširene grubi radove (Rohbau) za ovaj zahtjevni stambeni kvart. Sa snažnim timom od preko 20 stručnih radnika u punom kapacitetu i upotrebom dva građevinska krana, osiguravamo nesmetan napredak gradnje. Projekat je u završnoj fazi i očekuje se da će biti gotov u aprilu ove godine.",
    mainImageUrl: imgSunset,
    galleryImageUrls: [imgCranes, imgWide, imgSunset],
  },
];

interface SeedGalleryItem {
  imageUrl: string;
  caption: string;
}

const SEED_GALLERY: SeedGalleryItem[] = [
  { imageUrl: imgSteinfurt1, caption: 'Marienhospital Steinfurt' },
  { imageUrl: imgSteinfurt2, caption: 'Marienhospital Steinfurt - Ansicht 2' },
  { imageUrl: imgSteinfurt3, caption: 'Marienhospital Steinfurt - Ansicht 3' },
  { imageUrl: imgSunset, caption: 'Wohnen am Ostpark - Sunset' },
  { imageUrl: imgCranes, caption: 'Wohnen am Ostpark - Krane' },
  { imageUrl: imgWide, caption: 'Wohnen am Ostpark - Panorama' },
];

/**
 * Convert an image URL (figma:asset or any URL) to a File object
 */
async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const ext = blob.type.split('/')[1] || 'png';
  return new File([blob], `${filename}.${ext}`, { type: blob.type });
}

/**
 * Check if PocketBase projects collection is empty and seed if needed.
 * Returns { seededProjects, seededGallery } counts.
 */
export async function autoSeedIfEmpty(
  onProgress?: (msg: string) => void
): Promise<{ seededProjects: number; seededGallery: number }> {
  const result = { seededProjects: 0, seededGallery: 0 };

  // Check projects
  const projectsAvailable = await isCollectionAvailable('projects');
  if (projectsAvailable) {
    try {
      const existing = await pb.collection('projects').getList(1, 1);
      if (existing.totalItems === 0) {
        onProgress?.('Seedujem projekte...');
        for (const project of SEED_PROJECTS) {
          try {
            onProgress?.(`Dodajem: ${project.title}...`);
            const formData = new FormData();
            formData.append('text', project.title); // PB uses "text" field instead of "title"
            formData.append('location', project.location);
            formData.append('year', project.year);
            formData.append('category', project.category);
            formData.append('partner', project.partner);
            formData.append('description_de', project.description_de);
            formData.append('description_en', project.description_en);
            formData.append('description_bhs', project.description_bhs);

            // Convert main image URL to File and append
            const mainFile = await urlToFile(
              project.mainImageUrl,
              `${project.title.replace(/\s+/g, '_')}_main`
            );
            formData.append('main_image', mainFile);

            // Convert gallery images to Files and append
            for (let i = 0; i < project.galleryImageUrls.length; i++) {
              const galleryFile = await urlToFile(
                project.galleryImageUrls[i],
                `${project.title.replace(/\s+/g, '_')}_gallery_${i + 1}`
              );
              formData.append('gallery_images', galleryFile);
            }

            await pb.collection('projects').create(formData);
            result.seededProjects++;
          } catch (err) {
            console.warn(`[NP Seed] Greška pri seedovanju projekta "${project.title}":`, err);
          }
        }
      }
    } catch (err) {
      console.warn('[NP Seed] Greška pri provjeri projects kolekcije:', err);
    }
  }

  // Check gallery
  const galleryAvailable = await isCollectionAvailable('gallery');
  if (galleryAvailable) {
    try {
      const existing = await pb.collection('gallery').getList(1, 1);
      if (existing.totalItems === 0) {
        onProgress?.('Seedujem galeriju...');
        for (const item of SEED_GALLERY) {
          try {
            onProgress?.(`Dodajem: ${item.caption}...`);
            const formData = new FormData();
            const file = await urlToFile(
              item.imageUrl,
              item.caption.replace(/\s+/g, '_')
            );
            formData.append('image', file);
            formData.append('caption', item.caption);

            await pb.collection('gallery').create(formData);
            result.seededGallery++;
          } catch (err) {
            console.warn(`[NP Seed] Greška pri seedovanju galerije "${item.caption}":`, err);
          }
        }
      }
    } catch (err) {
      console.warn('[NP Seed] Greška pri provjeri gallery kolekcije:', err);
    }
  }

  if (result.seededProjects > 0 || result.seededGallery > 0) {
    window.dispatchEvent(new Event('np-data-updated'));
    onProgress?.(`Gotovo! Seedovano ${result.seededProjects} projekata i ${result.seededGallery} galerijskih slika.`);
  }

  return result;
}