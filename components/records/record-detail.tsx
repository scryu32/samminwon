"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, User, Calendar, CheckCircle, XCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

interface RecordDetailProps {
  record: any
  onBack: () => void
}

export default function RecordDetail({ record, onBack }: RecordDetailProps) {
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null)

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}분 ${remainingSeconds}초`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold">게임 기록 상세</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-medium">플레이어:</span>
              <span className="ml-2">
                {record.playerInfo.studentId} {record.playerInfo.name}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-medium">완료 시간:</span>
              <span className="ml-2">{formatDate(record.completedAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-medium">총 소요 시간:</span>
              <span className="ml-2">{formatTime(record.totalTime)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <span className="font-medium">성공한 민원:</span>
              <span className="ml-2">{record.interactions.filter((i: any) => i.success).length}개</span>
            </div>
            <div className="flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
              <span className="font-medium">실패 시도:</span>
              <span className="ml-2">{record.totalAttempts}회</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">민원 처리 내역</h3>
          <Accordion type="single" collapsible className="w-full">
            {record.interactions.map((interaction: any, index: number) => (
              <AccordionItem key={interaction.complaintId} value={interaction.complaintId}>
                <AccordionTrigger className="hover:bg-gray-50 px-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">
                        {index + 1}. {interaction.complaint.subject}
                      </span>
                      <Badge variant={interaction.success ? "success" : "destructive"}>
                        {interaction.success ? "성공" : "실패"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {interaction.complaint.sender} ({interaction.complaint.email})
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <Tabs defaultValue="complaint" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="complaint">민원 내용</TabsTrigger>
                      <TabsTrigger value="reply">답변</TabsTrigger>
                      {!interaction.success && <TabsTrigger value="feedback">피드백</TabsTrigger>}
                    </TabsList>
                    <TabsContent value="complaint" className="mt-4 p-4 bg-gray-50 rounded-md">
                      <div className="whitespace-pre-wrap">{interaction.complaint.content}</div>
                    </TabsContent>
                    <TabsContent value="reply" className="mt-4 p-4 bg-gray-50 rounded-md">
                      {interaction.reply ? (
                        <div className="whitespace-pre-wrap">{interaction.reply}</div>
                      ) : (
                        <div className="text-muted-foreground">답변 내용이 없습니다.</div>
                      )}
                    </TabsContent>
                    {!interaction.success && (
                      <TabsContent value="feedback" className="mt-4 p-4 bg-gray-50 rounded-md">
                        {interaction.failureReasons && interaction.failureReasons.length > 0 ? (
                          <div className="space-y-4">
                            {interaction.failureReasons.map((reason: string, i: number) => (
                              <div key={i} className="whitespace-pre-wrap">
                                <div className="font-medium mb-1">피드백 {i + 1}:</div>
                                {reason}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">피드백 내용이 없습니다.</div>
                        )}
                      </TabsContent>
                    )}
                  </Tabs>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}
