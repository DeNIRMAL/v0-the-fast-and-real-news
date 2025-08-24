"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FrameComponent } from "./FrameComponent"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

const GRID_SIZE = 12
const CELL_SIZE = 60 // pixels per grid cell

interface Frame {
  id: number
  image: string
  defaultPos: { x: number; y: number; w: number; h: number }
  corner: string
  edgeHorizontal: string
  edgeVertical: string
  mediaSize: number
  borderThickness: number
  borderSize: number
  autoplayMode: "all" | "hover"
  isHovered: boolean
  title: string
  summary: string
  publishedAt: string
  url?: string // Optional URL for external links
}

// Update the frames to use placeholder images instead of videos
const initialFrames: Frame[] = [
  {
    id: 1,
    image: "/placeholder.svg?height=400&width=600",
    defaultPos: { x: 0, y: 0, w: 4, h: 4 },
    corner: "https://static.cdn-luma.com/files/bcf576df9c38b05f/1_corner_update.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/bcf576df9c38b05f/1_vert_update.png",
    edgeVertical: "https://static.cdn-luma.com/files/bcf576df9c38b05f/1_hori_update.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    autoplayMode: "all",
    isHovered: false,
    title: "Escalating Tensions: India Accuses Pakistan of Missile Attack and Launches Retaliation",
    summary:
      "India has accused Pakistan of attempting a pre-emptive strike using a high-speed missile targeting critical Indian military infrastructure.",
    publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    url: "/article/india-pakistan-tensions",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=400&width=600",
    defaultPos: { x: 4, y: 0, w: 4, h: 4 },
    corner: "https://static.cdn-luma.com/files/bcf576df9c38b05f/2_corner_update.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/bcf576df9c38b05f/2_vert_update.png",
    edgeVertical: "https://static.cdn-luma.com/files/bcf576df9c38b05f/2_hori_update.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    autoplayMode: "all",
    isHovered: false,
    title: "Indian Economy Shows Strong Growth in Q2",
    summary: "Economic indicators point to a robust recovery with GDP growth exceeding expectations by 2.3%.",
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 3,
    image: "/placeholder.svg?height=400&width=600",
    defaultPos: { x: 8, y: 0, w: 4, h: 4 },
    corner: "https://static.cdn-luma.com/files/3d36d1e0dba2476c/3_Corner_update.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/3d36d1e0dba2476c/3_hori_update.png",
    edgeVertical: "https://static.cdn-luma.com/files/3d36d1e0dba2476c/3_Vert_update.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    autoplayMode: "all",
    isHovered: false,
    title: "Breakthrough in Renewable Energy Technology",
    summary: "Scientists in Bangalore have developed a new solar panel technology that increases efficiency by 40%.",
    publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    image: "/placeholder.svg?height=400&width=600",
    defaultPos: { x: 0, y: 4, w: 4, h: 4 },
    corner: "https://static.cdn-luma.com/files/9e67e05f37e52522/4_corner_update.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/9e67e05f37e52522/4_hori_update.png",
    edgeVertical: "https://static.cdn-luma.com/files/9e67e05f37e52522/4_vert_update.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    autoplayMode: "all",
    isHovered: false,
    title: "Cultural Festival Draws Record Crowds in Mumbai",
    summary: "The annual cultural festival celebrated diversity with performances from across the subcontinent.",
    publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    image: "/placeholder.svg?height=400&width=600",
    defaultPos: { x: 4, y: 4, w: 4, h: 4 },
    corner: "https://static.cdn-luma.com/files/9e67e05f37e52522/5_corner_update.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/9e67e05f37e52522/5_hori_update.png",
    edgeVertical: "https://static.cdn-luma.com/files/9e67e05f37e52522/5_verti_update.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    autoplayMode: "all",
    isHovered: false,
    title: "Cricket Team Announces New Captain for World Cup",
    summary: "The national cricket board has appointed a new captain ahead of the upcoming World Cup tournament.",
    publishedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    image: "/placeholder.svg?height=400&width=600",
    defaultPos: { x: 8, y: 4, w: 4, h: 4 },
    corner: "https://static.cdn-luma.com/files/1199340587e8da1d/6_corner.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/1199340587e8da1d/6_corner-1.png",
    edgeVertical: "https://static.cdn-luma.com/files/1199340587e8da1d/6_vert.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    autoplayMode: "all",
    isHovered: false,
    title: "Health Ministry Launches New Vaccination Campaign",
    summary: "A nationwide vaccination drive aims to immunize children against preventable diseases in rural areas.",
    publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    image: "/placeholder.svg?height=400&width=600",
    defaultPos: { x: 0, y: 8, w: 4, h: 4 },
    corner: "https://static.cdn-luma.com/files/b80b5aa00ccc33bd/7_corner.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/b80b5aa00ccc33bd/7_hori.png",
    edgeVertical: "https://static.cdn-luma.com/files/b80b5aa00ccc33bd/7_vert.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    autoplayMode: "all",
    isHovered: false,
    title: "Tech Startups in Hyderabad Secure Record Funding",
    summary: "Venture capital investments in Hyderabad's tech sector have reached an all-time high this quarter.",
    publishedAt: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    image: "/placeholder.svg?height=400&width=600",
    defaultPos: { x: 4, y: 8, w: 4, h: 4 },
    corner: "https://static.cdn-luma.com/files/981e483f71aa764b/8_corner.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/981e483f71aa764b/8_hori.png",
    edgeVertical: "https://static.cdn-luma.com/files/981e483f71aa764b/8_verticle.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    autoplayMode: "all",
    isHovered: false,
    title: "Environmental Activists Win Landmark Court Case",
    summary:
      "Supreme Court rules in favor of protecting forest land from industrial development in a historic decision.",
    publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    image: "/placeholder.svg?height=400&width=600",
    defaultPos: { x: 8, y: 8, w: 4, h: 4 },
    corner: "https://static.cdn-luma.com/files/981e483f71aa764b/9_corner.png",
    edgeHorizontal: "https://static.cdn-luma.com/files/981e483f71aa764b/9_hori.png",
    edgeVertical: "https://static.cdn-luma.com/files/981e483f71aa764b/9_vert.png",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    autoplayMode: "all",
    isHovered: false,
    title: "Education Reform Bill Passes in Parliament",
    summary:
      "New legislation aims to modernize the education system and improve access to quality education nationwide.",
    publishedAt: new Date(Date.now() - 135 * 60 * 1000).toISOString(),
  },
]

// Add a function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const publishedDate = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  }
}

export default function DynamicFrameLayout() {
  const [frames, setFrames] = useState<Frame[]>(initialFrames)
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)
  const [hoverSize, setHoverSize] = useState(6)
  const [gapSize, setGapSize] = useState(4)
  const [showControls, setShowControls] = useState(false)
  const [cleanInterface, setCleanInterface] = useState(true)
  const [showFrames, setShowFrames] = useState(false)
  const [autoplayMode, setAutoplayMode] = useState<"all" | "hover">("all")
  const [isMobile, setIsMobile] = useState(false)
  const [layout, setLayout] = useState<"grid" | "list">("grid")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second to keep relative times accurate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Check if we're on a mobile device and adjust layout
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile && layout === "grid") {
        setLayout("list")
      } else if (!mobile && layout === "list") {
        setLayout("grid")
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
      // Ensure all video playback is stopped when component unmounts
    }
  }, [layout])

  const getRowSizes = () => {
    if (hovered === null) {
      return "4fr 4fr 4fr"
    }
    const { row } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) {
      return "4fr 4fr 4fr"
    }
    const { col } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom"
    const horizontal = x === 0 ? "left" : x === 4 ? "center" : "right"
    return `${vertical} ${horizontal}`
  }

  const updateFrameProperty = (id: number, property: keyof Frame, value: number) => {
    setFrames(frames.map((frame) => (frame.id === id ? { ...frame, [property]: value } : frame)))
  }

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  const toggleCleanInterface = () => {
    setCleanInterface(!cleanInterface)
    if (!cleanInterface) {
      setShowControls(false)
    }
  }

  // Calculate relative times for all frames
  const framesWithUpdatedTimes = frames.map((frame) => ({
    ...frame,
    relativeTime: formatRelativeTime(frame.publishedAt),
  }))

  // Render grid layout for desktop
  if (layout === "grid") {
    return (
      <div className="space-y-4 w-full h-full">
        {!cleanInterface && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Dynamic Frame Layout</h2>
            <div className="space-x-2">
              <Button onClick={toggleControls}>{showControls ? "Hide Controls" : "Show Controls"}</Button>
              <Button onClick={toggleCleanInterface}>{cleanInterface ? "Show UI" : "Hide UI"}</Button>
            </div>
          </div>
        )}
        {!cleanInterface && showControls && (
          <>
            <div className="space-y-2">
              <label htmlFor="hover-size" className="block text-sm font-medium text-gray-200">
                Hover Size: {hoverSize}
              </label>
              <Slider
                id="hover-size"
                min={4}
                max={8}
                step={0.1}
                value={[hoverSize]}
                onValueChange={(value) => setHoverSize(value[0])}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gap-size" className="block text-sm font-medium text-gray-200">
                Gap Size: {gapSize}px
              </label>
              <Slider
                id="gap-size"
                min={0}
                max={20}
                step={1}
                value={[gapSize]}
                onValueChange={(value) => setGapSize(value[0])}
              />
            </div>
          </>
        )}
        <div
          className="relative w-full h-full"
          style={{
            display: "grid",
            gridTemplateRows: getRowSizes(),
            gridTemplateColumns: getColSizes(),
            gap: `${gapSize}px`,
            transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
          }}
        >
          {framesWithUpdatedTimes.map((frame) => {
            const row = Math.floor(frame.defaultPos.y / 4)
            const col = Math.floor(frame.defaultPos.x / 4)
            const transformOrigin = getTransformOrigin(frame.defaultPos.x, frame.defaultPos.y)

            return (
              <motion.div
                key={frame.id}
                className="relative"
                style={{
                  transformOrigin,
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={() => setHovered({ row, col })}
                onMouseLeave={() => setHovered(null)}
              >
                <FrameComponent
                  id={frame.id}
                  image={frame.image}
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                  corner={frame.corner}
                  edgeHorizontal={frame.edgeHorizontal}
                  edgeVertical={frame.edgeVertical}
                  mediaSize={frame.mediaSize}
                  borderThickness={frame.borderThickness}
                  borderSize={frame.borderSize}
                  onMediaSizeChange={(value) => updateFrameProperty(frame.id, "mediaSize", value)}
                  onBorderThicknessChange={(value) => updateFrameProperty(frame.id, "borderThickness", value)}
                  onBorderSizeChange={(value) => updateFrameProperty(frame.id, "borderSize", value)}
                  showControls={showControls && !cleanInterface}
                  label={`Frame ${frame.id}`}
                  showFrame={showFrames}
                  isHovered={
                    hovered?.row === Math.floor(frame.defaultPos.y / 4) &&
                    hovered?.col === Math.floor(frame.defaultPos.x / 4)
                  }
                  title={frame.title}
                  summary={frame.summary}
                  publishedAt={frame.relativeTime}
                  url={frame.url}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render list layout for mobile
  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 gap-4">
        {framesWithUpdatedTimes.map((frame) => (
          <div key={frame.id} className="relative aspect-video w-full">
            <FrameComponent
              id={frame.id}
              image={frame.image}
              width="100%"
              height="100%"
              className="absolute inset-0"
              corner={frame.corner}
              edgeHorizontal={frame.edgeHorizontal}
              edgeVertical={frame.edgeVertical}
              mediaSize={frame.mediaSize}
              borderThickness={frame.borderThickness}
              borderSize={frame.borderSize}
              onMediaSizeChange={(value) => updateFrameProperty(frame.id, "mediaSize", value)}
              onBorderThicknessChange={(value) => updateFrameProperty(frame.id, "borderThickness", value)}
              onBorderSizeChange={(value) => updateFrameProperty(frame.id, "borderSize", value)}
              showControls={false}
              label={`Frame ${frame.id}`}
              showFrame={showFrames}
              isHovered={false}
              title={frame.title}
              summary={frame.summary}
              publishedAt={frame.relativeTime}
              url={frame.url}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
