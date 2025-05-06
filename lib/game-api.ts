"use server";
import type { Complaint } from "@/types/game"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
// 민원 처리 API 호출 함수
export async function processComplaint(complaintId: string, reply: string, complaint: Complaint) {
  try {
    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 공공 기관의 민원 처리 평가 시스템입니다. 
          민원 내용과 담당자의 답변을 분석하여 답변이 적절한지 평가해야 합니다.
          단, 평가를 진행할때 후한 기준으로 채점하세요.
          
          평가 기준:
          1. 민원의 핵심 내용을 정확히 파악하고 있는가
          2. 민원에 대한 정확한 해결책을 제시하였는가
          
          응답 형식:
          {
            "gameres": "success" 또는 "fail",
            "message": "평가 메시지",
            "score": 0-100 사이의 점수
          }
          
          응답은 반드시 위의 JSON 형식으로만 제공하세요.`,
        },
        {
          role: "user",
          content: `민원 내용:
          제목: ${complaint.subject}
          발신자: ${complaint.sender} (${complaint.email})
          내용:
          ${complaint.content}
          
          담당자 답변:
          ${reply}
          
          이 답변이 적절한지 평가해주세요.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    })

    // API 응답 파싱
    const result = JSON.parse(response.choices[0].message.content || "{}")

    return {
      gameres: result.gameres,
      message: result.message,
      score: result.score,
    }
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error)
    // 오류 발생 시 기본값 반환
    return {
      gameres: "fail",
      message: "시스템 오류가 발생했습니다. 다시 시도해주세요.",
      score: 0,
    }
  }
}
