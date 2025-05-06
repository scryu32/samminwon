"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useGameContext } from "@/context/game-context"
import Link from "next/link"
import { BarChart2 } from "lucide-react"

export default function WelcomeScreen() {
  const [studentId, setStudentId] = useState("")
  const [name, setName] = useState("")
  const { gameStarted, startGame } = useGameContext()

  if (gameStarted) {
    return null
  }

  const isFormValid = studentId.trim() !== "" && name.trim() !== ""

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">3민원 처리하기 게임</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="text-center text-base sm:text-lg font-medium p-3 sm:p-4 bg-yellow-50 rounded-md border border-yellow-200">
          민원이 3개 들어왔습니다! 민원을 처리해 게임에서 승리하세요!
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="studentId" className="text-sm font-medium">
              학번을 입력하세요
            </label>
            <Input
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="학번"
              className="w-full text-base h-10 sm:h-12"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              이름을 입력하세요
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="w-full text-base h-10 sm:h-12"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
        <Button
          className="w-full text-base"
          size="lg"
          disabled={!isFormValid}
          onClick={() => startGame(studentId, name)}
        >
          게임 시작
        </Button>
        <Link href="/records" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full" size="lg">
            <BarChart2 className="mr-2 h-5 w-5" />
            기록 확인
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
