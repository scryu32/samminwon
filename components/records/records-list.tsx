"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getGameRecords } from "@/app/actions/get-game-records"
import { Loader2, RefreshCw, Clock, User, CheckCircle, XCircle } from "lucide-react"
import RecordDetail from "./record-detail"

export default function RecordsList() {
  const [records, setRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)

  const loadRecords = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getGameRecords()
      if (result.success) {
        setRecords(result.records)
      } else {
        setError(result.message || "기록을 불러오는데 실패했습니다.")
      }
    } catch (err) {
      setError("기록을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [])

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

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record)
  }

  const handleBackToList = () => {
    setSelectedRecord(null)
  }

  if (selectedRecord) {
    return <RecordDetail record={selectedRecord} onBack={handleBackToList} />
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">민원 처리 기록</CardTitle>
        <Button variant="outline" size="icon" onClick={loadRecords} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : records.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">저장된 게임 기록이 없습니다.</div>
        ) : (
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">목록 보기</TabsTrigger>
              <TabsTrigger value="table">표 보기</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="mt-4">
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewDetail(record)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">
                          {record.playerInfo.studentId} {record.playerInfo.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{formatDate(record.completedAt)}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatTime(record.totalTime)}</span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <span className="text-green-600 flex items-center mr-2">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {record.interactions.filter((i: any) => i.success).length}
                          </span>
                          <span className="text-red-600 flex items-center">
                            <XCircle className="h-4 w-4 mr-1" />
                            {record.totalAttempts}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="table" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-3">플레이어</th>
                      <th className="text-left p-3">완료 시간</th>
                      <th className="text-left p-3">소요 시간</th>
                      <th className="text-left p-3">성공/실패</th>
                      <th className="text-left p-3">상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            {record.playerInfo.studentId} {record.playerInfo.name}
                          </div>
                        </td>
                        <td className="p-3 text-sm">{formatDate(record.completedAt)}</td>
                        <td className="p-3">{formatTime(record.totalTime)}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <span className="text-green-600 flex items-center mr-2">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {record.interactions.filter((i: any) => i.success).length}
                            </span>
                            <span className="text-red-600 flex items-center">
                              <XCircle className="h-4 w-4 mr-1" />
                              {record.totalAttempts}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetail(record)}>
                            상세 보기
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
