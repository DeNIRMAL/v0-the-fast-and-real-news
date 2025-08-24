"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState } from "react"
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  LinkIcon,
  Share2,
  MessageCircle,
  Instagram,
  Send,
  Copy,
  Check,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface SocialShareButtonsProps {
  url: string
  title: string
  summary?: string
  hashtags?: string[]
  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal"
}

export default function SocialShareButtons({
  url,
  title,
  summary = "",
  hashtags = [],
  size = "md",
  variant = "default",
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  // Ensure we have the full URL (only in browser)
  const fullUrl = isBrowser && url.startsWith("http") ? url : url

  // Prepare sharing data
  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedSummary = encodeURIComponent(summary)
  const encodedHashtags = hashtags.join(",")

  // Social sharing URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0A${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  }

  const handleShare = (platform: string) => {
    const shareUrl = shareUrls[platform as keyof typeof shareUrls]

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  const copyToClipboard = () => {
    if (!isBrowser) return

    navigator.clipboard.writeText(fullUrl)
    setCopied(true)

    toast({
      title: "Link copied!",
      description: "The article link has been copied to your clipboard.",
      duration: 3000,
    })

    setTimeout(() => setCopied(false), 3000)
  }

  // Native share API for mobile devices
  const nativeShare = () => {
    if (!isBrowser) return

    if (navigator.share) {
      navigator
        .share({
          title,
          text: summary,
          url: fullUrl,
        })
        .catch((error) => console.error("Error sharing:", error))
    }
  }

  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
  }

  // If variant is minimal, just show the dropdown
  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
            <Share2 className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-white">
          <DropdownMenuLabel>Share Article</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer hover:bg-gray-700">
              <Facebook className="mr-2 h-4 w-4 text-blue-500" />
              <span>Facebook</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer hover:bg-gray-700">
              <Twitter className="mr-2 h-4 w-4 text-sky-500" />
              <span>Twitter</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="cursor-pointer hover:bg-gray-700">
              <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
              <span>WhatsApp</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare("telegram")} className="cursor-pointer hover:bg-gray-700">
              <Send className="mr-2 h-4 w-4 text-blue-400" />
              <span>Telegram</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare("linkedin")} className="cursor-pointer hover:bg-gray-700">
              <Linkedin className="mr-2 h-4 w-4 text-blue-600" />
              <span>LinkedIn</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare("email")} className="cursor-pointer hover:bg-gray-700">
              <Mail className="mr-2 h-4 w-4 text-gray-400" />
              <span>Email</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer hover:bg-gray-700">
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4 text-gray-400" />
            )}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </DropdownMenuItem>
          {isBrowser && navigator.share && (
            <DropdownMenuItem onClick={nativeShare} className="cursor-pointer hover:bg-gray-700">
              <Share2 className="mr-2 h-4 w-4 text-gray-400" />
              <span>Share via...</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Default variant with visible buttons
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="icon"
        className={`${sizeClasses[size]} bg-blue-600 hover:bg-blue-700 border-none rounded-full`}
        onClick={() => handleShare("facebook")}
        aria-label="Share on Facebook"
      >
        <Facebook className={`h-${iconSize[size] / 4} w-${iconSize[size] / 4} text-white`} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${sizeClasses[size]} bg-sky-500 hover:bg-sky-600 border-none rounded-full`}
        onClick={() => handleShare("twitter")}
        aria-label="Share on Twitter"
      >
        <Twitter className={`h-${iconSize[size] / 4} w-${iconSize[size] / 4} text-white`} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${sizeClasses[size]} bg-green-500 hover:bg-green-600 border-none rounded-full`}
        onClick={() => handleShare("whatsapp")}
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className={`h-${iconSize[size] / 4} w-${iconSize[size] / 4} text-white`} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${sizeClasses[size]} bg-blue-500 hover:bg-blue-600 border-none rounded-full`}
        onClick={() => handleShare("linkedin")}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className={`h-${iconSize[size] / 4} w-${iconSize[size] / 4} text-white`} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${sizeClasses[size]} bg-pink-600 hover:bg-pink-700 border-none rounded-full`}
        onClick={() => handleShare("pinterest")}
        aria-label="Share on Pinterest"
      >
        <Instagram className={`h-${iconSize[size] / 4} w-${iconSize[size] / 4} text-white`} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${sizeClasses[size]} bg-gray-600 hover:bg-gray-700 border-none rounded-full`}
        onClick={() => handleShare("email")}
        aria-label="Share via Email"
      >
        <Mail className={`h-${iconSize[size] / 4} w-${iconSize[size] / 4} text-white`} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${sizeClasses[size]} bg-gray-700 hover:bg-gray-800 border-none rounded-full`}
        onClick={copyToClipboard}
        aria-label="Copy Link"
      >
        {copied ? (
          <Check className={`h-${iconSize[size] / 4} w-${iconSize[size] / 4} text-green-500`} />
        ) : (
          <LinkIcon className={`h-${iconSize[size] / 4} w-${iconSize[size] / 4} text-white`} />
        )}
      </Button>

      {isBrowser && navigator.share && (
        <Button
          variant="outline"
          size="icon"
          className={`${sizeClasses[size]} bg-purple-600 hover:bg-purple-700 border-none rounded-full`}
          onClick={nativeShare}
          aria-label="Native Share"
        >
          <Share2 className={`h-${iconSize[size] / 4} w-${iconSize[size] / 4} text-white`} />
        </Button>
      )}
    </div>
  )
}
