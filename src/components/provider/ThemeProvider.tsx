import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { changePageTheme, setLocalTheme } from '@/utils/theme'
import { themeAtom } from '@/store/theme'

export function ThemeProvider() {
  const theme = useAtomValue(themeAtom)
  useEffect(() => {
    setLocalTheme(theme)
    changePageTheme(theme)
  }, [theme])
  return null
}
