// Shared data store - PocketBase (PocketHost) + silent fallback
import { pb, getFileUrl, isCollectionAvailable, resetPBCache } from './pb';
export { isCollectionAvailable } from './pb';

export interface SiteProject {
  id: string;
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
  };
  createdAt: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
  category: 'GEWERBEBAU' | 'WOHNBAU' | '';
  baustelle: string;
  location: string;
  createdAt: string;
}

// ---- PROJECTS (PocketBase) ----

// Expected field names in the "projects" collection
// NOTE: PocketBase uses "text" instead of "title" (PB default field name)
const EXPECTED_PROJECT_FIELDS = [
  'text', 'location', 'year', 'category', 'partner',
  'description_de', 'description_en', 'description_bhs',
  'main_image', 'gallery_images'
];

export async function getProjectsFromPB(): Promise<SiteProject[]> {
  const available = await isCollectionAvailable('projects');
  if (!available) {
    console.warn('[NP] projects collection not available, returning []');
    return [];
  }

  try {
    const records = await pb.collection('projects').getFullList({
      sort: '-created',
    });

    console.info(`[NP] Loaded ${records.length} projects from PocketBase`);

    // Schema check: log raw fields of first record so user can verify PocketBase schema
    if (records.length > 0) {
      const firstRecord = records[0];
      const recordKeys = Object.keys(firstRecord).filter(
        k => !['id', 'collectionId', 'collectionName', 'created', 'updated', 'expand'].includes(k)
      );
      console.info('[NP] Raw PocketBase record fields:', recordKeys);
      console.info('[NP] Expected fields:', EXPECTED_PROJECT_FIELDS);

      const missingFields = EXPECTED_PROJECT_FIELDS.filter(f => !(f in firstRecord) || firstRecord[f] === undefined);
      if (missingFields.length > 0) {
        console.error(
          `[NP] ⚠️ SCHEMA MISMATCH! These fields are MISSING in PocketBase "projects" collection: ${missingFields.join(', ')}\n` +
          `Go to https://nphochbau.pockethost.io/_/ → collections → projects → and add these fields.\n` +
          `Raw first record:`, firstRecord
        );
      }
    }

    return records.map((r) => {
      // PocketBase uses "text" field instead of "title"
      const projectTitle = r.text || r.title || '';

      const mainImageUrl = r.main_image
        ? getFileUrl(r, r.main_image)
        : '';

      const galleryUrls = (r.gallery_images || []).map((filename: string) =>
        getFileUrl(r, filename)
      );

      if (!mainImageUrl) {
        console.warn(`[NP] Project "${projectTitle}" has no main_image! Raw record:`, {
          id: r.id,
          text: r.text,
          title: r.title,
          main_image: r.main_image,
          fields: Object.keys(r),
        });
      }

      return {
        id: r.id,
        category: r.category as 'GEWERBEBAU' | 'WOHNBAU',
        image: mainImageUrl,
        title: projectTitle,
        location: r.location || '',
        gallery: galleryUrls,
        description: {
          DE: r.description_de || projectTitle || '',
          EN: r.description_en || projectTitle || '',
          BHS: r.description_bhs || projectTitle || '',
        },
        details: {
          year: r.year || '',
          partner: r.partner || undefined,
        },
        createdAt: r.created,
      };
    });
  } catch (err) {
    console.warn('[NP] PocketBase getProjects failed:', err);
    return [];
  }
}

export async function addProjectToPB(data: {
  title: string;
  location: string;
  year: string;
  category: string;
  partner: string;
  descriptionDE: string;
  descriptionEN: string;
  descriptionBHS: string;
  mainImageFile: File | null;
  galleryFiles: File[];
}): Promise<{ ok: boolean; error?: string }> {
  const available = await isCollectionAvailable('projects');
  if (!available) {
    return { ok: false, error: 'Kolekcija "projects" nije dostupna na PocketBase-u. Provjeri da postoji i da ima public API pravila.' };
  }

  try {
    const formData = new FormData();
    formData.append('text', data.title); // PB uses "text" field instead of "title"
    formData.append('location', data.location);
    formData.append('year', data.year);
    formData.append('category', data.category);
    formData.append('partner', data.partner);
    formData.append('description_de', data.descriptionDE || data.title);
    formData.append('description_en', data.descriptionEN || data.title);
    formData.append('description_bhs', data.descriptionBHS || data.title);

    if (data.mainImageFile) {
      formData.append('main_image', data.mainImageFile);
    }

    for (const file of data.galleryFiles) {
      formData.append('gallery_images', file);
    }

    await pb.collection('projects').create(formData);
    window.dispatchEvent(new Event('np-data-updated'));
    return { ok: true };
  } catch (err: any) {
    const msg = err?.response?.message || err?.message || 'Nepoznata greška';
    const details = err?.response?.data ? JSON.stringify(err.response.data) : '';
    console.error('[NP] PocketBase addProject failed:', msg, details, err);
    return { ok: false, error: `PocketBase greška: ${msg}${details ? ' — ' + details : ''}` };
  }
}

export async function updateProjectInPB(
  id: string,
  data: {
    title?: string;
    location?: string;
    year?: string;
    category?: string;
    partner?: string;
    descriptionDE?: string;
    descriptionEN?: string;
    descriptionBHS?: string;
    mainImageFile?: File | null;
    galleryFiles?: File[];
    removeGalleryImages?: string[];
  }
): Promise<{ ok: boolean; error?: string }> {
  const available = await isCollectionAvailable('projects');
  if (!available) {
    return { ok: false, error: 'Kolekcija "projects" nije dostupna.' };
  }

  try {
    const formData = new FormData();
    if (data.title !== undefined) formData.append('text', data.title); // PB uses "text" field
    if (data.location !== undefined) formData.append('location', data.location);
    if (data.year !== undefined) formData.append('year', data.year);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.partner !== undefined) formData.append('partner', data.partner);
    if (data.descriptionDE !== undefined) formData.append('description_de', data.descriptionDE);
    if (data.descriptionEN !== undefined) formData.append('description_en', data.descriptionEN);
    if (data.descriptionBHS !== undefined) formData.append('description_bhs', data.descriptionBHS);

    if (data.mainImageFile) {
      formData.append('main_image', data.mainImageFile);
    }

    if (data.galleryFiles) {
      for (const file of data.galleryFiles) {
        formData.append('gallery_images', file);
      }
    }

    if (data.removeGalleryImages) {
      for (const filename of data.removeGalleryImages) {
        formData.append('gallery_images-', filename);
      }
    }

    await pb.collection('projects').update(id, formData);
    window.dispatchEvent(new Event('np-data-updated'));
    return { ok: true };
  } catch (err: any) {
    const msg = err?.response?.message || err?.message || 'Nepoznata greška';
    const details = err?.response?.data ? JSON.stringify(err.response.data) : '';
    console.error('[NP] PocketBase updateProject failed:', msg, details, err);
    return { ok: false, error: `PocketBase greška: ${msg}${details ? ' — ' + details : ''}` };
  }
}

export async function deleteProjectFromPB(id: string): Promise<{ ok: boolean; error?: string }> {
  const available = await isCollectionAvailable('projects');
  if (!available) {
    return { ok: false, error: 'Kolekcija "projects" nije dostupna.' };
  }

  try {
    await pb.collection('projects').delete(id);
    window.dispatchEvent(new Event('np-data-updated'));
    return { ok: true };
  } catch (err: any) {
    const msg = err?.response?.message || err?.message || 'Nepoznata greška';
    console.error('[NP] PocketBase deleteProject failed:', err);
    return { ok: false, error: `Greška: ${msg}` };
  }
}

// ---- GALLERY (PocketBase) ----

export async function getGalleryFromPB(): Promise<GalleryPhoto[]> {
  const available = await isCollectionAvailable('gallery');
  if (!available) return [];

  try {
    const records = await pb.collection('gallery').getFullList({
      sort: '-created',
    });

    return records.map((r) => ({
      id: r.id,
      src: r.image ? getFileUrl(r, r.image) : '',
      caption: r.caption || '',
      category: ((r.category || '').toUpperCase() as GalleryPhoto['category']) || '',
      baustelle: r.Baustelle || r.baustelle || '',
      location: r.Location || r.location || '',
      createdAt: r.created,
    }));
  } catch (err) {
    console.warn('[NP] PocketBase getGallery failed:', err);
    return [];
  }
}

export async function addPhotoToPB(
  file: File,
  caption: string,
  category?: string,
  baustelle?: string,
  location?: string
): Promise<{ ok: boolean; error?: string }> {
  const available = await isCollectionAvailable('gallery');
  if (!available) {
    return { ok: false, error: 'Kolekcija "gallery" nije dostupna na PocketBase-u. Provjeri da postoji i da ima public API pravila.' };
  }

  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);
    // PocketBase field names: category values are "Gewerbebau"/"Wohnbau" (not uppercase)
    // Field names are "Baustelle" and "Location" (capitalized)
    if (category) {
      const pbCategory = category === 'GEWERBEBAU' ? 'Gewerbebau'
        : category === 'WOHNBAU' ? 'Wohnbau'
        : category;
      formData.append('category', pbCategory);
    }
    if (baustelle) formData.append('Baustelle', baustelle);
    if (location) formData.append('Location', location);

    try {
      await pb.collection('gallery').create(formData);
    } catch (firstErr: any) {
      // Retry without extra fields that may not exist in PocketBase schema
      console.info('[NP] Gallery: category/baustelle/location fields not configured in PocketBase — uploading without them.');
      const fallbackData = new FormData();
      fallbackData.append('image', file);
      fallbackData.append('caption', caption);
      await pb.collection('gallery').create(fallbackData);
      window.dispatchEvent(new Event('np-data-updated'));
      return {
        ok: true,
        error: 'FIELDS_MISSING',
      };
    }

    window.dispatchEvent(new Event('np-data-updated'));
    return { ok: true };
  } catch (err: any) {
    const msg = err?.response?.message || err?.message || 'Nepoznata greška';
    const details = err?.response?.data ? JSON.stringify(err.response.data) : '';
    console.error('[NP] PocketBase addPhoto failed:', msg, details, err);
    return { ok: false, error: `PocketBase greška: ${msg}${details ? ' — ' + details : ''}` };
  }
}

export async function deletePhotoFromPB(id: string): Promise<{ ok: boolean; error?: string }> {
  const available = await isCollectionAvailable('gallery');
  if (!available) {
    return { ok: false, error: 'Kolekcija "gallery" nije dostupna.' };
  }

  try {
    await pb.collection('gallery').delete(id);
    window.dispatchEvent(new Event('np-data-updated'));
    return { ok: true };
  } catch (err: any) {
    const msg = err?.response?.message || err?.message || 'Nepoznata greška';
    console.error('[NP] PocketBase deletePhoto failed:', err);
    return { ok: false, error: `Greška: ${msg}` };
  }
}

// ---- RETRY PB CONNECTION (for admin refresh button) ----

export function retryPBConnection() {
  resetPBCache();
}

// ---- AUTH (ostaje lokalno - samo šifra) ----

const AUTH_KEY = 'np_admin_auth';
const ADMIN_PASSWORD = 'Elhamdulillah.7';

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function setAuth() {
  sessionStorage.setItem(AUTH_KEY, 'true');
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY);
}

// ---- FILE UTILITY ----

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 1200;
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}