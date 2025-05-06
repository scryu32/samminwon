import type { Complaint } from "@/types/game"

// 10가지 민원 템플릿
const complaintTemplates: Omit<Complaint, "id" | "senderId" | "timestamp">[] = [
  {
    sender: "익명의 남자",
    email: "hutaochandaisuki@daepyeong.com",
    subject: "여자친구가 너무 이뻐요",
    content:
      "안녕하세요, 여자친구랑 사귄지 1년 조금 넘은 사람입니다.. 최근에 여자친구가 너무 이뻐서 고민입니다... 볼때마다 자꾸 빛이나요... 빨리 이 문제를 해결해주세요",
    preview: "여자친구가 너무 이뻐요",
    answer: "이런 행복한 고민이라니, 부럽기도 하고 보기 좋네요! 하지만 이건 문제가 아니라 축복에 가깝습니다. 여자친구분을 볼 때마다 빛이 난다면, 그건 당신이 정말 사랑하고 있다는 증거죠. 해결책을 굳이 찾자면... 그냥 그 빛을 자주 보세요. 자주 사랑하세요. 그리고 매일 감사하세요."
  },
  {
    sender: "뉴로",
    email: "neurosama@daepyeong.com",
    subject: "코딩하는데 친구가 코드를 이상하게짭니다",
    content:
      "자꾸 저희 친구가 변수 이름을 a, b, c로 짓습니다.. 볼때마다 살인충동느껴지는데 어떻게해야할까요? 빨리 저희 친구좀 잡아가주세요..",
    preview: "코딩하는데 친구가 코드를 이상하게짭니다",
    answer: "아이고야... 이런 건 거의 코드 테러에 가까운 중범죄입니다. a, b, c는 시험장에서 쓰라고 만든 이름이지, 협업 코드에는 죄송하지만 용납이 안 됩니다! 하지만 친구분을 당장 잡아갈 순 없고... 대신 다음과 같은 비폭력적 해결책을 제안합니다: 코드 리뷰 때마다 'a가 뭐였지?'라고 계속 물어보세요. 최후의 수단으로는, 친구가 짠 코드를 리팩토링해서 멋진 이름을 붙인 후 '이게 가독성이다'라고 보여주세요."
  },
  {
    sender: "아유무",
    email: "AiScReam@daepyeong.com",
    subject: "코딩하는데 친구가 나쁜짓을합니다.",
    content:
      "코딩할때 친구가 자꾸 세미콜론(;)을 그리스어 물음표(;)로 바꿉니다. 이친구를 어떻게 해야할까요?",
    preview: "친구가 코드를 자꾸 바꿉니다",
    answer: "잡아가서 다시는 그런행동 못하도록 각서를 작성시키세요."
  },
  {
    sender: "아즈키",
    email: "AZKi@daepyeong.com",
    subject: "코딩하는데 무서운 상황이 발생했습니다",
    content:
      "밤새 짠 코드가 한번에 실행됐습니다. 저 이제 어떡하죠?",
    preview: "코드가 한번에 실행됩니다",
    answer: "코드 다시 확인하기 – 왜 잘 되는 거지?라는 불신을 품고 다시 보세요. 정신 차리기 – 첫 실행 성공은 보통 '테스트를 빼먹었다'거나, '버그가 숨어 있다'는 신호일 수도 있습니다."
  },
  {
    sender: "가우르",
    email: "gawrguradontgoplease@daepyeong.com",
    subject: "프로그래밍 교과 너무 어려울것같습니다.",
    content:
      "제 꿈이 공학쪽인데 프로그래밍 교과가 너무 어려워보여 일반공학을 들어야할것같습니다.. 어떡하죠?",
    preview: "프로그래밍 교과 너무 어려울것같습니다.",
    answer: "프로그래밍이 익숙하지 않기 때문에 어렵게 다가올수있습니다. 여러분이 근의공식을 처음봤을때나 미적분을 처음봤을때 벽을 프로그래밍에서 다시 느끼고 있는것입니다. 하지만 '나는 이걸 써서 뭘 만들고 싶다'는 목표가 생기면, 그 벽은 생각보다 금방 낮아집니다. 이 교과를 수강해 배우시면 여러분도 하실수 있습니다."
  },
  {
    sender: "샤를로트",
    email: "Charlotte@daepyeong.com",
    subject: "프로그래밍이 너무 재미없습니다",
    content:
      "요즘 코딩하는데 자꾸 현타옵니다. 인공지능이 다해주니까 제가 할게없어요. 어떻게해야할까요?",
    preview: "프로그래밍이 너무 재미없습니다",
    answer: "인공지능이 할수있는 분야가있고, 사람이 할수있는 분야가 있습니다. 반복적인것은 인공지능에게 시키고, 생각을 필요로하면 당신이 하면 AI는 당신의 대체품이 아닌 당신을 확장하는 도구가 될수있습니다."
  },
  {
    sender: "카구야",
    email: "kaguyasama@daepyeong.com",
    subject: "프로그래밍 공부를 어떻게 해야할까요?",
    content:
      "프로그래밍을 공부하고싶은데 어떤식으로 공부해야할지 잘 모르겠습니다. 어떤식으로 공부해야할까요?",
    preview: "프로그래밍 공부를 어떻게 해야할까요?",
    answer: "프로그래밍을 공부할때는 목표를 정하고 공부하면 좋습니다. '잘하고싶다'라는 생각보단 '게임을 만들고싶다'같은 목표를 정해두면 훨씬 빠르게 코딩을 배울수있습니다. 목표를 정하면, 책이나 유튜브 강의를 통해 배워보세요!"
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
