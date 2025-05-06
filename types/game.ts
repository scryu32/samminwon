export interface Complaint {
  id: string
  sender: string
  email: string
  subject: string
  content: string
  preview: string
  answer: string
  senderId: string // 발신자 고유 ID
  originalId?: string // 실패 메일인 경우 원본 민원 ID
  isFailureNotice?: boolean // 실패 알림 메일인지 여부
  timestamp: number // 메일 도착 시간
}

export interface ComplaintInteraction {
  complaintId: string
  complaint: Complaint
  reply?: string
  success: boolean
  failureReasons?: string[]
}

export interface GameResult {
  playerInfo: {
    studentId: string
    name: string
  }
  completedAt: Date
  totalTime: number // 밀리초 단위
  interactions: ComplaintInteraction[]
  totalAttempts: number
}
