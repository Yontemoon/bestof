import React from 'react'
import { redirect } from 'next/navigation'
import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'
import ImageList from '@/components/image-list'
import { sortPayloadList } from '@/lib/utils'

const ContentPage = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const { id: paramId, slug: paramSlug } = await params
  const payload = await createPayload()

  const contentDetails = await payload.findByID({
    collection: 'Content',
    id: paramId,
  })

  const relatedLists = await payload.find({
    collection: 'List',
    pagination: false,
    where: {
      'parent_list.list_entry.content': {
        equals: paramId,
      },
    },
  })

  const { slug, id } = contentDetails

  if (!relatedLists.docs.length) {
    return <div>Nothing here.</div>
  }

  if (slug !== paramSlug) {
    redirect(`/content/${id}/${slug}`)
  }

  const sortedList = sortPayloadList(relatedLists, id)

  const creators = Array.isArray(contentDetails.creator)
    ? contentDetails.creator.filter(Boolean)
    : contentDetails.creator
      ? [contentDetails.creator]
      : []

  return (
    <div>
      {contentDetails.poster_url && (
        <div className="aspect-2/3 w-full overflow-hidden">
          <ImageList contentData={contentDetails} />
        </div>
      )}
      <div className="space-y-3 my-3">
        <h1 className="">{contentDetails.title}</h1>
        {creators.length > 0 && (
          <div className="flex flex-wrap items-center text-sm text-muted-foreground">
            <span>By</span>
            {creators.map((creator) => {
              if (typeof creator === 'number') {
                return null
              }
              return (
                <span key={creator.id} className="  px-1 py-1 leading-none">
                  <Link href={`/creator/${creator.id}/${creator.slug}`}>{creator.creator}</Link>
                </span>
              )
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {sortedList.map((item, index) => {
          return (
            <div key={index}>
              <Link href={`/list/${item?.id}/${item?.slug}`}>
                {item?.rank && `${item.rank}. `} {item?.title}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContentPage
