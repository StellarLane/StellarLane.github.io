import { useState } from 'react'
import { Cover } from './Cover'

interface SecretCoverProps {
  color?: string
  imgSrc?: string
  name?: string
  name_cn?: string
  link?: string
}

export function SecretCover({
  color = 'bg-accent/30',
  imgSrc = '/emb_1/image-1.webp',
  name = '「Preigee」',
  name_cn = '「近地点」',
  link = '/crossdress',
}: SecretCoverProps) {
  const [clickCount, setClickCount] = useState(0)

  const handleClick = () => {
    setClickCount((prev) => prev + 1)
  }

  const renderContent = () => {
    switch (clickCount) {
      case 0:
        return <div className="content content-0">qwq</div>
      case 1:
        return <div className="content content-1">qwq?</div>
      case 2:
        return <div className="content content-2">ovo</div>
      case 3:
        return <div className="content content-3">ovo?</div>
      default:
        return (
          <div className="content content-5">
            <div>
              <Cover color={color} imgSrc={imgSrc} name={name} name_cn={name_cn} link={link} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="SecretCover" onClick={handleClick}>
      {renderContent()}
    </div>
  )
}
