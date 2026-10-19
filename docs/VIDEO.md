# Videos in projects / Einblicke

Admin file pickers (Glavna slika, Galerija, Einblicke) accept images **and** `mp4`, `webm`, `mov`.
Videos are stored in the same PocketBase file fields (`projects.main_image`, `projects.gallery_images`, `gallery.image`).
The site renders any file ending in `.mp4/.webm/.mov/.m4v` as a muted, inline, autoplaying `<video>` (with controls in the project lightbox).
Einblicke does not auto-advance while a video is showing; it moves on when the clip ends.

## Size limit
Videos over **50 MB** are rejected in the admin with a hint to compress.
PocketBase fields must allow video MIME types and maxSize ≥ 50 MB (52428800).

## Compress DJI clips (4K/HEVC → 1080p H.264, web-friendly)
```bash
ffmpeg -i DJI_0001.MP4 -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -vf "scale='min(1920,iw)':-2" -crf 23 -preset medium -movflags +faststart -an DJI_0001-web.mp4
```
Aim for 5–15 MB per 15–40 s clip (raise `-crf` to 26–28 or use `scale=1280:-2` if still too big).
