"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Lock } from "lucide-react"
import { verifyPassword } from "@/app/actions/verify-password"
import RecordsList from "./records-list"

export default function RecordsPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    if (!password.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await verifyPassword(password)
      if (result.success) {
        setIsAuthenticated(true)
      } else {
        setError("비밀번호가 올바르지 않습니다.")
      }
    } catch (err) {
      setError("인증 과정에서 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        {!isAuthenticated ? (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">민원 처리 기록 확인</CardTitle>
              <CardDescription>기록을 확인하려면 비밀번호를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center border rounded-md p-2 bg-gray-50">
                <Lock className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button className="w-full" onClick={handleVerify} disabled={!password.trim() || isLoading}>
                {isLoading ? "확인 중..." : "확인"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <RecordsList />
        )}
      </div>
    </div>
  )
}
