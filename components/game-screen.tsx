"use client"

import { useState, useEffect } from "react"
import { useGameContext } from "@/context/game-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmailList from "@/components/email-list"
import EmailView from "@/components/email-view"
import GameStats from "@/components/game-stats"
import GameComplete from "@/components/game-complete"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function GameScreen() {
  const { gameStarted, playerName, complaints, completedSenders } = useGameContext()
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [showEmailList, setShowEmailList] = useState(true)
  const isMobile = useMobile()

  // 고유한 발신자 ID 목록 (민원처리과 제외)
  const uniqueSenderIds = [...new Set(complaints.filter((c) => c.sender !== "민원처리과").map((c) => c.senderId))]

  // 모든 발신자의 민원이 처리되었는지 확인
  const allCompleted = uniqueSenderIds.length > 0 && uniqueSenderIds.every((id) => completedSenders.includes(id))

  useEffect(() => {
    if (complaints.length > 0 && !selectedEmail) {
      // 가장 최근 메일 선택
      const sortedComplaints = [...complaints].sort((a, b) => b.timestamp - a.timestamp)
      setSelectedEmail(sortedComplaints[0]?.id)
    }
  }, [complaints, selectedEmail])

  useEffect(() => {
    // 선택된 이메일이 없거나 완료된 경우 다른 이메일 선택
    if (selectedEmail && completedSenders.includes(complaints.find((c) => c.id === selectedEmail)?.senderId || "")) {
      const uncompletedComplaints = complaints
        .filter((c) => !completedSenders.includes(c.senderId))
        .sort((a, b) => b.timestamp - a.timestamp)

      if (uncompletedComplaints.length > 0) {
        setSelectedEmail(uncompletedComplaints[0].id)
      }
    }
  }, [completedSenders, complaints, selectedEmail])

  // 모바일에서 이메일 선택 시 상세 보기로 전환
  useEffect(() => {
    if (isMobile && selectedEmail) {
      setShowEmailList(false)
    }
  }, [selectedEmail, isMobile])

  if (!gameStarted) {
    return null
  }

  if (allCompleted) {
    return <GameComplete />
  }

  const selectedComplaint = complaints.find((c) => c.id === selectedEmail)

  const handleSelectEmail = (id: string) => {
    setSelectedEmail(id)
    if (isMobile) {
      setShowEmailList(false)
    }
  }

  const handleBackToList = () => {
    setShowEmailList(true)
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="border-b p-3 sm:p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg sm:text-xl font-bold truncate">{playerName}님의 민원 처리함</CardTitle>
          <GameStats />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="inbox" className="flex-1">
              받은 메일함
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex-1">
              보낸 메일함
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inbox" className="m-0">
            {isMobile ? (
              <div className="h-[calc(100vh-12rem)] max-h-[600px]">
                {showEmailList ? (
                  <EmailList complaints={complaints} selectedEmail={selectedEmail} onSelectEmail={handleSelectEmail} />
                ) : selectedComplaint ? (
                  <div className="flex flex-col h-full">
                    <div className="p-2 border-b">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center text-sm"
                        onClick={handleBackToList}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        메일 목록으로
                      </Button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <EmailView complaint={selectedComplaint} />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="grid md:grid-cols-[300px_1fr] h-[calc(100vh-12rem)] max-h-[600px]">
                <EmailList complaints={complaints} selectedEmail={selectedEmail} onSelectEmail={setSelectedEmail} />
                {selectedComplaint && <EmailView complaint={selectedComplaint} />}
              </div>
            )}
          </TabsContent>
          <TabsContent value="sent" className="m-0 p-4">
            <div className="h-[calc(100vh-12rem)] max-h-[600px] overflow-auto flex items-start justify-center text-muted-foreground">
              {completedSenders.length > 0 ? (
                <div className="space-y-4 w-full max-w-md p-4">
                  <h3 className="text-lg font-medium">처리된 민원</h3>
                  <ul className="list-disc pl-5 space-y-4">
                    {completedSenders.map((id) => {
                      const complaint = complaints.find((c) => c.senderId === id && c.sender !== "민원처리과")
                      return complaint ? (
                        <li key={id} className="break-words">
                          <div className="font-medium">{complaint.sender}</div>
                          <div className="text-sm">{complaint.subject}</div>
                        </li>
                      ) : null
                    })}
                  </ul>
                </div>
              ) : (
                <p className="p-4">아직 처리된 민원이 없습니다.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
