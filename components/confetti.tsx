"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"
import { useMobile } from "@/hooks/use-mobile"

export function Confetti() {
  const [isActive, setIsActive] = useState(true)
  const isMobile = useMobile()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!isActive) return null

  return (
    <ReactConfetti
      width={typeof window !== "undefined" ? window.innerWidth : 1000}
      height={typeof window !== "undefined" ? window.innerHeight : 1000}
      recycle={false}
      numberOfPieces={isMobile ? 100 : 200}
    />
  )
}
