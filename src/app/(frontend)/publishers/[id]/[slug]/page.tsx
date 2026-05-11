import { createPayload } from '@/utils/payload'
import { redirect } from 'next/navigation'
import React from 'react'
import Link from '@/components/ui/link'

const PublisherPage = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const { id, slug } = await params
  const payload = await createPayload()
  const publisher = await payload.findByID({
    collection: 'publisher',
    id: id,
  })

  if (slug !== publisher.slug) {
    redirect(`/creator/${publisher.id}/${publisher.slug}`)
  }

  const relatedListDocs = publisher.related_list?.docs
  const lists = relatedListDocs
    ?.map((doc) => {
      if (typeof doc === 'number') {
        return
      } else {
        return doc
      }
    })
    .filter((doc) => doc !== undefined)

  return (
    <div>
      <h1>{publisher.name}</h1>
      <div>
        <h2>Lists</h2>
        <div>
          {lists?.map((list) => {
            return (
              <div key={list.id}>
                <Link href={`/list/${list.id}/${list.slug}`}>{list.parent_title}</Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PublisherPage
