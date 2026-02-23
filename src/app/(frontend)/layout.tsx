import React from 'react'
import TopNavbar from '@/components/top-navbar'
import Footer from '@/components/footer'

export const metadata = {
  description: 'Best of',
  title: 'Curated list of the best stuff in media.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <TopNavbar />
        <main className=" min-h-[80vh] h-screen mx-20 px-7 py-7">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
