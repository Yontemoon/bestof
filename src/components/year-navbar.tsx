import { createPayload } from '@/utils/payload'
import React from 'react'
import Link from 'next/link'

type PropTypes = {
  slug: string
}

const YearNavbar = async ({ slug }: PropTypes) => {
  const payload = await createPayload()
  const { years } = await payload.findGlobal({
    slug: 'year-navbar',
  })

  const filteredYears = years
    .map((year) => {
      return year.year
    })
    .filter((year) => typeof year !== 'number')

  return (
    <div>
      {filteredYears.map((year) => {
        return (
          <div key={year.id}>
            <Link href={`/category/${slug}/${year.id}`}>{year.id}</Link>
          </div>
        )
      })}
    </div>
  )
}

export default YearNavbar
