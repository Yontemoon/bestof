import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'
import React from 'react'
import { ThemeToggle } from './theme-toggle'
import { Separator } from './ui/separator'

const TopNavbar = async () => {
  const payload = await createPayload()

  const { categories } = await payload.findGlobal({
    slug: 'top-navbar',
  })

  const filteredCategories = categories
    .map((category) => {
      return category.category
    })
    .filter((category) => {
      return typeof category !== 'string'
    })

  return (
    <header className="w-full bg-background border-b">
      <div className="container mx-auto ">
        {/* Top Row: Brand & Tools */}
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity"
          >
            Best Of
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Bottom Row: Navigation Categories */}
        <nav
          aria-label="Categories"
          className="flex h-12 items-center overflow-x-auto no-scrollbar mb-5"
        >
          <ul className="flex flex-row items-center gap-8 text-sm font-medium">
            {filteredCategories.map((category) => (
              <li key={category.id} className="shrink-0">
                <Link
                  href={`/category/${category.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors capitalize whitespace-nowrap"
                >
                  {category.id}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Optional: The green separator looks great at the very bottom of the stack */}
      <Separator className="bg-green-500 h-[2px]" />
    </header>
  )
}

export default TopNavbar
