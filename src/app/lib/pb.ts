import PocketBase from 'pocketbase';

// ============================================================
// POSTAVI SVOJ POCKETHOST URL OVDJE:
// Idi na https://pockethost.io, napravi instancu, i zamijeni URL
// ============================================================
const PB_URL = 'https://nphochbau.pockethost.io';

export const pb = new PocketBase(PB_URL);

// Disable auto-cancellation (bitno za React re-renders)
pb.autoCancellation(false);

// ============================================================
// KOLEKCIJE KOJE TREBAŠ NAPRAVITI U POCKETBASE ADMIN PANELU:
//
// 1. Collection: "projects"
//    Fields:
//    - text (text, required) ← NOTE: PocketBase names this "text" by default, NOT "title"
//    - location (text)
//    - year (text)
//    - category (select: GEWERBEBAU, WOHNBAU, required)
//    - partner (text)
//    - description_de (text)
//    - description_en (text)
//    - description_bhs (text)
//    - main_image (file, single, required)
//    - gallery_images (file, multiple)
//    API Rules: List/View = "" (public), Create/Update/Delete = "" (public)
//
// 2. Collection: "gallery"
//    Fields:
//    - image (file, single, required)
//    - caption (text)
//    API Rules: List/View = "" (public), Create/Update/Delete = "" (public)
//
// VAŽNO: Za API Rules ostavi prazno ("") za sve operacije
// da bi mogao pristupiti bez autentifikacije.
// ============================================================

// Track whether PB collections are available (per-collection)
const _collectionAvailable: Record<string, boolean | null> = {
  projects: null,
  gallery: null,
};

// Track timestamp of last failed check (so we retry after a cooldown)
const _lastFailedCheck: Record<string, number> = {};
const RETRY_COOLDOWN_MS = 5000; // retry failed checks after 5 seconds

/**
 * Check if a specific PocketBase collection is reachable and has public API rules.
 * Caches successes permanently, but retries failures after cooldown.
 */
export async function isCollectionAvailable(name: string): Promise<boolean> {
  // If previously confirmed available, return true
  if (_collectionAvailable[name] === true) {
    return true;
  }

  // If previously failed, only retry after cooldown
  if (_collectionAvailable[name] === false) {
    const lastFailed = _lastFailedCheck[name] || 0;
    if (Date.now() - lastFailed < RETRY_COOLDOWN_MS) {
      return false;
    }
    // Cooldown expired, retry
    _collectionAvailable[name] = null;
  }

  try {
    await pb.collection(name).getList(1, 1);
    _collectionAvailable[name] = true;
  } catch (err: any) {
    if (err?.status === 403 || err?.status === 404) {
      console.info(
        `[NP Hochbau] Kolekcija "${name}" nije dostupna (${err?.status}). ` +
        `Idi na ${PB_URL}/_/ i provjeri da kolekcija postoji sa public API pravilima (prazna polja).`
      );
    } else {
      console.warn(`[NP Hochbau] Kolekcija "${name}" check failed:`, err?.message || err);
    }
    _collectionAvailable[name] = false;
    _lastFailedCheck[name] = Date.now();
  }

  return _collectionAvailable[name]!;
}

/**
 * Reset the availability cache (e.g. after user says they set up PB)
 */
export function resetPBCache() {
  for (const key of Object.keys(_collectionAvailable)) {
    _collectionAvailable[key] = null;
  }
  // Also clear failed check timestamps
  for (const key of Object.keys(_lastFailedCheck)) {
    delete _lastFailedCheck[key];
  }
}

/**
 * Check if ANY collection was confirmed available (used for connection status display)
 */
export function isAnyCollectionAvailable(): boolean {
  return Object.values(_collectionAvailable).some(v => v === true);
}

// Helper: Get file URL from PocketBase record using the official SDK method
export function getFileUrl(
  record: { [key: string]: any },
  filename: string,
  thumb?: string
): string {
  if (!filename) return '';
  const queryParams = thumb ? { thumb } : undefined;
  return pb.files.getURL(record, filename, queryParams);
}