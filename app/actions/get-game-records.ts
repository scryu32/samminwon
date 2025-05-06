"use server"

import clientPromise from "@/lib/mongodb"

export async function getGameRecords() {
  try {
    const client = await clientPromise
    const db = client.db("complaint-game")

    // 최신 기록부터 가져오기
    const records = await db.collection("game-results").find({}).sort({ completedAt: -1 }).limit(100).toArray()

    return {
      success: true,
      records: JSON.parse(JSON.stringify(records)),
    }
  } catch (error) {
    console.error("게임 기록 조회 중 오류 발생:", error)
    return {
      success: false,
      message: "게임 기록을 불러오는 중 오류가 발생했습니다.",
      records: [],
    }
  }
}

export async function getGameRecordById(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("complaint-game")
    const { ObjectId } = require("mongodb")

    // ID로 특정 기록 가져오기
    const record = await db.collection("game-results").findOne({
      _id: new ObjectId(id),
    })

    if (!record) {
      return {
        success: false,
        message: "해당 ID의 게임 기록을 찾을 수 없습니다.",
        record: null,
      }
    }

    return {
      success: true,
      record: JSON.parse(JSON.stringify(record)),
    }
  } catch (error) {
    console.error("게임 기록 상세 조회 중 오류 발생:", error)
    return {
      success: false,
      message: "게임 기록을 불러오는 중 오류가 발생했습니다.",
      record: null,
    }
  }
}
