"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, AlertCircle } from "lucide-react"
import { useGameContext } from "@/context/game-context"
import type { Complaint } from "@/types/game"
import { useMobile } from "@/hooks/use-mobile"

interface EmailListProps {
  complaints: Complaint[]
  selectedEmail: string | null
  onSelectEmail: (id: string) => void
}

export default function EmailList({ complaints, selectedEmail, onSelectEmail }: EmailListProps) {
  const { completedComplaints, isLatestComplaint } = useGameContext()
  const isMobile = useMobile()

  // 타임스탬프 기준으로 정렬 (최신순)
  const sortedComplaints = [...complaints].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="border-r h-full">
      <ScrollArea className="h-full">
        <div className="flex flex-col">
          {sortedComplaints.map((complaint) => {
            const isCompleted = completedComplaints.includes(complaint.id)
            const isLatest = isLatestComplaint(complaint)
            const isFailure = complaint.isFailureNotice

            // 원본 민원이 있는 경우 찾기
            const originalComplaint = complaint.originalId
              ? complaints.find((c) => c.id === complaint.originalId)
              : undefined

            return (
              <button
                key={complaint.id}
                onClick={() => onSelectEmail(complaint.id)}
                className={`flex items-start p-3 text-left border-b hover:bg-gray-50 transition-colors ${
                  selectedEmail === complaint.id ? "bg-gray-50" : ""
                } ${isCompleted ? "opacity-70" : ""}`}
                disabled={!isLatest && !isCompleted}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium truncate max-w-full">{complaint.sender}</div>
                    <div className="flex flex-wrap gap-1">
                      {isCompleted && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          <Check className="mr-1 h-3 w-3" />
                          처리됨
                        </span>
                      )}
                      {isFailure && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          실패
                        </span>
                      )}
                      {!isLatest && !isCompleted && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                          이전 메일
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-medium truncate">
                    {complaint.subject}
                    {originalComplaint && isMobile && (
                      <div className="text-xs text-blue-600">원본: {originalComplaint.subject}</div>
                    )}
                    {originalComplaint && !isMobile && (
                      <span className="text-xs text-blue-600 ml-2">(원본: {originalComplaint.subject})</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{complaint.preview}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(complaint.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
