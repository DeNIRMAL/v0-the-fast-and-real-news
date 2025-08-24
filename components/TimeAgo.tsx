"use client"

import { useState, useEffect } from "react"

interface TimeAgoProps {
  date: string | Date
  className?: string
  updateInterval?: number // in milliseconds
}

export default function TimeAgo({ date, className = "", updateInterval = 60000 }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date()
      const publishedDate = date instanceof Date ? date : new Date(date)
      const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000)

      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds} ${diffInSeconds === 1 ? "second" : "seconds"} ago`)
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        setTimeAgo(`${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`)
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        setTimeAgo(`${hours} ${hours === 1 ? "hour" : "hours"} ago`)
      } else {
        const days = Math.floor(diffInSeconds / 86400)
        setTimeAgo(`${days} ${days === 1 ? "day" : "days"} ago`)
      }
    }

    // Calculate immediately
    calculateTimeAgo()

    // Update at the specified interval
    const interval = setInterval(calculateTimeAgo, updateInterval)

    return () => clearInterval(interval)
  }, [date, updateInterval])

  return <span className={className}>{timeAgo}</span>
}
