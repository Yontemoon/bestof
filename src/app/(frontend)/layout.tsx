export const dynamic = 'force-static'

import React from 'react'
import TopNavbar from '@/components/top-navbar'

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
        <main>{children}</main>
      </body>
    </html>
  )
}
