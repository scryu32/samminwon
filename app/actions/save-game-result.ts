"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "@/lib/mongodb"
import type { GameResult } from "@/types/game"

export async function saveGameResult(result: GameResult) {
  try {
    const client = await clientPromise
    const db = client.db("complaint-game")

    // 결과에 타임스탬프 추가
    const resultWithTimestamp = {
      ...result,
      createdAt: new Date(),
    }

    // 게임 결과 저장
    const response = await db.collection("game-results").insertOne(resultWithTimestamp)

    revalidatePath("/")

    return {
      success: true,
      message: "게임 결과가 성공적으로 저장되었습니다.",
      id: response.insertedId.toString(),
    }
  } catch (error) {
    console.error("게임 결과 저장 중 오류 발생:", error)
    return {
      success: false,
      message: "게임 결과 저장 중 오류가 발생했습니다.",
    }
  }
}
