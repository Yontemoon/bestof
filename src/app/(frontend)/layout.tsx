import React from 'react'
import TopNavbar from '@/components/top-navbar'
import Footer from '@/components/footer'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme'
import { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'Best of',
  title: 'Curated list of the best stuff in media.',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="selection:bg-secondary mx-auto max-w-150 px-7 py-7 space-y-5 w-full">
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
