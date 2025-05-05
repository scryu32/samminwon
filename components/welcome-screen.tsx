"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useGameContext } from "@/context/game-context"

export default function WelcomeScreen() {
  const [playerName, setPlayerName] = useState("")
  const { gameStarted, startGame } = useGameContext()

  if (gameStarted) {
    return null
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">3민원 처리하기 게임</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="text-center text-base sm:text-lg font-medium p-3 sm:p-4 bg-yellow-50 rounded-md border border-yellow-200">
          민원이 3개 들어왔습니다! 민원을 처리해 게임에서 승리하세요!
        </div>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            이름을 입력하세요
          </label>
          <Input
            id="name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="이름"
            className="w-full text-base h-10 sm:h-12"
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6">
        <Button
          className="w-full text-base"
          size="lg"
          disabled={!playerName.trim()}
          onClick={() => startGame(playerName)}
        >
          게임 시작
        </Button>
      </CardFooter>
    </Card>
  )
}
