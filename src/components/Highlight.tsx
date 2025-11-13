import { type ReactNode } from 'react'

interface HighlightProps {
  className?: string
  children?: ReactNode
}

export function Highlight({ className = '', children }: HighlightProps) {
  return (
    <span className={`relative ${className}`}>
      <span className="absolute -z-1 top-[30%] left-0 w-full h-[40%] bg-accent/30 -rotate-3"></span>
      {children}
    </span>
  )
}
