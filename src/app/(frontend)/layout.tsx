import React from 'react'
import TopNavbar from '@/components/top-navbar'
import Footer from '@/components/footer'
import { Sofia_Sans } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme'
import { Metadata } from 'next'
import './styles.css'
import { cn } from '@/lib/utils'

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
          'selection:bg-secondary selection:text-white mx-auto max-w-150 px-7 py-7 space-y-5 w-full',
          sofiaSans.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopNavbar />
          <main className="min-h-[80vh]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
