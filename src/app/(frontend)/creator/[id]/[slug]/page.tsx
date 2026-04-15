import { createPayload } from '@/utils/payload'
import React from 'react'
import { redirect } from 'next/navigation'
import Link from '@/components/ui/link'
import type { Content } from '@/payload-types'
import ImageList from '@/components/image-list'
import { sortPayloadList } from '@/lib/utils'

const CreatorPage = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const { id, slug } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'creator',
    id,
  })
  console.log(data)

  if (slug !== data.slug) {
    redirect(`/creator/${data.id}/${data.slug}`)
  }

  const filterList =
    data.related_content?.docs?.filter(
      (doc): doc is Content =>
        typeof doc !== 'number' &&
        Array.isArray(doc.related_list?.docs) &&
        doc.related_list.docs.length > 0,
    ) ?? null

  return (
    <div className="space-y-3">
      <h1>{data.creator}</h1>
      <div className="space-y-10">
        {filterList?.map((content) => {
          return (
            <div key={content.id} className="space-y-1">
              <div className="aspect-2/3 w-full overflow-hidden">
                <ImageList contentData={content} />
              </div>
              <h2>{content.title}</h2>

              {content.related_list?.docs?.map((list) => {
                if (typeof list === 'object' && typeof list !== 'number')
                  return (
                    <div key={list.id}>
                      <Link href={`/list/${list.id}/${list.slug}`}>{list.parent_title}</Link>
                    </div>
                  )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CreatorPage
