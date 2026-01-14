import styles from './themes/Cover.module.css'
import { Highlight } from '../Highlight'

interface CoverProps {
  color?: string
  imgSrc?: string
  name?: string
  name_cn?: string
  link?: string
}

export function Cover({
  color = 'bg-accent/30',
  imgSrc = '/emb_1/image-1.webp',
  name = 'Precious Daily',
  name_cn = '平凡即是喜乐',
  link = '/daily',
}: CoverProps) {
  return (
    <div>
      <div className={styles['fan-wrapper']}>
        <div className={`${styles['fan-card']} ${styles['fan-layer-0']}`}>
          <div className="w-72 h-60 rounded-lg bg-accent/5"></div>
        </div>

        <div className={`${styles['fan-card']} ${styles['fan-layer-1']}`}>
          <div className="w-72 h-60 rounded-lg bg-accent/10"></div>
        </div>

        <div className={`${styles['fan-card']} ${styles['fan-layer-2']}`}>
          <div className="w-72 h-60 rounded-lg bg-accent/20"></div>
        </div>

        <div className={`${styles['fan-card']} ${styles['fan-layer-3']}`}>
          <div className="w-72 h-60 rounded-lg bg-accent/5"></div>
        </div>

        <div className={`${styles['fan-card']} ${styles['fan-layer-4']}`}>
          <div className="w-72 h-60 rounded-lg bg-accent/10"></div>
        </div>

        <div className={`${styles['fan-card']} ${styles['fan-layer-5']}`}>
          <div className="w-72 h-60 rounded-lg bg-accent/20"></div>
        </div>

        <div className={`${styles['fan-card']} ${styles['main-card']}`}>
          <div className={`w-72 h-60 rounded-lg ${color}`}>
            <div className="px-4 py-4 flex flex-col h-full">
              <div className="w-88 h-72 rounded-lg bg-accent/100 overflow-hidden">
                <a href={link} rel="noopener noreferrer">
                  <img
                    src={imgSrc}
                    alt="Gallery Image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`py-16 flex flex-col justify-center text-xl font-extrabold items-center`}>
        <Highlight className={'text-lg'} prefix={name_cn}>{name}</Highlight>
      </div>
    </div>
  )
}
