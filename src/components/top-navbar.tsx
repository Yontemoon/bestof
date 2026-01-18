import { createPayload } from '@/utils/payload'
import Link from 'next/link'
import React from 'react'

const TopNavbar = async () => {
  const payload = await createPayload()

  const { categories } = await payload.findGlobal({
    slug: 'top-navbar',
    depth: 1,
  })
  console.log(categories)

  const filteredCategories = categories
    .map((category) => {
      return category.category
    })
    .filter((category) => {
      return typeof category !== 'string'
    })

  return (
    <div>
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
