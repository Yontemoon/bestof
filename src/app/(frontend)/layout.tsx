import React from 'react'
import TopNavbar from '@/components/top-navbar'
import Footer from '@/components/footer'
import { Inter } from 'next/font/google'

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
    <html lang="en" className={inter.className}>
      <body>
        <TopNavbar />
        <main className="min-h-[80vh] px-7 py-7 mx-auto container w-full max-w-4xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
