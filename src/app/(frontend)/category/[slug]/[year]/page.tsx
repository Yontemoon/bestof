import React from 'react'
import { createPayload } from '@/utils/payload'

const CategoryBaseOnYear = async ({
  params,
}: {
  params: Promise<{ year: string; slug: string }>
}) => {
  const { slug, year } = await params

  const payload = await createPayload()

  const { docs } = await payload.find({
    collection: 'List',
    where: {
      and: [
        {
          category: {
            equals: slug,
          },
        },
        {
          year: {
            equals: Number(year),
          },
        },
      ],
    },
  })
  console.log(docs)

  return <div>{JSON.stringify(docs)}</div>
}

export default CategoryBaseOnYear
