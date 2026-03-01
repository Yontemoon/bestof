import React from 'react'
import TopNavbar from '@/components/top-navbar'
import Footer from '@/components/footer'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme'

export const metadata = {
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
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopNavbar />
          <main className="min-h-[80vh] px-7 py-7 mx-auto container w-full max-w-4xl">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
