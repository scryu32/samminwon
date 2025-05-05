"use client"

import { useGameContext } from "@/context/game-context"
import { useMobile } from "@/hooks/use-mobile"

export default function GameStats() {
  const { completedSenders, complaints } = useGameContext()
  const isMobile = useMobile()

  // 고유한 발신자 ID 목록 (민원처리과 제외)
  const uniqueSenderIds = [...new Set(complaints.filter((c) => c.sender !== "민원처리과").map((c) => c.senderId))]

  const totalSenders = uniqueSenderIds.length
  const completedCount = uniqueSenderIds.filter((id) => completedSenders.includes(id)).length

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {!isMobile && (
        <div className="text-xs sm:text-sm font-medium whitespace-nowrap">
          처리: {completedCount}/{totalSenders}
        </div>
      )}
      <div className="flex gap-1">
        {Array.from({ length: totalSenders }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${index < completedCount ? "bg-green-500" : "bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  )
}
