import "./globals.css"
import { ppEditorialNewUltralightItalic, inter } from "./fonts"
import type React from "react"

export const metadata = {
  title: "The Fast and Real News (TFARN)",
  description:
    "\"The Fast and Real News\" (TFARN) is a dynamic digital newspaper committed to delivering accurate, unbiased, and rapid news coverage across the Indian subcontinent. From breaking political developments and economic updates to culture, science, and grassroots stories, TFARN ensures that readers stay informed with facts — not noise. With a focus on speed without sacrificing truth, TFARN is your reliable window into the realities shaping South Asia.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
