"use client"
import { Slider } from "@/components/ui/slider"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface FrameComponentProps {
  id: number
  image: string
  width: number | string
  height: number | string
  className?: string
  corner: string
  edgeHorizontal: string
  edgeVertical: string
  mediaSize: number
  borderThickness: number
  borderSize: number
  onMediaSizeChange: (value: number) => void
  onBorderThicknessChange: (value: number) => void
  onBorderSizeChange: (value: number) => void
  showControls: boolean
  label: string
  showFrame: boolean
  isHovered: boolean
  title: string
  summary: string
  publishedAt: string
  url?: string // Optional URL for external links
}

export function FrameComponent({
  id,
  image,
  width,
  height,
  className = "",
  corner,
  edgeHorizontal,
  edgeVertical,
  mediaSize,
  borderThickness,
  borderSize,
  onMediaSizeChange,
  onBorderThicknessChange,
  onBorderSizeChange,
  showControls,
  label,
  showFrame,
  isHovered,
  title,
  summary,
  publishedAt,
  url,
}: FrameComponentProps) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState<string>(publishedAt)

  // Update the time display every minute
  useEffect(() => {
    setCurrentTime(publishedAt)

    // If the publishedAt is already a formatted string (like "5 minutes ago"),
    // we don't need to update it frequently
    if (!publishedAt.includes("ago")) {
      return
    }

    const interval = setInterval(() => {
      setCurrentTime(publishedAt)
    }, 60000)

    return () => clearInterval(interval)
  }, [publishedAt])

  const handleClick = () => {
    if (url) {
      // If it's an external URL (starts with http), open in new tab
      if (url.startsWith("http")) {
        window.open(url, "_blank")
      } else {
        // Otherwise navigate internally
        router.push(url)
      }
    } else {
      // Default behavior - navigate to article page
      router.push(`/article/${id}`)
    }
  }

  return (
    <div
      className={`relative ${className} cursor-pointer group`}
      style={{
        width,
        height,
        transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
      }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Image with Border */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: 1,
            transition: "all 0.3s ease-in-out",
            padding: showFrame ? `${borderThickness}px` : "0",
            width: showFrame ? `${borderSize}%` : "100%",
            height: showFrame ? `${borderSize}%` : "100%",
            left: showFrame ? `${(100 - borderSize) / 2}%` : "0",
            top: showFrame ? `${(100 - borderSize) / 2}%` : "0",
          }}
        >
          <div
            className="w-full h-full overflow-hidden"
            style={{
              transform: `scale(${mediaSize})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <div className="w-full h-full relative">
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* Frame Elements (Higher z-index) */}
        {showFrame && (
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            {/* Corners */}
            <div
              className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})` }}
            />
            <div
              className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scaleX(-1)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scaleY(-1)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scale(-1, -1)" }}
            />

            {/* Edges */}
            <div
              className="absolute top-0 left-16 right-16 h-16"
              style={{
                backgroundImage: `url(${edgeHorizontal})`,
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
              }}
            />
            <div
              className="absolute bottom-0 left-16 right-16 h-16"
              style={{
                backgroundImage: `url(${edgeHorizontal})`,
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
                transform: "rotate(180deg)",
              }}
            />
            <div
              className="absolute left-0 top-16 bottom-16 w-16"
              style={{
                backgroundImage: `url(${edgeVertical})`,
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
              }}
            />
            <div
              className="absolute right-0 top-16 bottom-16 w-16"
              style={{
                backgroundImage: `url(${edgeVertical})`,
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
                transform: "scaleX(-1)",
              }}
            />
          </div>
        )}

        {/* Article Info Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{summary}</p>
          <div className="text-white/60 text-xs mt-2">{currentTime}</div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 z-10">
          <div className="text-white font-bold mb-2">{label}</div>
          <div className="space-y-2">
            <div>
              <label htmlFor={`media-size-${label}`} className="block text-sm font-medium text-white">
                Media Size: {mediaSize.toFixed(2)}
              </label>
              <Slider
                id={`media-size-${label}`}
                min={0.5}
                max={3}
                step={0.01}
                value={[mediaSize]}
                onValueChange={(value) => onMediaSizeChange(value[0])}
              />
            </div>
            <div>
              <label htmlFor={`border-thickness-${label}`} className="block text-sm font-medium text-white">
                Border Thickness: {borderThickness}px
              </label>
              <Slider
                id={`border-thickness-${label}`}
                min={0}
                max={20}
                step={1}
                value={[borderThickness]}
                onValueChange={(value) => onBorderThicknessChange(value[0])}
              />
            </div>
            <div>
              <label htmlFor={`border-size-${label}`} className="block text-sm font-medium text-white">
                Border Size: {borderSize}%
              </label>
              <Slider
                id={`border-size-${label}`}
                min={50}
                max={100}
                step={1}
                value={[borderSize]}
                onValueChange={(value) => onBorderSizeChange(value[0])}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
