"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Flag, MoreVertical, Send } from "lucide-react"
import TimeAgo from "@/components/TimeAgo"

interface Comment {
  id: string
  articleId: string | number
  author: {
    name: string
    avatar?: string
    location?: string
  }
  content: string
  timestamp: Date
  likes: number
  userLiked: boolean
  replies?: Comment[]
}

interface CommentSectionProps {
  articleId: string | number
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<string | null>(null)

  // Load comments from localStorage on mount
  useEffect(() => {
    const storedComments = localStorage.getItem(`comments-${articleId}`)
    if (storedComments) {
      try {
        // Parse the stored comments and convert timestamp strings back to Date objects
        const parsedComments = JSON.parse(storedComments).map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp),
          replies: comment.replies
            ? comment.replies.map((reply: any) => ({
                ...reply,
                timestamp: new Date(reply.timestamp),
              }))
            : [],
        }))
        setComments(parsedComments)
      } catch (error) {
        console.error("Error parsing stored comments:", error)
      }
    }

    // Try to get user's stored name
    const storedName = localStorage.getItem("userName")
    if (storedName) {
      setUserName(storedName)
    }

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            )

            if (response.ok) {
              const data = await response.json()
              if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || ""
                const state = data.address.state || ""
                const country = data.address.country || ""

                const locationString = [city, state, country].filter(Boolean).join(", ")
                setUserLocation(locationString)
              }
            }
          } catch (error) {
            console.error("Error getting location details:", error)
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error)
        },
      )
    }
  }, [articleId])

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments-${articleId}`, JSON.stringify(comments))
    }
  }, [comments, articleId])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    if (!userName.trim()) {
      const name = prompt("Please enter your name to comment:")
      if (!name) return
      setUserName(name)
      localStorage.setItem("userName", name)
    }

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        articleId,
        author: {
          name: userName,
          location: userLocation || undefined,
        },
        content: newComment,
        timestamp: new Date(),
        likes: 0,
        userLiked: false,
        replies: [],
      }

      setComments([newCommentObj, ...comments])
      setNewComment("")
      setIsLoading(false)

      // Track user data (in a real app, this would be sent to a backend)
      const userData = {
        commentId: newCommentObj.id,
        userName,
        location: userLocation,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        articleId,
      }

      console.log("User data collected:", userData)
    }, 500)
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1,
            userLiked: !comment.userLiked,
          }
        }
        return comment
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white/90">Comments ({comments.length})</h3>
      </div>

      {/* Comment form */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              className="bg-white/5 border-white/10 text-white/80 placeholder:text-white/30 min-h-[100px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-white/50">
                {userName ? `Commenting as ${userName}` : "Enter your name when prompted"}
              </div>
              <Button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                {isLoading ? "Posting..." : "Post Comment"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-white/50">Be the first to comment on this article</div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                    <AvatarFallback className="bg-white/10 text-white">
                      {comment.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white/90">{comment.author.name}</div>
                        <div className="text-xs text-white/50 flex items-center gap-2">
                          <TimeAgo date={comment.timestamp} updateInterval={10000} />
                          {comment.author.location && (
                            <>
                              <span>•</span>
                              <span>{comment.author.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-white/80">{comment.content}</div>
                    <div className="flex items-center gap-4 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1 text-xs ${
                          comment.userLiked ? "text-blue-400" : "text-white/50"
                        }`}
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{comment.likes > 0 ? comment.likes : ""} Like</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs text-white/50">
                        <Flag className="h-3.5 w-3.5" />
                        <span>Report</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
