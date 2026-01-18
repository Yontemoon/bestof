import { createPayload } from '@/utils/payload'
import Link from 'next/link'
import React from 'react'

const ContentPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  const payload = await createPayload()

  const { docs } = await payload.find({
    collection: 'List',
    depth: 0,
    where: {
      category: {
        equals: slug,
      },
    },
  })

  return (
    <div>
      {docs.map((doc) => {
        return (
          <div key={doc.id}>
            <Link href={`/list/${doc.id}`}>{doc.parent_title}</Link>
          </div>
        )
      })}
    </div>
  )
}

export default ContentPage
