"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useGameContext } from "@/context/game-context"
import { Confetti } from "@/components/confetti"
import { saveGameResult } from "@/app/actions/save-game-result"
import { Loader2 } from "lucide-react"

export default function GameComplete() {
  const { resetGame, getGameResult, playerInfo } = useGameContext()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{
    attempted: boolean
    success: boolean
    message: string
  }>({
    attempted: false,
    success: false,
    message: "",
  })

  // useRef를 사용하여 저장 시도 여부를 추적
  const hasSavedRef = useRef(false)

  // 게임 결과 저장
  useEffect(() => {
    // 이미 저장을 시도했으면 중복 실행 방지
    if (hasSavedRef.current) return

    const saveResult = async () => {
      // 저장 시도 표시
      hasSavedRef.current = true
      setIsSaving(true)

      try {
        const gameResult = getGameResult()
        const result = await saveGameResult(gameResult)

        setSaveStatus({
          attempted: true,
          success: result.success,
          message: result.message,
        })
      } catch (error) {
        console.error("게임 결과 저장 중 오류:", error)
        setSaveStatus({
          attempted: true,
          success: false,
          message: "게임 결과 저장 중 오류가 발생했습니다.",
        })
      } finally {
        setIsSaving(false)
      }
    }

    saveResult()

    // 의존성 배열에서 getGameResult 제거
    // 컴포넌트가 마운트될 때만 실행되도록 빈 배열로 설정
  }, [])

  // 게임 결과 데이터 포맷
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}분 ${remainingSeconds}초`
  }

  const gameResult = getGameResult()
  const totalTime = formatTime(gameResult.totalTime)

  return (
    <>
      <Confetti />
      <Card className="w-full shadow-lg">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold">축하합니다!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center px-4 sm:px-6">
          <div className="text-base sm:text-lg font-medium">
            {playerInfo.studentId} {playerInfo.name}님이 모든 민원을 성공적으로 처리했습니다!
          </div>
          <div className="p-3 sm:p-4 bg-green-50 rounded-md border border-green-200">
            <p className="text-green-800">3개의 민원을 모두 처리하여 게임에서 승리했습니다.</p>
            <p className="text-green-800 mt-2">총 소요 시간: {totalTime}</p>
            <p className="text-green-800">
              총 시도 횟수: {gameResult.totalAttempts + gameResult.interactions.filter((i) => i.success).length}회
            </p>
          </div>

          {isSaving && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>게임 결과 저장 중...</span>
            </div>
          )}

          {saveStatus.attempted && (
            <div className={`text-sm ${saveStatus.success ? "text-green-600" : "text-red-600"}`}>
              {saveStatus.message}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 sm:p-6">
          <Button className="w-full text-base" size="lg" onClick={resetGame}>
            다시 시작하기
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
