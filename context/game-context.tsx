"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Complaint, ComplaintInteraction, GameResult } from "@/types/game"
import { generateComplaints } from "@/lib/complaints"

interface GameContextType {
  gameStarted: boolean
  playerName: string
  complaints: Complaint[]
  completedComplaints: string[]
  completedSenders: string[]
  interactions: ComplaintInteraction[]
  gameStartTime: number | null
  startGame: (name: string) => void
  completeComplaint: (id: string, reply: string) => void
  resetGame: () => void
  addFailureEmail: (originalId: string, reason: string) => void
  getLatestComplaintForSender: (senderId: string) => Complaint | undefined
  isLatestComplaint: (complaint: Complaint) => boolean
  getGameResult: () => GameResult
  totalAttempts: number
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameStarted, setGameStarted] = useState(false)
  const [playerName, setPlayerName] = useState("")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [completedComplaints, setCompletedComplaints] = useState<string[]>([])
  const [completedSenders, setCompletedSenders] = useState<string[]>([])
  const [interactions, setInteractions] = useState<ComplaintInteraction[]>([])
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)
  const [totalAttempts, setTotalAttempts] = useState(0)

  const startGame = (name: string) => {
    setPlayerName(name)
    setComplaints(generateComplaints(3))
    setCompletedComplaints([])
    setCompletedSenders([])
    setInteractions([])
    setGameStartTime(Date.now())
    setTotalAttempts(0)
    setGameStarted(true)
  }

  // 특정 발신자의 가장 최근 민원 가져오기
  const getLatestComplaintForSender = (senderId: string) => {
    const senderComplaints = complaints
      .filter(
        (c) =>
          c.senderId === senderId ||
          (c.originalId && complaints.find((oc) => oc.id === c.originalId)?.senderId === senderId),
      )
      .sort((a, b) => b.timestamp - a.timestamp)

    return senderComplaints[0]
  }

  // 해당 민원이 발신자의 가장 최근 민원인지 확인
  const isLatestComplaint = (complaint: Complaint) => {
    const latestComplaint = getLatestComplaintForSender(complaint.senderId)
    return latestComplaint?.id === complaint.id
  }

  const completeComplaint = (id: string, reply: string) => {
    // 처리된 민원 찾기
    const complaint = complaints.find((c) => c.id === id)
    if (!complaint) return

    // 같은 발신자의 모든 민원 ID 찾기
    const senderIds = [complaint.senderId]

    // 원본 민원이 있는 경우 원본 민원의 발신자도 포함
    if (complaint.originalId) {
      const originalComplaint = complaints.find((c) => c.id === complaint.originalId)
      if (originalComplaint) {
        senderIds.push(originalComplaint.senderId)
      }
    }

    // 해당 발신자들의 모든 민원 ID 찾기
    const allComplaintIds = complaints
      .filter(
        (c) =>
          senderIds.includes(c.senderId) ||
          (c.originalId && complaints.find((oc) => oc.id === c.originalId)?.senderId === complaint.senderId),
      )
      .map((c) => c.id)

    // 모든 관련 민원을 처리 완료로 표시
    setCompletedComplaints((prev) => [...new Set([...prev, ...allComplaintIds])])

    // 처리된 발신자 추가
    setCompletedSenders((prev) => [...new Set([...prev, ...senderIds])])

    // 상호작용 기록 추가
    setInteractions((prev) => [
      ...prev,
      {
        complaintId: id,
        complaint: { ...complaint },
        reply,
        success: true,
      },
    ])
  }

  const resetGame = () => {
    setGameStarted(false)
    setPlayerName("")
    setComplaints([])
    setCompletedComplaints([])
    setCompletedSenders([])
    setInteractions([])
    setGameStartTime(null)
    setTotalAttempts(0)
  }

  const addFailureEmail = (originalId: string, reason: string) => {
    // 원본 민원 찾기
    const originalComplaint = complaints.find((c) => c.id === originalId)
    if (!originalComplaint) return

    // 새 민원 ID 생성
    const newId = `failure-${originalId}-${Date.now()}`
    const timestamp = Date.now()

    // 실패 이유 포맷팅
    const formattedReason = reason
      .replace(/\n/g, "\n\n") // 줄바꿈 강화
      .replace(/\*/g, "") // 마크다운 제거

    // 새 민원 생성
    const newComplaint: Complaint = {
      id: newId,
      sender: "민원처리과",
      email: "feedback@complaints.gov",
      subject: `Re: ${originalComplaint.subject} - 처리 실패`,
      content: `안녕하세요,

${originalComplaint.sender}님이 제출하신 민원 답변이 다음과 같은 이유로 처리되지 못했습니다:

${formattedReason}

수정된 답변을 다시 제출해 주시기 바랍니다.

감사합니다.
민원처리과 드림`,
      preview: `${originalComplaint.sender}님의 민원 답변이 처리되지 못했습니다.`,
      senderId: originalComplaint.senderId,
      originalId: originalId,
      isFailureNotice: true,
      timestamp,
    }

    // 민원 목록에 추가
    setComplaints((prev) => [...prev, newComplaint])

    // 실패한 상호작용 기록 추가
    setInteractions((prev) => {
      // 이미 있는 상호작용 찾기
      const existingInteraction = prev.find((i) => i.complaintId === originalId)

      if (existingInteraction) {
        // 기존 상호작용에 실패 이유 추가
        return prev.map((i) => {
          if (i.complaintId === originalId) {
            return {
              ...i,
              success: false,
              failureReasons: [...(i.failureReasons || []), formattedReason],
            }
          }
          return i
        })
      } else {
        // 새 상호작용 추가
        return [
          ...prev,
          {
            complaintId: originalId,
            complaint: { ...originalComplaint },
            success: false,
            failureReasons: [formattedReason],
          },
        ]
      }
    })

    // 총 시도 횟수 증가
    setTotalAttempts((prev) => prev + 1)
  }

  // 게임 결과 데이터 생성
  const getGameResult = (): GameResult => {
    return {
      playerName,
      completedAt: new Date(),
      totalTime: gameStartTime ? Date.now() - gameStartTime : 0,
      interactions,
      totalAttempts,
    }
  }

  return (
    <GameContext.Provider
      value={{
        gameStarted,
        playerName,
        complaints,
        completedComplaints,
        completedSenders,
        interactions,
        gameStartTime,
        startGame,
        completeComplaint,
        resetGame,
        addFailureEmail,
        getLatestComplaintForSender,
        isLatestComplaint,
        getGameResult,
        totalAttempts,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}
