"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, ArrowLeft } from "lucide-react"
import type { Complaint } from "@/types/game"
import { useGameContext } from "@/context/game-context"
import { processComplaint } from "@/lib/game-api"
import { generateFailureReason } from "@/lib/gpt-api"
import { useMobile } from "@/hooks/use-mobile"

interface EmailViewProps {
  complaint: Complaint
}

export default function EmailView({ complaint }: EmailViewProps) {
  const [reply, setReply] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { completeComplaint, completedComplaints, addFailureEmail, isLatestComplaint, complaints } = useGameContext()
  const isMobile = useMobile()

  const isCompleted = completedComplaints.includes(complaint.id)
  const isLatest = isLatestComplaint(complaint)

  // 원본 민원이 있는 경우 찾기
  const originalComplaint = complaint.originalId ? complaints.find((c) => c.id === complaint.originalId) : undefined

  const handleReply = async () => {
    if (!reply.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // 민원 처리 API 호출 (complaint 객체 전달)
      const result = await processComplaint(complaint.id, reply, complaint)

      if (result.gameres === "success") {
        completeComplaint(complaint.id, reply)
        setIsReplying(false)
        setReply("")
      } else {
        // 실패 시 GPT API를 호출하여 실패 이유 생성 (complaint 객체 전달)
        const failureResponse = await generateFailureReason(complaint.id, reply, complaint)

        // 실패 이유를 담은 새 메일 생성
        addFailureEmail(complaint.id, failureResponse.reason)

        setError("민원 처리에 실패했습니다. 새로운 메일을 확인해주세요.")
      }
    } catch (err) {
      console.error("민원 처리 중 오류:", err)
      setError("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b">
        <h3 className="text-lg sm:text-xl font-semibold mb-1 break-words">{complaint.subject}</h3>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">보낸 사람:</span> {complaint.sender} &lt;{complaint.email}&gt;
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(complaint.timestamp).toLocaleString([], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {originalComplaint && (
          <div className="mt-2 flex items-center text-sm text-blue-600">
            <ArrowLeft className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">원본 민원: {originalComplaint.subject}</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-3 sm:p-4">
        {!isLatest && !isCompleted && (
          <Alert className="mb-4" variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>이전 메일입니다</AlertTitle>
            <AlertDescription>
              이 민원은 더 최근에 도착한 메일이 있어 답변할 수 없습니다. 가장 최근 메일에 답변해주세요.
            </AlertDescription>
          </Alert>
        )}

        {complaint.isFailureNotice && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>민원 처리 실패</AlertTitle>
            <AlertDescription>
              이전 답변이 처리되지 않았습니다. 아래 내용을 참고하여 다시 답변해주세요.
            </AlertDescription>
          </Alert>
        )}

        <div className="prose max-w-none text-sm sm:text-base">
          {complaint.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-3">
              {paragraph}
            </p>
          ))}
        </div>
      </ScrollArea>

      {isReplying ? (
        <div className="p-3 sm:p-4 border-t">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="답변을 작성하세요..."
            className="min-h-[120px] sm:min-h-[150px] mb-3 text-sm sm:text-base"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReplying(false)} size={isMobile ? "sm" : "default"}>
              취소
            </Button>
            <Button onClick={handleReply} disabled={isSubmitting} size={isMobile ? "sm" : "default"}>
              {isSubmitting ? "처리 중..." : "답변 보내기"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-4 border-t">
          <Button
            onClick={() => setIsReplying(true)}
            className="w-full"
            disabled={isCompleted || !isLatest}
            size={isMobile ? "sm" : "default"}
          >
            {isCompleted ? "처리 완료" : !isLatest ? "최신 메일에만 답변 가능" : "답변하기"}
          </Button>
        </div>
      )}
    </div>
  )
}
