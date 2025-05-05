export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)] max-h-[600px]">
      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
    </div>
  )
}
