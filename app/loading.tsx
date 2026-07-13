import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-4" />
      <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
    </div>
  )
}
