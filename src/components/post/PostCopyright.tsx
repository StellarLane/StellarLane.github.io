import { getFormattedDateTime } from '@/utils/date'
import { AnimatedSignature } from '../AnimatedSignature'
import { useEffect, useState } from 'react'

export function PostSignature({ lastMod }: { title: string; slug: string; lastMod: Date }) {
  const [lastModStr, setLastModStr] = useState('')

  useEffect(() => {
    setLastModStr(getFormattedDateTime(lastMod))
  }, [lastMod])

  return (
    <section className="text-xs leading-loose text-secondary">
      <hr className="my-3 border-primary" />

      <div className="flex items-center justify-between">
        <div className="ml-4 my-2">
          <p>
            <b>{lastModStr}</b>
          </p>
        </div>
        <div className="mr-4 my-2">
          <AnimatedSignature />
        </div>
      </div>
    </section>
  )
}
