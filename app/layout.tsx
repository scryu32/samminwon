import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GameProvider } from "@/context/game-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "3민원 처리하기 게임",
  description: "3개의 민원을 처리하여 게임에서 승리하세요!",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <GameProvider>{children}</GameProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
