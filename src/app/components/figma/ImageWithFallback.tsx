import React, { useState } from 'react'
import { isVideoUrl } from '@/app/lib/media'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type MediaProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Force video rendering (e.g. blob: previews where the URL has no extension). */
  isVideo?: boolean
  /** Show native video controls (lightbox). Default: false (muted autoplay loop). */
  videoControls?: boolean
  /** Loop the video. Default: true. */
  videoLoop?: boolean
  /** Autoplay (muted) the video. Default: true. When false, the first frame is shown as a still. */
  videoAutoPlay?: boolean
  /** Called when a non-looping video finishes. */
  onVideoEnded?: () => void
}

/**
 * Renders an <img> for images and a muted, inline <video> for .mp4/.webm/.mov
 * sources, keeping the same className/style (sizing, object-fit, filters).
 */
export function ImageWithFallback(props: MediaProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, isVideo, videoControls, videoLoop = true, videoAutoPlay = true, onVideoEnded, ...rest } = props

  if (isVideo || isVideoUrl(src)) {
    return (
      <video
        key={src}
        src={videoAutoPlay || !src || src.includes('#') ? src : `${src}#t=0.1`}
        className={className}
        style={style}
        aria-label={alt}
        title={alt}
        muted
        playsInline
        autoPlay={videoAutoPlay}
        loop={videoLoop}
        controls={videoControls}
        preload="metadata"
        onEnded={onVideoEnded}
      />
    )
  }

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
