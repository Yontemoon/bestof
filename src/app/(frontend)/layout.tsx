import React from 'react'
import TopNavbar from '@/components/top-navbar'
import Footer from '@/components/footer'
import { Sofia_Sans } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme'
import { Metadata } from 'next'
import './styles.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  description: 'Best of',
  title: 'Curated list of the best stuff in media.',
}

const sofiaSans = Sofia_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'selection:bg-secondary selection:text-white space-y-5 w-full antialiased ',
          sofiaSans.className,
        )}
      >
        <div className="mx-auto px-7 py-7 max-w-150 ">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TopNavbar />
            <div className="min-h-[80vh] ">{children}</div>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
