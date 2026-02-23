import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'
import React from 'react'

const TopNavbar = async () => {
  const payload = await createPayload()

  const { categories } = await payload.findGlobal({
    slug: 'top-navbar',
    depth: 1,
  })

  const filteredCategories = categories
    .map((category) => {
      return category.category
    })
    .filter((category) => {
      return typeof category !== 'string'
    })

  return (
    <div className="flex justify-between flex-row container w-full mx-auto py-4">
      <Link href="/">
        <span>Best Of</span>
      </Link>

      {filteredCategories.map((category) => {
        return (
          <div key={category.id}>
            <Link href={`/category/${category.id}`}>{category.id}</Link>
          </div>
        )
      })}
    </div>
  )
}

export default TopNavbar
