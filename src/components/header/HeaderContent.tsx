import { useState } from 'react'
import { menus } from '@/config.json'
import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import {
  usePathName,
  useShouldAccessibleMenuShow,
  useShouldHeaderMenuBgShow,
  useShouldHeaderMetaShow,
} from './hooks'
import { RootPortal } from '@/components/RootPortal'

export function HeaderContent() {
  return (
    <>
      <AnimatedMenu />
      <AccessibleMenu />
    </>
  )
}

function AnimatedMenu() {
  const shouldBgShow = useShouldHeaderMenuBgShow()
  const shouldHeaderMetaShow = useShouldHeaderMetaShow()

  return (
    <AnimatePresence>
      {!shouldHeaderMetaShow && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <HeaderMenu isBgShow={shouldBgShow} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AccessibleMenu() {
  const shouldShow = useShouldAccessibleMenuShow()

  return (
    <RootPortal>
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            className="fixed z-10 top-14 inset-x-0 flex justify-center pointer-events-none"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <HeaderMenu isBgShow />
          </motion.div>
        )}
      </AnimatePresence>
    </RootPortal>
  )
}

function HeaderMenu({ isBgShow }: { isBgShow: boolean }) {
  const pathName = usePathName()
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [radius, setRadius] = useState(0)

  const background = `radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, rgb(var(--color-accent) / 0.12) 0%, transparent 65%)`

  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
    const bounds = currentTarget.getBoundingClientRect()
    setMouseX(clientX - bounds.left)
    setMouseY(clientY - bounds.top)
    setRadius(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5)
  }

  return (
    <nav
      className={clsx('relative rounded-full group pointer-events-auto duration-100', {
        'shadow-lg shadow-zinc-800/5  bg-white/50 dark:bg-zinc-800/50 backdrop-blur':
          isBgShow,
      })}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute -z-1 rounded-full opacity-0 group-hover:opacity-50"
        style={{ background }}
        aria-hidden
      ></div>
      <div className="text-sm flex gap-1">
        {menus.map((menu) => (
          <HeaderMenuItem
            key={menu.name}
            href={menu.link}
            title={menu.name}
            icon={menu.icon}
            isActive={pathName === menu.link}
          />
        ))}
      </div>
    </nav>
  )
}

function HeaderMenuItem({
  href,
  isActive,
  title,
  icon,
}: {
  href: string
  isActive: boolean
  title: string
  icon: string
}) {
  return (
    <a
      className={clsx(
        'relative block py-1.5 transition-all rounded-full duration-300 ease-out',
        isActive
          ? 'pl-2 pr-2 bg-accent/20 text-accent font-bold'
          : 'px-6 hover:text-accent hover:bg-accent/5',
      )}
      href={href}
    >
      <div className="flex items-center gap-2">
        {isActive && (
          <motion.div
            className="flex items-center justify-center size-6 rounded-full bg-white dark:bg-zinc-800 shadow-sm"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <i className={clsx('iconfont text-sm', icon)}></i>
          </motion.div>
        )}
        <span>{title}</span>
      </div>
    </a>
  )
}
