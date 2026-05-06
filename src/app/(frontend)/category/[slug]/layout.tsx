import YearNavbar from '@/components/year-navbar'
import React from 'react'

type PropTypes = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

const CategoryLayout = async ({ children, params }: PropTypes) => {
  const { slug } = await params

  return (
    <div className="space-y-4">
      <div>
        <YearNavbar slug={slug} />
      </div>
      {children}
    </div>
  )
}

export default CategoryLayout
