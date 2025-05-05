import { Suspense } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import GameScreen from "@/components/game-screen"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-2 sm:p-4">
      <Suspense fallback={<LoadingScreen />}>
        <div className="w-full max-w-4xl">
          <WelcomeScreen />
          <GameScreen />
        </div>
      </Suspense>
    </main>
  )
}
