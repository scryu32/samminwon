import type { Complaint } from "@/types/game"

// 10가지 민원 템플릿
const complaintTemplates: Omit<Complaint, "id" | "senderId" | "timestamp">[] = [
  {
    sender: "김주민",
    email: "citizen1@example.com",
    subject: "도로 파손 신고",
    content:
      "안녕하세요,\n\n저희 동네 중앙로 123번길 앞 도로가 심하게 파손되어 있습니다. 지난 주말 비가 많이 온 후 도로에 큰 구멍이 생겼고, 차량 통행 시 위험한 상황입니다. 빠른 시일 내에 보수 작업을 진행해주시기 바랍니다.\n\n감사합니다.",
    preview: "저희 동네 중앙로 123번길 앞 도로가 심하게 파손되어 있습니다.",
  },
  {
    sender: "이시민",
    email: "citizen2@example.com",
    subject: "쓰레기 무단 투기 신고",
    content:
      "담당자님께,\n\n행복아파트 뒤편 공터에 쓰레기가 불법으로 버려지고 있습니다. 이로 인해 악취가 심하고 주변 환경이 매우 불결해졌습니다. CCTV 설치나 정기적인 순찰을 통해 쓰레기 무단 투기를 단속해주시길 요청드립니다.\n\n주민 일동",
    preview: "행복아파트 뒤편 공터에 쓰레기가 불법으로 버려지고 있습니다.",
  },
  {
    sender: "박민원",
    email: "citizen3@example.com",
    subject: "소음 민원 신고",
    content:
      "안녕하세요,\n\n평화로운 아파트 302동 옆 건설 현장에서 발생하는 소음이 너무 심합니다. 새벽 6시부터 밤 10시까지 지속적인 공사 소음으로 수면과 일상생활에 큰 지장을 받고 있습니다. 공사 시간 제한과 소음 저감 대책을 마련해주시기 바랍니다.\n\n불편을 겪고 있는 주민 드림",
    preview: "평화로운 아파트 302동 옆 건설 현장에서 발생하는 소음이 너무 심합니다.",
  },
  {
    sender: "최불편",
    email: "citizen4@example.com",
    subject: "가로등 고장 신고",
    content:
      "담당 부서에 문의드립니다.\n\n행복동 456번지 앞 가로등이 일주일째 고장나서 켜지지 않고 있습니다. 밤에 이 구간이 매우 어두워 보행자의 안전이 우려됩니다. 빠른 시일 내에 수리 부탁드립니다.\n\n지역 주민 드림",
    preview: "행복동 456번지 앞 가로등이 일주일째 고장나서 켜지지 않고 있습니다.",
  },
  {
    sender: "정요청",
    email: "citizen5@example.com",
    subject: "버스 노선 증설 요청",
    content:
      "교통과 담당자님께,\n\n신도시 개발로 인해 우리 지역 인구가 크게 증가했으나, 대중교통 서비스는 그대로입니다. 특히 아침 출근 시간대 버스가 매우 혼잡하여 많은 주민들이 불편을 겪고 있습니다. 301번 버스 증차 또는 새로운 노선 신설을 검토해주시기 바랍니다.\n\n주민 대표 드림",
    preview: "신도시 개발로 인해 우리 지역 인구가 크게 증가했으나, 대중교통 서비스는 그대로입니다.",
  },
  {
    sender: "강건의",
    email: "citizen6@example.com",
    subject: "공원 시설 개선 건의",
    content:
      "안녕하세요,\n\n행복공원의 놀이 시설이 노후화되어 아이들이 이용하기에 위험한 상태입니다. 특히 그네와 미끄럼틀의 녹이 심하고 일부 부품이 파손되어 있습니다. 아이들의 안전을 위해 시설 점검 및 교체를 요청드립니다.\n\n학부모 드림",
    preview: "행복공원의 놀이 시설이 노후화되어 아이들이 이용하기에 위험한 상태입니다.",
  },
  {
    sender: "윤불만",
    email: "citizen7@example.com",
    subject: "상수도 수질 문제",
    content:
      "수도과 담당자님께,\n\n최근 저희 지역 수돗물에서 이상한 냄새가 나고 색이 탁하게 변했습니다. 여러 가구에서 같은 증상을 보고하고 있으며, 건강상의 우려가 큽니다. 수질 검사와 원인 파악을 신속히 진행해주시기 바랍니다.\n\n걱정하는 주민 드림",
    preview: "최근 저희 지역 수돗물에서 이상한 냄새가 나고 색이 탁하게 변했습니다.",
  },
  {
    sender: "한요구",
    email: "citizen8@example.com",
    subject: "횡단보도 신설 요청",
    content:
      "교통안전 담당자님께,\n\n행복초등학교 앞 도로는 차량 통행이 많으나 횡단보도가 없어 학생들의 등하교 시 매우 위험합니다. 학부모와 교사들이 수차례 위험한 상황을 목격했습니다. 아이들의 안전을 위해 횡단보도 설치와 과속방지턱 설치를 강력히 요청합니다.\n\n학부모회 드림",
    preview: "행복초등학교 앞 도로는 차량 통행이 많으나 횡단보도가 없어 학생들의 등하교 시 매우 위험합니다.",
  },
  {
    sender: "임항의",
    email: "citizen9@example.com",
    subject: "불법 주차 단속 요청",
    content:
      "주차 관리 담당자님께,\n\n행복시장 주변 도로에 불법 주차가 만연하여 교통 흐름이 매우 악화되었습니다. 특히 주말에는 도로가 거의 막히는 상황입니다. 정기적인 단속과 주차 공간 확보 방안을 마련해주시기 바랍니다.\n\n인근 상인회 드림",
    preview: "행복시장 주변 도로에 불법 주차가 만연하여 교통 흐름이 매우 악화되었습니다.",
  },
  {
    sender: "서민심",
    email: "citizen10@example.com",
    subject: "공공 와이파이 설치 요청",
    content:
      "정보통신과 담당자님께,\n\n행복동 주민센터와 인근 공원에 공공 와이파이 설치를 요청드립니다. 디지털 정보 격차 해소와 주민 편의를 위해 필요한 시설입니다. 특히 학생들이 방과 후 학습을 위해 많이 이용할 수 있을 것입니다.\n\n지역 주민 드림",
    preview: "행복동 주민센터와 인근 공원에 공공 와이파이 설치를 요청드립니다.",
  },
]

// 랜덤으로 민원 생성
export function generateComplaints(count: number): Complaint[] {
  // 템플릿에서 랜덤으로 선택
  const shuffled = [...complaintTemplates].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, count)

  // ID 추가하여 반환
  return selected.map((template, index) => {
    const timestamp = Date.now() - (count - index) * 60000 // 시간차를 두고 도착한 것처럼
    const senderId = `sender-${template.email}`

    return {
      ...template,
      id: `complaint-${timestamp}-${index}`,
      senderId,
      timestamp,
    }
  })
}
