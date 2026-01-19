import { createPayload } from '@/utils/payload'
import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const CreatorPage = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const { id, slug } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'creator',
    id: id,
  })

  if (slug !== data.slug) {
    redirect(`/creator/${data.id}/${data.slug}`)
  }

  const filterList = data.related_list?.docs?.filter((doc) => typeof doc !== 'number')

  return (
    <div>
      <h1>Best Of: {data.creator}</h1>
      <div>
        {filterList?.map((item) => {
          return (
            <div key={item.id}>
              <Link href={`/list/${item.id}/${item.slug}`}>{item.parent_title}</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CreatorPage
