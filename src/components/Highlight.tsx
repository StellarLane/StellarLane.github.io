import { type ReactNode } from 'react'
import '@/styles/highlight.css'

interface HighlightProps {
  prefix: string
  className?: string
  children?: ReactNode
}

export function Highlight({ className = '', children, prefix }: HighlightProps) {
  if (prefix) {
    return (
      <span
        className={`group relative inline-flex flex-row items-center gap-1 rounded-full select-none text-2xl ${className}`}
      >
        <span className="absolute inset-0 rounded-full border-2 border-accent/30 wheel-mask animate-[highlight-pop_1s_ease-out_both]" />
        <span className="relative px-4 py-0.5 bg-accent/30 font-bold rounded-full overflow-hidden animate-[highlight-inner_0.5s_ease-out_0.2s_both]">
          <span
            className="absolute inset-0 -translate-x-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />
          {prefix}
        </span>
        <span className="pr-3 text-accent font-bold animate-[highlight-text_0.4s_ease-out_0.3s_both]">
          {children}
        </span>
      </span>
    )
  }

  return (
    <span className={`relative px-2 ${className}`}>
      <span className="absolute -z-1 top-[10%] left-0 w-full h-[80%] bg-accent/30 rounded-full" />
      {children}
    </span>
  )
}
