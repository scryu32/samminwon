"use server"

export async function verifyPassword(password: string) {
  // 하드코딩된 비밀번호 (실제 환경에서는 환경 변수나 해시된 값을 사용하는 것이 좋습니다)
  const correctPassword = "ryusungchan"

  return {
    success: password === correctPassword,
  }
}
