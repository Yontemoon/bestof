import Link from '@/components/ui/link'
import React from 'react'
import { Separator } from './ui/separator'
import { createPayload } from '@/utils/payload'

const Footer = async () => {
  const payload = await createPayload()

  const yearsNav = await payload.findGlobal({
    slug: 'year-navbar',
  })

  const topNav = await payload.findGlobal({
    slug: 'top-navbar',
  })

  const years = yearsNav.years
    .map(({ year }) => {
      if (typeof year === 'number') return
      return year.id
    })
    .filter((year): year is number => !!year)

  const categories = topNav.categories.map(({ category }) => {
    if (typeof category === 'string') return
    return category.id
  })

  return (
    <footer className="w-full mt-24 mb-12 ">
      <Separator className="mb-10 bg-secondary/50" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Links */}
        <div className="flex flex-col gap-4 text-sm font-medium">
          <Link href="/about" className="transition-opacity hover:opacity-70">
            About
          </Link>
          <Link href="/publishers" className="transition-opacity hover:opacity-70">
            All Publishers
          </Link>
        </div>

        {/* Years Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Years
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {years.map((year) => (
              <Link
                key={year}
                href={`/year/${year}`}
                className="hover:underline underline-offset-4"
              >
                {year}
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Categories
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category}`}
                className="hover:underline underline-offset-4 capitalize"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-secondary/30 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Best Of. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
