// Shared helpers for image + video media stored in PocketBase file fields.

const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i

/** Accept string for admin file inputs: images + web video formats. */
export const MEDIA_ACCEPT = 'image/*,video/mp4,video/webm,video/quicktime'

/** Videos larger than this trigger a friendly "please compress" warning. */
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024

/** True for persisted URLs (PocketBase / http) whose path ends in a video extension. */
export function isVideoUrl(src?: string | null): boolean {
  if (!src || typeof src !== 'string') return false
  if (src.startsWith('blob:') || src.startsWith('data:')) return false
  const path = src.split('#')[0].split('?')[0]
  return VIDEO_RE.test(path)
}

/** True for a picked File that is a video. */
export function isVideoFile(file?: File | null): boolean {
  if (!file) return false
  if (file.type && file.type.startsWith('video/')) return true
  return VIDEO_RE.test(file.name || '')
}

/** Returns the oversized video files from a selection. */
export function oversizedVideos(files: File[]): File[] {
  return files.filter(f => isVideoFile(f) && f.size > MAX_VIDEO_BYTES)
}

export function formatMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`
}
