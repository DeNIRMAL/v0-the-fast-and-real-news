"use client"

import { useState, useEffect, useRef } from "react"
import { AlertTriangle, X } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface BreakingNews {
  id: number
  title: string
  timestamp: Date
  urgent: boolean
}

// Use actual dates for timestamps
const breakingNewsData: BreakingNews[] = [
  {
    id: 1,
    title: "Massive Floods Reported in Eastern States as Monsoon Intensifies",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    urgent: true,
  },
  {
    id: 2,
    title: "Prime Minister to Address Nation Tonight at 8 PM on Economic Reforms",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    urgent: true,
  },
  {
    id: 3,
    title: "Supreme Court Issues Landmark Ruling on Privacy Rights",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    urgent: false,
  },
]

// Function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

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

export default function BreakingNewsBar() {
  const [visible, setVisible] = useState(true)
  const [activeNewsIndex, setActiveNewsIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const rotateNews = () => {
    setActiveNewsIndex((prev) => (prev + 1) % breakingNewsData.length)
  }

  useEffect(() => {
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    if (!visible || isPaused) return

    intervalRef.current = setInterval(rotateNews, 8000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      clearInterval(timeInterval)
    }
  }, [visible, isPaused])

  if (!visible) return null

  const activeNews = breakingNewsData[activeNewsIndex]
  const relativeTime = formatRelativeTime(activeNews.timestamp)

  return (
    <div className="w-full bg-red-900/80 text-white mb-6 rounded-lg overflow-hidden">
      <div
        className="relative p-4 flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex-shrink-0 mr-3">
          <div className="bg-red-600 p-2 rounded-full">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="flex-grow overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center">
            <span className="mr-2">Breaking News</span>
            <span className="relative h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="ml-2 text-white/70">{relativeTime}</span>
          </div>

          <motion.div
            key={activeNews.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-lg md:text-xl"
          >
            {activeNews.title}
          </motion.div>
        </div>

        <div className="flex-shrink-0 ml-3 flex items-center space-x-2">
          <div className="hidden md:flex space-x-1">
            {breakingNewsData.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === activeNewsIndex ? "bg-white" : "bg-white/30"
                } transition-colors`}
                onClick={() => setActiveNewsIndex(index)}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-red-800/50"
            onClick={() => setVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
