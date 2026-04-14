'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme, systemTheme } = useTheme()
  React.useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-9">
      {mounted && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setTheme((prev) => {
              if (prev === 'dark') {
                return 'light'
              }
              return 'dark'
            })
          }}
        >
          {systemTheme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      )}
    </div>
  )
}
