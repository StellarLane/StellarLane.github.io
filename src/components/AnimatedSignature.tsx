import Svg from '@/assets/Stellarlane.svg?raw'

export function AnimatedSignature() {
  return (
    <div
      className="animated-signature"
      dangerouslySetInnerHTML={{
        __html: Svg,
      }}
    ></div>
  )
}
