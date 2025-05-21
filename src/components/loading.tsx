import { Loader2 } from 'lucide-react'

export const Loading = () => (
  <div className="flex h-[calc(100vh-80px)] w-full flex-col items-center justify-center">
    <Loader2 className="text-primary h-12 w-12 animate-spin" />
  </div>
)
