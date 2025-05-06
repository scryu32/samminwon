"use server";
import type { Complaint } from "@/types/game"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
// GPT API를 호출하여 실패 이유 생성
export async function generateFailureReason(complaintId: string, reply: string, complaint: Complaint) {
  try {
    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 민원 처리 평가 시스템입니다. 
          민원 내용과 담당자의 답변을 분석하여 답변이 부적절한 이유와 개선 방안을 제시해야 합니다.
          심각하게 주제에서 벗어나거나 시비조, 욕설이 포함되지 않는 한 대부분의 경우는 통과시키세요.
          평가를 할때 감성적인 부분보다 이성적인 부분을 먼저 생각하세요. 그러나 감정적이라고 실패라는 이야기는 아닙니다.
          단, 이 상황의 '민원'이 의미하는것은 '고민'과 거의 동일합니다.
          
          응답 형식:
          {
            "reason": "실패 이유에 대한 상세 설명",
            "suggestions": "개선을 위한 구체적인 제안",
            "keyPoints": ["놓친 핵심 포인트 1", "놓친 핵심 포인트 2", ...]
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
          
          이 답변이 부적절한 이유와 개선 방안을 제시해주세요.`,
        },
        {
          role: "system",
          content: `
          아래는 모범답안입니다:
          ${complaint.answer}
          `,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    })

    // API 응답 파싱
    const result = JSON.parse(response.choices[0].message.content || "{}")

    return {
      reason: result.reason,
      suggestions: result.suggestions,
      keyPoints: result.keyPoints || [],
    }
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error)
    // 오류 발생 시 기본값 반환
    return {
      reason: "시스템 오류로 인해 상세한 평가를 제공할 수 없습니다. 다시 시도해주세요.",
      suggestions: "더 구체적인 해결책과 일정을 포함하고, 공손한 어조로 답변을 작성해 보세요.",
      keyPoints: ["민원의 핵심 내용 파악", "구체적인 해결책 제시", "후속 조치 명시"],
    }
  }
}
